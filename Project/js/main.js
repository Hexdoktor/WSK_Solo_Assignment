const views = document.querySelectorAll(".view");

//Function to switch views
function showView(id) {
  views.forEach((view) => {
    if (view.id === id) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  document.querySelectorAll(".nav button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === id);
  });
}

//Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  //Navigation
  document.querySelectorAll(".nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      showView(btn.dataset.view);
    });
  });

  //Authorization listeners
  document.getElementById("loginBtn")?.addEventListener("click", handleLogin);
  document
    .getElementById("registerBtn")
    ?.addEventListener("click", handleRegister);

  //Auto-login
  if (getCurrentUser()) {
    showView("restaurantsView");
  } else {
    showView("loginView");
  }
});

//Load users from localStorage
function loadUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

//Save users
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

//Set current logged-in user
function setCurrentUser(username) {
  localStorage.setItem("currentUser", username);
}

//Get current logged-in user
function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

//Function to handle registering account
function handleRegister() {
  const username = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  const users = loadUsers();

  //Check if username exists
  if (users.some((u) => u.username === username)) {
    alert("Username already exists");
    return;
  }

  //Create new user
  const newUser = {
    username,
    password,
    favorites: [],
    profile: {
      name: "",
      city: "",
      image: "",
    },
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(username);

  showView("restaurantsView");
}

//Function handle logging in
function handleLogin() {
  const username = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const users = loadUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    alert("Invalid username or password");
    return;
  }

  setCurrentUser(username);
  showView("restaurantsView");
}

//Logic for logout button
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  showView("loginView");
});
