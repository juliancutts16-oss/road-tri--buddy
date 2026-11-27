# AWTY ("Are We There Yet?")

AWTY is a road-trip app for children that I am designing and building myself, using AI coding tools (Claude), without a software development background. It is in development: version 0.4, being prepared for a Google Play launch. It has not been released and has no users yet.

The app tells children stories and fun facts about the landmarks they pass on a journey, alongside a live route and an "are we there yet?" countdown.

## About this repository

This repository is the **server** behind AWTY. The **Android app** itself is built in Flutter and kept in a separate, private repository while it is in development. I am happy to show the app working, or to walk through how it is built, on request.

The server sits between the app and the paid services it uses, so that the secret API keys never sit on the phone, and so that every AI-written story is checked before a child sees it.

## Where to look

| What | Where |
|---|---|
| The child-safety checks every AI story and fact goes through | `netlify/lib/safety.mjs` |
| The written safety rulebook and its test sentences | `netlify/lib/safety-rules.json`, `netlify/lib/safety-tests.json` |
| The server helpers the app calls (route, places, stories, vehicle lookup, usage stats) | `netlify/functions/` |
| Release history | `CHANGELOG.md` |
| The release checklist | `RELEASING.md` |

## What the app does

- **Android app** built in Flutter (private repository).
- **Google Maps Routes and Places APIs** for the route, landmarks along the way and destination suggestions.
- **DVLA vehicle lookup**, so the app can show the family's car by its number plate.
- **Claude** writes the stories and fun facts about each landmark.

## Child safety

- Every AI-written story and fact passes server-side safety checks against a written safety rulebook, which has its own set of test sentences.
- Children's names are never sent to the AI.
- Grown-up settings sit behind a parent PIN.
- Usage stats are opt-in only, and are deleted after 90 days.
- The server only answers the app: every request needs a passcode.

## How I run it

- A three-tier plan: Free, plus £2.99 and £5.99 monthly subscriptions.
- A feature roadmap, numbered releases with a changelog, and a release checklist.
- A separate test server, so testing never touches the live service.
- A developer dashboard that tracks usage and the results of the AI safety checks.
- A website with a privacy policy.

## How it is built

I design the app and build it with AI coding tools, using Claude to write the code.

© 2026 Julian Cutts. All rights reserved. This code is shared to show my work and may not be reused.

---

*The setup guide for running the server on Netlify follows below.*

# Server setup guide

The server for **AWTY**, a road-trip app for children. The app itself is a Flutter app (Android first) in its own private repository, `awty-flutter`. This repository holds the small server it talks to, hosted on Netlify, which keeps the secret keys off the phone.

## What's in this folder

| Path | What it is |
|---|---|
| `netlify/functions/` | The server helpers the app calls under `/api/…`: `route` (Google Maps route, scenery and landmarks), `places` (destination suggestions), `story` and `answer` (AI stories, fun facts and replies, full version only), `vehicle` (DVLA number plate lookup, full version only), `telemetry` (usage stats and issue reports), `report` (story reports), `stats` (developer dashboard data), `cleanup` (daily tidy-up of old stats) and `health` (tells the app which services are switched on). |
| `netlify/lib/` | Shared code: `common.mjs` (helpers and the `EDITION` switch), `safety.mjs` (the child-safety checks every AI story and fact goes through), `ideas.mjs` (story ideas) and the safety rulebook (`safety-rules.json`, `safety-tests.json`). |
| `public/` | The website: a simple home page, the privacy policy, the developer dashboard (`dashboard.html`), the recorded sounds the app downloads (`sounds/`) and a copy of the safety rulebook the app can fetch. |
| `netlify.toml`, `package.json` | Settings Netlify reads when it builds the site. |
| `.env.example` | The names of the secret keys to add on Netlify. Don't put real keys in this file. |

The `main` branch is the live server (`roadtripbuddy.netlify.app`, used by AWTY Free). The `test` branch is the test server (`test--roadtripbuddy.netlify.app`, used by the full test version of the app), so testing never touches the live dashboard.

## Setting it up on Netlify

1. In Netlify: **Add new site → Import an existing project → GitHub** → pick this repository → **Deploy**. The build settings come from `netlify.toml`, so leave them as they are.
2. Add your keys under **Site configuration → Environment variables** (mark each one **secret**), then **Deploys → Trigger deploy → Deploy site** so they take effect.
3. Open `https://<your-site>/api/health` to check which services are switched on.

From then on, Netlify rebuilds automatically whenever this repository is pushed.

### The keys

| Variable | What it switches on | How to get it |
|---|---|---|
| `GOOGLE_MAPS_API_KEY` | Real routes, destination suggestions, landmarks along the way, scenery that matches the road | [Google Cloud Console](https://console.cloud.google.com/): create a project, add a billing account, then under **APIs & Services → Library** enable **Routes API** and **Places API (New)**. Create a key under **Credentials**, then **restrict** it to just those two APIs. |
| `DVLA_API_KEY` *(optional, full version)* | Number plate lookup (make, colour and year) | Register for the **Vehicle Enquiry Service API** on the [DVLA developer portal](https://developer-portal.driver-vehicle-licensing.api.gov.uk/). It's free. |
| `ANTHROPIC_API_KEY` *(full version)* | AI-written stories and fun facts for each landmark | [console.anthropic.com](https://console.anthropic.com/) → **API keys**. Set a monthly **spend limit** under Billing. Stories use the `claude-opus-5-5` model at low effort. Set `CLAUDE_MODEL` for a different model. |
| `APP_PASSCODE` *(recommended)* | Stops strangers who find the address from using your keys | Make up any passcode, then type it into the app under **Settings → Data & services → Server passcode**. |
| `STATS_KEY` | Opens the developer dashboard at `/dashboard.html` | Make up a long random password and mark it **secret**. Open `https://<your-site>/dashboard.html` and type it in; the page remembers it on that browser only. Never link the dashboard from the app. |

### Usage stats and the dashboard
Usage stats are only sent if a parent switches on **Help improve AWTY** in the privacy choices (off by default). They go to `/api/telemetry` and are stored in **Netlify Blobs** (store `awty-stats`, or `awty-stats-test` on the test branch; no setup needed). Usage events are deleted after 90 days and issue reports after 180 days; `netlify/functions/cleanup.mjs` does this every day, and the dashboard also tidies up when it loads.

## Free and Full

The `EDITION` setting in `netlify/lib/common.mjs` matches the app: on `"free"` the story, answer and vehicle helpers are switched off. The live server is Free; the test server is Full.

## Versions

`CHANGELOG.md` lists what's in each server release, and `RELEASING.md` is the checklist for making the next one.
