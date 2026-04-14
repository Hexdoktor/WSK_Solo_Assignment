const API_BASE = "https://media2.edu.metropolia.fi/restaurant/api/v1";

// Fetch all restaurants
export async function fetchRestaurants() {
  try {
    const res = await fetch(`${API_BASE}/restaurants`);
    if (!res.ok) throw new Error("Failed to fetch restaurants");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Render restaurant cards
export function renderRestaurants(restaurants) {
  const list = document.getElementById("restaurantList");
  list.innerHTML = "";

  restaurants.forEach((r) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = r._id;

    card.innerHTML = `
        <span class="badge">${r.provider}</span>
        <h3>${r.name}</h3>
        <p>${r.city}</p>
        <p class="text-muted">${r.address}</p>
    `;

    card.addEventListener("click", () => {
      console.log("Clicked restaurant:", r._id);
    });

    list.appendChild(card);
  });
}
