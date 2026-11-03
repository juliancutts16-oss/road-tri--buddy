// Clean-up only: some phones still have an older offline copy of this site saved, with its own offline helper.
// Browsers check this file for updates, so this version replaces that helper: it deletes everything it saved,
// switches itself off and reloads any open page, which then shows the current home page.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((pages) => Promise.all(pages.map((p) => p.navigate(p.url))))
  );
});
