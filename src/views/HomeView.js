import { askNotificationPermission } from '../utils/notification.js';

export default class HomeView {
  constructor(container) {
    this.container = container;
    this.container.innerHTML = `
      <h2>Galeri Cerita</h2>
      <div id="loading-container"></div>
      <div id="stories-container" class="story-list"></div>
      <div id="product-map"></div>
    `;

    // Tombol aktivasi notifikasi
    document.getElementById('subscribeNotifBtn')?.addEventListener('click', () => {
      askNotificationPermission();
    });
  }

  showLoading() {
    const loadingEl = this.container.querySelector('#loading-container');
    if (loadingEl) {
      loadingEl.innerHTML = `<p>Memuat cerita...</p>`;
    }
  }

  showStories(stories) {
    const list = this.container.querySelector('#stories-container');
    list.innerHTML = '';

    stories.forEach(story => {
      const item = document.createElement('div');
      item.className = 'story-item';
      item.innerHTML = `
        <img src="${story.photoUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${story.description}" />
        <h3>${story.name || 'Pengguna'}</h3>
        <p>${story.description}</p>
        <button class="save-btn">Simpan</button>
      `;

      // Event Simpan ke IndexedDB
      item.querySelector('.save-btn').addEventListener('click', () => {
        import('../utils/idb.js').then(({ idbPut }) => {
          idbPut(story);
          alert('Cerita disimpan ke Saved Stories!');
        });
      });

      list.appendChild(item);
    });

    // Map rendering jika ada koordinat
    const mapEl = this.container.querySelector('#product-map');
    if (mapEl && stories.length > 0) {
      import('../utils/map.js').then(({ default: createMapWithMarkers }) => {
        createMapWithMarkers(mapEl, stories);
      });
    }
  }

  showError(message) {
    const list = this.container.querySelector('#stories-container');
    list.innerHTML = `<p style="color:red;">${message}</p>`;
  }
}
