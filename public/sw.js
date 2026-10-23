// Offline support: keeps the app itself (and its fonts) on the phone so it opens with no signal.
// Server calls under /api always go to the network.
// The app registers this file as "sw.js?v=<version>", so each release gets its own cache and old ones are cleared.
const CACHE = "awty-" + (new URL(location.href).searchParams.get("v") || "dev");
const SHELL = ["./", "index.html", "manifest.webmanifest", "privacy.html", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const save = (req, res) => {
  if (res && (res.ok || res.type === "opaque")) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
};

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/")) return;

  if (url.origin === location.origin) {
    // App files: try the network first so updates arrive, fall back to the saved copy offline.
    e.respondWith(
      fetch(req)
        .then((res) => save(req, res))
        .catch(() => caches.match(req).then((hit) => hit || caches.match("index.html")))
    );
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => save(req, res))));
  }
});
