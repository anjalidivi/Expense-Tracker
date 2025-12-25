const loginBtn = document.getElementById('login-button');
const nameInput = document.getElementById('name-input');

loginBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Enter your name!");
  localStorage.setItem('et_user', name);
  window.location.href = "tracker.html";
});
