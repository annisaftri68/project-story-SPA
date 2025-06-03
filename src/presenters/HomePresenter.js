import StoryListView from '../views/StoryListView.js';
import { fetchStories } from '../models/StoryModel.js';
import { idbPut, idbGetAll, idbDelete } from '../models/idb.js';
import sleep from '../utils/sleep.js';

export default async function HomePresenter(container) {
  // 🔒 Cek token sebelum render
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Silakan login terlebih dahulu.');
    window.location.hash = '#/login';
    return;
  }

  const view = new StoryListView(container);
  view.showLoading();
  await sleep(); // Simulasi delay

  try {
    const result = await fetchStories();
    const stories = result.listStory;

    // Simpan ke IndexedDB
    for (const story of stories) {
      await idbPut(story);
    }

    // Tampilkan dari cache (IndexedDB)
    const cached = await idbGetAll();
    view.showStories(cached, handleDelete);
  } catch (err) {
    // Jika fetch gagal, tampilkan dari IndexedDB
    const cached = await idbGetAll();
    if (cached.length > 0) {
      view.showStories(cached, handleDelete);
    } else {
      view.showError('Gagal memuat data: ' + err.message);
    }
  }

  async function handleDelete(id) {
    await idbDelete(id);
    const updated = await idbGetAll();
    view.showStories(updated, handleDelete);
  }
}
