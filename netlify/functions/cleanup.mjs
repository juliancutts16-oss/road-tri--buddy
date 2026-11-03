// Runs once a day on Netlify's scheduler. Deletes usage events and AI safety-check results older than 90 days, and issue and story reports older
// than 180 days, so the retention periods in the privacy policy hold even if nobody opens the dashboard.
// Scheduled functions only run on the live site, so it tidies the test site's stats store too.
import { getStore } from "@netlify/blobs";
import { STATS_STORES } from "../lib/common.mjs";

const DAY = 864e5;
const keyDay = (key, idx) => Date.parse(key.split("/")[idx]) || 0; // the yyyy-mm-dd part of a key

export default async () => {
  const now = Date.now();
  for (const name of STATS_STORES) {
    const store = getStore(name);
    const [ev, issues, reports, checks] = await Promise.all(["ev/", "issues/", "reports/", "checks/"].map((prefix) => store.list({ prefix })));
    const old = [
      ...ev.blobs.filter((b) => keyDay(b.key, 2) < now - 90 * DAY),
      ...checks.blobs.filter((b) => keyDay(b.key, 1) < now - 90 * DAY), // AI safety-check results
      ...issues.blobs.filter((b) => keyDay(b.key, 1) < now - 180 * DAY),
      ...reports.blobs.filter((b) => keyDay(b.key, 1) < now - 180 * DAY), // story reports, kept as long as issue reports
    ];
    await Promise.all(old.map((b) => store.delete(b.key)));
    console.log(`cleanup: deleted ${old.length} old items from ${name}`);
  }
};

export const config = { schedule: "@daily" };
