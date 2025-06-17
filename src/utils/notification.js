export async function requestPermission() {
  if (!('Notification' in window)) {
    alert('Browser tidak mendukung notifikasi.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Izin notifikasi ditolak.');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // ganti dengan VAPID key dari Firebase/Web Push
  });

  console.log('Subscribed to Push:', JSON.stringify(subscription));
}
