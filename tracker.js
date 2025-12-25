// Dark Mode
const bodyRoot = document.documentElement;
const themeBtn = document.querySelectorAll("#theme-toggle");

const saved = localStorage.getItem("et_theme");
if (saved === "dark") bodyRoot.classList.add("dark");

themeBtn.forEach(btn =>
  btn.addEventListener("click", () => {
    bodyRoot.classList.toggle("dark");
    localStorage.setItem("et_theme", bodyRoot.classList.contains("dark") ? "dark" : "light");
}));

// Dashboard logic
const userName = localStorage.getItem("et_user") || "User";
document.getElementById("user-name").textContent = userName;

let transactions = JSON.parse(localStorage.getItem("et_transactions") || "[]");

const dateInput = document.getElementById("date-input");
const amountInput = document.getElementById("amount-input");
const typeSelect = document.getElementById("type-select");
const addButton = document.getElementById("add-button");

const tbody = document.getElementById("transactions-body");
const incomeRef = document.getElementById("income-amount");
const expenseRef = document.getElementById("expense-amount");
const balanceRef = document.getElementById("balance-amount");

let pieChart = null;

function save() { localStorage.setItem("et_transactions", JSON.stringify(transactions)); }

function formatCurrency(n) { return "₹ " + Number(n || 0).toLocaleString(); }

function renderAll() { renderCards(); renderTable(); renderCharts(); }

addButton.addEventListener("click", () => {
  const amt = parseFloat(amountInput.value);
  const dt = dateInput.value;
  const tp = typeSelect.value;
  if (!amt || !dt) return alert("Enter all fields!");
  transactions.unshift({ id: Date.now(), amount: amt, type: tp, date: dt });
  amountInput.value = "";
  dateInput.value = "";
  save(); renderAll();
});

function renderCards() {
  let income = 0, expense = 0;
  transactions.forEach(t => t.type === "Income" ? income += t.amount : expense += t.amount);
  incomeRef.textContent = formatCurrency(income);
  expenseRef.textContent = formatCurrency(expense);
  balanceRef.textContent = formatCurrency(income - expense);
}

function renderTable() {
  tbody.innerHTML = transactions.map(t => `
    <tr>
      <td>${formatCurrency(t.amount)}</td>
      <td>${t.type}</td>
      <td>${t.date}</td>
      <td>
        <button class="edit-btn" onclick="editTrans(${t.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTrans(${t.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function deleteTrans(id) {
  transactions = transactions.filter(t => t.id !== id);
  save(); renderAll();
}

function editTrans(id) {
  const t = transactions.find(x => x.id === id);
  const newAmt = prompt("New amount", t.amount);
  if (!newAmt || isNaN(newAmt)) return;
  t.amount = parseFloat(newAmt);
  save(); renderAll();
}

function renderCharts() {
  const ctx = document.getElementById("pieChart").getContext("2d");
  const inc = transactions.filter(t => t.type==="Income")
                          .reduce((s,t)=>s+t.amount,0);
  const exp = transactions.filter(t => t.type==="Expense")
                          .reduce((s,t)=>s+t.amount,0);
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income","Expense"],
      datasets: [{ data:[inc,exp], backgroundColor:["#4c79ff","#c086ff"] }]
    }
  });
}

renderAll();
const storedName = localStorage.getItem("et_user") || "User";
document.getElementById("user-name").textContent = storedName;

// Get stored transactions
let transactions = JSON.parse(localStorage.getItem("et_transactions") || "[]");

// UI elements
const dateInput = document.getElementById("date-input");
const amountInput = document.getElementById("amount-input");
const categorySelect = document.getElementById("category-select");
const addButton = document.getElementById("add-button");

const tbody = document.getElementById("transactions-body");
const incomeRef = document.getElementById("income-amount");
const expenseRef = document.getElementById("expense-amount");
const balanceRef = document.getElementById("balance-amount");
let pieChart = null;

// Save to localStorage
function save() {
  localStorage.setItem("et_transactions", JSON.stringify(transactions));
}

// Format currency
function formatCurrency(n) {
  return "₹ " + Number(n || 0).toLocaleString();
}

// Render all UI
function renderAll() {
  renderCards();
  renderTable();
  renderCharts();
}

addButton.addEventListener("click", () => {
  const amt = parseFloat(amountInput.value);
  const dt = dateInput.value;
  const cat = categorySelect.value;

  if (!amt || !dt) {
    alert("Enter all fields");
    return;
  }

  transactions.unshift({ id: Date.now(), amount: amt, type: cat, date: dt });

  amountInput.value = "";
  dateInput.value = "";
  save();
  renderAll();
});

function renderCards() {
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "Income") income += t.amount;
    else expense += t.amount;
  });

  incomeRef.textContent = formatCurrency(income);
  expenseRef.textContent = formatCurrency(expense);
  balanceRef.textContent = formatCurrency(income - expense);
}

function renderTable() {
  tbody.innerHTML = transactions.map(t => `
    <tr>
      <td>${formatCurrency(t.amount)}</td>
      <td>${t.type}</td>
      <td>${t.date}</td>
      <td>
        <button class="edit-btn" onclick="editTrans(${t.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTrans(${t.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function deleteTrans(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  renderAll();
}

function editTrans(id) {
  const t = transactions.find(x => x.id === id);
  const newAmt = prompt("Enter new amount", t.amount);
  if (!newAmt || isNaN(newAmt)) return;

  const newCat = prompt("Enter category (Income/Food/Shopping/Travel/Bills/Others)", t.type);
  if (!newCat) return;

  t.amount = parseFloat(newAmt);
  t.type = newCat;
  save();
  renderAll();
}

function renderCharts() {
  const ctx = document.getElementById("pieChart").getContext("2d");

  // Group by category (exclude Income)
  const catTotals = {};
  transactions.forEach(t => {
    // skip "Income" in category breakdown chart
    if (t.type !== "Income") {
      catTotals[t.type] = (catTotals[t.type] || 0) + t.amount;
    }
  });

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(catTotals),
      datasets: [{
        data: Object.values(catTotals),
        backgroundColor: [
          "#4c79ff", // Food
          "#ff8c66", // Shopping
          "#66ff88", // Travel
          "#ff66a8", // Bills
          "#d4bfff"  // Others
        ]
      }]
    }
  });
}

