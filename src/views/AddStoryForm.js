import pickCoordinates from '../utils/mapPicker';

export default class AddProductForm {
  render(container, onSubmit) {
    const wrapper = document.createElement('div');
    wrapper.className = 'add-story-form';

    const form = document.createElement('form');
    form.innerHTML = `
      <h2>Tambah Cerita</h2>

      <label for="description">Deskripsi:</label>
      <textarea id="description" name="description" required></textarea>

      <label>Gambar Cerita (kamera atau pilih file):</label>
      <div style="margin-bottom:1rem;">
        <video id="camera" autoplay playsinline style="max-width:100%; display:none;"></video>
        <button type="button" id="capture">Ambil Foto</button>
        <input type="file" id="imageFile" accept="image/*" style="margin-top:0.5rem;" />
        <canvas id="snapshot" class="hidden" style="margin-top:0.5rem;"></canvas>
        <img id="previewImage" class="hidden" alt="Preview Gambar" style="max-width:100%; margin-top:1rem; border-radius:8px;" />
      </div>

      <label>Lokasi Cerita (klik di peta):</label>
      <div id="mapPicker" style="height:200px;"></div>
      <input type="hidden" id="lat" name="lat" />
      <input type="hidden" id="lng" name="lng" />

      <button type="submit" id="submitBtn">Kirim Cerita</button>
    `;

    const video = form.querySelector('#camera');
    const canvas = form.querySelector('#snapshot');
    const fileInput = form.querySelector('#imageFile');
    const previewImg = form.querySelector('#previewImage');
    const submitBtn = form.querySelector('#submitBtn');

    let stream = null;
    let imageBlob = null;

    // Aktifkan kamera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        stream = s;
        video.srcObject = stream;
        video.style.display = 'block';
      })
      .catch(() => {
        console.warn('Kamera tidak tersedia atau ditolak.');
      });

    // Ambil foto dari kamera
    form.querySelector('#capture').addEventListener('click', () => {
      canvas.classList.remove('hidden');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);

      canvas.toBlob(blob => {
        imageBlob = blob;

        // Tampilkan preview dari canvas
        previewImg.src = canvas.toDataURL('image/jpeg');
        previewImg.classList.remove('hidden');
      }, 'image/jpeg');
    });

    // Ambil gambar dari file
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        imageBlob = file;
        canvas.classList.add('hidden');

        const reader = new FileReader();
        reader.onload = () => {
          previewImg.src = reader.result;
          previewImg.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    // Map picker
    import('../utils/mapPicker').then(({ default: pickCoordinates }) => {
      pickCoordinates(form.querySelector('#mapPicker'), (lat, lng) => {
        form.querySelector('#lat').value = lat;
        form.querySelector('#lng').value = lng;
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.querySelector('#lat').value || !form.querySelector('#lng').value) {
        alert('Pilih lokasi di peta.');
        return;
      }

      if (!imageBlob) {
        alert('Ambil foto atau pilih gambar terlebih dahulu.');
        return;
      }

      const description = form.querySelector('#description').value;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';

      await onSubmit({
        description,
        lat: form.querySelector('#lat').value,
        lng: form.querySelector('#lng').value,
        imageBlob,
      });

      submitBtn.disabled = false;
      submitBtn.textContent = 'Kirim Cerita';

      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    });

    wrapper.appendChild(form);
    container.appendChild(wrapper);
  }
}
