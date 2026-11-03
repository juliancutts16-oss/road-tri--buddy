# How to make a server release

## Version numbers
| Change | Example |
|---|---|
| New features | 0.1.0 → **0.2.0** |
| Fixes only | 0.1.0 → **0.1.1** |
| Play Store launch | → **1.0.0** |

## Checklist
1. **Set the number**: `package.json`, change `"version"`.
2. **Update `CHANGELOG.md`**: rename "Unreleased" to the new number and start a fresh, empty "Unreleased" section above it.
3. **Safety rulebook**: if `netlify/lib/safety-rules.json` changed, run `tools\sync-safety.ps1` on this computer and check it says "All OK".
4. **Upload**: say "deploy" in the Release hub session. It shows you what's changing and, once you say yes, pushes it as one commit, and Netlify then builds automatically. Use a commit message like `Release 0.4.0`.
5. **Check it's live**: open the site's `/api/health` address and check the server answers, then try a trip in the app.
6. *(Optional)* On GitHub: **Releases → Draft a new release**, with tag `v0.4.0` and the changelog section pasted in.

The app itself is released separately: see `RELEASING.md` in the `awty-flutter` repository.

## Never upload to GitHub
`keys.txt`, `google play`, `.claude`, `planning`, `tools`, `mascots`, `sounds-inbox`.
