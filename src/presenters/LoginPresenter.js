import { login } from '../services/api.js';
import LoginForm from '../views/LoginForm.js';

export default function LoginPresenter(container) {
  const view = new LoginForm();

  view.render(container, async ({ email, password }) => {
    try {
      const res = await login({ email, password });

      // ✅ Cek kalau error = true ATAU token tidak ada
      if (res.error || !res.loginResult?.token) {
        return alert('Login gagal: ' + (res.message || 'Email/password salah'));
      }

      const token = res.loginResult.token;
      localStorage.setItem('token', token);

      alert('Login berhasil!');
      window.location.hash = '#/';
    } catch (err) {
      alert('Terjadi kesalahan saat login: ' + err.message);
    }
  });
}
