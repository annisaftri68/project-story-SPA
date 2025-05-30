export default class HomeView {
  constructor(container) {
    this.container = container;
    this.container.innerHTML = `
      <h2>Galeri Cerita</h2>
      <div id="loading-container"></div>
      <div id="stories-container" class="story-list"></div>
      <div id="product-map"></div>
    `;
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
        <img src="${story.photoUrl}" alt="${story.description}" />
        <h3>${story.name || 'Pengguna'}</h3>
        <p>${story.description}</p>
      `;
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
