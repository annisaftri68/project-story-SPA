import { precacheAndRoute } from 'workbox-precaching';

// Ini penting: workbox akan mengisi array __WB_MANIFEST otomatis saat build
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notifikasi Baru';
  const options = {
    body: data.body || 'Ada cerita baru di Galeri Cerita!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
