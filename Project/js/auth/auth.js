//Load users from localStorage
function loadUsers() {
  const raw = localStorage.getItem("users");
  return raw ? JSON.parse(raw) : [];
}

//Save users
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

//Set current logged-in user
function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

//Get current logged-in user
export function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
}

//Function to handle registering account
export function handleRegister() {
  const usernameInput = document.getElementById("registerUsername");
  const passwordInput = document.getElementById("registerPassword");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  const users = loadUsers();
  //Check if username exists
  if (users.find((u) => u.username === username)) {
    alert("Username already exists");
    return;
  }

  users.push({ username, password });
  saveUsers(users);

  alert("Registration successful. You can now log in.");
  usernameInput.value = "";
  passwordInput.value = "";
}

//Function to handle logging in
export function handleLogin(onSuccess) {
  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  const users = loadUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    alert("Invalid username or password");
    return;
  }

  setCurrentUser(user);
  if (typeof onSuccess === "function") onSuccess(user);
}
