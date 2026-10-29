# Sound effects (`sound-fx`): changelog

Distance sounds, the arrival fanfare, chimes, timer ticks and the sounds in the story.
Version numbers belong to this feature only (see `FEATURES.md`). Newest first.

## 1.1 — Sounds play on their words (29 October 2026, test version, not released yet)

**Why:** on the Pixel 10 phone test, the dinosaur's roar played before Hoot said anything, at the start of "A bit further on, the dinosaur was bumping along a country lane". Nothing in that part roared.

**What changed:**
- **Built-in story:** each theme sound now has its own short line that ends on the sound, such as "The dinosaur gave a big, happy roar!" or "The dinosaur went stomp, stomp, stomp." Travel sounds (whoosh, choo, chug, gallop, waves, rocket) still start a travel line, where they make sense.
- **AI stories:** a sound the writer put at the very start of a sentence moves to just after its word ("…the dinosaur roared", then the roar), or to the end of the sentence if the word isn't there.

**Checked in the test app:** no roar or stomp at the start of any built-in line. In "Everyone heard the dinosaur roar loudly." the roar now comes after the word "roar".

**Where the code is** (`public/index.html`): `CUE_TAILS` (the built-in sound lines), `CUE_WORDS` and `CUE_START` (just under `BASE_CUES`), and the end of `speakable()` (moving a sound from the start of a sentence).

**Next (to pick up later):** listen on the phone that each sound lands on its word, with Emma and with the phone's voice. A sound whose word isn't in `CUE_WORDS` goes to the end of its sentence. Add words there if one sounds wrong.

## 1.0 — Where it started (up to 29 October 2026)

Where the feature stood when feature versions began. The details are in `CHANGELOG.md` under each app version.
