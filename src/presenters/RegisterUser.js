export async function register({ name, email, password }) {
  const res = await fetch('https://story-api.dicoding.dev/v1/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}
