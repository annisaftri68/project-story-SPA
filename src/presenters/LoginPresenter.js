import { login } from '../services/api.js';
import LoginForm from '../views/LoginForm.js';

export default function LoginPresenter(container) {
  const view = new LoginForm();

  view.render(container, async ({ email, password }) => {
    if (!email || !password) {
      alert('Email dan password tidak boleh kosong.');
      return;
    }

    try {
      const res = await login({ email, password });
      console.log('DEBUG LOGIN:', res);

      if (res?.error === false && res?.loginResult?.token) {
        localStorage.setItem('token', res.loginResult.token);
        alert('Login berhasil!');
        window.location.hash = '#/';
      } else {
        alert('Login gagal: ' + (res.message || 'Email/password salah'));
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Terjadi kesalahan saat login: ' + err.message);
    }
  });
}
