import {getRestaurantData} from '../filters/filters.js';
import {fetchMenuToday} from '../restaurants/details.js';

let map;
let markers = [];

// initialize the map
export async function initMapView() {
  if (!map) {
    map = L.map('map').setView([60.1699, 24.9384], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
  }

  const restaurants = getRestaurantData();
  if (!restaurants || !restaurants.length) return;

  markers.forEach((m) => map.removeLayer(m));
  markers = [];

  restaurants.forEach((r) => {
    if (!r.location) return;

    const [lon, lat] = r.location.coordinates;

    const marker = L.marker([lat, lon]).addTo(map);

    marker.on('click', () => {
      openRestaurantPopup(r, marker);
    });

    markers.push(marker);
  });

  highlightClosest(restaurants);
}

// open the pop up for the clicked restaurant to show information
async function openRestaurantPopup(restaurant, marker) {
  const todayMenu = await fetchMenuToday(restaurant._id);

  const menuHtml = todayMenu.length
    ? todayMenu.map((item) => `<li>${item.name}</li>`).join('')
    : '<li>No menu available today</li>';

  const popupHtml = `
  <div class="popup-content">
    <strong>${restaurant.name}</strong><br>
    ${restaurant.address}<br></br>
    <strong>Today's Menu:</strong>
    <ul>${menuHtml}</ul>
  </div>`;

  marker.bindPopup(popupHtml).openPopup();
}

// adds the users location to the map as a blue dot
function addUserLocationMarker(lat, lon) {
  const userMarker = L.circleMarker([lat, lon], {
    radius: 8,
    color: '#007bff',
    fillColor: '#007bff',
    fillOpacity: 0.9,
    weight: 2,
  });

  userMarker.addTo(map).bindPopup('You are here');
}

// calculates the distance from the users location to the closest restaurant
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = (x) => (x * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// highlights the closest restaurant with a different marker
function highlightClosest(restaurants) {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition((pos) => {
    const userLat = pos.coords.latitude;
    const userLon = pos.coords.longitude;

    addUserLocationMarker(userLat, userLon);

    let closest = null;
    let minDist = Infinity;

    restaurants.forEach((r) => {
      if (!r.location) return;

      const [lon, lat] = r.location.coordinates;
      const dist = getDistance(userLat, userLon, lat, lon);

      if (dist < minDist) {
        minDist = dist;
        closest = r;
      }
    });

    if (closest) {
      highlightMarker(closest);
    }
  });
}

// defines the marker for highlighted restaurant and gives it the same on click function as the rest
function highlightMarker(restaurant) {
  const [lon, lat] = restaurant.location.coordinates;

  const highlightIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const marker = L.marker([lat, lon], {icon: highlightIcon}).addTo(map);

  marker.on('click', () => {
    openRestaurantPopup(restaurant, marker);
  });

  openRestaurantPopup(restaurant, marker);
}
