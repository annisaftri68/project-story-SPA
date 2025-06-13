const BASE_URL = 'https://story-api.dicoding.dev/v1';

// Login
export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
}

// Register
export async function register({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  return await res.json();
}

// Ambil daftar story (produk)
export async function fetchStories() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

  const res = await fetch(`${BASE_URL}/stories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.message?.toLowerCase().includes('token')) {
      localStorage.removeItem('token');
      window.location.hash = '#/login';
    }
    throw new Error(data.message || 'Gagal memuat data');
  }

  return data;
}

// Tambah cerita
export async function addStory(data) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

  const formData = new FormData();
  formData.append('description', data.description);
  formData.append('lat', data.lat);
  formData.append('lon', data.lng);
  formData.append('photo', data.imageBlob);

  const res = await fetch(`${BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || 'Gagal menambahkan cerita');
  }

  return result;
}
