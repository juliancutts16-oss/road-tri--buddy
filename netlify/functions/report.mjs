// Receives a parent's "Report a problem" about a story part, so you can see what slipped through.
// The report holds only the story text (with {NAMES}/{BUDDY} placeholders, never real names), the age band and a short note.
// It's written to the Netlify function log: Netlify → your site → Logs → Functions → report.
import { json, checkPasscode, readBody, clip } from "../lib/common.mjs";

export default async (req) => {
  const denied = checkPasscode(req);
  if (denied) return denied;

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  const part = clip(body.part, 40);
  const text = clip(body.text, 3000);
  if (!part || !text) return json({ error: "Nothing to report." }, 400);
  const report = {
    event: "story-report",
    when: new Date().toISOString(),
    part,
    age: ["4-5", "6-7", "8+"].includes(body.age) ? body.age : "",
    reason: clip(body.reason, 60),
    note: clip(body.note, 300),
    text,
  };
  console.log(JSON.stringify(report));
  return json({ ok: true });
};

export const config = { path: "/api/report" };
