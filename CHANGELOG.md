# AWTY server changelog

Every server release gets a number. Bump the **middle** number for new features (0.1 → 0.2), the **last** number for fixes only (0.1.0 → 0.1.1), and go to **1.0** when the app launches on the Play Store.
See `RELEASING.md` for the step-by-step.

## Unreleased
_Changes waiting for the next release go here. Deploy only when the owner says so._
- Server: the live developer dashboard now has the "AI safety checks" card too (fun facts from the library, passed first time, passed on the second ask, failed twice, and the latest rejections). It stays empty on the live site until AI fun facts reach families, and says so. The storyteller voice card now says Emma, not Alice.
- The website now only serves the AWTY app: a simple home page ("coming soon to Android", with a link to the privacy policy), the privacy policy, the dashboard, the sounds the app downloads and the safety rulebook. Files the app doesn't use are removed, and `sw.js` clears an older saved copy of the site from phones that still have one. The server helpers are unchanged.
- Safety rulebook, step 1: the child-safety word lists, AI rules and reading limits are written down in one master file (`netlify/lib/safety-rules.json`), with example sentences to test them (`safety-tests.json`). A copy is published at `/safety-rules.json` so the app can fetch updates later. Nothing uses it yet, so the server behaves exactly as before; a checking tool on this PC proves the rulebook blocks and allows exactly the same sentences as the server and the app do today.
- README and release checklist rewritten for the server on its own.

## 0.3.2 and earlier
Kept in the owner's private records.
