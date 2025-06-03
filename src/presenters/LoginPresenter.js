import { login } from '../services/api.js';
import LoginForm from '../views/LoginForm.js';

export default function LoginPresenter(container) {
  const view = new LoginForm();

  view.render(container, async ({ email, password }) => {
    try {
      const res = await login({ email, password });

      //Tangani kemungkinan "res.error === false", tapi token tidak valid
      const token = res?.loginResult?.token;

      if (!token) {
        return alert('Login gagal: ' + (res.message || 'Token tidak valid'));
      }

      localStorage.setItem('token', token);
      alert('Login berhasil!');
      window.location.hash = '#/';
    } catch (err) {
      alert('Terjadi kesalahan saat login: ' + err.message);
    }
  });
}
