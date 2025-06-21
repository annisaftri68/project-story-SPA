import { saveStory, getAllStories, deleteStory } from '../models/idb.js';
import SavedView from '../views/SavedView.js';

export default async function SavedPresenter(container) {
  const view = new SavedView(container);
  const savedStories = await idbGetAll();
  view.showStories(savedStories);
}
