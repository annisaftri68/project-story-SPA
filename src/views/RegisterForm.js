export default class RegisterForm {
  render(container, onSubmit) {
    const form = document.createElement('form');
    form.innerHTML = `
      <h2>Daftar Akun Baru</h2>

      <label for="name">Nama Lengkap</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label for="password">Password</label>
      <input id="password" name="password" type="password" required />

      <button type="submit">Daftar</button>
    `;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      onSubmit({ name, email, password });
    });

    container.appendChild(form);
  }
}