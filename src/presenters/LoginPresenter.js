import { login } from '../services/api.js';
import LoginForm from '../views/LoginForm.js';

export default function LoginPresenter(container) {
  const view = new LoginForm();

  view.render(container, async ({ email, password }) => {
    try {
      const res = await login({ email, password });

      console.log('DEBUG LOGIN RESPONSE:', res); // Debug respons

      // ✅ Validasi respons
      if (res.error || !res.loginResult?.token) {
        alert('Login gagal: ' + (res.message || 'Email atau password salah'));
        return;
      }

      // ✅ Simpan token
      localStorage.setItem('token', res.loginResult.token);

      alert('Login berhasil!');
      window.location.hash = '#/';
    } catch (err) {
      alert('Terjadi kesalahan saat login: ' + err.message);
    }
  });
}
