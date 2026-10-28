// Shared helpers for the AWTY server functions.
import { getStore } from "@netlify/blobs";

// Usage stats, issue and story reports live in Netlify Blobs. The live site uses "awty-stats"; the test branch
// (and any other non-live deploy) uses "awty-stats-test", so testing never shows up on the live dashboard.
export const STATS_STORES = ["awty-stats", "awty-stats-test"];
export const statsStore = (context) =>
  getStore(!context?.deploy?.context || context.deploy.context === "production" ? STATS_STORES[0] : STATS_STORES[1]);

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

// Which version this branch is. "free" (the live branch, main): no AI stories, no AI replies to spoken answers and no
// number-plate lookup, so those helpers say no and /api/health reports them as off. The test branch sets "full".
export const EDITION = "full";
export const notInFree = () => (EDITION === "free" ? json({ error: "This isn’t part of AWTY Free." }, 404) : null);

// Optional protection: if APP_PASSCODE is set on the server, every request must send it.
// This stops strangers who find your site from spending your API credit.
export function checkPasscode(req) {
  const code = process.env.APP_PASSCODE;
  if (!code) return null;
  if (req.headers.get("x-app-passcode") === code) return null;
  return json({ error: "Wrong or missing server passcode. Enter it in Settings → Data & services." }, 401);
}

export async function readBody(req) {
  if (req.method !== "POST") throw new Error("Use POST.");
  try {
    return await req.json();
  } catch {
    throw new Error("The request was not valid JSON.");
  }
}

export const clip = (v, n) => String(v ?? "").slice(0, n).trim();
