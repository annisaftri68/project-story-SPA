import './styles/main.css';
import './router';
import './register-sw.js';
import { askNotificationPermission } from './utils/notification.js';

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

// Trigger awal route
window.dispatchEvent(new CustomEvent('route-change'));

// ✅ Aktifkan push notification otomatis (simulasi, tanpa backend)
if ('Notification' in window && navigator.serviceWorker) {
  window.addEventListener('load', async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();
        if (!subscription) {
          await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              'BO2sxG0ve5rolN-RlnFRMe1wV-DzBfQQyFyDbrdHyWFOBrrTK_otP8_yC2aB6NCd5r4l-0-TsUFfsHYJV3TuIZ8'
            ),
          });
        }
      }
    } catch (err) {
      console.error('Gagal mengaktifkan push notification:', err);
    }
  });
}

// Helper konversi VAPID Key
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
