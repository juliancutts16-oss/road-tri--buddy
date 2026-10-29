# Kids profiles (`profiles`): changelog

A saved profile for each child, and their pictures down the left of the Search screen, to put them into the story.
Version numbers belong to this feature only (see `FEATURES.md`). Newest first.

## 1.1 — No wrong picture, and nothing overlapping (29 October 2026, test version, not released yet)

**Why:** on the Pixel 10 phone test, Mia (made from the old "names" box) showed the boy cartoon, because no picture had been chosen. Her picture also overlapped the globe logo and the edge of the Start box, and so did the tick ring when she was picked.

**What changed:**
- A child with no picture chosen yet shows their first letter in a circle instead of the boy cartoon.
- The Search screen asks once for each of them, by opening their page so a parent can choose ("Choose Mia's picture").
- The kids' pictures sit a little lower, and lower again once the Start and End bars both show, so they stay clear of the logo and the bars.

**Checked in the test app:** the letter picture shows, and the Search screen opens without errors. **Not yet seen on a phone with both bars showing.** That needs Google routes, which the test app on this computer doesn't have.

**Where the code is** (`public/index.html`): `kidPic()` and `askLook()` (just under `let kids=`), `askLook()` is called at the top of `renderStart()`, and the CSS is `.hero-kids`, `.hero.two .hero-kids` and `.kid-pic.kp-none`.

**Next (to pick up later):**
- On the phone, check the pictures are clear of the logo and the bars, both before and after a destination is typed, and with 4 or more children (the smaller "many" size).
- The "Choose Mia's picture" ask opens the child's normal edit page. A heading saying "Choose Mia's picture" could make it clearer.
- Still open from before: the Kids tile shares its red colour with Prompts in Settings.

## 1.0 — Where it started (up to 29 October 2026)

Where the feature stood when feature versions began. The details are in `CHANGELOG.md` under each app version.