renderAll();
const storedName = localStorage.getItem("et_user") || "User";
document.getElementById("user-name").textContent = storedName;

// Get stored transactions
let transactions = JSON.parse(localStorage.getItem("et_transactions") || "[]");

// UI elements
const dateInput = document.getElementById("date-input");
const amountInput = document.getElementById("amount-input");
const categorySelect = document.getElementById("category-select");
const addButton = document.getElementById("add-button");

const tbody = document.getElementById("transactions-body");
const incomeRef = document.getElementById("income-amount");
const expenseRef = document.getElementById("expense-amount");
const balanceRef = document.getElementById("balance-amount");
let pieChart = null;

// Save to localStorage
function save() {
  localStorage.setItem("et_transactions", JSON.stringify(transactions));
}

// Format currency
function formatCurrency(n) {
  return "₹ " + Number(n || 0).toLocaleString();
}

// Render all UI
function renderAll() {
  renderCards();
  renderTable();
  renderCharts();
}

addButton.addEventListener("click", () => {
  const amt = parseFloat(amountInput.value);
  const dt = dateInput.value;
  const cat = categorySelect.value;

  if (!amt || !dt) {
    alert("Enter all fields");
    return;
  }

  transactions.unshift({ id: Date.now(), amount: amt, type: cat, date: dt });

  amountInput.value = "";
  dateInput.value = "";
  save();
  renderAll();
});

function renderCards() {
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "Income") income += t.amount;
    else expense += t.amount;
  });

  incomeRef.textContent = formatCurrency(income);
  expenseRef.textContent = formatCurrency(expense);
  balanceRef.textContent = formatCurrency(income - expense);
}

