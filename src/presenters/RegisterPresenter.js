import { register } from '../services/api.js';
import RegisterForm from '../views/RegisterForm.js';

export default function RegisterPresenter(container) {
  const view = new RegisterForm();
  view.render(container, async ({ name, email, password }) => {
    try {
      const res = await register({ name, email, password });
      if (res.error) return alert(res.message);
      alert('Registrasi berhasil! Silakan login.');
      window.location.hash = '#/login';
    } catch {
      alert('Gagal registrasi');
    }
  });
}
