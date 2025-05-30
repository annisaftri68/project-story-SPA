export default function captureCamera(videoElement, snapshotCanvas) {
  if (!videoElement || !snapshotCanvas) {
    console.error('Elemen video atau canvas tidak ditemukan.');
    alert('Gagal memuat kamera: elemen video/canvas tidak ada.');
    return;
  }

  // Matikan stream sebelumnya jika ada
  if (videoElement._streamRef) {
    videoElement._streamRef.getTracks().forEach(track => track.stop());
  }

  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.play();

      // Simpan stream untuk referensi penghentian nanti
      videoElement._streamRef = stream;

      const captureBtn = document.querySelector('#capture');
      if (captureBtn) {
        captureBtn.addEventListener('click', () => {
          const ctx = snapshotCanvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
          snapshotCanvas.style.display = 'block';
          videoElement.style.display = 'none';
        });
      } else {
        console.warn('Tombol #capture tidak ditemukan di DOM.');
      }
    })
    .catch((err) => {
      console.error('Gagal mengakses kamera:', err.name, err.message);
      alert(`Gagal mengakses kamera: ${err.name}\n${err.message}`);
    });
}
