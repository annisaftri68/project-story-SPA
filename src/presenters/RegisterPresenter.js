import { register } from '../services/api.js';
import RegisterForm from '../views/RegisterForm.js';

export default function RegisterPresenter(container) {
  const view = new RegisterForm();

  view.render(container, async ({ name, email, password }) => {
    try {
      // DEBUG: tampilkan data dikirim & respon
      console.log('Data dikirim:', { name, email, password });

      const res = await register({ name, email, password });
      console.log('Respon dari API:', res);

      // Validasi hasil dari API
      if (res.error === true) {
        return alert('Gagal daftar: ' + (res.message || 'Cek kembali input'));
      }

      // Jika berhasil
      alert('Registrasi berhasil! Silakan login.');
      window.location.hash = '#/login';

    } catch (err) {
      alert('Terjadi kesalahan saat registrasi: ' + err.message);
    }
  });
}
