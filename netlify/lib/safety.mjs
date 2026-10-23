// Child-safety rules shared by the AWTY server functions:
//  - the age rulebooks given to the AI writer (and to the reviewer that checks its work)
//  - a word filter, a reading-level check, and a filter for interests typed by parents and for landmarks

export const AGE_RULES = {
  "4-5": "Ages 4 to 5: very short sentences (about 8 to 10 words) using everyday words a four-year-old knows. Problems are tiny and cosy, like a lost hat or a missing map. Only kind characters; no baddies at all.",
  "6-7": "Ages 6 to 7: short sentences (about 10 to 14 words). A few new words are fine if the story makes their meaning clear. Small adventures and gentle surprises. Characters can be cheeky but never mean.",
  "8+": "Ages 8 to 12: longer sentences and richer vocabulary are fine. Bigger quests and puzzles are fine, but never real danger. A rival is allowed only if they become friends by the end.",
};

export const ALWAYS_RULES = `Rules for every age:
- Never include injury, illness, death, monsters, ghosts, anyone getting lost or being scared, strangers, weapons or fighting, romance, brand names, food or allergy dangers, toilet humour, or anyone being mean or left out.
- Never show behaviour a child might copy that is unsafe, especially in a car: unbuckling a seatbelt, distracting the driver, opening windows, throwing things, climbing, wandering off, talking to strangers, going near water or roads alone, or eating things they don't know.
- Always show kindness, teamwork and good manners.
- The children are strapped into car seats. When the story asks them to do something, it may only ask them to look out of the window, listen, say something in a normal voice, count, sing quietly or imagine.
- Never ask, dare or encourage them to do anything with their bodies: no kicking, stamping, jumping, bouncing, wriggling, clapping, banging, tapping, reaching, grabbing, touching, pressing, pushing, pulling, opening, unbuckling, climbing, standing up or throwing, and no shouting or loud noises that could startle the driver. Never ask them to talk to or wave at anyone outside the car.
- The hero may run, jump or kick a ball in the story world, but never suggest the children copy it (nothing like "kick like Pip!" or "can you jump too?").`;

export const FACT_RULES = "For fun facts: only facts that are true and cheerful. Leave out anything upsetting, such as wars, battles, deaths, disasters, crimes or punishments.";

// Words that should never appear in a story read to a young child (whole words, any case).
const BLOCKED = /\b(kill(s|ed|ing|er)?|murder\w*|dead|deaths?|die[sd]?|dying|blood\w*|guns?|rifles?|pistols?|bombs?|bombing|stab\w*|shoot(s|ing)?|wars?|weapons?|knife|knives|corpses?|graves?|graveyards?|cemeter\w*|coffins?|funerals?|ghosts?|zombies?|monsters?|demons?|devils?|hell|vampires?|nightmares?|terrif\w*|horror|kidnap\w*|strangers?|poison\w*|drown\w*|beer|wine|vodka|alcohol|drunk|cigarettes?|vap(e|ing)|drugs?|sex\w*|naked|stupid|idiots?|dumb|hate[sd]?|damn|crap|farts?|farting|poo|pee)\b/i;
// Unsafe things to copy in a car.
const UNSAFE_ACTS = /\b(unbuckl\w*|seat ?belts? (off|undone)|took (off )?(his|her|their|its) seat ?belt|open(ed|s|ing)? the (car )?window|open(ed|s|ing)? the car door|wav(e|es|ed|ing) (to|at) (the )?(people|person|anyone|someone|strangers?|drivers?|lorry drivers?|other cars?)|distract(ed|ing|s)? the driver|stick(ing)? (his|her|their|its) head out)\b/i;

