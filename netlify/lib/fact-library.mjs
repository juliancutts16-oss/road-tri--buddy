// The fact library (landmarks): fun facts that passed every safety check, saved so the next family passing the same
// place hears them straight away (no wait, no chance of a rejection, no AI cost). The plan is in planning/fact-library.
// One entry per place, age group and word level, holding up to 4 sets so a family on a regular trip hears new ones:
//   facts/<Google place ID>/<age>-<simple|academic>   in Netlify Blobs (store "awty-facts", or "awty-facts-test")
// Only Google's place ID and our own facts are kept: never the family, the trip, dates of use, or Google's name for it.
import { getStore } from "@netlify/blobs";
import rulebook from "./safety-rules.json" with { type: "json" };
import { AGE_RULES, ALWAYS_RULES, FACT_RULES } from "./safety.mjs";

// The live site uses "awty-facts"; the test branch (and any other non-live deploy) uses "awty-facts-test"
export const FACT_STORES = ["awty-facts", "awty-facts-test"];
const factStore = (context) =>
  getStore(!context?.deploy?.context || context.deploy.context === "production" ? FACT_STORES[0] : FACT_STORES[1]);

export const MAX_SETS = 4;
export const SET_SIZE = 7; // the most facts a parent can choose, so one set suits 3, 5 or 7

// Sets checked under other rules are never given out: any change to the rulebook or the AI's age rules starts afresh
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.codePointAt(0)) | 0; return (h >>> 0).toString(36); };
export const RULES = `${rulebook.version}-${hash(JSON.stringify([AGE_RULES, ALWAYS_RULES, FACT_RULES]))}`;
const thisMonth = () => new Date().toISOString().slice(0, 7);
const monthsOld = (m) => { const [y, mo] = String(m).split("-").map(Number), now = new Date(); return (now.getUTCFullYear() - y) * 12 + now.getUTCMonth() + 1 - mo; };
const fresh = (s) => s && s.rules === RULES && monthsOld(s.month) < 12 && Array.isArray(s.sentences) && s.sentences.length;

export const placeIdOk = (v) => typeof v === "string" && /^[A-Za-z0-9_-]{10,300}$/.test(v);
export const setIdOk = (v) => typeof v === "string" && /^[a-z0-9]{4,12}$/.test(v);
export const libraryKey = (placeId, ageKey, rich) => `facts/${placeId}/${ageKey}-${rich ? "academic" : "simple"}`;

// A saved set this phone hasn't heard yet (the least used first), or null
export async function fromLibrary(context, key, heard) {
  const store = factStore(context);
  const entry = await store.get(key, { type: "json" });
  const sets = (entry?.sets || []).filter(fresh);
  const set = sets.filter((s) => !heard.includes(s.id)).sort((a, b) => (a.uses || 0) - (b.uses || 0))[0];
  if (!set) return null;
  set.uses = (set.uses || 0) + 1;
  await store.setJSON(key, { sets }).catch(() => {}); // counting the use is only a nice-to-have
  return set;
}

// Saves a set that passed the checks. Out-of-date sets are dropped, and with 4 already the oldest one makes room.
export async function addToLibrary(context, key, piece) {
  const store = factStore(context);
  const entry = await store.get(key, { type: "json" });
  const sets = (entry?.sets || []).filter(fresh);
  const set = { id: Math.random().toString(36).slice(2, 10), ...piece, rules: RULES, month: thisMonth(), uses: 1 };
  sets.push(set);
  while (sets.length > MAX_SETS) sets.shift();
  await store.setJSON(key, { sets });
  return set.id;
}
