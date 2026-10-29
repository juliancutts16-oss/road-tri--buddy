# Spot-it game (`spotit`): changelog

The spotting game, and starting it from the Games page.
Version numbers belong to this feature only (see `FEATURES.md`). Newest first.

## 1.1 — "Pop up every" means what it says (29 October 2026, test version, not released yet)

**Why:** on the Pixel 10 phone test, Settings said "every 2 miles", but rounds were really 6 to 12 miles apart. Over 21 miles there was at most one round.

**What changed:** rounds now come about as often as the setting says (a little either side, so they aren't predictable). A round that comes due while a voice, game or question is on still waits, and starts as soon as they've finished.

**Checked in the test app:** with "every 2 miles", the next round comes 1.7 to 2.3 miles later.

**Where the code is** (`public/index.html`): `spotGap()`, and the `Spot.start()` check in `events()`.

**Next (to pick up later):** on a story trip, a voice is speaking much of the time, so rounds may still wait a long while for a quiet moment. Count the rounds on the next phone trip. If there are too few, let a round start in the gap between story parts.

## 1.0 — Where it started (up to 29 October 2026)

Where the feature stood when feature versions began. The details are in `CHANGELOG.md` under each app version.
