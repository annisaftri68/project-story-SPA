const BASE_URL = 'https://story-api.dicoding.dev/v1';

export async function fetchStories() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/stories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal memuat data');
  }

  return await res.json(); // akan berisi { listStory: [...] }
}

export async function addStory({ description, lat, lng, imageBlob }) {
  const token = localStorage.getItem('token');

  const formData = new FormData();
  formData.append('description', description);
  formData.append('lat', lat);
  formData.append('lon', lng);
  formData.append('photo', imageBlob);

  const res = await fetch(`${BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Gagal menambahkan cerita');
  return result;
}
