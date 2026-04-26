let allRestaurants = [];
let onFilterUpdate = null;

export function setRestaurantData(data) {
  allRestaurants = data;
}

// function to show only the filtered restaurants
export function applyFilters() {
  const city = document.getElementById('cityFilter').value;
  const provider = document.getElementById('providerFilter').value;
  const search = document.getElementById('searchInput').value.toLowerCase();

  return allRestaurants.filter((r) => {
    const matchesCity = city ? r.city === city : true;
    const matchesProvider = provider ? r.company === provider : true;
    const matchesSearch = r.name.toLowerCase().includes(search);
    return matchesCity && matchesProvider && matchesSearch;
  });
}

// function to fill the dropdowns with options
export function populateFilters(restaurants) {
  const cityFilter = document.getElementById('cityFilter');
  const providerFilter = document.getElementById('providerFilter');

  const cities = [...new Set(restaurants.map((r) => r.city))].sort();
  const providers = [...new Set(restaurants.map((r) => r.company))].sort();

  cities.forEach((city) => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    cityFilter.appendChild(opt);
  });

  providers.forEach((provider) => {
    const opt = document.createElement('option');
    opt.value = provider;
    opt.textContent = provider;
    providerFilter.appendChild(opt);
  });
}

// listeners for filters
export function setupFilterListeners(callback) {
  onFilterUpdate = callback;

  document.getElementById('cityFilter').addEventListener('change', () => {
    onFilterUpdate(applyFilters());
  });

  document.getElementById('providerFilter').addEventListener('change', () => {
    onFilterUpdate(applyFilters());
  });

  document.getElementById('searchInput').addEventListener('input', () => {
    onFilterUpdate(applyFilters());
  });
}
