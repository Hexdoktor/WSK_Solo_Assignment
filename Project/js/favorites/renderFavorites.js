import {getFavorites} from './favorites.js';
import {
  fetchRestaurants,
  renderRestaurants,
} from '../restaurants/restaurants.js';

export async function renderFavoritesView() {
  const favIds = getFavorites();
  const all = await fetchRestaurants();

  const filtered = all.filter((r) => favIds.includes(r._id));

  renderRestaurants(filtered, 'favoritesList', false);
}
