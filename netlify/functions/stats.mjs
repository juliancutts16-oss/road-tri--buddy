// Developer dashboard data. Only answers when the request carries the secret STATS_KEY set in Netlify.
// On the test site it reads the test stats, so the live dashboard only ever shows real families.
// Works out the key numbers from the stored usage events, and tidies up old data while it's at it:
// usage events older than 90 days and issue reports older than 180 days are deleted.
import { json, statsStore } from "../lib/common.mjs";

const DAY = 864e5;
const keyDay = (key, idx) => Date.parse(key.split("/")[idx]) || 0; // the yyyy-mm-dd part of a key

export default async (req, context) => {
  const secret = process.env.STATS_KEY;
  if (!secret) return json({ error: "STATS_KEY isn't set in Netlify yet." }, 503);
  if (req.headers.get("x-stats-key") !== secret) return json({ error: "Wrong dashboard key." }, 401);

  const store = statsStore(context);
  const now = Date.now();

  // ---- load usage events (and delete expired ones)
  const { blobs } = await store.list({ prefix: "ev/" });
  const installs = new Map(); // id -> { events:[], platform, v }
  const expired = [];
  await Promise.all(blobs.map(async (b) => {
    if (keyDay(b.key, 2) < now - 90 * DAY) { expired.push(b.key); return; }
    const batch = await store.get(b.key, { type: "json" });
    if (!batch) return;
    const id = b.key.split("/")[1];
    const rec = installs.get(id) || { events: [], platform: batch.platform, v: batch.v };
    rec.events.push(...(batch.events || []));
    if (batch.v) rec.v = batch.v;
    installs.set(id, rec);
  }));
  await Promise.all(expired.map((k) => store.delete(k)));

  // ---- issue reports (and delete expired ones)
  const issueList = await store.list({ prefix: "issues/" });
  const issues = [];
  await Promise.all(issueList.blobs.map(async (b) => {
    if (keyDay(b.key, 1) < now - 180 * DAY) { await store.delete(b.key); return; }
    const it = await store.get(b.key, { type: "json" });
    if (it) issues.push(it);
  }));
  issues.sort((a, b) => b.at - a.at);

  // ---- story reports from "Report a problem" (and delete expired ones)
  const reportList = await store.list({ prefix: "reports/" });
  const reports = [];
  await Promise.all(reportList.blobs.map(async (b) => {
    if (keyDay(b.key, 1) < now - 180 * DAY) { await store.delete(b.key); return; }
    const it = await store.get(b.key, { type: "json" });
    if (it) reports.push(it);
  }));
  reports.sort((a, b) => b.at - a.at);

  // ---- work out the numbers
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : null);
  const tripsByDay = {}, features = {}, games = {}, crashes = {}, versions = {}, platforms = {}, ages = {}, modes = {};
  let started = 0, finished = 0, withStart = 0, withFinish = 0, secondTrip = 0, eligibleSecond = 0;
  let active30 = 0, finishes30 = 0, active7 = 0;
  const ratings = [];
  const voiceEv = [], voiceRtf = [], voiceTrips = []; // the storyteller voice: every wait, each install's latest speed, trips read by Alice
  for (const [, rec] of installs) {
    const ev = rec.events.sort((a, b) => a.at - b.at);
    versions[rec.v || "?"] = (versions[rec.v || "?"] || 0) + 1;
    platforms[rec.platform || "other"] = (platforms[rec.platform || "other"] || 0) + 1;
    const starts = ev.filter((e) => e.t === "trip_start"), ends = ev.filter((e) => e.t === "trip_end");
    started += starts.length; finished += ends.length;
    if (starts.length) withStart++;
    if (ends.length) withFinish++;
    // second trip within 30 days of the first finished one (only counted once 30 days have passed, or it already happened)
    if (ends.length) {
      const first = ends[0].at, again = ends.find((e) => e.at > first && e.at - first <= 30 * DAY);
      if (again || now - first > 30 * DAY) { eligibleSecond++; if (again) secondTrip++; }
    }
    const recent = ends.filter((e) => e.at > now - 30 * DAY);
    if (recent.length) { active30++; finishes30 += recent.length; }
    if (ev.some((e) => e.at > now - 7 * DAY)) active7++;
    for (const e of ev) {
      if (e.t === "trip_end") { const d = new Date(e.at).toISOString().slice(0, 10); tripsByDay[d] = (tripsByDay[d] || 0) + 1; }
      if (e.t === "trip_start") { if (e.age) ages[e.age] = (ages[e.age] || 0) + 1; if (e.mode) modes[e.mode] = (modes[e.mode] || 0) + 1; }
      if (e.t === "feature" && e.f) {
        if (e.f.startsWith("game:")) games[e.f.slice(5)] = (games[e.f.slice(5)] || 0) + 1;
        else features[e.f] = (features[e.f] || 0) + 1;
      }
      if (e.t === "crash") {
        const k = e.msg || "Unknown error";
        const c = crashes[k] || (crashes[k] = { msg: k, where: e.where || "", count: 0, last: 0, versions: {} });
        c.count++; c.last = Math.max(c.last, e.at); c.versions[rec.v || "?"] = true;
      }
      if (e.t === "rating" && Number.isFinite(e.score)) ratings.push(e.score);
      if (e.t === "voice") voiceEv.push({ ...e, v: rec.v || "?", platform: rec.platform || "other" });
      if (e.t === "trip_end" && e.sv) voiceTrips.push(e);
    }
    const lastV = ev.filter((e) => e.t === "voice" && Number.isFinite(e.rtf)).pop();
    if (lastV) voiceRtf.push(lastV);
  }
  // middle value and the value 9 in 10 are under
  const q = (arr, p) => { const a = arr.filter(Number.isFinite).sort((x, y) => x - y); return a.length ? a[Math.min(a.length - 1, Math.floor(p * a.length))] : null; };
  const waitKinds = {};
  for (const w of ["start", "opening", "chapter", "line"]) {
    const s = voiceEv.filter((e) => e.w === w).map((e) => e.s);
    waitKinds[w] = { count: s.length, median: q(s, 0.5), p90: q(s, 0.9), max: s.length ? Math.max(...s) : null };
  }
  const voice = {
    phones: voiceRtf.length,
    rtfMedian: q(voiceRtf.map((e) => e.rtf), 0.5),
    multiCorePct: pct(voiceRtf.filter((e) => e.iso).length, voiceRtf.length),
    loadMedian: q(voiceEv.filter((e) => e.w === "load").map((e) => e.s), 0.5),
    trips: voiceTrips.length,
    tripsNoWaitPct: pct(voiceTrips.filter((e) => !e.waits).length, voiceTrips.length),
    waitKinds,
    recent: voiceEv.filter((e) => e.w !== "load").sort((a, b) => b.at - a.at).slice(0, 40)
      .map(({ at, w, s, rtf, q: left, iso, cores, v, platform }) => ({ at, w, s, rtf, left, iso, cores, v, platform })),
  };
  const days = [];
  for (let i = 29; i >= 0; i--) { const d = new Date(now - i * DAY).toISOString().slice(0, 10); days.push({ day: d, trips: tripsByDay[d] || 0 }); }

  return json({
    generated: now,
    totals: { installs: installs.size, active7, active30, tripsStarted: started, tripsFinished: finished },
    keyNumbers: {
      firstTripCompletion: pct(withFinish, withStart),
      secondTripRate: pct(secondTrip, eligibleSecond),
      secondTripSample: eligibleSecond,
      tripsPerFamilyPerMonth: active30 ? Math.round((finishes30 / active30) * 10) / 10 : null,
      plusConversion: null, // shown once subscriptions exist
      recommendAverage: ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null,
      recommendCount: ratings.length,
    },
    tripsByDay: days,
    features, games, ages, modes, versions, platforms, voice,
    crashes: Object.values(crashes).map((c) => ({ ...c, versions: Object.keys(c.versions) })).sort((a, b) => b.count - a.count).slice(0, 50),
    issues: issues.slice(0, 100),
    reports: reports.slice(0, 100),
  });
};

export const config = { path: "/api/stats" };
