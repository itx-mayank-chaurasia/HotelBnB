// Initialize map
const map = L.map('map').setView([28.6139, 77.2090], 10); // Delhi

// Tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
let marker;

// 🧭 Forward Geocoding: Address → Coordinates
async function gecodefunc() {
  if (marker) map.removeLayer(marker);
  marker = L.marker([geoData.lat, geoData.lon]).addTo(map)
    .bindPopup(`<b>${geoData.display_name}</b><br>📍 (${geoData.lat}, ${geoData.lon})`)
    .openPopup();

  map.setView([geoData.lat, geoData.lon], 13);
}
// else {
//   alert("Location not found!");
// }
// }
gecodefunc();