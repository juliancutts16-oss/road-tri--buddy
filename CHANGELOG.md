# AWTY server changelog (test server)

This is the `test` branch: the test server used by the full test version of the app (`test--roadtripbuddy.netlify.app`). Its `EDITION` is `"full"`, so stories, answers and the number plate lookup are switched on. See `RELEASING.md` for how releases work.

## Unreleased
_Changes waiting for the next release go here. Deploy only when the owner says so._
- The test site now only serves the AWTY app: a simple home page, the privacy policy, the dashboard and the sounds the app downloads. Files the app doesn't use are removed, and `sw.js` clears an older saved copy of the site from phones that still have one. The server helpers are unchanged.
- README and release checklist are now the same as the live server's.

## 0.3.2 and earlier
Kept in the owner's private records.
