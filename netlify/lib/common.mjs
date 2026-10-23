// Shared helpers for the AWTY server functions.

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

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
