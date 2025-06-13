import { login } from '../services/api.js';
import LoginForm from '../views/LoginForm.js';

export default function LoginPresenter(container) {
  const view = new LoginForm();

  view.render(container, async ({ email, password }) => {
    try {
      const res = await login({ email, password });
      console.log('DEBUG LOGIN RESPONSE:', res); // 🔍 tampilkan hasil ke console

      if (res.error === true) {
        alert('Login gagal: ' + (res.message || 'Email/password salah'));
        return;
      }

      const token = res?.loginResult?.token;
      if (!token) {
        alert('Login gagal: token tidak ditemukan');
        return;
      }

      localStorage.setItem('token', token);
      alert('Login berhasil!');
      window.location.hash = '#/';
    } catch (err) {
      alert('Terjadi kesalahan saat login: ' + err.message);
    }
  });
}