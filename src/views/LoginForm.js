export default class LoginForm {
  render(container) {
    const form = document.createElement('form');
    form.innerHTML = `
      <h2>Login</h2>
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label for="password">Password</label>
      <input id="password" name="password" type="password" required />

      <button type="submit">Login</button>
    `;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;

      try {
        const res = await fetch('https://story-api.dicoding.dev/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const result = await res.json();

        if (result?.loginResult?.token) {
          localStorage.setItem('token', result.loginResult.token);
          alert('Login berhasil!');
          window.location.hash = '#/';
        } else {
          alert('Login gagal: ' + (result.message || 'Email/password salah'));
        }
      } catch (error) {
        alert('Terjadi kesalahan saat login: ' + error.message);
      }
    });

    container.appendChild(form);
  }
}
