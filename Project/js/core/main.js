import {
  fetchRestaurants,
  renderRestaurants,
} from "../restaurants/restaurants.js";
import { handleLogin, handleRegister, getCurrentUser } from "../auth/auth.js";

//Function to switch views
function showView(id) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("active");
    view.style.display = "none";
  });

  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    target.style.display = "block";
  }
}

export { showView };

function setupNav() {
  document.querySelectorAll(".nav button[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const viewId = btn.getAttribute("data-view");
      showView(viewId);
    });
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      showView("loginView");
    });
  }
}

function setupAuth() {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      handleLogin(async () => {
        showView("restaurantsView");

        const restaurants = await fetchRestaurants();
        renderRestaurants(restaurants);
      });
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", handleRegister);
  }
}

//Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupAuth();

  //Auto-login
  const currentUser = getCurrentUser();
  if (currentUser) {
    showView("restaurantsView");

    fetchRestaurants().then(renderRestaurants);
  } else {
    showView("loginView");
  }
});
