importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const assetsToCache = [
    { url: '/index.html', revision: '1' },
    { url: '/layout/nav.html', revision: '1' },
    { url: '/pages/favorite-team.html', revision: '1' },
    { url: '/pages/list-team.html', revision: '1' },
    { url: '/pages/news.html', revision: '1' },
    { url: '/pages/top-team.html', revision: '1' },
    { url: '/pages/error/404.html', revision: '1' },
    { url: '/pages/error/error.html', revision: '1' },
    { url: '/assets/css/icons.css', revision: '1' },
    { url: '/assets/css/materialize.min.css', revision: '1' },
    { url: '/assets/css/styles.css', revision: '1' },
    { url: '/assets/js/app.js', revision: '1' },
    { url: '/assets/js/idb.js', revision: '1' },
    { url: '/assets/js/database.js', revision: '1' },
    { url: '/assets/js/materialize.min.js', revision: '1' },
    { url: '/assets/js/pwa.js', revision: '1' },
    { url: '/assets/js/router.js', revision: '1' },
    { url: '/assets/js/utils.js', revision: '1' },
    { url: '/assets/img/icons/Ball-36x36.webp', revision: '1' },
    { url: '/assets/img/icons/Ball-48x48.webp', revision: '1' },
    { url: '/assets/img/icons/Ball-72x72.webp', revision: '1' },
    { url: '/assets/img/icons/Ball-96x96.webp', revision: '1' },
    { url: '/assets/img/icons/Ball-144x144.webp', revision: '1' },
    { url: '/assets/img/icons/Ball-192x192.webp', revision: '1' },
    { url: '/assets/img/icons/Ball-512x512.webp', revision: '1' },
    { url: '/assets/img/icons/Ball-Maskable.webp', revision: '1' },
    { url: '/assets/img/error-404.svg', revision: '1' },
    { url: '/assets/img/error.svg', revision: '1' },
    { url: '/manifest.json', revision: '1' },
];

workbox.precaching.precacheAndRoute(assetsToCache);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheFirst: "icons-image",
        plugins: [
            new workbox.expiration.Plugin({
              maxAgeSeconds: 30 * 24 * 60 * 60
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
      cacheName: "font-icons",
    })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  })
);  

workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2"),
    workbox.strategies.networkFirst({
      cacheName: "football-data",
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 7 * 24 * 60 * 60
        }),
      ],
    }),
);

workbox.routing.registerRoute(
  new RegExp("https://newsapi.org/v2"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "news-football",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60
      }),
    ],
  }),
);

self.addEventListener('push', event => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Hai ini adalah notifikasi PWA';
  }
  const options = {
    body: body,
    icon: "./assets/img/icons/Ball-48x48.webp",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});