function renderTable() {
  tbody.innerHTML = transactions.map(t => `
    <tr>
      <td>${formatCurrency(t.amount)}</td>
      <td>${t.type}</td>
      <td>${t.date}</td>
      <td>
        <button class="edit-btn" onclick="editTrans(${t.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTrans(${t.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function deleteTrans(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  renderAll();
}

function editTrans(id) {
  const t = transactions.find(x => x.id === id);
  const newAmt = prompt("Enter new amount", t.amount);
  if (!newAmt || isNaN(newAmt)) return;

  const newCat = prompt("Enter category (Income/Food/Shopping/Travel/Bills/Others)", t.type);
  if (!newCat) return;

  t.amount = parseFloat(newAmt);
  t.type = newCat;
  save();
  renderAll();
}

function renderCharts() {
  const ctx = document.getElementById("pieChart").getContext("2d");

  // Group by category (exclude Income)
  const catTotals = {};
  transactions.forEach(t => {
    // skip "Income" in category breakdown chart
    if (t.type !== "Income") {
      catTotals[t.type] = (catTotals[t.type] || 0) + t.amount;
    }
  });

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(catTotals),
      datasets: [{
        data: Object.values(catTotals),
        backgroundColor: [
          "#4c79ff", // Food
          "#ff8c66", // Shopping
          "#66ff88", // Travel
          "#ff66a8", // Bills
          "#d4bfff"  // Others
        ]
      }]
    }
  });
}

renderAll();
const storedName = localStorage.getItem("et_user") || "User";
document.getElementById("user-name").textContent = storedName;

// Get stored transactions
let transactions = JSON.parse(localStorage.getItem("et_transactions") || "[]");

// UI elements
const dateInput = document.getElementById("date-input");
const amountInput = document.getElementById("amount-input");
const categorySelect = document.getElementById("category-select");
const addButton = document.getElementById("add-button");

const tbody = document.getElementById("transactions-body");
const incomeRef = document.getElementById("income-amount");
const expenseRef = document.getElementById("expense-amount");
const balanceRef = document.getElementById("balance-amount");
let pieChart = null;

// Save to localStorage
function save() {
  localStorage.setItem("et_transactions", JSON.stringify(transactions));
}

// Format currency
function formatCurrency(n) {
  return "₹ " + Number(n || 0).toLocaleString();
}

// Render all UI
function renderAll() {
  renderCards();
  renderTable();
  renderCharts();
}

addButton.addEventListener("click", () => {
  const amt = parseFloat(amountInput.value);
  const dt = dateInput.value;
  const cat = categorySelect.value;

  if (!amt || !dt) {
    alert("Enter all fields");
    return;
  }

  transactions.unshift({ id: Date.now(), amount: amt, type: cat, date: dt });

  amountInput.value = "";
  dateInput.value = "";
  save();
  renderAll();
});

function renderCards() {
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "Income") income += t.amount;
    else expense += t.amount;
  });

  incomeRef.textContent = formatCurrency(income);
  expenseRef.textContent = formatCurrency(expense);
  balanceRef.textContent = formatCurrency(income - expense);
}

function renderTable() {
  tbody.innerHTML = transactions.map(t => `
    <tr>
      <td>${formatCurrency(t.amount)}</td>
      <td>${t.type}</td>
      <td>${t.date}</td>
      <td>
        <button class="edit-btn" onclick="editTrans(${t.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTrans(${t.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function deleteTrans(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  renderAll();
}

function editTrans(id) {
  const t = transactions.find(x => x.id === id);
  const newAmt = prompt("Enter new amount", t.amount);
  if (!newAmt || isNaN(newAmt)) return;

  const newCat = prompt("Enter category (Income/Food/Shopping/Travel/Bills/Others)", t.type);
  if (!newCat) return;

  t.amount = parseFloat(newAmt);
  t.type = newCat;
  save();
  renderAll();
}

function renderCharts() {
  const ctx = document.getElementById("pieChart").getContext("2d");

  // Group by category (exclude Income)
  const catTotals = {};
  transactions.forEach(t => {
    // skip "Income" in category breakdown chart
    if (t.type !== "Income") {
      catTotals[t.type] = (catTotals[t.type] || 0) + t.amount;
    }
  });

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(catTotals),
      datasets: [{
        data: Object.values(catTotals),
        backgroundColor: [
          "#4c79ff", // Food
          "#ff8c66", // Shopping
          "#66ff88", // Travel
          "#ff66a8", // Bills
          "#d4bfff"  // Others
        ]
      }]
    }
  });
}

renderAll();
const storedName = localStorage.getItem("et_user") || "User";
document.getElementById("user-name").textContent = storedName;

// Get stored transactions
let transactions = JSON.parse(localStorage.getItem("et_transactions") || "[]");

// UI elements
const dateInput = document.getElementById("date-input");
const amountInput = document.getElementById("amount-input");
const categorySelect = document.getElementById("category-select");
const addButton = document.getElementById("add-button");

const tbody = document.getElementById("transactions-body");
const incomeRef = document.getElementById("income-amount");
const expenseRef = document.getElementById("expense-amount");
const balanceRef = document.getElementById("balance-amount");
let pieChart = null;

// Save to localStorage
function save() {
  localStorage.setItem("et_transactions", JSON.stringify(transactions));
}

// Format currency
function formatCurrency(n) {
  return "₹ " + Number(n || 0).toLocaleString();
}

// Render all UI
function renderAll() {
  renderCards();
  renderTable();
  renderCharts();
}

addButton.addEventListener("click", () => {
  const amt = parseFloat(amountInput.value);
  const dt = dateInput.value;
  const cat = categorySelect.value;

  if (!amt || !dt) {
    alert("Enter all fields");
    return;
  }

  transactions.unshift({ id: Date.now(), amount: amt, type: cat, date: dt });

  amountInput.value = "";
  dateInput.value = "";
  save();
  renderAll();
});

function renderCards() {
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "Income") income += t.amount;
    else expense += t.amount;
  });

  incomeRef.textContent = formatCurrency(income);
  expenseRef.textContent = formatCurrency(expense);
  balanceRef.textContent = formatCurrency(income - expense);
}

