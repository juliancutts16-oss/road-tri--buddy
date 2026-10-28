// Receives AWTY's usage stats, issue reports and "delete my data" requests.
// Usage stats only arrive if a parent switched on "Help improve AWTY". They carry a random install ID
// (not linked to a person or the phone), the app version, a coarse device type and a small list of events.
// Nothing here ever contains names, interests, locations, voice or story text: every field is checked
// against an allow-list and anything else is dropped.
// Stored in Netlify Blobs (store "awty-stats"):
//   ev/<installId>/<yyyy-mm-dd>/<random>   a batch of events   (deleted after 90 days)
//   issues/<yyyy-mm-dd>/<random>            a parent's issue report (deleted after 180 days)
import { getStore } from "@netlify/blobs";
import { json, checkPasscode, readBody, clip } from "../lib/common.mjs";

const ID_OK = /^[a-f0-9-]{16,40}$/i;
const TYPES = new Set(["open", "trip_start", "trip_end", "feature", "crash", "rating", "voice"]);
const VOICE_WAITS = new Set(["load", "start", "opening", "chapter", "line"]);
const MODES = new Set(["demo", "gps", "timer", "offline"]);
const AGES = new Set(["4-5", "6-7", "8+"]);
const PLATFORMS = new Set(["android", "iphone", "ipad", "desktop", "other"]);
const ISSUE_CATS = new Set(["broke", "story", "maps", "other"]);
const day = (t) => new Date(t).toISOString().slice(0, 10);
const rand = () => Math.random().toString(36).slice(2, 10);
const num = (v, max) => (Number.isFinite(+v) ? Math.max(0, Math.min(max, Math.round(+v * 10) / 10)) : undefined);
// strip anything that could be personal from free text: emails, phone numbers, postcodes, long digit runs, links
const scrub = (s, n) =>
  clip(s, n)
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email]")
    .replace(/\+?\d[\d\s-]{7,}\d/g, "[number]")
    .replace(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/gi, "[postcode]")
    .replace(/https?:\/\/\S+/g, "[link]");

function cleanEvent(e, now) {
  if (!e || !TYPES.has(e.t)) return null;
  const at = Number(e.at);
  const out = { t: e.t, at: Number.isFinite(at) && at > now - 40 * 864e5 && at < now + 864e5 ? at : now };
  if (e.mode && MODES.has(e.mode)) out.mode = e.mode;
  if (e.age && AGES.has(e.age)) out.age = e.age;
  if (e.style) out.style = clip(e.style, 12).replace(/[^a-z]/g, "");
  if (e.miles !== undefined) out.miles = num(e.miles, 2000);
  if (e.mins !== undefined) out.mins = num(e.mins, 2000);
  if (e.f) out.f = clip(e.f, 40).replace(/[^a-z0-9_:-]/gi, "");
  if (e.t === "crash") { out.msg = scrub(e.msg, 160); out.where = clip(e.where, 60).replace(/[^\w.:/-]/g, ""); }
  if (e.t === "rating") out.score = num(e.score, 10);
  // the storyteller voice: how long the story waited for her, how fast this phone makes her voice, its cores (numbers only)
  if (e.t === "voice") {
    if (!VOICE_WAITS.has(e.w)) return null;
    Object.assign(out, { w: e.w, s: num(e.s, 600), rtf: num(e.rtf, 50), q: num(e.q, 1000), iso: e.iso ? 1 : 0, cores: num(e.cores, 128) });
  }
  if (e.t === "trip_end" && e.sv) Object.assign(out, { sv: 1, waits: num(e.waits, 500), waitS: num(e.waitS, 20000) });
  return out;
}

export default async (req) => {
  const denied = checkPasscode(req);
  if (denied) return denied;
  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  const store = getStore("awty-stats");
  const now = Date.now();
  const version = clip(body.v, 12).replace(/[^\w.-]/g, "");
  const platform = PLATFORMS.has(body.platform) ? body.platform : "other";

  // A parent's issue report (sent even if usage stats are off, because the parent chose to send it)
  if (body.kind === "issue") {
    const text = scrub(body.text, 600);
    if (!text) return json({ error: "Please describe the issue." }, 400);
    await store.setJSON(`issues/${day(now)}/${rand()}`, { at: now, cat: ISSUE_CATS.has(body.cat) ? body.cat : "other", text, v: version, platform });
    return json({ ok: true });
  }

  const id = String(body.id || "");
  if (!ID_OK.test(id)) return json({ error: "Missing install ID." }, 400);

  // "Delete my usage data": remove everything stored for this install
  if (body.kind === "delete") {
    const { blobs } = await store.list({ prefix: `ev/${id}/` });
    await Promise.all(blobs.map((b) => store.delete(b.key)));
    return json({ ok: true, deleted: blobs.length });
  }

  const events = (Array.isArray(body.events) ? body.events : []).slice(0, 100).map((e) => cleanEvent(e, now)).filter(Boolean);
  if (!events.length) return json({ ok: true, stored: 0 });
  await store.setJSON(`ev/${id}/${day(now)}/${rand()}`, { v: version, platform, events });
  return json({ ok: true, stored: events.length });
};

export const config = { path: "/api/telemetry" };
