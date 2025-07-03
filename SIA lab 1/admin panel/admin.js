 // ✅ Dummy fetch simulation - replace this with real fetch/database logic
  function loadDashboardData() {
    // backend here
    const data = {
      employees: 0,
      inventory: 0,
      sales: 0
    };

    // Set placeholders for now
    document.getElementById("employees").textContent = `${data.employees} staff`;
    document.getElementById("inventory").textContent = `${data.inventory} items`;
    document.getElementById("sales").textContent = `₱${data.sales.toLocaleString()}`;
  }

  // Call this once when the page loads
  loadDashboardData();

  // ✅ Live date/time
  function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString("en-PH", {
      weekday: "short", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    });
    document.getElementById("dateTime").textContent = formatted;
  }

  updateDateTime();
  setInterval(updateDateTime, 60000);

  // ✅ Logout logic
  document.getElementById("logoutBtn").addEventListener("click", () => {
    window.location.href = "admin-login.html";
  });

  

