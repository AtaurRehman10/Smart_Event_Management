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
     // Skip non-http requests (e.g., chrome-extension://, about:blank, etc.)
     if (!event.request.url.startsWith('http')) {
          return;
     }

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
               const fetchPromise = fetch(event.request)
                    .then((networkResponse) => {
                         // Check if we received a valid response
                         if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                              return networkResponse;
                         }

                         const responseToCache = networkResponse.clone();
                         caches.open(CACHE_NAME).then((cache) => {
                              cache.put(event.request, responseToCache);
                         });
                         return networkResponse;
                    })
                    .catch(() => {
                         // Return cached response if network fails, or nothing if not in cache
                         return cachedResponse;
                    });
               return cachedResponse || fetchPromise;
          })
     );
});
