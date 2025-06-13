
import L from 'leaflet';

export default function pickCoordinates(el, callback) {
  const map = L.map(el).setView([-6.2, 106.8], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  let marker;

  map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);
    callback(lat, lng);
  });
}
