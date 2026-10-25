// Receives a parent's "Report a problem" about a story part, so it can be reviewed on the developer dashboard.
// The report holds only the story text (with {NAMES}/{BUDDY} placeholders, never real names; the phone also swaps the
// destination for {DEST}), the part, the age band and the reason chosen. Emails, phone numbers, postcodes and links are
// removed here too. Stored in Netlify Blobs (store "awty-stats"):
//   reports/<yyyy-mm-dd>/<random>   a story report (deleted after 180 days, like issue reports)
// It's also written to the Netlify function log: Netlify → your site → Logs → Functions → report.
import { getStore } from "@netlify/blobs";
import { json, checkPasscode, readBody, clip } from "../lib/common.mjs";

const REASONS = new Set(["scary", "age", "unsafe", "other"]);
const day = (t) => new Date(t).toISOString().slice(0, 10);
const rand = () => Math.random().toString(36).slice(2, 10);
const scrub = (s, n) =>
  clip(s, n)
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email]")
    .replace(/\+?\d[\d\s-]{7,}\d/g, "[number]")
    .replace(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/gi, "[postcode]")
    .replace(/https?:\/\/\S+/g, "[link]");

export default async (req) => {
  const denied = checkPasscode(req);
  if (denied) return denied;

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  const part = scrub(body.part, 60);
  const text = scrub(body.text, 3000);
  if (!part || !text) return json({ error: "Nothing to report." }, 400);
  const now = Date.now();
  const report = {
    at: now,
    part,
    kind: ["story", "fact"].includes(body.kind) ? body.kind : "story",
    age: ["4-5", "6-7", "8+"].includes(body.age) ? body.age : "",
    reason: REASONS.has(body.reason) ? body.reason : "other",
    text,
    v: clip(body.v, 12).replace(/[^\w.-]/g, ""),
  };
  console.log(JSON.stringify({ event: "story-report", ...report }));
  try {
    await getStore("awty-stats").setJSON(`reports/${day(now)}/${rand()}`, report);
  } catch (e) {
    console.log(JSON.stringify({ event: "story-report-not-saved", error: String(e && e.message) }));
  }
  return json({ ok: true });
};

export const config = { path: "/api/report" };
