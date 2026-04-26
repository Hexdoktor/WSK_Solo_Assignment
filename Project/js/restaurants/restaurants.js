import {
  fetchRestaurantById,
  fetchMenuToday,
  fetchMenuWeek,
  renderRestaurantDetail,
  setupMenuTabs,
} from './details.js';
import {showView} from '../core/main.js';

const API_BASE = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

// Fetch all restaurants
export async function fetchRestaurants() {
  try {
    const res = await fetch(`${API_BASE}/restaurants`);
    if (!res.ok) throw new Error('Failed to fetch restaurants');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Render restaurant cards
export function renderRestaurants(restaurants) {
  const list = document.getElementById('restaurantList');
  list.innerHTML = '';

  restaurants.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = r._id;

    card.innerHTML = `
        <span class="badge">${r.company}</span>
        <h3>${r.name}</h3>
        <p>${r.city}</p>
        <p class="text-muted">${r.address}</p>
    `;

    card.addEventListener('click', async () => {
      showView('restaurantDetailView');

      const restaurant = await fetchRestaurantById(r._id);
      const todayMenu = await fetchMenuToday(r._id);
      const weekMenu = await fetchMenuWeek(r._id);

      renderRestaurantDetail(restaurant, todayMenu, weekMenu);
      setupMenuTabs();
    });

    list.appendChild(card);
  });
}
