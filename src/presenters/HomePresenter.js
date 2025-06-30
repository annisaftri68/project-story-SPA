import StoryListView from '../views/StoryListView.js';
import { fetchStories } from '../models/StoryModel.js';
import { getAllSavedStories, deleteSavedStory } from '../services/indexedDB.js';
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

    // Tidak lagi menyimpan otomatis ke IndexedDB di sini

    // Tampilkan data dari API
    view.showStories(stories, handleDelete);
  } catch (err) {
    // Jika fetch gagal, tampilkan dari IndexedDB
    const cached = await getAllSavedStories();
    if (cached.length > 0) {
      view.showStories(cached, handleDelete);
    } else {
      view.showError('Gagal memuat data: ' + err.message);
    }
  }

  async function handleDelete(id) {
    await deleteSavedStory(id);
    const updated = await getAllSavedStories();
    view.showStories(updated, handleDelete);
  }
}
