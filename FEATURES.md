# AWTY feature packs

Every extra in AWTY is its own feature, with its own on/off switch. Tiers (Free, £3, £5…) are just lists of these features, so a feature can move to a different tier by changing one line.

**To work on one, tell Claude its name**, for example: "let's work on *Mini-games*" or "tidy up `points`".

## The core (always on, in every tier)
The map, miles and time left, the car at the top, background music (with the optional ~8 MB music download), Stats (trips and miles), Settings, the parent PIN and the trip-screen lock.

## The features

| # | Name (code name) | What's in it | Needs | Status | In tiers |
|---|---|---|---|---|---|
| 1 | Read-aloud voice (`voice`) | The phone reading things out loud | – | ✅ Ready | Full |
| 2 | Alice storyteller voice (`storyteller`) | The downloadable natural voice that runs on the phone (~124 MB with sounds) | Read-aloud voice | ✅ Ready | Full |
| 3 | Landmarks & fun facts (`landmarks`) | Landmarks found along the route, their pop-ups, facts and questions | – | ✅ Ready | Full |
| 4 | Trip story (`stories`) | Hoot's story told across the trip, the Story page, "Make the stories theirs" (children's names, favourite animal, likes, buddy) | Voice, Landmarks | 🧹 Needs tidying | Full |
| 5 | AI-written stories (`ai-stories`) | Stories and fun facts written by the AI for this route (names never sent) | Trip story | ✅ Ready | Full |
| 6 | Listen for answers (`listen`) | Microphone answers to questions, and AI replies to them | Voice, Landmarks | ✅ Ready | Full |
| 7 | Spot-it game (`spotit`) | The spotting game, and starting it from the Games page | – | ✅ Ready | Full |
| 8 | Mini-games (`games`) | The Games page and the bonus game pop-ups during a trip | – | 🧹 Needs tidying | Full |
| 9 | Points, coins & unlocks (`points`) | Stars on the trip screen, coins, unlocking cars, the points and "seen most" stats | – | 🧹 Needs tidying | Full |
| 10 | Car & house choices (`cars-houses`) | Choosing the car and houses, the My car page, number-plate lookup | – | 🧹 Needs tidying | Full |
| 11 | Sound effects (`sound-fx`) | Distance sounds, arrival fanfare, chimes, timer ticks, story sounds | – | ✅ Ready | Full |
| 12 | Age-group themes (`themes`) | The paid age-group looks (see `planning/ui-v2/BUILD-NOTES.md`) | – | 🚧 Being built | – |
| 13 | Kids profiles (`profiles`) | A saved profile per child (name, age, a boy or girl cartoon picture, and with stories on: favourite animal, things they love, travel buddy). Set up once after the privacy choices, changed in Settings → Kids. The kids' pictures sit down the left of the Search screen's mountain with their first names; nobody is in the story until tapped, and each child tapped (blue ring and tick) goes into the story by name with their favourites. The age follows the youngest picked. The picks clear when the app is opened again after half an hour, like the search bar. Choosing their own look is planned for a paid tier. Replaces typing names and favourites on the Search screen, and drops "What's the trip for?" | – | 🚧 Being built (first version done, try it with the picker) | – |

**Status:**
- ✅ **Ready**: works on its own and can go into any tier.
- 🧹 **Needs tidying**: works, but hasn't been checked on its own yet (for example, with the features it's usually paired with switched off). Worth a clean-up before it's sold separately.
- 🚧 **Being built**: not in any tier and not seen by anyone, except through the test picker.

## Tiers
| Tier | Features |
|---|---|
| Free (live today) | Core only |
| Full (test version) | Everything that isn't 🚧 |
| £3 | *Not decided yet* |
| £5 | *Not decided yet* |

## Trying a tier (test version only)
In the test app: **Settings → Safety → Feature packs**. Tap features on or off, or tap "Show the free tier", and the app restarts showing just that mix. "Back to normal" undoes it. This picker never appears in the live app.

## Where it lives in the code (for Claude)
- `public/index.html`: `FEATURES`, `TIERS`, `EDITION`, `has()`, `featureForce()`. Keep this file's table in step with `FEATURES`.
- `netlify/lib/common.mjs`: `TIERS`, `EDITION`, `has()`, `featureOff()` for the server helpers (story → `ai-stories`, answer → `listen`, vehicle → `cars-houses`).
- Each branch keeps its own `EDITION` line: `'free'` on `main`, `'full'` on `test`.
- Selling a tier (Play Store subscriptions, checking who has paid) isn't built yet. Right now the tier is set per branch.
