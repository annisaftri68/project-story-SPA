import AddStoryForm from '../views/AddStoryForm.js';
import { addStory } from '../services/api.js';
import { saveStory } from '../models/idb.js';

export default function AddStoryPresenter(container) {
  const view = new AddStoryForm();
  view.render(container, async (data) => {
    try {
      // Validasi imageBlob dari AddStoryForm
      if (!data.imageBlob) {
        throw new Error('Foto tidak ditemukan atau tidak valid');
      }

      // Kirim ke API
      await addStory({
        description: data.description,
        lat: data.lat,
        lng: data.lng,
        imageBlob: data.imageBlob, // gunakan dari form
      });

      // Simpan ke IndexedDB (opsional)
      await saveStory({
        id: Date.now(),
        description: data.description,
        lat: data.lat,
        lng: data.lng,
        createdAt: new Date().toISOString(),
      });

      alert('Cerita berhasil ditambahkan!');
      window.location.hash = '#/';
    } catch (err) {
      alert('Gagal menambahkan cerita: ' + err.message);
    }
  });
}
