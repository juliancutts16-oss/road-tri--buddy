// Runs once a day on Netlify's scheduler. Deletes usage events older than 90 days and issue reports older
// than 180 days, so the retention periods in the privacy policy hold even if nobody opens the dashboard.
import { getStore } from "@netlify/blobs";

const DAY = 864e5;
const keyDay = (key, idx) => Date.parse(key.split("/")[idx]) || 0; // the yyyy-mm-dd part of a key

export default async () => {
  const store = getStore("awty-stats");
  const now = Date.now();
  const [ev, issues] = await Promise.all([store.list({ prefix: "ev/" }), store.list({ prefix: "issues/" })]);
  const old = [
    ...ev.blobs.filter((b) => keyDay(b.key, 2) < now - 90 * DAY),
    ...issues.blobs.filter((b) => keyDay(b.key, 1) < now - 180 * DAY),
  ];
  await Promise.all(old.map((b) => store.delete(b.key)));
  console.log(`cleanup: deleted ${old.length} old items`);
};

export const config = { schedule: "@daily" };
