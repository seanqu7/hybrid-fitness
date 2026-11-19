const CACHE_NAME = 'hybrid-fitness-v1';
const ASSETS = [
  '/', '/index.html', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png',
  '/icons/apple-touch-icon.png', '/icons/favicon-64.png'
];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => {
    if (r && r.status === 200 && e.request.url.startsWith(self.location.origin)) {
      const cl = r.clone(); caches.open(CACHE_NAME).then(ca => ca.put(e.request, cl));
    }
    return r;
  }).catch(() => caches.match('/index.html'))));
});
