import StoryListView from '../views/StoryListView.js';
import { fetchStories } from '../models/StoryModel.js';
import { saveStoryToDB, getAllStoriesFromDB, deleteStoryFromDB } from '../models/idb.js';
import sleep from '../utils/sleep.js';

export default async function HomePresenter(container) {
  const view = new StoryListView(container);

  view.showLoading();
  await sleep(); // Simulasi delay

  try {
    const result = await fetchStories();
    const stories = result.listStory;

    // Simpan ke IndexedDB untuk mode offline
    stories.forEach(story => saveStoryToDB(story));

    // Tampilkan dari cache (IndexedDB)
    const cached = await getAllStoriesFromDB();
    view.showStories(cached, handleDelete);
  } catch (err) {
    // Jika fetch gagal, tampilkan dari IndexedDB
    const cached = await getAllStoriesFromDB();
    if (cached.length > 0) {
      view.showStories(cached, handleDelete);
    } else {
      view.showError('Gagal memuat data: ' + err.message);
    }
  }

  async function handleDelete(id) {
    await deleteStoryFromDB(id);
    const updated = await getAllStoriesFromDB();
    view.showStories(updated, handleDelete);
  }
}
