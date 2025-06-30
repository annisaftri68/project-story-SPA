import './styles/main.css';
import './router';
import './register-sw.js';
import { VAPID_PUBLIC_KEY, subscribeWebPush } from './services/api.js';

// Tambahkan skip to content
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.innerText = 'Skip to Content';
document.body.prepend(skipLink);

// Fokuskan ke konten utama
const mainContent = document.querySelector('#main-content');
skipLink.addEventListener('click', function (event) {
  event.preventDefault();
  skipLink.blur();

  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView();
  }
});

// Transisi halaman
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

// Trigger awal
window.dispatchEvent(new CustomEvent('route-change'));

// Minta izin notifikasi saat aplikasi pertama kali dijalankan
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Helper function for VAPID key conversion
function urlB64ToUint8Array(base64String) {
  if (!base64String) {
    throw new Error('Base64 string is required');
  }
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  try {
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error('Failed to decode VAPID key:', error);
    throw new Error('Invalid VAPID key format');
  }
}

async function subscribeToPushNotifications(registration) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const applicationServerKey = urlB64ToUint8Array(VAPID_PUBLIC_KEY);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }
    const { endpoint, keys } = subscription.toJSON();
    console.log('Push subscription endpoint:', endpoint, keys);
    const response = await subscribeWebPush({ endpoint, keys });
    console.log('Push subscription successful:', response);
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    throw error;
  }
}

// Panggil setelah service worker ready
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.ready.then(reg => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Belum login, push notification tidak diaktifkan.');
      // Optional: tampilkan pesan ke user atau redirect ke login
      return;
    }
    console.debug('[PushDebug] Mulai proses subscribe push notification...');
    subscribeToPushNotifications(reg)
      .then(sub => {
        console.info('[PushDebug] Push notification subscription berhasil:', sub);
      })
      .catch(err => {
        console.error('[PushDebug] Push notification subscription gagal:', err);
      });
  });
}
