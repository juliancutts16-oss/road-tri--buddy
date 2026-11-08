// Developer only: runs the server's AI safety reviewer over AWTY's built-in fun facts (the 200 in the app), exactly as
// it checks AI fun facts, so they get the same second opinion. Only answers with the dashboard key (STATS_KEY).
// tools/review-built-in-facts.ps1 sends the list a few at a time and writes the report. Nothing is saved here.
import { json, readBody, clip } from "../lib/common.mjs";
import { AGE_RULES } from "../lib/safety.mjs";
import { aiReview } from "../lib/review.mjs";

export default async (req) => {
  const secret = process.env.STATS_KEY;
  if (!secret) return json({ error: "STATS_KEY isn't set in Netlify yet." }, 503);
  if (req.headers.get("x-stats-key") !== secret) return json({ error: "Wrong dashboard key." }, 401);
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: "The reviewer is not set up on the server." }, 503);
  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  const facts = (Array.isArray(body.facts) ? body.facts : []).slice(0, 12)
    .map((f) => ({ id: clip(f && f.id, 12), text: clip(f && f.text, 300) })).filter((f) => f.text);
  if (!facts.length) return json({ error: "No facts sent." }, 400);
  const age = AGE_RULES[body.age] ? body.age : "4-5";
  try {
    const r = await aiReview("(These are stand-alone fun facts: there is no question, word or quiz.)", age, "fact", facts.map((f) => f.text));
    return json({ ok: !r.problems.length, problems: r.problems, bad: r.bad.map((k) => facts[k - 1].id) });
  } catch (e) {
    return json({ error: `The reviewer failed: ${clip(e && e.message, 200)}` }, 502);
  }
};

export const config = { path: "/api/review-facts" };
