document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const quantity = parseInt(document.getElementById("productQty").value);
  const imageFile = document.getElementById("productImage").files[0];

  if (!name || !price || !quantity || !imageFile) {
    alert("Please fill out all fields.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const product = {
      name,
      price,
      quantity,
      image: reader.result
    };

    const products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));

    alert(`${name} added to inventory!`);
    renderProductList();
    document.getElementById("productForm").reset();
  };

  reader.readAsDataURL(imageFile);
});

function renderProductList() {
  const list = document.getElementById("productInventory");
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  list.innerHTML = "";

  products.forEach((product, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="details">
        <strong><input type="text" value="${product.name}" id="name-${index}" /></strong><br/>
       <div class="peso-input">
        <span>₱</span>
         <input type="number" value="${product.price}" id="price-${index}" />
        </div>

        Stock: <input type="number" value="${product.quantity}" id="qty-${index}" />
        <div class="actions">
          <button onclick="updateProduct(${index})">Update</button>
          <button class="delete" onclick="deleteProduct(${index})">Delete</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  });
}

function updateProduct(index) {
  const products = JSON.parse(localStorage.getItem("products") || "[]");

  const updatedName = document.getElementById(`name-${index}`).value.trim();
  const updatedPrice = parseFloat(document.getElementById(`price-${index}`).value);
  const updatedQty = parseInt(document.getElementById(`qty-${index}`).value);

  if (!updatedName || isNaN(updatedPrice) || isNaN(updatedQty)) {
    alert("Please provide valid values.");
    return;
  }

  products[index].name = updatedName;
  products[index].price = updatedPrice;
  products[index].quantity = updatedQty;

  localStorage.setItem("products", JSON.stringify(products));
  alert("✅ Product updated!");
  renderProductList();
}

function deleteProduct(index) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const products = JSON.parse(localStorage.getItem("products") || "[]");
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProductList();
}

document.addEventListener("DOMContentLoaded", renderProductList);
