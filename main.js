var prodName = document.getElementById("prodName");
var prodPrice = document.getElementById("prodPrice");
var prodDesc = document.getElementById("prodDesc");

var products = [];
var editIndex = -1;

document.querySelectorAll("input , textarea").forEach(function (el) {
  let original = el.placeholder;
  el.addEventListener("focus", function () {
    el.placeholder = "";
  });
  el.addEventListener("blur", function () {
    el.placeholder = original;
  });
});

if (localStorage.getItem("products") != null) {
  products = JSON.parse(localStorage.getItem("products"));
  displayProduct();
}

// Validation
function validateInputs(name, price) {
  if (!name) {
    showError(prodName, "Product name is required.");
    return false;
  }

  if (name.length < 2) {
    showError(prodName, "Name must be at least 2 characters.");
    return false;
  }

  if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(name)) {
    showError(prodName, "Name must contain letters only.");
    return false;
  }

  if (!price) {
    showError(prodPrice, "Product price is required.");
    return false;
  }

  if (parseFloat(price) <= 0) {
    showError(prodPrice, "Price must be greater than zero.");
    return false;
  }

  return true;
}

function showError(inputEl, message) {
  clearError(inputEl);

  inputEl.classList.add("is-invalid");

  let errorDiv = document.createElement("div");
  errorDiv.classList.add("invalid-feedback", "validation-msg");
  errorDiv.textContent = message;

  inputEl.insertAdjacentElement("afterend", errorDiv);
}

function clearError(inputEl) {
  inputEl.classList.remove("is-invalid");

  let next = inputEl.nextElementSibling;
  if (next && next.classList.contains("validation-msg")) {
    next.remove();
  }
}

function clearAllErrors() {
  clearError(prodName);
  clearError(prodPrice);
}

function getProduct() {
  let name = prodName.value.trim();
  let price = prodPrice.value.trim();
  let desc = prodDesc.value.trim();

  clearAllErrors();

  if (!validateInputs(name, price)) return;

  let product = { name, price, desc };

  if (editIndex === -1) {
    products.push(product);
  } else {
    products[editIndex] = product;
    editIndex = -1;
    document.getElementById("saveBtn").textContent = "Add Product";
    document.getElementById("cancelBtn").style.display = "none";
  }

  localStorage.setItem("products", JSON.stringify(products));
  displayProduct();
  clear();
}

function displayProduct() {
  let tbody = document.getElementById("body");
  tbody.innerHTML = "";

  products.forEach((product, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.desc}</td>
        <td class="text-end">
          <button onclick="editProduct(${index})" class="btn btn-warning btn-sm me-1">Update</button>
          <button onclick="deleteProduct(${index})" class="btn btn-danger btn-sm">Delete</button>
        </td>
      </tr>`;
  });
}

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  displayProduct();
}

function editProduct(index) {
  let product = products[index];
  prodName.value = product.name;
  prodPrice.value = product.price;
  prodDesc.value = product.desc;

  editIndex = index;
  clearAllErrors();
  document.getElementById("saveBtn").textContent = "Save Update";
  document.getElementById("cancelBtn").style.display = "inline-block";
}

function cancelEdit() {
  editIndex = -1;
  clear();
  clearAllErrors();
  document.getElementById("saveBtn").textContent = "Add Product";
  document.getElementById("cancelBtn").style.display = "none";
}

function clear() {
  prodName.value = "";
  prodPrice.value = "";
  prodDesc.value = "";
}
