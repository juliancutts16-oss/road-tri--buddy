# Storyteller voice (`storyteller`): changelog

The natural storyteller voice that runs on the phone itself (Kokoro, model `onnx-community/Kokoro-82M-v1.0-ONNX`, q8). Nothing it reads ever leaves the phone, so the children's names stay private.
Version numbers belong to this feature only (see `FEATURES.md`). Newest first.

## 1.4 — Emma only, even when she's late (29 October 2026, test version, not released yet)

**Why:** in the emulator tests, Emma once took more than 20 seconds over a line, so the phone's own voice read it instead. The owner chose "Emma only".

**What changed:** a line that isn't ready now waits for Emma for up to 2½ minutes (the same as a chapter's longest wait), with the "Getting the story ready" globe, instead of switching to the phone's voice after 20 seconds. The phone's voice only reads a line if Emma can't make it at all (for example, if her voice has broken), or after that 2½ minutes, so the story never stops for good. A line that waited is forgotten once it's read, so the same line later in the trip waits for Emma again rather than going straight to the phone's voice.

**Checked in the test app:** with Emma taking 30 seconds over a line, she read it at 30 seconds and the phone's voice never stepped in. With Emma unable to make a line, the phone's voice read it after her 2-second failure, so the story carried on.

## 1.3 — Tested on three emulator phones, one fix (29 October 2026, test version, not released yet)

**What we did:** two 10-minute trips with Emma on each of three Android emulator phones (Android 37, Chrome 145), with the test app run from the computer the same way as the real site. Low-end phone: 2 processor cores, 2 GB. Medium: 4 cores, 4 GB. High-end: 8 cores, 8 GB (Chrome saw 6). Each trip starts cold, with nothing made in advance (like pressing Go at once). Hoot greets, reads the opening, then each chapter after a 30-second "drive", until 10 minutes are up. Questions and choices were skipped, because nobody can tap them in an emulator. The speed test was also run once on each phone.

**Fixed:**
- **The question at the end of a chapter wasn't prepared ahead.** For example, "What do you think we might see…?" at the end of the last chapter, or any chapter without a choice. The same was true for the "Can you say…? Say it with me" and "Say it after me" lines for 4–5-year-olds. Each of these lines made the story wait for Emma when it came up. Emma now prepares them with the rest of the chapter. Checked for all six combinations of age activity (question, say-it-with-me or neither) with choices on and off.

**What the tests showed:**

| Phone | Emma's speed (seconds of work per second of speech) | Wait before the opening | Wait before each chapter | Gaps once reading |
|---|---|---|---|---|
| Low (2 cores), test 1 | 2.8 | 79 s | 54 to 104 s | 1 s at most |
| Low, test 2 (after the fix) | 2.8 | 72 s | 61 to 91 s | 1 s at most |
| Medium (4 cores), test 1 | 2.0 | 80 s | 46 to 150 s | 1 s at most |
| Medium, extra monitored test | 5.2 | 50 s | 150 s (the most it waits) | one 20 s wait |
| Medium, test 2 | 5.3 | 150 s | 150 s | 1 s at most |
| High (8 cores), test 1 | 3.7 | 101 s | 84 to 121 s | 1.1 s at most |
| High, test 2 | 3.7 | 101 s | 82 to 150 s | 1 s at most |

- No errors on any phone. Emma was never restarted. Every line read was one she had prepared (after the fix).
- Once a part starts, it plays smoothly: gaps of about 1 second between passages.
- Hoot said hello after 19 to 51 seconds from cold. On a real trip, the greeting is usually made on the Search screen before Go.
- The phone's own voice read one line once (medium phone, test 2): Emma took more than 20 seconds to make a choice question, and that's how long the app waits before the phone's voice reads a line instead.
- **The emulator speeds aren't real phone speeds.** All three emulators share this computer's processor, so the "high-end" phone was slower than the "low-end" one, and the medium phone's speed changed from 2.0 to 5.3 between runs. What the tests do show is that whenever Emma is slower than real time, every part waits a minute or more when parts come close together. That's the main problem.
- **The speed test** worked on every phone: it timed the main processor and said clearly that the graphics chip can't be used on the emulator (it has none for the app). It then left only today's model on the phone.

**Needs the owner:** the real-phone speed test (graphics chip), whether the phone's voice should ever read a line when Emma is very late, and whether the 150-second maximum wait is right.

## 1.2 — Hello straight away, and a graphics-chip speed test (29 October 2026, test version, not released yet)

**Why:** the wait before the story starts is the main problem. Emma takes longer to make her voice than to say it (on this computer, 1.4 to 1.9 seconds of work for each second of speech; phones are likely slower), so the app waits until she's far enough ahead.

