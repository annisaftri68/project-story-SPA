export default class NotFoundView {
  render(container) {
    container.innerHTML = `
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p>Halaman yang kamu cari tidak tersedia.</p>
      <a href="#/">Kembali ke Beranda</a>
    `;
  }
}
