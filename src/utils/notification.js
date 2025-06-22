const BASE_URL = 'https://story-api.dicoding.dev/v1';

export async function askNotificationPermission() {
  if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('Browser tidak mendukung notifikasi.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Izin notifikasi tidak diberikan.');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('<YOUR_VAPID_PUBLIC_KEY>'),
  });

  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('Token tidak ditemukan. Tidak mengirim subscription ke server.');
    return;
  }

  const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    console.error('Gagal subscribe ke server:', await response.text());
    return;
  }

  registration.showNotification('Notifikasi aktif!', {
    body: 'Terima kasih telah mengaktifkan notifikasi.',
    icon: './icons/icon-192x192.png',
  });

  console.log('Push subscription berhasil dan terkirim ke server');
}

// Helper untuk konversi VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
