import AddStoryForm from '../views/AddStoryForm.js';
import { addStory } from '../services/api.js';
import { saveStory } from '../models/idb.js';

export default function AddStoryPresenter(container) {
  const view = new AddStoryForm();
  view.render(container, async (data) => {
    try {
      let imageBlob = null;

      if (data.image) {
        const res = await fetch(data.image);
        if (!res.ok) throw new Error('Gagal mengunduh gambar');
        imageBlob = await res.blob();
      }

      // Kirim ke API
      await addStory({ ...data, imageBlob });

      // Simpan ke IndexedDB (gunakan timestamp sebagai id unik)
      await saveStory({
        id: Date.now(), // ID unik, bisa diganti dengan ID dari API jika ada
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
