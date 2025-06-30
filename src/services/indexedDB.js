import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const STORE_NAME = 'savedStories';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveStory(story) {
  const db = await getDB();
  await db.put(STORE_NAME, story);
}

export async function getAllSavedStories() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function deleteSavedStory(id) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
