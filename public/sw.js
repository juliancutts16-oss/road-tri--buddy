// Offline support: keeps the app itself (and its fonts) on the phone so it opens with no signal.
// Server calls under /api always go to the network.
// The app registers this file as "sw.js?v=<version>", so each release gets its own cache and old ones are cleared.
// The storyteller voice (if a parent downloaded it) lives in its own caches, which are kept across releases so it
// never has to be downloaded again: "awty-voice" (the voice program and speech engine), "kokoro-voices" (the three
// voices) and "transformers-cache" (the voice model itself); the last two are saved there by the voice program.
const CACHE = "awty-" + (new URL(location.href).searchParams.get("v") || "dev");
// "awty-sounds" holds the recorded sound pack (public/sounds/), also kept across releases; a new pack gets a new ?v=.
const VOICE = "awty-voice", SOUNDS = "awty-sounds", KEEP = [CACHE, VOICE, SOUNDS, "kokoro-voices", "transformers-cache"];
const SHELL = ["./", "index.html", "manifest.webmanifest", "privacy.html", "voice-worker.js", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const save = (req, res, name = CACHE) => {
  if (res && (res.ok || res.type === "opaque")) {
    const copy = res.clone();
    caches.open(name).then((c) => c.put(req, copy));
  }
  return res;
};
// Saved copy first, else download and keep it (for files whose address never changes once published).
const keep = (e, name) => e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => save(e.request, res, name))));

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/")) return;

  if (url.origin === location.origin && url.pathname.startsWith("/sounds/")) {
    keep(e, SOUNDS); // recorded sounds: the saved copy first (each pack version has its own ?v=)
  } else if (url.origin === location.origin) {
    // App files: try the network first so updates arrive. On weak signal (no answer within 3 seconds) or offline,
    // open the saved copy straight away; a slow download still finishes and updates the saved copy for next time.
    const net = fetch(req).then((res) => save(req, res));
    const slow = new Promise((resolve) => setTimeout(resolve, 3000));
    const saved = () => caches.match(req).then((hit) => hit || caches.match("index.html"));
    e.respondWith(
      Promise.race([net.catch(() => null), slow.then(() => null)]).then((res) =>
        res || saved().then((hit) => hit || net)
      )
    );
    e.waitUntil(net.catch(() => {}));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    keep(e, CACHE);
  } else if (url.hostname === "cdn.jsdelivr.net" && /^\/npm\/(kokoro-js|@huggingface\/transformers)@\d/.test(url.pathname)) {
    keep(e, VOICE); // the storyteller voice program and speech engine (fixed versions, so they never change)
  }
});
