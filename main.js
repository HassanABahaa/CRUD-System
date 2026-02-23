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

// ============ Validation ============

function showError(id, message) {
  let el = document.getElementById(id);
  el.textContent = message;
  el.style.display = "block";
}

function hideError(id) {
  let el = document.getElementById(id);
  el.textContent = "";
  el.style.display = "none";
}

function validateInputs(name, price, desc) {
  let isValid = true;

  // Name validation
  if (!name) {
    showError("nameError", "Product name is required.");
    isValid = false;
  } else if (name.length < 3) {
    showError("nameError", "Name must be at least 3 characters.");
    isValid = false;
  } else if (name.length > 30) {
    showError("nameError", "Name must be less than 30 characters.");
    isValid = false;
  } else if (/[^a-zA-Z\u0600-\u06FF\s]/.test(name)) {
    showError("nameError", "Name must not contain numbers or symbols.");
    isValid = false;
  } else {
    hideError("nameError");
  }

  // Price validation
  if (!price) {
    showError("priceError", "Product price is required.");
    isValid = false;
  } else if (isNaN(price) || Number(price) <= 0) {
    showError("priceError", "Price must be a number greater than 0.");
    isValid = false;
  } else {
    hideError("priceError");
  }

  // Description validation (optional but if written must be 10-200 chars)
  if (desc && desc.length < 10) {
    showError("descError", "Description must be at least 10 characters.");
    isValid = false;
  } else if (desc && desc.length > 200) {
    showError("descError", "Description must be less than 200 characters.");
    isValid = false;
  } else {
    hideError("descError");
  }

  return isValid;
}

// ============ CRUD ============

function getProduct() {
  let name = prodName.value.trim();
  let price = prodPrice.value.trim();
  let desc = prodDesc.value.trim();

  if (editIndex !== -1) {
    if (!name && !price && !desc) {
      deleteProduct(editIndex);
      cancelEdit();
      return;
    }
  }

  if (!validateInputs(name, price, desc)) return;

  let product = { name, price, desc };

  if (editIndex === -1) {
    products.push(product);
  } else {
    products[editIndex] = product;
    cancelEdit();
    return;
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
  document.getElementById("saveBtn").textContent = "Save Update";
  document.getElementById("cancelBtn").style.display = "inline-block";
}

function cancelEdit() {
  editIndex = -1;
  document.getElementById("saveBtn").textContent = "Add Product";
  document.getElementById("cancelBtn").style.display = "none";
  hideError("nameError");
  hideError("priceError");
  hideError("descError");
  localStorage.setItem("products", JSON.stringify(products));
  displayProduct();
  clear();
}

function clear() {
  prodName.value = "";
  prodPrice.value = "";
  prodDesc.value = "";
}
