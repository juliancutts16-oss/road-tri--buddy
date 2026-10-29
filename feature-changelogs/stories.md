# Trip story (`stories`): changelog

Hoot's story told across the trip: a beginning, middle parts and an end, the Story page, and "Make the stories theirs".
Version numbers belong to this feature only (see `FEATURES.md`). Newest first.

## 1.1 — More story, less silence, no repeats (29 October 2026, test version, not released yet)

**Why:** on the Pixel 10 phone test (Birmingham to Coventry, 43 minutes), each part was about a minute of story followed by about 5 minutes of nothing. The built-in story also repeated itself ("Ah… ah… achoo!" twice, "zooming along the open road" twice, and the same "set off again" line in every part).

**What changed:**
- **A story part about every 4 minutes** instead of every 7 (on long trips, every twelfth of the trip instead of every eighth). The Coventry trip now has 10 parts instead of 6. With AI stories on, that means more chapters to write, and more for Emma to prepare.
- **Hoot's in-between moments**, halfway between parts: a short built-in line (no AI, so no cost). They take turns: a question about the story ("Mia, how do you think the dinosaur is feeling?"), something to spot ("Hoot here! Can anyone see a red car?"), and how long is left ("Hoot here! Only 20 minutes to go!"). Emma prepares them after the story itself. One that isn't ready yet, or that comes while a game, question or Spot-it round is on, is simply skipped, so it never holds anything up.
- **The built-in story never repeats a line in one trip.** Every kind of line now has a long list (12 road lines, 12 things that happen on the road, 6 extra finds, 8 lines about what the child loves, and so on). A line that's been used is skipped until its list runs out.

**Checked in the test app:** on the 43-minute Coventry route with a dinosaur fan, the built-in story had no repeated line at 3, 5 or 7 sentences per part. There are 10 parts and 11 in-between moments. Not yet heard on a real trip.

**Where the code is** (`public/index.html`): `storyStops()` spaces the parts (the `Math.max(4,mins/12)` line), `sagaFallback()` builds the built-in story, the line lists sit just above it (`ROAD_GO`, `ROAD_BIT`, `FOUND_MORE`, `LIKE_LINES`, `AGAIN_MORE`, `EXCITE`, `SET_OFF`, `NEXT_Q`), `checkins()` makes Hoot's in-between moments, and `events()` plays them.

**Next (to pick up later):**
- Re-test on the phone: is every 4 minutes right, or too much? Do the in-between moments land well, or come too often (there's now something about every 2 minutes)?
- Check the AI cost and Emma's waits with 10 parts instead of 6 (the dashboard's "Storyteller voice" card).
- Very long trips (2 hours or more) can still run through a list and repeat. Add more lines if that shows up.
- The in-between moments are skipped if Emma hasn't made them yet. If they're skipped a lot, have her make them earlier.

## 1.0 — Where it started (up to 29 October 2026)

Where the feature stood when feature versions began. The details are in `CHANGELOG.md` under each app version.
