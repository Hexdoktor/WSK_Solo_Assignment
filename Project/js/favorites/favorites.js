const FAVORITES_KEY = 'favoriteRestaurants';

export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

export function isFavorite(id) {
  const favs = getFavorites();
  return favs.includes(id);
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  let updated;

  if (favs.includes(id)) {
    updated = favs.filter((f) => f !== id);
  } else {
    updated = [...favs, id];
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated.includes(id);
}
