const API_BASE = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

function formatFullDate(dateStr) {
  if (!dateStr) return 'Unknown';

  return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

// function to fetch a specific restaurant by its id
export async function fetchRestaurantById(id) {
  try {
    const res = await fetch(`${API_BASE}/restaurants/${id}`);
    if (!res.ok) throw new Error('Failed to fetch restaurants');
    return await res.json();
  } catch (err) {
    console.error('Restaurant detail error:', err);
    return null;
  }
}

//function to fetch the daily menu for a given restaurant
export async function fetchMenuToday(id) {
  try {
    const res = await fetch(`${API_BASE}/restaurants/daily/${id}/fi`);
    if (!res.ok) throw new Error("Failed to fetch today's menu");

    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.courses)) return data.courses;

    return [];
  } catch (err) {
    console.error('Daily menu error:', err);
    return [];
  }
}

//function to fetch the weekly menu for a given restaurant
export async function fetchMenuWeek(id) {
  try {
    const res = await fetch(`${API_BASE}/restaurants/weekly/${id}/fi`);
    if (!res.ok) throw new Error('Failed to fetch weekly menu');

    const data = await res.json();

    //
    if (Array.isArray(data.days)) {
      return data.days.map((dayObj) => {
        return {
          day: formatFullDate(dayObj.date),
          courses: dayObj.courses || [],
        };
      });
    }

    return [];
  } catch (err) {
    console.error('Weekly menu error:', err);
    return [];
  }
}

// function to show restaurant details after clicking its card
export function renderRestaurantDetail(restaurant, todayMenu, weekMenu) {
  const infoContainer = document.getElementById('restaurantInfo');
  const dayContainer = document.getElementById('menuDay');
  const weekContainer = document.getElementById('menuWeek');

  infoContainer.innerHTML = `
  <h2>${restaurant.name}</h2>
  <p>${restaurant.address}</p>
  <p>${restaurant.city}</p>
  <p class="text-muted">${restaurant.company}</p>
  `;

  dayContainer.innerHTML = `
  <h3>Today's Menu</h3>
  <ul>
    ${todayMenu
      .map(
        (item) => `
      <li>
        <strong>${item.name}</strong>
        <div class="meta>
          <span>${item.price || ''}</span>
          <span>${item.diets || ''}</span>
        </div>
      </li>`
      )
      .join('')}
  </ul>`;

  weekContainer.innerHTML = `
  <h3>Weekly Menu</h3>
  ${weekMenu
    .map(
      (day) => `
    <div class="week-day-block">
      <h4>${day.day}</h4>
      <ul>
        ${day.courses
          .map(
            (item) => `
          <li>
            <strong>${item.name}</strong>
            <div class="meta">
              <span>${item.price || ''}</span>
              <span>${item.diets || ''}</span>
            </div>
          </li>`
          )
          .join('')}
      </ul>
    </div>
    `
    )
    .join('')}`;
}

// listeners for menu tabs to show either daily or weekly menu
export function setupMenuTabs() {
  const dayBtn = document.querySelector('[data-menu="day"]');
  const weekBtn = document.querySelector('[data-menu="week"]');

  const dayContainer = document.getElementById('menuDay');
  const weekContainer = document.getElementById('menuWeek');

  //daily menu tab
  dayBtn.addEventListener('click', () => {
    dayBtn.classList.add('active');
    weekBtn.classList.remove('active');

    dayContainer.style.display = 'block';
    weekContainer.style.display = 'none';
  });

  // weekly menu tab
  weekBtn.addEventListener('click', () => {
    weekBtn.classList.add('active');
    dayBtn.classList.remove('active');

    dayContainer.style.display = 'none';
    weekContainer.style.display = 'block';
  });
}
