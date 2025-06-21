if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', {
        scope: './',
      });

      console.log('Service Worker registered:', registration);

      // Opsional: Cek update Service Worker
      if (registration.waiting) {
        console.log('Ada versi baru service worker yang menunggu untuk diaktifkan.');
      }

      // Listening update
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('Konten baru tersedia. Silakan refresh halaman.');
              } else {
                console.log('Konten tersedia untuk digunakan offline.');
              }
            }
          };
        }
      };
    } catch (err) {
      console.error('Gagal mendaftarkan Service Worker:', err);
    }
  });
}