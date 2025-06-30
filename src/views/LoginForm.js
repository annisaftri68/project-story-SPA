export default class LoginForm {
  render(container, onSubmit) {
    const form = document.createElement('form');
    form.className = 'login-form';
    form.innerHTML = `
      <h2>Login Akun</h2>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required />

      <label for="password">Password</label>
      <input type="password" id="password" name="password" required />

      <button type="submit">Login</button>
    `;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value.trim();
      onSubmit({ email, password });
    });

    container.innerHTML = '';
    container.appendChild(form);
  }
}
