import { login } from '../services/api.js';
import LoginForm from '../views/LoginForm.js';

export default function LoginPresenter(container) {
  const view = new LoginForm();

  view.render(container, async ({ email, password }) => {
    try {
      const res = await login({ email, password });
      console.log('DEBUG LOGIN:', res); // Tambahkan log ini saat testing

      if (res?.error === false && res?.loginResult?.token) {
        localStorage.setItem('token', res.loginResult.token);
        alert('Login berhasil!');
        window.location.hash = '#/';
      } else {
        alert('Login gagal: ' + (res.message || 'Email/password salah'));
      }
    } catch (err) {
      alert('Terjadi kesalahan saat login: ' + err.message);
    }
  });
}
