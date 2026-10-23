# AWTY – Are We There Yet?

A road-trip app for children. The car on screen drives from home to the destination as the real journey goes on, with Spot-it rounds, landmark stories read aloud, a bonus driving game, unlockable cars and trip stats.

It is a **web app you install on an Android phone** (a "progressive web app"). Once installed it has its own icon, opens full screen like any other app, works without signal, uses the phone's GPS and keeps the screen awake during a trip.

## What's in this folder

| Path | What it is |
|---|---|
| `public/` | The app itself: `index.html`, the app icon, `manifest.webmanifest` (makes it installable) and `sw.js` (lets it work offline). |
| `netlify/functions/` | Small server helpers that hold your secret keys: `route` (Google Maps route + landmarks), `places` (destination suggestions), `vehicle` (DVLA number plate lookup), `story` (AI stories and fun facts), `health` (tells the app which of these are switched on). |
| `netlify.toml`, `package.json` | Settings Netlify reads when it puts the app online. |
| `.env.example` | The names of the secret keys you'll add on Netlify. Don't put real keys in this file. |

The app runs without any keys. Anything not set up falls back to the built-in demo (pretend routes, pre-written stories) or, for the number plate lookup, is hidden.  **Settings → Data & services** shows what is connected.

---

## Step 1: Try it on your phone today (no keys, about 5 minutes)

1. Go to **https://app.netlify.com/drop** and sign up for a free account.
2. Drag the **`public`** folder onto the page. Netlify gives you a web address like `https://something-random.netlify.app`.
3. On your Android phone, open that address in **Chrome**.
4. Tap the **⋮** menu → **Install app** (or **Add to Home screen**). AWTY now has its own icon.

What works at this stage: everything in demo mode, the offline timer trip (Settings → Trip & route → Offline → set the journey time, turn **Demo driving** off, press ▶ as you set off), read-aloud, sounds, the bonus game, stats and backups.

> Netlify Drop only hosts the app files, not the server helpers. For real Google Maps, DVLA and AI stories, do Step 2.

## Step 2: The full version with Google Maps, DVLA and AI stories

You'll need free accounts on **GitHub** and **Netlify**. You don't need to install anything on your computer.

1. **Put the project on GitHub.** Sign in at github.com → **New repository** → name it `road-trip-buddy` → **Create**. On the empty repository page, click **uploading an existing file** and drag in *everything inside this folder*: `public`, `netlify`, `netlify.toml`, `package.json`, `README.md` and `.env.example`. Leave out `.claude`, `planning`, `backups`, `releases`, `tools`, `todo`, `keys.txt` and the `google play` folder. Then press **Commit changes**.
2. **Connect it to Netlify.** In Netlify: **Add new site → Import an existing project → GitHub** → pick `road-trip-buddy` → **Deploy**. The build settings come from `netlify.toml`, so leave them as they are.
3. **Add your keys.** In Netlify: **Site configuration → Environment variables → Add a variable**. Add each key from the list below, then go to **Deploys → Trigger deploy → Deploy site** so the new keys take effect.
4. Open the new address on your phone and install it as in Step 1. **Settings → Data & services** should now say *Connected* for each key you added.

From then on, whenever you change a file on GitHub, Netlify updates the app automatically.

### The keys

| Variable | What it switches on | How to get it |
|---|---|---|
| `GOOGLE_MAPS_API_KEY` | Real routes, destination suggestions, landmarks along the way, scenery that matches the road | [Google Cloud Console](https://console.cloud.google.com/): create a project, add a billing account, then under **APIs & Services → Library** enable **Routes API** and **Places API (New)**. Create a key under **Credentials**, then **restrict** it to just those two APIs. Google includes a monthly free allowance, and one route costs a few pence at most. |
| `DVLA_API_KEY` *(optional)* | Number plate lookup (gives make, colour and year). Without it, the plate box is hidden and you pick the car shape and colour yourself. | Register for the **Vehicle Enquiry Service API** on the [DVLA developer portal](https://developer-portal.driver-vehicle-licensing.api.gov.uk/). It's free. The key is emailed to you and approval can take a few days. |
| `ANTHROPIC_API_KEY` | AI-written stories and fun facts for each landmark, shaped by your age, length, voice-style and vocabulary settings | [console.anthropic.com](https://console.anthropic.com/) → **API keys**. Set a monthly **spend limit** under Billing. Stories use the `claude-opus-5-5` model at low effort (to keep it quick and cheap). Set `CLAUDE_MODEL` if you want a different model. |
| `APP_PASSCODE` *(recommended)* | Stops strangers who find your web address from using your keys | Make up any passcode. Then type it into the app under **Settings → Data & services → Server passcode**. |
| `STATS_KEY` | Opens the developer dashboard at `/dashboard.html` (trips, features, mini-games, crashes, issue reports and the 5 key numbers) | Make up a long random password and mark it **secret**. Open `https://<your-site>/dashboard.html` and type it in; the page remembers it on that browser only. Never link the dashboard from the app. |

### Usage stats and the dashboard
Usage stats are only sent if a parent switches on **Help improve AWTY** in the privacy choices (off by default). They go to `/api/telemetry` and are stored in **Netlify Blobs** (store `awty-stats`, no setup needed; the `@netlify/blobs` package is in `package.json`). Usage events are deleted after 90 days and issue reports after 180 days; a scheduled function (`netlify/functions/cleanup.mjs`) does this every day, and the dashboard also tidies up when it loads. Trips in demo mode are counted too; the dashboard's "Trip modes" panel shows how many.

## Using it in the car

1. **Settings → Trip & route**: turn **Demo driving** off.
2. Leave **From** blank (it uses where you are now), type the destination and press **Get route from Google Maps**. Landmarks appear, and if AI stories are on, the app writes them straight away. Do this before you lose signal.
3. Tap **Open in Google Maps** to start the same trip in Maps for the driver.
4. Press **Save & start trip**. Allow location when the phone asks. The car now follows the GPS, and the screen stays on.
5. Going somewhere with patchy signal? Press **Save offline** while you still have signal. The route, its scenery, landmarks and stories are kept on the phone.

## Good to know (honest limits)

- **Google Maps doesn't let other apps read its navigation.** That's why you set the destination in AWTY, and one tap opens the same route in Maps.
- **Android Auto (the car's own screen) only allows navigation, music and messaging apps**, not children's games. AWTY runs on the phone or tablet in the back. The device needs GPS: many Wi-Fi-only tablets don't have it, so use a phone, or the offline timer.
- **Keep the app open on screen during the drive.** A web app stops getting GPS updates when it's in the background. The screen is kept awake for you.
- **Saved data lives on the phone.** Use **Settings → Data & services → Save backup file** to keep it safe or move it to another phone (**Restore from backup**).
- **Scenery is estimated** from each road's speed and name (motorway, town, city, countryside), plus forests and coast near matching landmarks.

## Versions

The app is released in numbered versions, starting at **0.1.0**. The number shows at the bottom of Settings. `CHANGELOG.md` lists what's in each one, and `RELEASING.md` is the checklist for making the next one.

## Want a "real" app file (APK / Play Store) later?

Once Step 2 is online, go to **https://www.pwabuilder.com**, enter your Netlify address and choose **Android**. It packages the same app into an installable Android file (and a Play Store bundle), with no coding needed.
