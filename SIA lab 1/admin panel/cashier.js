let products = JSON.parse(localStorage.getItem("products") || "[]");
let cart = [];
const historyKey = "receiptHistory";

// Render all products
function renderProducts() {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image || 'images/default.png'}" alt="${product.name}" class="product-img" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>Price: ₱${product.price}</p>
        <p>Stock: <span>${product.quantity}</span></p>
        <div class="actions">
          <input type="number" id="qty-${index}" placeholder="Qty" min="1" max="${product.quantity}" class="quantity-input" />
          <button onclick="addToCart(${index})" class="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Add product to cart
function addToCart(index) {
  const qtyInput = document.getElementById(`qty-${index}`);
  const qty = parseInt(qtyInput.value);
  if (!qty || qty <= 0) return alert("Enter a valid quantity.");

  const product = products[index];
  if (qty > product.quantity) return alert("Not enough stock.");

  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    if (existing.qty + qty > product.quantity) return alert("Stock limit exceeded.");
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  updateReceipt();
  qtyInput.value = "";
}

// Update receipt preview
function updateReceipt() {
  const receipt = document.getElementById("receiptBox");
  if (cart.length === 0) {
    receipt.innerHTML = "<p>No items yet.</p>";
    return;
  }

  const date = new Date().toLocaleString();
  let total = 0;
  let html = `<p><strong>🧾 Brennan Fanatics</strong><br/><span>Date: ${date}</span></p><hr><ul>`;

  cart.forEach((item, index) => {
    const subtotal = item.qty * item.price;
    total += subtotal;
    html += `
      <li>
        ${item.qty} x ${item.name} @ ₱${item.price} = ₱${subtotal}
        <button onclick="removeFromCart(${index})" style="margin-left: 10px; background: red; color: white; border: none; border-radius: 4px; padding: 2px 6px; font-size: 12px;">🗑</button>
      </li>
    `;
  });

  html += `</ul><hr/><p><strong>Total: ₱${total.toFixed(2)}</strong></p>`;
  receipt.innerHTML = html;
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateReceipt();
}

// Clear cart button
document.getElementById("clearCartBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("🛒 Cart is already empty.");
    return;
  }

  const confirmClear = confirm("Are you sure you want to clear the entire cart?");
  if (confirmClear) {
    cart.length = 0;
    updateReceipt();
    alert("✅ Cart cleared.");
  }
});

// Main checkout function
function checkout() {
  if (cart.length === 0) return alert("Cart is empty.");

  const name = document.getElementById("custName").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const email = document.getElementById("custEmail").value.trim();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const paymentInput = document.getElementById("paymentInput");
  const payment = parseFloat(paymentInput.value);

  if (!payment || payment < total) {
    return alert(`Insufficient payment. Total is ₱${total}`);
  }

  const change = payment - total;

  // Deduct stock
  cart.forEach(cartItem => {
    const index = products.findIndex(p => p.name === cartItem.name);
    if (index !== -1) {
      products[index].quantity -= cartItem.qty;
    }
  });

  localStorage.setItem("products", JSON.stringify(products));

  const currentSales = parseFloat(localStorage.getItem("totalSales") || "0");
  const newSales = currentSales + total;
  localStorage.setItem("totalSales", newSales.toFixed(2));

  const date = new Date().toLocaleString();
  const orderId = "ORD" + Date.now();

  // Receipt HTML for purchase history
  const receiptHTML = `
    <div class="receipt-item">
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Name:</strong> ${name || "-"}</p>
      <p><strong>Address:</strong> ${address || "-"}</p>
      <p><strong>Email:</strong> ${email || "-"}</p>
      <ul>
        ${cart.map(item => `<li>${item.qty} x ${item.name} = ₱${item.qty * item.price}</li>`).join("")}
      </ul>
      <p><strong>Total:</strong> ₱${total.toFixed(2)}</p>
      <p><strong>Payment:</strong> ₱${payment}</p>
      <p><strong>Change:</strong> ₱${change.toFixed(2)}</p>
    </div>
  `;

  // Save to receipt history
  const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
  history.unshift(receiptHTML);
  localStorage.setItem(historyKey, JSON.stringify(history));

  // Save to customerOrders
  const orders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
  orders.unshift({
    id: orderId,
    name: name || "-",
    address: address || "-",
    email: email || "-",
    items: cart.map(item => ({ name: item.name, qty: item.qty })),
    total: total
  });
  localStorage.setItem("customerOrders", JSON.stringify(orders));

  alert("✅ Checkout complete!");
  cart = [];
  paymentInput.value = "";
  document.getElementById("custName").value = "";
  document.getElementById("custAddress").value = "";
  document.getElementById("custEmail").value = "";

  updateReceipt();
  renderProducts();
  loadReceiptHistory();
}

// Load purchase history from localStorage
function loadReceiptHistory() {
  const container = document.getElementById("historyContainer");
  const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
  container.innerHTML = history.join("");
}

// Event listeners
document.getElementById("checkoutBtn").addEventListener("click", checkout);

document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("Logout now?")) {
    window.location.href = "logIn.html";
  }
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateReceipt();
  loadReceiptHistory();
});
