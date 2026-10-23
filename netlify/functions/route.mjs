// Builds a AWTY route from Google Maps:
//  - the driving route (Routes API) → distance, time, and the road's path for GPS tracking
//  - scenery zones along the way (town / countryside / motorway / city, plus forest and coast near matching places)
//  - famous places along the route (Places API Text Search "along route") → the landmarks that get read aloud
import { json, checkPasscode, readBody, clip } from "../lib/common.mjs";
import { unsuitablePlace } from "../lib/safety.mjs";

const MILE = 1609.344;

function decodePolyline(str) {
  const out = [];
  let i = 0, lat = 0, lng = 0;
  while (i < str.length) {
    for (const which of [0, 1]) {
      let b, shift = 0, result = 0;
      do {
        b = str.charCodeAt(i++) - 63;
        result |= (b & 31) << shift;
        shift += 5;
      } while (b >= 32);
      const d = result & 1 ? ~(result >> 1) : result >> 1;
      if (which === 0) lat += d; else lng += d;
    }
    out.push([lat / 1e5, lng / 1e5]);
  }
  return out;
}

function metres(a, b) {
  const R = 6371008.8, t = Math.PI / 180;
  const dLat = (b[0] - a[0]) * t, dLng = (b[1] - a[1]) * t;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function pickEmoji(p) {
  const name = (p.displayName?.text || "").toLowerCase();
  const types = (p.types || []).join(" ");
  if (/castle|fort\b|keep\b/.test(name) || types.includes("castle")) return ["🏰", "castle"];
  if (/bridge|viaduct/.test(name) || types.includes("bridge")) return ["🌉", "bridge"];
  if (/cathedral|abbey|minster|church|priory/.test(name) || /church|place_of_worship/.test(types)) return ["⛪", "cathedral"];
  if (/stadium|arena/.test(types + " " + name)) return ["🏟️", "stadium"];
  if (/pier|ferris|wheel|amusement|theme park/.test(name) || /amusement_park|amusement_center/.test(types)) return ["🎡", "fun park"];
  if (types.includes("zoo") || /zoo|safari|wildlife park/.test(name)) return ["🦁", "zoo"];
  if (types.includes("aquarium")) return ["🐠", "aquarium"];
  if (types.includes("museum")) return ["🏛️", "museum"];
  if (/beach|bay\b|sands/.test(name) || types.includes("beach")) return ["🏖️", "beach"];
  if (/lake|loch|reservoir|forest|wood|national park|country park/.test(name) || /national_park|park|hiking_area|state_park/.test(types)) return ["🏞️", "park"];
  if (/tower|monument|memorial|statue/.test(name) || /monument|historical_landmark/.test(types)) return ["🗿", "monument"];
  if (/railway|station/.test(name)) return ["🚂", "railway"];
  return ["⭐", (p.primaryTypeDisplayName?.text || "landmark").toLowerCase()];
}

// Scenery from the route steps: each step's average speed and road name says what kind of road it is.
function zonesFromSteps(steps, totalMiles, landmarks) {
  const n = Math.max(1, Math.ceil(totalMiles * 4)); // quarter-mile buckets
  const bucket = new Array(n).fill("countryside");
  let acc = 0;
  for (const s of steps) {
    const miles = (s.distanceMeters || 0) / MILE;
    const hours = parseInt(s.staticDuration || "0", 10) / 3600;
    const mph = hours > 0 ? miles / hours : 30;
    const text = s.navigationInstruction?.instructions || "";
    const zone = /\bM\d+\b|\(M\)|motorway/i.test(text) || mph > 55 ? "motorway" : mph < 16 ? "city" : mph < 28 ? "town" : "countryside";
    const a = Math.floor(acc * 4), b = Math.min(n, Math.ceil((acc + miles) * 4));
    for (let i = a; i < b; i++) bucket[i] = zone;
    acc += miles;
  }
  for (const lm of landmarks) {
    const z = lm.kind === "beach" || lm.kind === "fun park" ? "beach" : lm.kind === "park" ? "forest" : null;
    if (!z) continue;
    for (let i = Math.max(0, Math.floor((lm.mile - 1.5) * 4)); i < Math.min(n, Math.ceil((lm.mile + 1.5) * 4)); i++) {
      if (bucket[i] !== "motorway" && bucket[i] !== "city") bucket[i] = z;
    }
  }
  const zones = [];
  bucket.forEach((z, i) => {
    const until = +((i + 1) / 4).toFixed(2);
    if (zones.length && zones[zones.length - 1].zone === z) zones[zones.length - 1].until = until;
    else zones.push({ until, zone: z });
  });
  // fold stretches shorter than half a mile into the one before, so the scenery doesn't flicker
  const merged = [];
  for (const z of zones) {
    const start = merged.length ? merged[merged.length - 1].until : 0;
    if (merged.length && z.until - start < 0.5) merged[merged.length - 1].until = z.until;
    else if (merged.length && merged[merged.length - 1].zone === z.zone) merged[merged.length - 1].until = z.until;
    else merged.push({ ...z });
  }
  if (merged.length) merged[merged.length - 1].until = +totalMiles.toFixed(2);
  return merged;
}

async function findLandmarks(key, encoded, pts, cum, totalMiles) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask":
        "places.displayName,places.location,places.types,places.primaryTypeDisplayName,places.editorialSummary,places.userRatingCount",
    },
    body: JSON.stringify({
      textQuery: "famous landmarks and tourist attractions",
      searchAlongRouteParameters: { polyline: { encodedPolyline: encoded } },
      maxResultCount: 20,
      languageCode: "en-GB",
    }),
  });
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  const found = [];
  for (const p of data.places || []) {
    if ((p.userRatingCount || 0) < 150 || !p.location) continue; // keep places lots of people know
    if (unsuitablePlace(p.displayName?.text, p.types)) continue; // no pubs, cemeteries, prisons, hospitals, battlefields…
    const loc = [p.location.latitude, p.location.longitude];
    let best = 0, bd = Infinity;
    for (let i = 0; i < pts.length; i++) {
      const d = metres(loc, pts[i]);
      if (d < bd) { bd = d; best = i; }
    }
    if (bd > 3000) continue; // must be visible-ish from the road
    const [emoji, kind] = pickEmoji(p);
    found.push({
      mile: +cum[best].toFixed(1),
      name: clip(p.displayName?.text, 80),
      kind,
      emoji,
      summary: clip(p.editorialSummary?.text, 300),
      popularity: p.userRatingCount || 0,
    });
  }
  found.sort((a, b) => b.popularity - a.popularity);
  const picked = [];
  for (const lm of found) {
    if (picked.length >= 8) break;
    if (lm.mile < 1 || lm.mile > totalMiles - 1) continue;
    if (picked.some((o) => Math.abs(o.mile - lm.mile) < 2 || o.name === lm.name)) continue;
    picked.push(lm);
  }
  return picked
    .sort((a, b) => a.mile - b.mile)
    .map(({ popularity, ...lm }, i) => ({ id: "p" + i, ...lm }));
}

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
  // A place picked from the suggestions (or a saved place) comes as a Google place ID, which is exact;
  // anything typed (such as a postcode) comes as an address.
  const placeIdOk = (v) => typeof v === "string" && /^[A-Za-z0-9_-]{10,300}$/.test(v);
  const destinationText = clip(body.destination, 200);
  const destination = placeIdOk(body.destinationPlaceId) ? { placeId: body.destinationPlaceId } : destinationText ? { address: destinationText } : null;
  if (!destination) return json({ error: "Enter a destination." }, 400);
  const o = body.origin || {};
  const origin =
    typeof o.lat === "number" && typeof o.lng === "number"
      ? { location: { latLng: { latitude: o.lat, longitude: o.lng } } }
      : placeIdOk(o.placeId)
        ? { placeId: o.placeId }
        : o.address
          ? { address: clip(o.address, 200) }
          : null;
  if (!origin) return json({ error: "Missing a starting point." }, 400);

  const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask":
        "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs.steps.distanceMeters,routes.legs.steps.staticDuration,routes.legs.steps.navigationInstruction.instructions",
    },
    body: JSON.stringify({
      origin,
      destination,
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      units: "IMPERIAL",
      regionCode: "gb",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return json({ error: data.error?.message || "Google Maps couldn’t work out that route." }, 502);
  const route = data.routes?.[0];
  if (!route?.polyline?.encodedPolyline) return json({ error: "No driving route was found to that destination." }, 404);

  const encoded = route.polyline.encodedPolyline;
  const full = decodePolyline(encoded);
  const fullCum = [0];
  for (let i = 1; i < full.length; i++) fullCum.push(fullCum[i - 1] + metres(full[i - 1], full[i]) / MILE);
  const totalMiles = (route.distanceMeters || 0) / MILE || fullCum[fullCum.length - 1];
  const scale = fullCum[fullCum.length - 1] ? totalMiles / fullCum[fullCum.length - 1] : 1;

  // thin the path to keep saved routes small: one point every ~80 m, at most ~2500 points
  const spacing = Math.max(0.05, totalMiles / 2500);
  const points = [], cum = [];
  let last = -Infinity;
  full.forEach((p, i) => {
    const m = fullCum[i] * scale;
    if (m - last >= spacing || i === full.length - 1) {
      points.push([+p[0].toFixed(5), +p[1].toFixed(5)]);
      cum.push(+m.toFixed(3));
      last = m;
    }
  });

  const landmarks = await findLandmarks(key, encoded, points, cum, totalMiles).catch(() => []);
  const steps = (route.legs || []).flatMap((l) => l.steps || []);
  const zones = zonesFromSteps(steps, totalMiles, landmarks);

  return json({
    miles: +totalMiles.toFixed(1),
    mins: Math.max(1, Math.round(parseInt(route.duration || "0", 10) / 60)),
    zones,
    landmarks,
    points,
    cum,
    dest: points[points.length - 1],
  });
};

export const config = { path: "/api/route" };
