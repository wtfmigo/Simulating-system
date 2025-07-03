document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageBox = document.querySelector(".message-box");

  const employees = JSON.parse(localStorage.getItem("employees") || "[]");
  const user = employees.find(emp => emp.email === email && emp.password === password);

  if (user) {
    messageBox.className = "message-box success";
    messageBox.innerText = `✅ Welcome, ${user.fullName}! Redirecting...`;
    messageBox.style.display = "block";

    setTimeout(() => {
      if (user.position === "Admin") {
        window.location.href = "indexLogin.html";
      } else if (user.position === "Cashier") {
        window.location.href = "cashier.html";
      } else {
        alert("User has no valid role.");
      }
    }, 1500);
  } else {
    messageBox.className = "message-box";
    messageBox.innerText = "❌ Invalid email or password.";
    messageBox.style.display = "block";
  }
});
