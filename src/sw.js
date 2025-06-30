import { precacheAndRoute } from 'workbox-precaching';

// Ini penting: workbox akan mengisi array __WB_MANIFEST otomatis saat build
precacheAndRoute(self.__WB_MANIFEST);

// Event listener untuk push notification (aman untuk payload JSON maupun string)
self.addEventListener('push', event => {
  console.debug('[SW][PushDebug] Push event diterima:', event);
  let title = 'Notifikasi Baru';
  let body = 'Ada cerita baru di Galeri Cerita!';
  if (event.data) {
    try {
      const data = event.data.json();
      console.debug('[SW][PushDebug] Payload JSON:', data);
      title = data.title || title;
      body = data.body || body;
    } catch (e) {
      body = event.data.text();
      console.debug('[SW][PushDebug] Payload text:', body);
    }
  }
  const options = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
  console.info('[SW][PushDebug] showNotification dipanggil:', title, options);
});
