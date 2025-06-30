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
        <input type="file" id="imageFile" accept="image/*" style="display:none;" />
        <button type="button" id="customFileBtn" class="custom-file-btn">Pilih Gambar</button>
        <span id="fileName" style="margin-left:0.5rem;font-size:0.95em;color:#555;"></span>
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
    const customFileBtn = form.querySelector('#customFileBtn');
    const fileNameSpan = form.querySelector('#fileName');
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
      if (!video.videoWidth || !video.videoHeight) {
        alert('Kamera belum siap. Silakan tunggu sebentar.');
        return;
      }
      canvas.classList.remove('hidden');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (!blob) {
          alert('Gagal mengambil gambar dari kamera.');
          return;
        }
        imageBlob = blob;
        previewImg.src = canvas.toDataURL('image/jpeg');
        previewImg.classList.remove('hidden');
        fileNameSpan.textContent = '';
        console.log('Ambil Foto: imageBlob', imageBlob);
      }, 'image/jpeg');
    });

    // Custom tombol pilih file
    customFileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.click();
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
        fileNameSpan.textContent = file.name;
        console.log('File Input: imageBlob', imageBlob);
      } else {
        fileNameSpan.textContent = '';
      }
    });

    // Map picker
    import('../utils/mapPicker').then(({ default: pickCoordinates }) => {
      pickCoordinates(form.querySelector('#mapPicker'), (lat, lng) => {
        form.querySelector('#lat').value = lat;
        form.querySelector('#lng').value = lng;
      });
    });

    // Fungsi bantu untuk matikan kamera
    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        video.srcObject = null;
        stream = null;
      }
      // Sembunyikan video element agar tidak tampil setelah kamera dimatikan
      video.style.display = 'none';
    }

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
      console.log('Submit: imageBlob', imageBlob);
      const description = form.querySelector('#description').value;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
      try {
        await onSubmit({
          description,
          lat: form.querySelector('#lat').value,
          lng: form.querySelector('#lng').value,
          imageBlob,
        });
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Cerita';
        stopCamera(); // Pastikan kamera selalu dimatikan setelah submit
      }
    });

    // Matikan kamera juga saat user navigasi/keluar dari halaman tambah cerita
    window.addEventListener('hashchange', stopCamera);

    wrapper.appendChild(form);
    container.appendChild(wrapper);
  }
}