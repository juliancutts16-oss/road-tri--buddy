# AWTY changelog

Every release gets a number. Bump the **middle** number for new features (0.1 → 0.2), the **last** number for fixes only (0.1.0 → 0.1.1), and go to **1.0** when the app launches on the Play Store.
See `RELEASING.md` for the step-by-step.

## Unreleased
_Changes waiting for the next release go here. Deploy only when the owner says so._

## 0.3.2 (fixes)
- Free: everyone gets the red saloon and the default houses again. In 0.3.1 a slip switched this off, so a phone that had picked a different car or house in an older version kept it, with no way to change it in Free.
- Start screen: the "Start" bar now only appears once a destination is typed in (after 0.3.1 it showed straight away if you'd used a starting place before).
- Start screen: the two bars now look like Citymapper, with a bold "Start" or "End" label and a hint ("Where from?" / "Where to?") where you type.

## 0.3.1
- Welcome screen: "nothing sold" now reads "we never sell your data", so it's clear it's about data, not about selling things.
- Welcome screen: the "Help improve AWTY" text now reads properly (it showed "Data &amp; services" by mistake), and the line under the choices is clearer.
- Start screen: removed the "Use maps" and "No signal: set the time" buttons from Trip details. With no signal, the app now switches to the drive time by itself (see below).
- Destination search: fixed places showing as about 3,500 miles away. When the phone hadn't shared where it was, the distance was measured from a point in the sea off West Africa. Now no distance is shown unless the phone's position is known.
- Destination search: when "Use this phone's location" is on, searching now asks the phone where it is (the first time, Android shows its permission pop-up), so places show their real distance and nearby ones come first.
- Start screen, like Citymapper: once a destination is typed, a "Starting point" bar appears above it at the top, with the 📍 button for "start from where I am". If location is off or refused, it says "Type starting address". Pressing "Let's go!" without a starting point makes the bar shake. Saved places show underneath as quick picks. This replaces the old "From" pop-up and the "Trip details" box at the bottom (Trip details now only appears for no-signal trips).
- Trip map: a small "N" compass arrow in the top corner shows that north is up (only on real Google routes, which are drawn the right way round; no-signal and demo trips don't get one).
- No more made-up routes: if "Live routes from Google Maps" is switched off (or Google isn't answering), the app used to invent a pretend distance (18–68 miles) and show it as if it were real. Now the start screen says so (with a "Turn them on" link) and asks how long the drive is, and the car moves by the clock. Demo driving, for testing at home, still makes its pretend route.
- Settings → Music: clearer wording for the music download ("Better music (optional download)"), explaining what you get with and without it.
- Settings → Safety: removed the "End trip & go to main menu" button and its "Get unstuck" heading (the Search button already does this). The reset buttons now sit under a "Reset" heading.
- Free: the trip screen now always locks for the kids. The "Lock the trip screen for the kids" switch is gone from Settings → Safety, and the Parent PIN text explains the lock instead.
- Settings: the "Report an issue" form is no longer repeated inside Data & services. The "Report a problem" button now opens its own page with just the form.
- Settings → Screen: the three look sliders now say what they do in words (Smaller / Normal / Bigger, Very few / Fewer / All, Softer / Normal / Brighter) instead of percentages, which all read "100%" at different places on each slider. Their names are plainer too ("Size of the sun, clouds and trees", "How many clouds and trees", "Colour brightness").
- Free, Settings → Places: removed the "Demo driving" switch and the "Connected (Maps) / Offline (no signal)" choice. With no signal the trip already moves by the drive time by itself, and a saved route ("Use this route") still works with no signal. Demo driving is hidden, with no "Demo driving is on" box on the start screen either; for testing, hold the Settings button for 15 seconds to open Places with the switch showing.
- Free: removed the made-up example saved route ("Grandma's (example)", Home → Oakville, 30 miles), including from phones that already had it.
- Start screen: tapping the destination or starting point bar now shows a blue ring round it and a blue blinking cursor, so it's clear where you're typing.
- Free: removed the "Who's coming?" box from the start screen. There's no age choice any more: Free is always set for ages 4–5 (the trip screen shows the drive in cartoons).

## 0.3.0 — AWTY Free
- The test version of the app (the `test` branch on Netlify) now keeps its usage stats, issue reports and story reports separate from the live app, so trips taken while testing don't appear on the live developer dashboard. The test site's own dashboard shows only test data. The daily clean-up deletes old test data on the same schedule as live data.
- **AWTY Free.** The live app (the `main` branch) is now the free version. The full version with everything is kept on the `test` branch for future work. The extras are switched off with one setting (`EDITION='free'` in `public/index.html` and `EDITION = "free"` in `netlify/lib/common.mjs`), not deleted, so they can come back later as paid extras.
  - Free keeps: the map, miles and time left, the car on the road at the top, background music, the Stats page, Settings, the parent PIN and the kids' lock.
  - Free has no storyteller voice or phone voice, no stories, no landmarks, no games or Spot-it, no pop-ups, no number-plate lookup and no choice of car or houses (everyone gets the red saloon and the default houses). The microphone is never used. Only the music makes a sound.
  - The trip screen shows only the Map page (no Games, Story or My car pages, and no points counter).
  - Settings has four tiles: Music, Safety, Screen and Places. The Search screen's "Who's coming?" box only asks for the age group, and "Make the stories theirs" is gone.
  - The recorded music (11 tunes and 4 quiet road sounds, about 8 MB) can be downloaded on its own in Settings → Music. Until then the phone makes its own tune.
  - Stats shows trips, miles, the longest trip, time on the road and a "Miles by trip" chart. Trips now remember how long they took.
  - The arrival card shows the miles and the time the trip took, in place of points, spotting and coins.
  - The privacy choices screen is shorter (Google Maps, location and usage stats only) and is version 3, so every parent sees it once more. Earlier choices are kept.
  - The privacy policy now describes only what the Free version does. The app's store description no longer mentions games or stories.
  - On the server, the AI story, AI answer and number-plate helpers say no in the Free version, and routes no longer search Google for landmarks (one less Google charge per route).
- The trip map now shows the route the way it really looks on a map, with north at the top. Before, it was turned and stretched so it always ran straight down the screen, so Birmingham to Cornwall looked like a straight line; now you can see it head south-west down the M5 and turn west at Exeter. The finish is also kept clear of the menu bar at the bottom of the screen.
- Fewer paid Google lookups for place suggestions while typing a start or destination. Suggestions now appear once 3 letters are typed (was 2) and after a half-second pause (was a third of a second), and anything already looked up is remembered until the app is closed. Typing the same text again, or pressing Go after typing a place without picking it from the list, no longer asks Google a second time.

## 0.2.7 (fixes)
- Shorter waits between chapters with Alice. On a phone she takes longer to make her voice than to speak (even a fast computer needs about 1.2 seconds for each second of speech), so any wasted work made later chapters wait a minute or more. Her time now goes on what's read next:
  - When the children choose, the rewritten next chapter no longer jumps ahead of the chapter she's already making. It's made straight after it, and only read if it's fully ready in time. Before, it could hold up the chapter itself, and was then often thrown away.
  - Parts already told, the "just like you chose" lines for options nobody picked, and the greeting once the story has started are no longer made.
  - While the AI is writing the story, she no longer makes the built-in story it's about to replace. She starts on each AI chapter as soon as it arrives.
  - The everyday lines ("Well done!", "Can you spot these?") are made just after the opening, so they're ready for the first chapter.
- Alice's finished sentences are now saved on the phone (for 3 days), so if Android restarts the app or her mid-trip, she carries on where she was instead of starting again. They take half the memory they used to. "Remove the download" and "Reset everything" delete them too.
- With "Help improve AWTY" on, the app now records how long the story waits for Alice (starting up, the opening, a chapter or one sentence, in seconds), how fast the phone makes her voice, whether it can use several processor cores, and how long she takes to start. Never any story text or names. The developer dashboard has a new "Storyteller voice (Alice)" card showing it, so waits on real phones can be seen instead of guessed. Parents see these events in plain words under "What we collect", and the privacy policy lists them.
- Alice is no longer restarted just because the app was in the background for a while (for example while a parent checked the map). The phone slows her down there, so she now gets a fresh go when the app comes back.

## 0.2.6 (fixes)
- Demo driving is now off for new users, so a family's first real trip follows the real drive: the GPS if location is on, otherwise the clock. Before, it was on by default and the car raced along at 10 times speed. Phones that already have the app keep their current setting. Demo driving can still be switched on in Settings for testing at home.
- The story no longer plays underneath a game. Hoot already paused when a game opened, but a new chapter could still start during the game (on a test trip, a whole chapter, its "Can you spot a tractor?" and its quiz played while the child was doing Car Sums). Now:
  - A chapter that comes due during a game waits, and starts as soon as the game closes. The arrival ending waits too.
  - A game is only offered while Hoot is quiet, never in the middle of a story or a question.
  - After a game, the next one isn't offered for about 3 minutes of driving. Before, Traffic Lights popped up 7 seconds after Car Sums ended.
- With "Listen for their answers" on, the app no longer answers for the child. On a test trip it said "You found a tractor!", picked a story choice and said "I heard you have a go" when nobody had spoken: any sound at all (the car, the music, or Hoot's own voice coming back through the microphone) counted as an answer. Now:
  - Only real words count. A sound with no words is ignored, and the child can still tap, as before.
  - Words that are mostly what Hoot has just said are ignored, as that's the phone hearing itself.
  - The music and road sounds go quiet while the app is listening.
  - For a choice, the app no longer picks one at random when it can't tell which was said. It listens once more, then the buttons stay up until the timer runs out, as before.
- The trip story now lasts the whole journey. Before, a route with only one or two landmarks got just two middle chapters, so on a test trip (Bath to Bradford on Avon, 28 minutes) the story went quiet for the last 16 minutes. Now "open road" chapters fill any long gap, so there's a part at least every 7 minutes or so (every eighth of the trip on long drives), right up to arriving. That test trip now gets 4 middle chapters instead of 2.
  - The built-in story has a new "found it" moment for each plot and more open-road scenes, so the extra chapters don't repeat each other. The flying machine is now "missing some parts" rather than "three", as there can be more than three chapters.
- AI trip stories were often turned down for long sentences, so children got the built-in story instead (seen on a test trip: rejected twice, "average 31 words, one sentence has 70"). Three fixes on the server:
  - The writer is now told the exact sentence length for the age (for 6–7: about 12 words, never more than 18), and that each line is one sentence.
  - The length check now counts real sentences. Before, a line holding a few sentences (for example a bit of dialogue and who said it) was counted as one very long sentence.
  - The second try now actually happens. It was only allowed if the first try took under 6 seconds, but writing takes about 12, so it never ran. Since Netlify now allows 60 seconds, a second try (and its safety review) runs if there's time to finish by about 45 seconds. The phone waits 60.
- The opening chapter no longer waits up to 2½ minutes for Alice. When it waited behind the greeting, its sentences were put at the back of her list, so she made the rest of the story first. They now go straight after the greeting.
- While a chapter or a sentence waits for Alice, the "Getting the story ready" percentage now moves smoothly. Before, it only moved each time she finished a whole sentence (every 8–13 seconds on a test phone), or stayed at 0% for a single sentence, so it looked stuck.
- Demo trips now drive at real speed while Alice is behind (starting up, still making the story, or a chapter is waiting for her), then go back to the chosen demo speed. The demo controls show "×1 · Alice catching up" meanwhile. Before, a 10× demo trip reached the next chapter long before she'd made it, so chapters waited up to 53 seconds.

## 0.2.5 (fixes)
- My car page: the big picture of the car is drawn a little smaller, so the top of the car is no longer cut off.
- After a choice, the story no longer seems to stop:
  - Alice now says where it carries on ("We'll find out what happens next when we get to Bluebell Lake Park!"). This line is prepared ahead like the rest.
  - The Story page shows "Next part at … · 8 miles" while she's quiet. It used to just say "Hoot is reading along".
- Alice can no longer go silent for good. If the phone stops her in the middle of a line (for example while the app was in the background), the app notices after at least 30 seconds, restarts her and carries on with the same lines in the same order. Restarts are counted in the crash stats (with usage stats on), so we can see if it happens.

## 0.2.4 — a different story every trip, Alice only
- A library of 230 story ideas (`netlify/lib/ideas.mjs`), from the owner's list of 200 plus 30 new ones made for road trips and landmarks, grouped by age: 68 for ages 4–5, 72 for 6–7 and 90 for 8+.
  - Each new story usually starts from one idea for the children's age group (otherwise from the random spark mix below). The writer turns the idea into a journey, with something new happening at each place the car passes, and adds a twist and a running gag.
  - The phone remembers which ideas it has had, so a family hears every idea for their age before any comes round again.
  - Ideas that would have broken the safety rules were rewritten rather than dropped. For example, the monster under the bed is now a friendly fluffy creature who'd like a nightlight to read by. The pigeons' pretzel heist is now a birthday surprise. The prank war is a friendly contest. The scared lost dog is a puppy following its nose to a picnic. The ghost is a cheeky garden statue. The mystery snacks are gone.
  - The writer is also told to change any part of an idea that would frighten anyone or show something unsafe. Every story still goes through all the checks.
- Every trip gets a different story:
  - A story is now told once. The next trip on the same route (planned again, or from a saved place) gets a brand-new one, started early on the Search screen. Before, the route kept its story and played it again.
  - Each new AI story gets a random "spark": where it's set (24 worlds, from a singing lighthouse to a library where characters climb out of the books), the kind of hero (16, unless the children's favourite animal is the hero), the quest (15), a twist for the ending and a running joke or clue. That's tens of thousands of combinations.
  - The phone remembers the outlines of the last 5 stories, and the writer is told to make the new one completely different (hero, world, goal, problem and names). These outlines stay on the phone and only go to the writer with the next story request.
  - The writer's examples no longer push every story the same way. They used to suggest "a lost map" and a hero called "Pip".
- Better storytelling, always inside the existing safety rules (which still come first, and every part is still checked):
  - hook the children from the very first sentence
  - show, don't tell, with lively dialogue and sounds
  - the hero solves the problems with their own ideas, helped by the children's choices and spotting, never rescued by a grown-up or sudden magic
  - never preachy
  - each chapter has its own fresh challenge and ends on a gentle cliffhanger, building to a twist at the end
  - conflict stays gentle: puzzles, races against the clock and mix-ups, never danger or meanness
- The built-in story (used when the AI story isn't available) now has 4 plots instead of 1: a map blown away, a song that has lost its notes, a rainbow that has lost its colours, and a flying machine missing its parts. A plot is picked for each trip.
- With Alice as the storyteller, the phone's own voice is no longer mixed in. Before, any line Alice hadn't made ahead of time was read by the phone's voice, which was confusing.
  - Now she always reads it herself, making it next (usually a second or two). The globe only appears if that takes longer than a couple of seconds.
  - If the app has only just opened and she's still starting up, the story waits for her.
  - The phone's voice is used only if she can't make a line at all (or after 20 seconds, or a minute while starting up).
- Alice now prepares much more ahead of time, so those waits are rare:
  - each chapter's opening line ("Coming up soon, we'll pass…")
  - what's said after every choice ("Great choice! … it is!", "So, just like you chose…")
  - the everyday replies ("Well done!", "Brilliant!", "That's okay! Keep looking…")
- No more long pause between chapters after a choice. When the children choose, the next chapter is rewritten to follow their choice, and that new version was never prepared by Alice, so it waited (45 seconds or more) every time. Now she makes the rewrite straight away. If it isn't ready in time, the chapter she already prepared is read instead, starting "So, just like you chose, our hero decided to…", so it still follows the children's choice with no wait.

## 0.2.3 — story reports reviewed and rewritten, quicker start
- Trip screen: swiping round from the last page to the Map (or back) no longer gets stuck halfway between two pages. The phone's own snapping is paused for the jump, so it always lands on one page.
- Alice starts the story sooner:
  - The greeting is now made one sentence at a time, so she can start on "Hello everyone!" while she makes the rest. Before, she waited for the whole greeting.
  - The safety margin is a little smaller now that the app knows this phone's speed. In tests, the start came about 20% sooner, and she still never had to pause mid-chapter.
- The loading globe's percentage now shows how much of the opening is ready. The story starts as soon as Alice can keep ahead (often well before 20%), and the rest is made while she reads.
- Story reports now go somewhere to be reviewed. "⚑ Report a problem" (Settings → Prompts → Read the story) saves the report on our server and shows it in a new "Story reports" section of the developer dashboard. Each report has the date, which part, the reason, the age group, the reported text and the app version. Names stay as {NAMES} / {BUDDY}, and the destination is now swapped for {DEST} on the phone before sending. Reports are deleted after 180 days, like issue reports, and the privacy policy says so.
- Reporting a part now rewrites it. The built-in story covers it straight away, and the AI writes a fresh version, told what the parent didn't like ("scary", "not right for their age", and so on) and asked to make it clearly gentler and simpler. It goes through all the usual safety checks before it's used. The beginning and the end keep the same hero and story. Settings says when the new version is ready to read, or if it couldn't be written (then the built-in story is read for that part).

## 0.2.2 — quicker stories, My car page, slide to unlock
- Trip screen: Hoot's circle and the "Next stop" bubble are gone (Hoot stays on the Story page). The Map / Games / Story box is taller instead.
- New loading globe: while Alice gets the story ready, the AWTY globe appears above the box with "Getting the story ready · 40%". It starts grey and fills with colour from the bottom up. When she's ready, it bounces, shrinks away, and the box grows into its space. It only shows if there's actually a wait (never for less than about half a second), and only once at the start, not separately for the greeting and the opening.
- Stories with Alice start much sooner:
  - She no longer waits for a whole chapter to be ready. The app measures how fast this phone makes her voice and starts reading as soon as she's far enough ahead not to be caught up. If a line is ever not quite ready, she waits for it rather than switching to the phone's voice mid-chapter.
  - The route is planned on the Search screen as soon as the destination and the start are both chosen (picked from the list, saved, or typed as a full address or postcode). The story starts being written and Alice starts on the greeting while everyone gets ready, before Go is pressed. Vague names like "Tesco" still wait for Go so the right one can be picked.
- Search bar: tapping it selects what's already there, so typing replaces the old destination straight away. Opening the app again later (after more than half an hour away, e.g. the next day) starts with an empty "Search destination". Coming back within half an hour keeps it, in case the phone closed the app while a parent looked something up.
- Our trips: the "Most spotted things" list now folds away inside the green "Seen most" tile. Tap the tile (it has a little arrow) to open it full width, and tap again to close.
- Our trips: the "Score by trip" chart can no longer push the page wider than a small phone once there are 9 or more trips. It scrolls sideways inside its own box instead.
- Parent lock: the lock is now slid to the right to unlock, like a phone's "slide to unlock". The bar says "Parents only · Slide to unlock ›". Sliding all the way asks for the PIN. Letting go early springs it back, and a tap only gives a little wiggle as a hint.
- Trip screen: a new "My car" page in the swipe box (after Map, Games and Story). It shows the children's car, every car with the locked ones marked by a 🔒 and what unlocks them, a bar showing how close the next car is, and the colours (if "Car colour" is allowed for the kids). Only unlocked cars can be picked. With usage stats on, the developer dashboard counts how often a car is picked there.
- Trip screen: the swipe box goes round. Swiping on from the last page (or the › arrow there) comes back to the Map, and swiping back from the Map goes to the last page. The box fades over the jump, so it doesn't rewind through every page.
- Search screen: the "From · My location · Type address" line is centred under the search bar.
- Settings: the ▶ voice previews work more reliably.
  - They play even if the app's sound is switched off.
  - "▶ Hear Alice" says "Getting Alice ready…" while she prepares, then "Playing…". Her two preview lines are now made ahead of time with the other everyday lines.
  - "▶ Hear this voice" (Prompts) always plays the phone voice picked there, even when Alice tells the stories.
  - "▶ Preview next landmark" waits for Alice instead of mixing in the phone's voice.
- New town atmosphere: "Quiet Town Ambience" from Pixabay (freesound_community) replaces the old one, which had dogs barking that could sound scary. It's made into the same 24-second seamless loop at the same quiet level. Phones that already have the sounds download only this one file again (about 0.2 MB, not the whole 8 MB), and the old copy is removed.

## 0.2.1 (fixes)
- Spot-it ("Can you spot…") comes now and then instead of constantly: a random gap of 6–12 miles between rounds, and never while Hoot is talking, a question is up or a game is open.
- Spot-it has a **Done** button, and its timer now keeps time by the clock, so a round always ends (it could get stuck on screen before).
- The story's "Can you help spot…?" question has a **Not this time** button (Hoot says "That's okay!"), and its timer is 30 seconds instead of 45.
- The trip screen can no longer freeze if something goes wrong in one frame: the app carries on and the problem is still reported in the crash stats.
- Alice becomes the storyteller automatically as soon as she's downloaded, even if "Phone voice" was picked before. Phones that already downloaded her in 0.2.0 switch to her once. After that, a parent's own choice is kept.

## 0.2.0 — Alice and real sound

**Storyteller voice (new)**
- Hoot can now read with Alice, a natural British storyteller voice that runs on the phone itself (Kokoro). The phone's own voice is still there as an option.
- Settings → Voice → Storyteller voice: a parent downloads it once (about 116 MB, best on Wi-Fi). After that it works with no signal, stays on the phone across app updates, and can be removed again from the same card.
- First launch: after the privacy choices and parent PIN, a pop-up asks "A storytelling voice for Hoot?" with **Download now** or **Later**. It shows the download's progress, closes itself when Alice is ready, mentions it if the phone seems to be on mobile data, and is only asked once.
- Nothing is sent to the cloud, so the children's names still never leave the phone.
- The trip's story is turned into audio in the background as soon as it's ready, in the order it will be read. Each chapter waits until all its lines are ready, then is read in one go with no gaps. Only the opening usually waits (Hoot's bubble says he's getting his voice ready); later chapters are ready miles ahead. One-off lines that aren't ready yet use the phone voice so nothing waits.
- The read-along highlighter follows the storyteller voice's real timing.
- Real recorded sounds (in progress): 44 sounds chosen by the owner from Pixabay (free for use in a paid app), trimmed and tidied into `public/sounds/`. That's 29 sound effects cut to their best 0.1–4 seconds, 11 storybook music tracks made into seamless 64-second loops, and 4 background atmospheres (countryside, seaside, town, forest) as 24-second loops. Volumes are evened out, and the whole set is about 8 MB.
- The recorded sounds now play in the stories:
  - The AI places each sound straight after the word it belongs to ("Oh look, the dragon is here!" and the growl lands on "here"). It can also choose the music mood for each part.
  - With Alice, sounds land exactly on their word; with the phone voice they follow the phone's word signal (or an estimate). Mid-sentence sounds play a little softer so they sit under the voice, placed slightly left or right, with a soft room echo.
  - Real storybook music replaces the made-up tunes: the happy main theme while driving, each story's mood during its chapters, and the calm track for the ending. It dips whenever Hoot speaks. Loops blend end-to-start over 50 ms, so there's no click.
  - Music and atmosphere only ever play on the trip screen once the trip is moving. There's none on the Search screen, in Settings, while paused, or for a story read while parked. Two exceptions: the calm music under the ending when you arrive, and a parent's ▶ music preview in Settings.
  - A very quiet background atmosphere matches where the car is (countryside birdsong, the seaside, a town, a forest) and stops when the trip pauses or ends.
  - The sounds download with Alice (about 124 MB together), stay on the phone across updates and work with no signal. Without them, the app's own made-up sounds play as before.
- The site now has "cross-origin isolation" switched on, so the voice can use several of the phone's processor cores (about 1.6x faster).

## 0.1.5 (fixes)
- Search screen: once you've entered a destination, one slim line under the search bar asks "From" with two small buttons: "📍 My location" or "Type address" (which opens Trip details, ready to type). It stays clear of the mountain top and disappears once a start is chosen. Pressing Go without one gives it a little shake instead of trying a route. Not shown for no-signal trips or routes that are already planned.
- Hoot is now centred in his circle beside the "Next stop" bubble, and in the Story header, with his ears no longer cut off. His picture was being shifted up and to the left.

## 0.1.4
- Search screen: the mountain is now a full-screen splash on every phone and tablet, with just the search bar and the Go button over it. "Trip details", "Who's coming?" and "Make the stories theirs" are slim boxes underneath. Scroll down a little, or tap the round down arrow on its own at the bottom right. It only shows on the Search screen and hides once the boxes are on screen. On narrow phones the bottom bar slides a little left while the arrow is showing.
- The search bar starts empty with "Search destination", instead of the example "Grandma's House, Oakville". Phones that still had the example filled in have it cleared.
- Search bar: it now says "Search destination" in darker, easier-to-read text, sized so it fits on small phones.
- Search screen messages (like "Type where you're going first") now appear under the search bar where you can see them.
- Faster and lighter on battery (nothing looks different):
  - The journey map is only drawn while you can see it, not while the swipe box shows Games or the Story. The road picture stops drawing while it's scrolled off screen, and both stop while a mini-game is open.
  - While the trip is paused, the pictures are drawn 15 times a second instead of 30.
  - The app opens faster on weak signal. If the internet doesn't answer within 3 seconds, the saved copy opens straight away, and the new download finishes in the background for next time. Before, it could sit waiting.
  - The first screen no longer waits for Google Fonts, and a font the app never used (Nunito) is no longer requested.
- Trip screen: the road picture is always the straight road from home to the destination. The winding road, its "Road style" choice in Settings and the kids' road button are gone.

## 0.1.3 (fixes)
- "Use my current location" (📍 in the search bar) now shows its message right under the search bar, says which town you're near (e.g. "near Oxford"), and turns blue while it's in use. If location is switched off, the message has a "Turn it on" button. Only a position rounded to about 1 km is sent to find the town.
- "Make the stories theirs" is now a fold-away box like "Trip details" and "Who's coming?", with a one-line summary.
- Settings: no more long list under the tiles. Each coloured tile opens its own page that grows out of the tile, with a Back button. "Report a problem" jumps straight to the right page.
- Story read-along: instead of a whole yellow block, a highlighter sweeps through each word as Hoot says it, then the line fades back.
- Trip screen: the winding road is now one smooth road with a dashed centre line. It used to be covered in dark rings, with big dark circles at each end.
- Trip screen: Hoot now sits level with the middle of the "Next stop" bubble, and the bubble has a little tail pointing at him.

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
