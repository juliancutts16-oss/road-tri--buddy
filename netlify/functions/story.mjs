// Writes the read-aloud story or fun facts for one landmark, shaped by the parent's settings.
import Anthropic from "@anthropic-ai/sdk";
import { json, checkPasscode, readBody, clip } from "../lib/common.mjs";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the server's environment
const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";

const AGE_WORDS = { "4-5": "four or five", "6-7": "six or seven", "8+": "eight to twelve" };

const SYSTEM = `You write short pieces that a phone reads aloud to children in the back of a car during a UK road trip.
Write in British English. Everything must be gentle, positive and suitable for young children: nothing frightening, sad, violent or unsafe.
The text is heard, not read, so write natural spoken sentences: no lists, emoji, brackets, abbreviations or stage directions.`;

const SCHEMA = {
  type: "object",
  properties: {
    sentences: { type: "array", items: { type: "string" } },
    question: { type: "string" },
    word: { type: "string" },
  },
  required: ["sentences", "question", "word"],
  additionalProperties: false,
};

export default async (req) => {
  const denied = checkPasscode(req);
  if (denied) return denied;
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: "The story writer is not set up on the server." }, 503);

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  const name = clip(body.name, 120);
  const kind = clip(body.kind, 60) || "landmark";
  const summary = clip(body.summary, 400);
  const type = body.type === "fact" ? "fact" : "story";
  const n = [3, 5, 7].includes(body.sentences) ? body.sentences : 5;
  const rich = body.lang === "academic";
  const age = AGE_WORDS[body.age] || AGE_WORDS["6-7"];
  if (!name) return json({ error: "Missing the landmark name." }, 400);

  const about = `The place is ${name} (a ${kind}).${summary ? ` Google Maps describes it as: "${summary}"` : ""}`;
  const task =
    type === "fact"
      ? `Give exactly ${n} fun facts about it, one per sentence. Only state things you are confident are true. If you know little about this exact place, give true facts about this kind of place instead and say so naturally, for example "Places like this…".`
      : `Write a made-up story of exactly ${n} sentences in which this place plays a part. Give it a friendly animal hero and a happy ending, and finish by linking it to the family driving past right now.`;
  const level = rich
    ? `Use rich, interesting vocabulary for a confident child aged ${age}.`
    : `Use simple, short words for a child aged ${age}.`;

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `${about}\n\n${task}\n${level}\n\nAlso give "question": one open question to ask the child about the place afterwards, and "word": one word or a very short phrase (up to three words) from the piece for the child to repeat aloud.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") return json({ error: "The writer declined this place." }, 422);
    const text = response.content.find((b) => b.type === "text")?.text;
    if (!text) return json({ error: "The writer returned nothing." }, 502);
    const data = JSON.parse(text);
    const sentences = (data.sentences || []).map((s) => clip(s, 400)).filter(Boolean).slice(0, n);
    if (!sentences.length) return json({ error: "The writer returned no sentences." }, 502);
    return json({ sentences, question: clip(data.question, 300), word: clip(data.word, 40) });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) return json({ error: "The server’s Anthropic API key was rejected." }, 502);
    if (error instanceof Anthropic.RateLimitError) return json({ error: "Too many stories at once. Try again in a minute." }, 429);
    if (error instanceof Anthropic.BadRequestError) return json({ error: "The story request was rejected: " + error.message }, 502);
    if (error instanceof Anthropic.APIError) return json({ error: `The story service failed (${error.status}).` }, 502);
    if (error instanceof SyntaxError) return json({ error: "The writer’s answer couldn’t be read." }, 502);
    throw error;
  }
};

export const config = { path: "/api/story" };
