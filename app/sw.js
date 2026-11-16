// Mode hors ligne : toutes les fiches sont disponibles sans connexion.
const CACHE = 'aegis-v12';
const FICHIERS = ['./', 'index.html', 'style.css', 'app.js', 'fiches.js', 'oreille.js', 'voix.js', 'situations.js', 'jeune.js', 'dessins.js', 'icon-180.png', 'icon-512.png', 'questions.js', 'formation.js', 'parcours.js', 'pas.js', 'manifest.webmanifest', 'icon.svg'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || (u.origin !== location.origin && !u.host.includes('unpkg.com'))) return;
  e.respondWith(fetch(e.request).then((r) => { const copie = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copie)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
