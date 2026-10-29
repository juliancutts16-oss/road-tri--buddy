# AI-written stories (`ai-stories`): changelog

Stories and fun facts written by the AI for this route. Children's names are never sent (the server only ever sees {NAMES}).
Version numbers belong to this feature only (see `FEATURES.md`). Newest first.

## 1.1 — The AI story now gets through (29 October 2026, test version, not released yet)

**Why:** on the Pixel 10 phone test, AI stories were on, but the family never got one. The whole trip used the built-in story.
- Netlify cuts a request off after 30 seconds. Writing a story takes about 12 seconds and checking it about 6, so a story that needed one rewrite (12 + 6 + 12 + 6 seconds) could never arrive.
- For a dinosaur fan, the writer is asked to use roar and stomp sounds, but the safety check counted "Everyone heard the dinosaur roar" as asking the children to roar.
- One failed beginning threw away the whole AI story, including the chapters.

**What changed:**
- **One try per request.** Each request now writes and checks the story once, which fits inside the 30 seconds. If it's rejected, the phone asks once more and passes on the reasons, so the writer can fix them. A story is still never sent back without its safety review.
- **Roar, stomp and shake are allowed in the story.** They only count as a problem when the children are asked to do it ("Can you roar?", "Let's all stomp!", "Everyone roar!", "Stomp your feet!"). "Everyone heard the dinosaur roar" and "Let's see the dinosaur stomp" are fine now. Every other move (shouting, jumping, kicking and so on) stays as strict as before.
- **If the beginning can't be written, the chapters still are.** The built-in beginning and end are used, and the AI chapters follow the built-in story's plot, so it's still one story.
- **Why a story was rejected is kept on the phone** (the last 20 reasons, with no names), so failures can be looked into.
- The chapter rewrites after the children's choices use the same retry.

**Checked in the test app:** the new safety rule against 12 example lines. All four "the story says it" lines pass, and all eight "the children are asked" lines are caught. Both server files were checked for mistakes in the browser, because this computer has no Node. **Not yet run on the real server.** That needs an upload to the test site and a trip with AI stories on.

**Where the code is:** `netlify/functions/story.mjs` (the one-try block near the end, `REVIEW_BY`, and `body.fix` for the reasons sent back), `netlify/lib/safety.mjs` (`SOFT_MOVES`, `COPY_SOFT`, `EVERYONE_SOFT`), and in `public/index.html` `storyApi()` and `storyLog()` (the reasons kept on the phone, in local storage `rtb.storyFails`), plus `prepareSaga()` (`builtIn: true` when the beginning failed).

**Next (to pick up later):**
- Take a trip on the test site with AI stories on, and check the story arrives. On the phone, the reasons for any rejection are in local storage `rtb.storyFails` (via Chrome remote debugging). On Netlify, see the function log's `story-rejected` lines.
- If a write alone sometimes takes over 20 seconds, the review is skipped and it's rejected ("no time left to review it"). Watch for that reason. If it's common, try a faster writer model or shorter requests.
- **The owner's idea, not built yet:** let the writer learn from rejections. Record only the reason, the age group, the story theme and whether the rewrite passed (never names, interests or places). Count the most common reasons each week. Turn the top ones into "watch out for" tips for the writer, which go live only after the owner approves them on the dashboard. Show the rejection rate on the dashboard. The privacy page may need a line about it.

## 1.0 — Where it started (up to 29 October 2026)

Where the feature stood when feature versions began. The details are in `CHANGELOG.md` under each app version.
