# AWTY feature packs

Every extra in AWTY is its own feature, with its own on/off switch. Tiers (Free, £3, £5…) are just lists of these features, so a feature can move to a different tier by changing one line.

**To work on one, tell Claude its name**, for example: "let's work on *Mini-games*" or "tidy up `points`".

## The core (always on, in every tier)
The map, miles and time left, the car at the top, background music (with the optional ~8 MB music download), Stats (trips and miles), Settings, the parent PIN and the trip-screen lock.

## The features

| # | Name (code name) | What's in it | Needs | Status | Version | In tiers |
|---|---|---|---|---|---|---|
| 1 | Read-aloud voice (`voice`) | The phone reading things out loud | – | 🧹 Needs tidying | 1.0 | Full |
| 2 | Emma storyteller voice (`storyteller`) | The downloadable natural voice that runs on the phone (~124 MB with sounds) | Read-aloud voice | 🧹 Needs tidying | [1.5](feature-changelogs/storyteller.md) | Full |
| 3 | Landmarks & fun facts (`landmarks`) | Landmarks found along the route, their pop-ups, facts and questions | – | 🧹 Needs tidying | 1.0 | Full |
| 4 | Trip story (`stories`) | Hoot's story told across the trip, the Story page, "Make the stories theirs" (children's names, favourite animal, likes, buddy) | Voice, Landmarks | 🧹 Needs tidying | [1.1](feature-changelogs/stories.md) | Full |
| 5 | AI-written stories (`ai-stories`) | Stories and fun facts written by the AI for this route (names never sent) | Trip story | 🧹 Needs tidying | [1.1](feature-changelogs/ai-stories.md) | Full |
| 6 | Listen for answers (`listen`) | Microphone answers to questions, and AI replies to them | Voice, Landmarks | 🧹 Needs tidying | 1.0 | Full |
| 7 | Spot-it game (`spotit`) | The spotting game, and starting it from the Games page | – | 🧹 Needs tidying | [1.1](feature-changelogs/spotit.md) | Full |
| 8 | Mini-games (`games`) | The Games page and the bonus game pop-ups during a trip | – | 🧹 Needs tidying | [1.1](feature-changelogs/games.md) | Full |
| 9 | Points, coins & unlocks (`points`) | Stars on the trip screen, coins, unlocking cars, the points and "seen most" stats | – | 🧹 Needs tidying | 1.0 | Full |
| 10 | Car & house choices (`cars-houses`) | Choosing the car and houses, the My car page, number-plate lookup | – | 🧹 Needs tidying | 1.0 | Full |
| 11 | Sound effects (`sound-fx`) | Distance sounds, arrival fanfare, chimes, timer ticks, story sounds | – | 🧹 Needs tidying | [1.1](feature-changelogs/sound-fx.md) | Full |
| 12 | Age-group themes (`themes`) | The paid age-group looks (see `planning/ui-v2/BUILD-NOTES.md`) | – | 🚧 Being built | 1.0 | – |
| 13 | Kids profiles (`profiles`) | A saved profile per child (name, age, a boy or girl cartoon picture, and with stories on: favourite animal, things they love, travel buddy). Set up once after the privacy choices, changed in Settings → Kids. The kids' pictures sit down the left of the Search screen's mountain with their first names; nobody is in the story until tapped, and each child tapped (blue ring and tick) goes into the story by name with their favourites. The age follows the youngest picked. The picks clear when the app is opened again after half an hour, like the search bar. Choosing their own look is planned for a paid tier. Replaces typing names and favourites on the Search screen, and drops "What's the trip for?" | – | 🚧 Being built (first version done, try it with the picker) | [1.1](feature-changelogs/profiles.md) | – |

**Status:**
- ✅ **Ready**: works on its own and can go into any tier.
- 🧹 **Needs tidying**: works, but hasn't been checked on its own yet (for example, with the features it's usually paired with switched off). Worth a clean-up before it's sold separately.
- 🚧 **Being built**: not in any tier and not seen by anyone, except through the test picker.

**Version:** each feature has its own version number, separate from the app's version (0.3.2 and so on). Every feature started at **1.0** on 29 October 2026, as it was then. Each round of work on a feature adds 0.1 (1.0 → 1.1 → 1.2…).
Every feature that has changed since then has its own changelog, `feature-changelogs/<code name>.md`, with the date and every change in plain English, newest first. A feature's version links to its changelog. A change is also still added under "Unreleased" in `CHANGELOG.md`, as before.

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
