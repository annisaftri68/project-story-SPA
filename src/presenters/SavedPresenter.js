import SavedView from '../views/SavedView.js';
import { getAllStories, deleteStory } from '../models/idb.js';

export default async function SavedPresenter(container) {
  const view = new SavedView(container);

  view.render();

  try {
    const stories = await getAllStories(); // ✅ Gantilah idbGetAll
    view.showStories(stories);
  } catch (err) {
    console.error('Gagal memuat data tersimpan:', err);
    view.showError('Gagal memuat data tersimpan.');
  }

  // Tangani klik tombol hapus jika ada
  container.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-story')) {
      const id = e.target.dataset.id;
      await deleteStory(id);
      const updated = await getAllStories();
      view.showStories(updated);
    }
  });
}
