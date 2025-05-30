import L from 'leaflet';

export default function createMapWithMarkers(container, products) {
  const map = L.map(container).setView([0, 0], 2);

  // --- TILE LAYERS ---
  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  });

  const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB Dark Matter',
  });

  const satellite = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenTopoMap contributors',
  });

  street.addTo(map); // default

  const baseMaps = {
    'Jalan (OSM)': street,
    'Gelap (Dark)': dark,
    'Topografi (Satelit)': satellite,
  };

  L.control.layers(baseMaps).addTo(map);

  // --- MARKERS ---
  products.forEach(product => {
    if (product.lat && product.lon) {
      const marker = L.marker([product.lat, product.lon]).addTo(map);
      marker.bindPopup(`<strong>${product.user?.name || 'Tanpa Nama'}</strong><br/>${product.description}`);
    }
  });

  // Center to markers
  const validMarkers = products.filter(p => p.lat && p.lon);
  if (validMarkers.length > 0) {
    const group = new L.featureGroup(
      validMarkers.map(p => L.marker([p.lat, p.lon]))
    );
    map.fitBounds(group.getBounds(), { padding: [50, 50] });
  }
}
