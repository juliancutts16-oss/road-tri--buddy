// Place suggestions while the parent types (Google Places Autocomplete, New).
// If the phone sends its position, results are ranked near you and each one comes back with its distance,
// so "Tesco" finds the Tescos close by rather than one at random.
import { json, checkPasscode, readBody, clip } from "../lib/common.mjs";

const MILE = 1609.344;

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
  if (input.length < 2) return json({ suggestions: [] });

  const request = { input, includedRegionCodes: ["gb"], languageCode: "en-GB" };
  const lat = Number(body.lat), lng = Number(body.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
    const center = { latitude: lat, longitude: lng };
    request.locationBias = { circle: { center, radius: 30000 } }; // prefer places within about 20 miles
    request.origin = center; // makes Google include each place's distance from you
  }

  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
    body: JSON.stringify(request),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return json({ error: data.error?.message || "Google Places did not answer." }, 502);

  const suggestions = (data.suggestions || [])
    .map((s) => s.placePrediction)
    .filter((p) => p && p.placeId)
    .slice(0, 6)
    .map((p) => ({
      placeId: p.placeId,
      text: p.text?.text || "",
      main: p.structuredFormat?.mainText?.text || p.text?.text || "",
      secondary: p.structuredFormat?.secondaryText?.text || "",
      miles: typeof p.distanceMeters === "number" ? +(p.distanceMeters / MILE).toFixed(1) : null,
    }));
  // nearest first when we know the distances
  if (suggestions.every((s) => s.miles !== null)) suggestions.sort((a, b) => a.miles - b.miles);
  return json({ suggestions });
};

export const config = { path: "/api/places" };