function renderTable() {
  tbody.innerHTML = transactions.map(t => `
    <tr>
      <td>${formatCurrency(t.amount)}</td>
      <td>${t.type}</td>
      <td>${t.date}</td>
      <td>
        <button class="edit-btn" onclick="editTrans(${t.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTrans(${t.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function deleteTrans(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  renderAll();
}

function editTrans(id) {
  const t = transactions.find(x => x.id === id);
  const newAmt = prompt("Enter new amount", t.amount);
  if (!newAmt || isNaN(newAmt)) return;

  const newCat = prompt("Enter category (Income/Food/Shopping/Travel/Bills/Others)", t.type);
  if (!newCat) return;

  t.amount = parseFloat(newAmt);
  t.type = newCat;
  save();
  renderAll();
}

function renderCharts() {
  const ctx = document.getElementById("pieChart").getContext("2d");

  // Group by category (exclude Income)
  const catTotals = {};
  transactions.forEach(t => {
    // skip "Income" in category breakdown chart
    if (t.type !== "Income") {
      catTotals[t.type] = (catTotals[t.type] || 0) + t.amount;
    }
  });

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(catTotals),
      datasets: [{
        data: Object.values(catTotals),
        backgroundColor: [
          "#4c79ff", // Food
          "#ff8c66", // Shopping
          "#66ff88", // Travel
          "#ff66a8", // Bills
          "#d4bfff"  // Others
        ]
      }]
    }
  });
}

renderAll();
const storedName = localStorage.getItem("et_user") || "User";
document.getElementById("user-name").textContent = storedName;

// Get stored transactions
let transactions = JSON.parse(localStorage.getItem("et_transactions") || "[]");

// UI elements
const dateInput = document.getElementById("date-input");
const amountInput = document.getElementById("amount-input");
const categorySelect = document.getElementById("category-select");
const addButton = document.getElementById("add-button");

const tbody = document.getElementById("transactions-body");
const incomeRef = document.getElementById("income-amount");
const expenseRef = document.getElementById("expense-amount");
const balanceRef = document.getElementById("balance-amount");
let pieChart = null;

// Save to localStorage
function save() {
  localStorage.setItem("et_transactions", JSON.stringify(transactions));
}

// Format currency
function formatCurrency(n) {
  return "₹ " + Number(n || 0).toLocaleString();
}

// Render all UI
function renderAll() {
  renderCards();
  renderTable();
  renderCharts();
}

addButton.addEventListener("click", () => {
  const amt = parseFloat(amountInput.value);
  const dt = dateInput.value;
  const cat = categorySelect.value;

  if (!amt || !dt) {
    alert("Enter all fields");
    return;
  }

  transactions.unshift({ id: Date.now(), amount: amt, type: cat, date: dt });

  amountInput.value = "";
  dateInput.value = "";
  save();
  renderAll();
});

function renderCards() {
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "Income") income += t.amount;
    else expense += t.amount;
  });

  incomeRef.textContent = formatCurrency(income);
  expenseRef.textContent = formatCurrency(expense);
  balanceRef.textContent = formatCurrency(income - expense);
}

function renderTable() {
  tbody.innerHTML = transactions.map(t => `
    <tr>
      <td>${formatCurrency(t.amount)}</td>
      <td>${t.type}</td>
      <td>${t.date}</td>
      <td>
        <button class="edit-btn" onclick="editTrans(${t.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTrans(${t.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function deleteTrans(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  renderAll();
}

function editTrans(id) {
  const t = transactions.find(x => x.id === id);
  const newAmt = prompt("Enter new amount", t.amount);
  if (!newAmt || isNaN(newAmt)) return;

  const newCat = prompt("Enter category (Income/Food/Shopping/Travel/Bills/Others)", t.type);
  if (!newCat) return;

  t.amount = parseFloat(newAmt);
  t.type = newCat;
  save();
  renderAll();
}

function renderCharts() {
  const ctx = document.getElementById("pieChart").getContext("2d");

  // Group by category (exclude Income)
  const catTotals = {};
  transactions.forEach(t => {
    // skip "Income" in category breakdown chart
    if (t.type !== "Income") {
      catTotals[t.type] = (catTotals[t.type] || 0) + t.amount;
    }
  });

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(catTotals),
      datasets: [{
        data: Object.values(catTotals),
        backgroundColor: [
          "#4c79ff", // Food
          "#ff8c66", // Shopping
          "#66ff88", // Travel
          "#ff66a8", // Bills
          "#d4bfff"  // Others
        ]
      }]
    }
  });
}

renderAll();

