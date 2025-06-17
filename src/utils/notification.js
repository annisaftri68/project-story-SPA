export async function askNotificationPermission() {
  if (!('Notification' in window)) {
    alert('Browser tidak mendukung notifikasi.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Izin notifikasi tidak diberikan.');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  registration.showNotification('Notifikasi diaktifkan!', {
    body: 'Terima kasih telah mengaktifkan notifikasi.',
    icon: './icons/icon-192x192.png',
  });
}
