import {getFavorites} from './favorites.js';
import {renderRestaurants} from '../restaurants/restaurants.js';
import {getRestaurantData} from '../filters/filters.js';

export async function renderFavoritesView() {
  const favIds = getFavorites();
  const all = getRestaurantData();

  const filtered = all.filter((r) => favIds.includes(r._id));

  renderRestaurants(filtered, 'favoritesList', false);
}
