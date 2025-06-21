import './styles/main.css';
import './router';
import './register-sw.js';
import { askNotificationPermission } from './utils/notification.js';

// ✅ Import presenter halaman Saved
import SavedPresenter from './presenters/SavedPresenter.js';

// Notifikasi sambutan jika sudah diizinkan sebelumnya
document.addEventListener('DOMContentLoaded', () => {
  if (Notification.permission === 'default') {
    // Biarkan user klik manual (tombol di HTML)
  } else if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Selamat datang kembali!');
    });
  }
});

// Skip to content
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.innerText = 'Skip to Content';
document.body.prepend(skipLink);

const mainContent = document.querySelector('#main-content');
skipLink.addEventListener('click', function (event) {
  event.preventDefault();
  skipLink.blur();

  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView();
  }
});

// View Transition untuk hash routing
if ('startViewTransition' in document) {
  window.addEventListener('hashchange', () => {
    document.startViewTransition(() => {
      window.dispatchEvent(new CustomEvent('route-change'));
    });
  });
} else {
  window.addEventListener('hashchange', () => {
    window.dispatchEvent(new CustomEvent('route-change'));
  });
}

// ✅ Tangani route #/saved
window.addEventListener('route-change', () => {
  const app = document.getElementById('app');
  const hash = window.location.hash;

  if (hash === '#/saved') {
    app.innerHTML = '';
    SavedPresenter(app); // Tampilkan halaman saved
  }
});

// Trigger awal route
window.dispatchEvent(new CustomEvent('route-change'));

// ✅ Aktifkan push notification otomatis (simulasi, tanpa backend)
window.addEventListener('load', async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notification tidak didukung browser ini.');
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Izin notifikasi ditolak.');
      return;
    }

    const reg = await navigator.serviceWorker.ready;
    let subscription = await reg.pushManager.getSubscription();

    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'
        ),
      });
    }

    // ✅ Kirim subscription ke endpoint Story API
    const token = localStorage.getItem('token');
    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    console.log('Push subscription berhasil dan terkirim ke server');
  } catch (err) {
    console.error('Gagal mengaktifkan push notification:', err);
  }
});

// Helper untuk konversi VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
