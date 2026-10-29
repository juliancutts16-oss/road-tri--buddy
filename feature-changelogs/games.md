# Mini-games (`games`): changelog

The Games page and the bonus game pop-ups during a trip.
Version numbers belong to this feature only (see `FEATURES.md`). Newest first.

## 1.1 — Traffic Lights: shorter, with more reds (29 October 2026, test version, not released yet)

**Why:** on the Pixel 10 phone test, 14 lights felt like too many (the other games for 6–7-year-olds have 8 rounds). And because each light was green 60% of the time by chance, some games had only 1 or 2 reds.

**What changed:** 10 lights every game, always 6 green and 4 red, shuffled, and never more than 3 greens in a row.

**Also:** the games now talk in Emma's voice when she's on (see the storyteller's version 1.5).

**Checked in the test app:** 200 shuffled games all had exactly 4 reds and never 4 greens in a row.

**Where the code is** (`public/index.html`): `GAMES.traffic` (`N=10` and the `seq` shuffle). The game voice is `GAME_SAY`, `gameLines()` and `gameSay()`, just above `MG`.

**Next (to pick up later):**
- Play Traffic Lights on the phone: is 10 lights right?
- Check the games speak in Emma's voice once she's had time to make their lines.
- The other games still only show "Well done!" and "Oops, red means stop!" on screen. If Emma should say them too, add them to `GAME_SAY`.

## 1.0 — Where it started (up to 29 October 2026)

Where the feature stood when feature versions began. The details are in `CHANGELOG.md` under each app version.
