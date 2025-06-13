import { login } from '../services/api.js';
import LoginForm from '../views/LoginForm.js';

export default function LoginPresenter(container) {
  const view = new LoginForm();

  view.render(container, async ({ email, password }) => {
    try {
      const res = await login({ email, password });
      console.log('DEBUG LOGIN:', res); // bantu debug

      // Validasi error benar
      if (res.error === true) {
        return alert('Login gagal: ' + (res.message || 'Email/password salah'));
      }

      // Validasi token benar-benar ada
      const token = res?.loginResult?.token;
      if (!token) {
        return alert('Login gagal: token tidak ditemukan');
      }

      localStorage.setItem('token', token);
      alert('Login berhasil!');
      window.location.hash = '#/';
    } catch (err) {
      alert('Terjadi kesalahan saat login: ' + err.message);
    }
  });
}
