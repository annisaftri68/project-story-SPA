if ('serviceWorker' in navigator && 'Notification' in window) {
  window.addEventListener('load', async () => {
    const reg = await navigator.serviceWorker.register('/sw.js');

    // Minta izin notifikasi
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      reg.showNotification('Notifikasi Aktif 🎉', {
        body: 'Notifikasi akan muncul dari Service Worker',
        icon: '/icons/icon-192.png', // pastikan kamu punya ikon ini
      });
    }
  });
}
