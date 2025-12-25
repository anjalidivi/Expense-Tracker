// Dark Mode Toggle
const root = document.body;
const toggleBtn = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("et_theme");

if (savedTheme === "dark") root.classList.add("dark");

toggleBtn.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.setItem("et_theme", root.classList.contains("dark") ? "dark" : "light");
});

// Login
const loginBtn = document.getElementById("login-button");
const nameInput = document.getElementById("name-input");

loginBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Enter your name!");
  localStorage.setItem("et_user", name);
  window.location.href = "tracker.html";
});


