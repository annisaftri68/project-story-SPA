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
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
      `;

      // Tombol Simpan
      const saveBtn = document.createElement('button');
      saveBtn.innerText = 'Simpan';
      saveBtn.className = 'save-button';
      saveBtn.setAttribute('aria-label', `Simpan cerita dari ${story.name}`);
      saveBtn.addEventListener('click', async () => {
        const { saveStory } = await import('../services/indexedDB.js');
        await saveStory(story);
        alert('Cerita disimpan ke database lokal!');
      });
      item.appendChild(saveBtn);

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
      item.appendChild(deleteBtn);

      list.appendChild(item);
    });

    this.container.innerHTML = '';
    this.container.appendChild(list);
  }

  showError(message) {
    this.container.innerHTML = `<p class="error">${message}</p>`;
  }
}