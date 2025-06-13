import AddStoryForm from '../views/AddStoryForm.js';
import { addStory } from '../services/api.js';

export default function AddStoryPresenter(container) {
  const view = new AddStoryForm();
  view.render(container, async (data) => {
    try {
      const imageBlob = await fetch(data.image).then((res) => res.blob());
      await addStory({ ...data, imageBlob });
      alert('Cerita berhasil ditambahkan!');
      window.location.hash = '#/';
    } catch (err) {
      alert('Gagal menambahkan cerita: ' + err.message);
    }
  });
}
