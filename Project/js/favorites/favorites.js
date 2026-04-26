import {getCurrentUser} from '../auth/auth.js';

function getFavoritesKey() {
  const user = getCurrentUser();
  return user ? `favoriteRestaurants_${user.username}` : null;
}

export function getFavorites() {
  const key = getFavoritesKey();
  if (!key) return [];
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function isFavorite(id) {
  const favs = getFavorites();
  return favs.includes(id);
}

export function toggleFavorite(id) {
  const key = getFavoritesKey();
  if (!key) return false;

  const favs = getFavorites();
  let updated;

  if (favs.includes(id)) {
    updated = favs.filter((f) => f !== id);
  } else {
    updated = [...favs, id];
  }

  localStorage.setItem(key, JSON.stringify(updated));
  return updated.includes(id);
}
