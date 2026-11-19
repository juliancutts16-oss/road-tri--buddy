// The live safety report on the website's "Our promise" page. Needs no key, because it only gives four totals for the
// last 30 days, worked out from the same checks/ records the developer dashboard reads (see story.mjs):
//   checked      first asks (library + first + rejected)
//   passedFirst  library + first
//   fixed        rewrite (asked again with the problems pointed out, and passed)
//   replaced     rejected − rewrite, never below 0 (the app used one of our own instead)
// It sends nothing else: no problems text, no times, no versions, nothing per family. It never deletes records
// (the dashboard and cleanup tidy them). Below 50 checks it says "not enough yet" instead of numbers.
// Cached for an hour on Netlify's servers (and in this function's memory), so a busy page doesn't re-count every time.
// Each site reads its own records: the live site its own, the test site the test ones (statsStore).
import { statsStore } from "../lib/common.mjs";

const DAY = 864e5;
const HOUR = 36e5;
const MIN_CHECKS = 50;
let memo = null; // { at, site, body }

const send = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": status === 200 ? "public, max-age=600" : "no-store",
      ...(status === 200 ? { "Netlify-CDN-Cache-Control": "public, durable, s-maxage=3600, stale-while-revalidate=600" } : {}),
    },
  });

async function count(store) {
  const since = Date.parse(new Date(Date.now() - 29 * DAY).toISOString().slice(0, 10)); // today and the 29 days before
  const { blobs } = await store.list({ prefix: "checks/" });
  const recent = blobs.filter((b) => (Date.parse(b.key.split("/")[1]) || 0) >= since);
  const n = { library: 0, first: 0, rejected: 0, rewrite: 0 };
  // a few at a time, so a busy month doesn't open hundreds of reads at once
  for (let i = 0; i < recent.length; i += 50) {
    const recs = await Promise.all(recent.slice(i, i + 50).map((b) => store.get(b.key, { type: "json" }).catch(() => null)));
    for (const r of recs) if (r && r.result in n) n[r.result]++;
  }
  const checked = n.library + n.first + n.rejected;
  if (checked < MIN_CHECKS) return { enough: false, message: "not enough yet" };
  return {
    enough: true,
    checked,
    passedFirst: n.library + n.first,
    fixed: n.rewrite,
    replaced: Math.max(0, n.rejected - n.rewrite),
  };
}

export default async (req, context) => {
  if (req.method !== "GET") return send({ error: "Use GET." }, 405);
  try {
    const store = statsStore(context);
    const site = String(context?.deploy?.context || "production"); // live or test records
    if (!memo || memo.site !== site || Date.now() - memo.at > HOUR) {
      memo = { at: Date.now(), site, body: await count(store) };
    }
    return send(memo.body);
  } catch (e) {
    console.log(JSON.stringify({ event: "safety-report-failed", error: String(e && e.message) }));
    return send({ error: "The safety report isn't available just now." }, 503);
  }
};

export const config = { path: "/api/safety-report" };
