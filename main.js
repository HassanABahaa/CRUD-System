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

function getProduct() {
  let name = prodName.value.trim();
  let price = prodPrice.value.trim();
  let desc = prodDesc.value.trim();

  if (!name || !price) return alert("Please enter name and price!");

  let product = { name, price, desc };

  if (editIndex === -1) {
    products.push(product);
  } else {
    products[editIndex] = product;
    editIndex = -1;
    document.querySelector("button").textContent = "Add Product";
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
  document.querySelector("button").textContent = "Save Update";
}

function clear() {
  prodName.value = "";
  prodPrice.value = "";
  prodDesc.value = "";
}
