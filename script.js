// ZAYQORA KITCHEN - ORDER SYSTEM

const products = {
  shami: {
    name: "Shami Kabab",
    prices: { "500g": 650, "1kg": 1200 }
  },
  koftay: {
    name: "Premium Koftay",
    prices: { "500g": 700, "1kg": 1300 }
  },
  seekh: {
    name: "Seekh Kabab",
    prices: { "500g": 750, "1kg": 1400 }
  },
  "chicken-roll": {
    name: "Chicken Roll",
    prices: { "500g": 600, "1kg": 1100 }
  },
  "chicken-samosa": {
    name: "Chicken Samosa",
    prices: { "500g": 550, "1kg": 1000 }
  },
  "vegetable-roll": {
    name: "Vegetable Roll",
    prices: { "500g": 450, "1kg": 850 }
  },
  "vegetable-samosa": {
    name: "Vegetable Samosa",
    prices: { "500g": 400, "1kg": 750 }
  }
};

const whatsappNumber = "923127433874";
const orderModal = document.getElementById("orderModal");
const selectedProductArea = document.getElementById("selectedProductArea");
const cartItems = document.getElementById("cartItems");
const orderTotal = document.getElementById("orderTotal");

let cart = [];
let selectedProduct = "shami";

// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

// Open order window
function openOrder(productId) {
  selectedProduct = productId;
  orderModal.classList.add("show");
  orderModal.setAttribute("aria-hidden", "false");
  showProductSelector();
}

document.querySelectorAll(".product-btn[data-product]").forEach(button => {
  button.addEventListener("click", () => {
    openOrder(button.dataset.product);
  });
});

// Product and package selection
function showProductSelector() {
  const options = Object.keys(products).map(id => {
    return `<option value="${id}" ${id === selectedProduct ? "selected" : ""}>
      ${products[id].name}
    </option>`;
  }).join("");

  selectedProductArea.innerHTML = `
    <label for="productSelect">Select Product</label>
    <select id="productSelect">${options}</select>

    <label for="packageSelect">Select Package</label>
    <select id="packageSelect">
      <option value="500g">500g - Rs. ${products[selectedProduct].prices["500g"]}</option>
      <option value="1kg">1kg - Rs. ${products[selectedProduct].prices["1kg"]}</option>
    </select>

    <label for="productQuantity">Quantity</label>
    <input type="number" id="productQuantity" min="1" max="50" value="1">

    <button type="button" id="addToCart" class="primary-btn">
      Add to Order
    </button>
  `;

  document.getElementById("productSelect").addEventListener("change", event => {
    selectedProduct = event.target.value;
    showProductSelector();
  });

  document.getElementById("addToCart").addEventListener("click", addToCart);
}

// Add product to cart
function addToCart() {
  const productId = document.getElementById("productSelect").value;
  const packageSize = document.getElementById("packageSelect").value;
  const quantity = Number(document.getElementById("productQuantity").value);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    alert("Please enter a quantity between 1 and 50.");
    return;
  }

  const existingItem = cart.find(item =>
    item.productId === productId && item.packageSize === packageSize
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, packageSize, quantity });
  }

  renderCart();
  alert("Product added to your order!");
}

// Display cart and calculate total
function renderCart() {
  let total = 0;

  cartItems.innerHTML = cart.map((item, index) => {
    const product = products[item.productId];
    const price = product.prices[item.packageSize];
    const subtotal = price * item.quantity;

    total += subtotal;

    return `
      <div class="cart-item">
        <strong>${product.name}</strong>
        <p>${item.packageSize} × ${item.quantity}</p>
        <p>Rs. ${subtotal.toLocaleString("en-PK")}</p>
        <button type="button" class="remove-item" data-index="${index}">
          Remove
        </button>
      </div>
    `;
  }).join("");

  orderTotal.textContent = total.toLocaleString("en-PK");

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.index), 1);
      renderCart();
    });
  });
}

// Add another product
document.getElementById("addAnotherProduct").addEventListener("click", () => {
  showProductSelector();
  selectedProductArea.scrollIntoView({ behavior: "smooth" });
});

// Close order window
document.getElementById("closeModal").addEventListener("click", closeOrder);

function closeOrder() {
  orderModal.classList.remove("show");
  orderModal.setAttribute("aria-hidden", "true");
}

orderModal.addEventListener("click", event => {
  if (event.target === orderModal) closeOrder();
});

// Send order to WhatsApp
document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Please add at least one product to your order.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !phone || !address) {
    alert("Please complete all delivery details.");
    return;
  }

  let total = 0;

  let message = `Assalamualaikum ZAYQORA Kitchen!\n\n`;
  message += `*NEW ORDER*\n\n`;
  message += `Customer: ${name}\n`;
  message += `Mobile: ${phone}\n`;
  message += `Address: ${address}\n\n`;
  message += `*ORDER DETAILS*\n`;

  cart.forEach((item, index) => {
    const product = products[item.productId];
    const price = product.prices[item.packageSize];
    const subtotal = price * item.quantity;

    total += subtotal;

    message += `\n${index + 1}. ${product.name}\n`;
    message += `Package: ${item.packageSize}\n`;
    message += `Quantity: ${item.quantity}\n`;
    message += `Price: Rs. ${price}\n`;
    message += `Subtotal: Rs. ${subtotal}\n`;
  });

  message += `\n*TOTAL BILL: Rs. ${total.toLocaleString("en-PK")}*`;
  message += `\n\nPlease confirm my order. Thank you!`;

  const whatsappURL =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");
});
