let selectedPosition = "";

const adminBtn = document.getElementById("adminBtn");
const cashierBtn = document.getElementById("cashierBtn");
const authFields = document.querySelectorAll(".auth-fields");

adminBtn.addEventListener("click", () => {
  selectedPosition = "Admin";
  adminBtn.classList.add("selected");
  cashierBtn.classList.remove("selected");
  authFields.forEach(f => f.style.display = "block");
});

cashierBtn.addEventListener("click", () => {
  selectedPosition = "Cashier";
  cashierBtn.classList.add("selected");
  adminBtn.classList.remove("selected");
  authFields.forEach(f => f.style.display = "block");
});

document.getElementById("employeeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const photo = document.getElementById("photo").files[0];

  if (!fullName || !photo || !selectedPosition || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const photoBase64 = reader.result;

    const newEmployee = {
      fullName,
      email,
      password,
      photo: photoBase64,
      position: selectedPosition,
      role: selectedPosition
    };

    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    employees.push(newEmployee);
    localStorage.setItem("employees", JSON.stringify(employees));

    alert(`${fullName} added successfully!`);
    renderEmployeeList();

    if (selectedPosition === "Admin") {
      window.location.href = "indexLogin.html";
    } else {
      window.location.href = "cashier.html";
    }
  };

  reader.readAsDataURL(photo);
});

function renderEmployeeList() {
  const employees = JSON.parse(localStorage.getItem("employees") || "[]");
  const list = document.getElementById("employeeList");
  list.innerHTML = "";

  employees.forEach((emp, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${emp.position}</strong><br/>
      <input type="text" value="${emp.fullName}" id="name-${index}" />
      <input type="text" value="${emp.email}" id="email-${index}" />
      <input type="text" value="${emp.password}" id="password-${index}" />
      <button onclick="updateEmployee(${index})">Update</button>
      <button onclick="deleteEmployee(${index})">Delete</button>
      <hr/>
    `;
    list.appendChild(li);
  });
}

function updateEmployee(index) {
  const employees = JSON.parse(localStorage.getItem("employees") || "[]");
  const updatedName = document.getElementById(`name-${index}`).value.trim();
  const updatedEmail = document.getElementById(`email-${index}`).value.trim();
  const updatedPassword = document.getElementById(`password-${index}`).value.trim();

  if (!updatedName || !updatedEmail || !updatedPassword) {
    alert("All fields are required.");
    return;
  }

  employees[index].fullName = updatedName;
  employees[index].email = updatedEmail;
  employees[index].password = updatedPassword;

  localStorage.setItem("employees", JSON.stringify(employees));
  alert("✅ Employee updated!");
  renderEmployeeList();
}

function deleteEmployee(index) {
  if (!confirm("Delete this employee?")) return;

  const employees = JSON.parse(localStorage.getItem("employees") || "[]");
  employees.splice(index, 1);
  localStorage.setItem("employees", JSON.stringify(employees));
  renderEmployeeList();
}

document.addEventListener("DOMContentLoaded", renderEmployeeList);
