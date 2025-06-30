export default class SavedStoryView {
  async render(container) {
    container.innerHTML = '<h2>Daftar Cerita Tersimpan</h2><div id="saved-list">Memuat...</div>';
    const { getAllSavedStories, deleteSavedStory } = await import('../services/indexedDB.js');
    const stories = await getAllSavedStories();
    const list = document.createElement('div');
    list.className = 'story-list';
    if (stories.length === 0) {
      list.innerHTML = '<p>Tidak ada cerita yang disimpan.</p>';
    } else {
      stories.forEach(story => {
        const item = document.createElement('div');
        item.className = 'story-item';
        item.innerHTML = `
          <img src="${story.photoUrl}" alt="${story.name}" />
          <h3>${story.name}</h3>
          <p>${story.description}</p>
        `;
        // Tombol hapus dari saved
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Hapus dari Saved';
        deleteBtn.className = 'delete-button';
        deleteBtn.onclick = async () => {
          await deleteSavedStory(story.id);
          item.remove();
        };
        item.appendChild(deleteBtn);
        list.appendChild(item);
      });
    }
    const savedList = container.querySelector('#saved-list');
    savedList.innerHTML = '';
    savedList.appendChild(list);
  }
}