**What changed:**
- **Hoot says hello as soon as you press Go.** Before, the greeting ("Hello everyone! Our drive takes about…") waited until Emma was far enough ahead on the whole opening, so the children heard nothing at first. Now the greeting plays as soon as it's ready (usually it's made on the Search screen before Go), and the "Getting the story ready" globe shows afterwards if the opening still needs time. On this computer, with nothing made in advance, Hoot spoke after 27 seconds instead of 66. The story itself started after 88 seconds instead of 79, which may be partly chance (tests vary by a few seconds).
- **Speed test (test version only):** Settings → Storyteller voice → "Speed test: try the graphics chip". It times Emma on the phone's main processor (today's way) and on its graphics chip (WebGPU), then shows both and says whether the graphics chip would remove the wait. It downloads the 326 MB full-size model for the test and removes it again afterwards, keeping today's model. With "Help improve AWTY" on, the numbers (no text) are recorded too. It needs taking out before the storyteller is released.

**What we found on this computer:**
- The graphics chip made Emma about 15 to 20 times faster (0.09 seconds of work per second of speech).
- It only works with the full-size 326 MB model. Today's 92 MB model ran no faster on the graphics chip, and the 163 MB half-size model came out as broken noise.
- A phone's graphics chip is much weaker, so we need the phone test before deciding on the bigger download.

**Checked in the test app:** the greeting plays before the opening is ready. The speed test runs from start to finish, shows its results in Settings, and removes only the full-size model.

**Next:** the owner runs the speed test on their phone once the hub has uploaded this to the test site. Then we decide whether phones that can use the graphics chip should get the bigger download.

## 1.1 — Emma, read in passages (29 October 2026, test version, not released yet)

**Why:** the owner found Alice flat and robotic, with no rise and fall in her voice.

**How we chose:** we built a voice lab on the computer (kept off GitHub) to hear the same story in every voice that can run on the phone: Kokoro's four British women (Alice, Emma, Isabella, Lily), Piper's British women (Jenny, Cori, Alba, a Southern English woman, Prudence) and the computer's own voices. Voices over the internet that sound more human (for example ElevenLabs) were ruled out, because the children's names would leave the phone. The owner wanted a British woman and chose **Emma**. The voice's makers rate her B-, against Alice's D.

**What changed:**
- **Emma replaces Alice.** Phones that had Alice switch to Emma by themselves. They fetch her small voice file once, the next time they're online. If they're offline, the app says so, and the phone's own voice reads the story until then. Settings, the first-time download offer and the developer dashboard all say Emma now.
- **Her dramatic pauses are kept.** The app used to turn "…" and " — " into plain commas before she read them, which made her flatter. She now reads them as written. The phone's own voice still gets commas, as before.
- **She reads in short passages instead of one sentence at a time.** Each part of the story starts with one sentence, so it begins just as quickly, then two sentences together, then up to three. Her voice flows across each passage like a real storyteller. The Story page, the read-along highlighting and the sound effects follow the passages. Up to 6 sound effects can play in a passage (it was 3 per sentence). The phone's own voice still reads one sentence at a time.
- **She reads about 10% slower.** The owner felt passages were a little fast.

**Checked on the computer (test app):**
- A phone set to Alice switches to Emma.
- Her voice downloads, and she reads lines with "…" and "—".
- Every passage she prepares ahead is exactly what's read on the trip.
- The opening started after the same wait as before (49.5 seconds with passages, 48.2 seconds one sentence at a time, on a computer that takes about 1.9 seconds to make each second of her speech), then played with no gaps.
- Not yet heard on a real phone or on a full trip.

**Tried and dropped:** having her make a whole passage and then cutting it back into sentences. She sometimes barely pauses after "!", so the cut points couldn't be found reliably.

**Still to do:** the wait before the story starts on slower phones (she takes longer to make her voice than to say it).

## 1.0 — Alice (app versions 0.2.0 to 0.3.2, up to 29 October 2026)

Where the feature stood when feature versions began. The details are in `CHANGELOG.md` under each app version.
- **0.2.0:** Alice arrives: a natural British storyteller voice (`bf_alice`) that runs on the phone, downloaded once (about 124 MB with the music and sound effects) and kept for use with no signal. A first-launch offer to download her. Sound effects land exactly on their word.
- **0.2.1 to 0.2.3:** she becomes the storyteller as soon as she's downloaded. Stories start sooner: lines are prepared ahead, and the route is planned on the Search screen before Go. The "Getting the story ready" globe shows how much is ready. Settings previews wait for her.
- **0.2.4:** Alice only, never mixed with the phone's voice. She prepares much more ahead, including the lines after each choice and the chapter rewritten to follow the children's choice.
- **0.2.5 and 0.2.6:** she can no longer go silent for good (she's restarted if she stops answering). The opening no longer waits behind the rest of the story, the globe moves smoothly, and demo trips slow down while she catches up.
- **0.2.7:** shorter waits between chapters (no wasted work), and her finished sentences are saved on the phone for 3 days, so a restart doesn't lose them. She isn't restarted just because the app was in the background. With "Help improve AWTY" on, the developer dashboard records how long the story waits for her.
- **0.3.0 to 0.3.2:** not in the Free app. Kept, unchanged, in the full test version.
