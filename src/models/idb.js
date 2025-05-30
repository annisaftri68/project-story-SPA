import { openDB } from 'idb';

const dbPromise = openDB('galeri-cerita-db', 1, {
  upgrade(db) {
    db.createObjectStore('stories', { keyPath: 'id' });
  },
});

export const idbPut = async (story) => {
  const db = await dbPromise;
  return db.put('stories', story);
};

export const idbGetAll = async () => {
  const db = await dbPromise;
  return db.getAll('stories');
};

export const idbDelete = async (id) => {
  const db = await dbPromise;
  return db.delete('stories', id);
};
