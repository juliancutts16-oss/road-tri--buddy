# How to make a release

## Version numbers
| Change | Example |
|---|---|
| New features | 0.1.0 → **0.2.0** |
| Fixes only | 0.1.0 → **0.1.1** |
| Play Store launch | → **1.0.0** |

## Checklist
1. **Set the number in two places**
   - `public/index.html`: search for `APP_VERSION='` and change it.
   - `package.json`: change `"version"`.
   - The offline copy (`sw.js`) follows automatically. Don't edit it.
2. **Update `CHANGELOG.md`**: rename "Unreleased" to the new number and start a fresh, empty "Unreleased" section above it.
3. **Keep a copy on your computer**: copy `public`, `netlify`, `netlify.toml`, `package.json`, `CHANGELOG.md` into `releases/<number>/` (e.g. `releases/0.2.0/`). Or run:
   ```
   powershell -ExecutionPolicy Bypass -File tools\snapshot-release.ps1
   ```
4. **One big upload to GitHub**: drag the `public` and `netlify` folders (plus `package.json` and `CHANGELOG.md` if they changed) into the repository in a **single commit**, so Netlify only builds once. Use a commit message like `Release 0.2.0`.
5. **Check it's live**: open the site, go to Settings, and check the bottom says the new version.
6. *(Optional)* On GitHub: **Releases → Draft a new release**, with tag `v0.2.0` and the changelog section pasted in.
7. **APK (only when you rebuild it in PWABuilder)**:
   - Set **Version name** to the same number (0.2.0).
   - Raise **Version code** by 1 each time (1, 2, 3…).
   - Always sign with the **same keystore** from the `google play` folder.

## Never upload to GitHub
`keys.txt`, `google play`, `.claude`, `planning`, `backups`, `releases`, `tools`, `todo`.
