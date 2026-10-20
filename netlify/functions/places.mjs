// Destination suggestions while the parent types (Google Places Autocomplete, New).
import { json, checkPasscode, readBody, clip } from "../lib/common.mjs";

export default async (req) => {
  const denied = checkPasscode(req);
  if (denied) return denied;
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return json({ error: "Google Maps is not set up on the server." }, 503);

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  const input = clip(body.input, 120);
  if (input.length < 3) return json({ suggestions: [] });

  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
    body: JSON.stringify({ input, includedRegionCodes: ["gb"], languageCode: "en-GB" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return json({ error: data.error?.message || "Google Places did not answer." }, 502);

  const suggestions = (data.suggestions || [])
    .map((s) => s.placePrediction?.text?.text)
    .filter(Boolean)
    .slice(0, 5);
  return json({ suggestions });
};

export const config = { path: "/api/places" };