// Asking the children to copy a physical action ("can you kick like Pip?", "stamp your feet!", "let's jump!").
// Deliberately strict: a story that trips it is rewritten, and if it trips again the built-in story is used.
const MOVES = "kick\\w*|stamp\\w*|stomp\\w*|jump\\w*|bounc\\w*|wriggl\\w*|wiggl\\w*|clap\\w*|bang\\w*|drum\\w*|tap\\w*|knock\\w*|reach\\w*|grab\\w*|touch\\w*|press\\w*|push\\w*|pull\\w*|open\\w*|unbuckl\\w*|undo\\w*|climb\\w*|stand up|throw\\w*|hit|punch\\w*|shake\\w*|wave|waving|shout\\w*|scream\\w*|yell\\w*|roar\\w*";
const COPY_ME = new RegExp(`\\b(can you|could you|will you|would you|you can|you could|you should|now you|everyone|let's|let us|try to|join in|copy|do it too|with me)\\b[^.!?]{0,30}\\b(${MOVES})\\b`, "i");
const BODY_ORDER = new RegExp(`(^|[.!?]\\s*)(now\\s+|quick(ly)?,?\\s+|go on,?\\s+)?(${MOVES})\\b[^.!?]{0,25}\\b(your|the seat|the window|the door|the car|feet|legs|hands|arms)\\b`, "i");
export function blockedWords(text) {
  const found = [];
  const s = String(text || "").replace(/\{[^}]*\}/g, " ").replace(/’/g, "'");
  const a = s.match(BLOCKED), b = s.match(UNSAFE_ACTS), c = s.match(COPY_ME) || s.match(BODY_ORDER);
  if (a) found.push(`uses the word "${a[0]}"`);
  if (b) found.push(`shows unsafe behaviour in a car ("${b[0]}")`);
  if (c) found.push(`asks the children to do a physical action or make a loud noise in the car ("${c[0].trim()}"); they may only look, listen, say, count, sing quietly or imagine`);
  return found;
}

// Reading level: average and longest sentence, and the share of long words, for the age band.
const READING = {
  "4-5": { avg: 11, max: 16, longLen: 9, longShare: 0.08 },
  "6-7": { avg: 15, max: 22, longLen: 10, longShare: 0.12 },
  "8+": { avg: 22, max: 32, longLen: 12, longShare: 0.2 },
};
export function readingIssues(sentences, ageKey, rich) {
  const r = READING[ageKey] || READING["6-7"], loosen = rich ? 1.3 : 1;
  const clean = (s) => String(s).replace(/\{[^}]*\}/g, " ").replace(/[^A-Za-z' -]/g, " ");
  const lists = sentences.map((s) => clean(s).split(/\s+/).filter(Boolean)).filter((w) => w.length);
  if (!lists.length) return [];
  const words = lists.flat(), avg = words.length / lists.length, longest = Math.max(...lists.map((w) => w.length));
  const longShare = words.filter((w) => w.replace(/['-]/g, "").length >= r.longLen).length / words.length;
  const issues = [];
  if (avg > r.avg * loosen) issues.push(`sentences are too long for this age (average ${avg.toFixed(0)} words; keep to about ${Math.round(r.avg * loosen)} or fewer)`);
  if (longest > r.max * loosen) issues.push(`one sentence has ${longest} words; keep every sentence under ${Math.round(r.max * loosen)}`);
  if (longShare > r.longShare * loosen) issues.push("too many long, hard words for this age; use simpler words");
  return issues;
}

// Interests and names typed by parents: anything on the blocked list is left out of the story request.
export function safeDetail(text) {
  const s = String(text || "");
  return blockedWords(s).length ? "" : s;
}

// Landmarks that should never become story stops, by Google place type or by name.
const BAD_PLACE_TYPES = /\b(bar|night_club|casino|liquor_store|cemetery|funeral_home|prison|correctional|hospital|police|courthouse|adult|tobacco|cannabis|wine_bar|pub)\b/;
const BAD_PLACE_NAMES = /\b(pub|inn|tavern|bar|brewery|distillery|nightclub|casino|cemetery|graveyard|crematorium|prison|hmp|gaol|jail|hospital|hospice|asylum|morgue|memorial|battlefield|battle of|gallows|execution|war museum|dungeon)\b/i;
export function unsuitablePlace(name, types = []) {
  return BAD_PLACE_NAMES.test(String(name || "")) || BAD_PLACE_TYPES.test((types || []).join(" "));
}
