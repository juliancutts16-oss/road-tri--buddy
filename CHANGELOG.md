# AWTY changelog

Every release gets a number. Bump the **middle** number for new features (0.1 → 0.2), the **last** number for fixes only (0.1.0 → 0.1.1), and go to **1.0** when the app launches on the Play Store.
See `RELEASING.md` for the step-by-step.

## Unreleased
_Changes waiting for the next release go here._

## 0.1.2 (hotfix)
- No more maths questions. Setting up the parent PIN goes straight to choosing it.
- "Forgot PIN?" now has to be held down for 10 seconds (it counts down) before a new PIN can be chosen. Trips and settings are kept.

## 0.1.1 (fixes)
- Search screen: "Trip details" and "Who's coming?" are now fold-away boxes. When closed, each shows a one-line summary (where you're starting from; names, age and games).
- Search screen: the whole mountain now fits on every phone, instead of being cut off at the bottom.
- Sounds: the "Vroom" distance sound no longer sounds like a fart. It's now a toy racing car zooming past. The dinosaur roar and rocket lost their low buzz too, and all sound effects have a soft echo so they sound rounder.
- Easier to read: headings in Settings and elsewhere no longer get a smudged, fake bold. The same rounded font, just crisp.

## 0.1.0 (first release)

**New look (UI version 3)**
- A fresh, simpler design in blue, yellow, red and green, with the AWTY planet logo and Hoot the owl as the storyteller.
- The Search screen is just the logo and a search bar over a mountain, with a car climbing the road. Saved places are behind a bookmark button.
- The trip screen shows the road, big "Miles left" and "Time left" boxes, Hoot telling you the next stop, and one big box you swipe between the Map, Games and the Story (to read along with Hoot). A speaker button turns the music on and off.
- A bottom bar with Search, Stats, Settings and a Lock. During a trip it's locked for the kids ("Parents only") and slides open with the parent PIN.
- A 4-digit parent PIN replaces the maths question. It's set up the first time it's needed, and "Forgot PIN?" lets a grown-up set a new one.
- Settings has big coloured tiles and a red "Report a problem" button. Stats has coloured number tiles.
- One look for every age for now. The age-group themes will come later as a paid extra.

**The trip**
- A car drives from home to the destination, following the phone's GPS (or demo driving, or the offline timer).
- A journey map with landmarks that tick off as you pass them.
- Three age looks: Playful (4–5), Adventure (6–7), Neon (8+), plus straight or winding roads.
- New name and icon: AWTY – Are We There Yet?, with a red car inside a yellow question mark.
- Works on phones and tablets: full-width tabs on phones, and on a tablet held sideways the road sits on the left with games and buttons on the right.
- A Menu button that ends the trip and goes back to the start screen, plus Reset settings and Clear everything in Parent controls.

**Stories and games**
- A trip-long AI story with a beginning, chapters at each landmark and an ending, read aloud with sound effects.
- Children choose what happens next with two big picture buttons (or by saying it), and the next chapter follows their choice.
- The story asks the children to help by spotting something out of the window (a cow, a bus, the sea…), matched to where the car is.
- A nicer-sounding voice by default (the best one on the phone, with a "Hear this voice" button), and storyteller pacing with pauses, lively questions and a calmer ending.
- "Listen for answers" (off unless a parent turns it on): after a question the app listens through the microphone and says whether they got it right. The phone asks for microphone permission when a grown-up switches it on.
- Listening is forgiving for young voices: words that sound close count ("wabbit" for rabbit), a child who speaks but can't be made out still gets praised for trying, and "repeat after me" always rewards a go.
- A 📖 Story time button for the next part of the story, and pausing the trip also pauses the voice.
- Spot-it rounds and 12 mini-games (4 per age group). Traffic Lights shows how fast each tap was.
- Music, sound effects, unlockable cars and trip stats.

**Places**
- "Use my current location".
- Suggestions near you, with a "Which one?" choice for vague names like "Tesco".
- Exact postcodes and saved places (Home, Grandma's…).

**Child safety and privacy**
- A grown-up maths gate and a privacy choices screen.
- Children's names stay on the phone and are never sent to the AI.
- Every AI story gets a safety check, and parents can report a problem from Settings → Read the story.
- Story safety checks: age rules, a word filter, a reading-level check and a separate AI review. Anything that fails is rewritten once or replaced by the built-in story.
- Stories never ask children to move, touch, open, kick or throw anything, or to shout or wave at people outside. They only ever look, listen, say or imagine.
- Unsuitable interests typed by parents are left out (with a note saying so), and pubs, cemeteries, prisons and hospitals are never used as story stops.
- Optional anonymous usage stats (off by default), plus a privacy policy page.
- Location is its own privacy choice (off by default): a "Location on" sign shows on the kids' screen while GPS is used, and any position sent to Google is rounded (about 1 km for a start point, 10 km for nearby places).
- Settings → Data & services shows exactly what usage stats were recorded, with "Delete my usage data" and a "Report an issue" form.
- A one-time 0–10 "would you recommend AWTY?" question for grown-ups after the second trip (only with stats on, behind the maths gate).
- The privacy policy has a short summary for children, a plain serif look, and covers usage stats, issue reports and location.
- A private developer dashboard (`/dashboard.html`, needs STATS_KEY) with trips, features, mini-games, crashes and issue reports; old stats are deleted automatically every day (90 days for usage, 180 for issue reports).

**Under the hood**
- Works offline. Each release has its own offline copy, so phones pick up updates cleanly.
- The version number is shown at the bottom of Settings.
- Smoother and lighter on battery: drawing is capped at 30 frames a second, canvas sizes are remembered rather than measured every frame, and the map's fixed parts are drawn once and reused.
