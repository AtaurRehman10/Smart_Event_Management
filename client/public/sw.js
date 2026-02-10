const CACHE_NAME = 'devcon-v1';
const STATIC_ASSETS = [
     '/',
     '/index.html',
     '/manifest.json',
     '/src/main.jsx',
];

self.addEventListener('install', (event) => {
     event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
     );
});

self.addEventListener('fetch', (event) => {
     // Network first, fall back to cache for navigation (better for dynamic app)
     if (event.request.mode === 'navigate') {
          event.respondWith(
               fetch(event.request)
                    .catch(() => caches.match('/index.html'))
          );
          return;
     }

     // Stale-while-revalidate for assets
     event.respondWith(
          caches.match(event.request).then((cachedResponse) => {
               const fetchPromise = fetch(event.request).then((networkResponse) => {
                    caches.open(CACHE_NAME).then((cache) => {
                         cache.put(event.request, networkResponse.clone());
                    });
                    return networkResponse;
               });
               return cachedResponse || fetchPromise;
          })
     );
});
