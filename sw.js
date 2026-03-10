/* ============================================================
   sw.js — Service Worker SMARTBOT
   Cache-first para assets estáticos, PWA instalable
   ============================================================ */

const CACHE_NAME = 'smartbot-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/variables.css',
  './css/base.css',
  './css/components.css',
  './css/sections.css',
  './css/responsive.css',
  './js/main.js',
  './js/chat-demo.js',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

/* ── Instalación: pre-cachear assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-cacheando assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* ── Activación: limpiar caches viejos ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Eliminando cache viejo:', name);
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch: Cache First, luego red ── */
self.addEventListener('fetch', event => {
  // Solo cachear peticiones GET
  if (event.request.method !== 'GET') return;

  // No interceptar peticiones a Google Fonts (externas)
  if (event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; // Servir desde cache
      }

      // No está en cache → buscar en red y guardar
      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Sin red y sin cache → página offline básica
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
