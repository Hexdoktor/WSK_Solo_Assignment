import {
  fetchRestaurantById,
  fetchMenuToday,
  fetchMenuWeek,
  renderRestaurantDetail,
  setupMenuTabs,
} from './details.js';
import {showView} from '../core/main.js';
import {isFavorite, toggleFavorite} from '../favorites/favorites.js';

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
export function renderRestaurants(
  restaurants,
  containerId = 'restaurantList',
  sort = true
) {
  if (sort) {
    restaurants = [...restaurants].sort((a, b) => {
      const aFav = isFavorite(a._id);
      const bFav = isFavorite(b._id);

      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      return a.name.localeCompare(b.name);
    });
  }

  const list = document.getElementById(containerId);
  if (!list) return;
  list.innerHTML = '';

  restaurants.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = r._id;

    const fav = isFavorite(r._id);

    card.innerHTML = `
        <span class="badge">${r.company}</span>
        <div class="card-header">
          <h3>${r.name}</h3>
          <span class="favorite-icon ${fav ? 'active' : ''}" data-fav="${r._id}">
            ${fav ? '★' : '☆'}
          </span>
        </div>

        <p>${r.city}</p>
        <p class="text-muted">${r.address}</p>
    `;

    card.addEventListener('click', async (e) => {
      if (e.target.classList.contains('favorite-icon')) return;

      showView('restaurantDetailView');

      const restaurant = await fetchRestaurantById(r._id);
      const todayMenu = await fetchMenuToday(r._id);
      const weekMenu = await fetchMenuWeek(r._id);

      if (!restaurant) return;

      renderRestaurantDetail(restaurant, todayMenu, weekMenu);
      setupMenuTabs();
    });

    card.querySelector('.favorite-icon').addEventListener('click', (e) => {
      e.stopPropagation();

      const id = e.target.dataset.fav;
      const nowFav = toggleFavorite(id);

      e.target.classList.toggle('active', nowFav);
      e.target.textContent = nowFav ? '★' : '☆';
    });

    list.appendChild(card);
  });
}
