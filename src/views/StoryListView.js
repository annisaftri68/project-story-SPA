import { saveStory } from '../models/idb.js';
import noImage from '../assets/no-image.png';

export default class StoryListView {
  constructor(container) {
    this.container = container;
  }

  showLoading() {
    this.container.innerHTML = '<p>Memuat cerita...</p>';
  }

  showStories(stories, onDelete) {
    const list = document.createElement('div');
    list.className = 'story-list';

    stories.forEach((story) => {
      const item = document.createElement('div');
      item.className = 'story-item';

      const imageUrl = story.photoUrl || noImage;

      item.innerHTML = `
        <img src="${imageUrl}" alt="${story.name || 'Cerita'}" />
        <h3>${story.name || 'Pengguna'}</h3>
        <p>${story.description}</p>
      `;

      // Tombol Hapus
      const deleteBtn = document.createElement('button');
      deleteBtn.innerText = 'Hapus';
      deleteBtn.className = 'delete-button';
      deleteBtn.setAttribute('aria-label', `Hapus cerita dari ${story.name}`);
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Yakin ingin menghapus cerita dari ${story.name}?`)) {
          onDelete(story.id);
        }
      });

      // Tombol Simpan
      const saveBtn = document.createElement('button');
      saveBtn.innerText = 'Simpan';
      saveBtn.className = 'save-button';
      saveBtn.setAttribute('aria-label', `Simpan cerita dari ${story.name}`);
      saveBtn.addEventListener('click', () => {
        saveStory(story);
        alert(`Cerita dari ${story.name} disimpan ke perangkat!`);
      });

      item.appendChild(deleteBtn);
      item.appendChild(saveBtn);
      list.appendChild(item);
    });

    this.container.innerHTML = '';
    this.container.appendChild(list);
  }

  showError(message) {
    this.container.innerHTML = `<p class="error">${message}</p>`;
  }
}
