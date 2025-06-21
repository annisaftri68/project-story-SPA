self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activated');
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notifikasi Baru!';
  const options = {
    body: data.body || 'Anda punya pesan baru.',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-192x192.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
