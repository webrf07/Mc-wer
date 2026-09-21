/* ========== MENU DATA ========== */
const MENU = {
  food: [
    {
      id: "f1",
      name: "Classic Burger",
      price: 4.99,
      desc: "Juicy beef patty with fresh lettuce & tomato",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop",
      hasAddons: true
    },
    {
      id: "f2",
      name: "Pepperoni Pizza",
      price: 5.99,
      desc: "Loaded with pepperoni & melted mozzarella",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop",
      hasAddons: true
    },
    {
      id: "f3",
      name: "Beef Taco",
      price: 3.99,
      desc: "Seasoned beef, salsa & cheese in soft tortilla",
      img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=400&fit=crop",
      hasAddons: true
    },
    {
      id: "f4",
      name: "Crispy Fries",
      price: 2.99,
      desc: "Golden crispy french fries",
      img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&h=400&fit=crop",
      hasAddons: true
    },
    {
      id: "f5",
      name: "Chicken Burger",
      price: 4.79,
      desc: "Crispy chicken fillet with special sauce",
      img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=400&fit=crop",
      hasAddons: true
    },
    {
      id: "f6",
      name: "Cheese Pizza",
      price: 5.49,
      desc: "Classic cheese pizza with rich tomato sauce",
      img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d264?w=500&h=400&fit=crop",
      hasAddons: true
    }
  ],
  drinks: [
    {
      id: "d1",
      name: "Cola",
      price: 1.99,
      desc: "Chilled classic cola",
      img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&h=400&fit=crop",
      hasAddons: false
    },
    {
      id: "d2",
      name: "Orange Juice",
      price: 2.49,
      desc: "Fresh squeezed orange juice",
      img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&h=400&fit=crop",
      hasAddons: false
    },
    {
      id: "d3",
      name: "Iced Tea",
      price: 2.29,
      desc: "Refreshing iced tea with lemon",
      img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=400&fit=crop",
      hasAddons: false
    },
    {
      id: "d4",
      name: "Milkshake",
      price: 3.99,
      desc: "Creamy vanilla milkshake",
      img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&h=400&fit=crop",
      hasAddons: false
    },
    {
      id: "d5",
      name: "Sparkling Water",
      price: 1.49,
      desc: "Refreshing sparkling water",
      img: "https://images.unsplash.com/photo-1523362628745-0c25248f4540?w=500&h=400&fit=crop",
      hasAddons: false
    }
  ],
  desserts: [
    {
      id: "s1",
      name: "Vanilla Ice Cream",
      price: 3.49,
      desc: "Creamy vanilla ice cream",
      img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=400&fit=crop",
      hasAddons: false,
      hasToppings: true
    },
    {
      id: "s2",
      name: "Chocolate Sundae",
      price: 4.29,
      desc: "Rich chocolate sundae with whipped cream",
      img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=400&fit=crop",
      hasAddons: false,
      hasToppings: true
    },
    {
      id: "s3",
      name: "Brownie",
      price: 3.99,
      desc: "Warm chocolate brownie",
      img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=400&fit=crop",
      hasAddons: false,
      hasToppings: false
    },
    {
      id: "s4",
      name: "Strawberry Ice Cream",
      price: 3.79,
      desc: "Fresh strawberry ice cream",
      img: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&h=400&fit=crop",
      hasAddons: false,
      hasToppings: true
    }
  ]
};

const SIZE_PRICES = { L: 0, XL: 0.70, XXL: 1.40 };
const ADDON_PRICE = 0.40;
const TOPPING_PRICE = 0.60;

/* ========== CART HELPERS ========== */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("mcwer_cart")) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("mcwer_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function addToCart(item) {
  const cart = getCart();
  const key = `${item.id}-${item.size || ""}-${(item.addons || []).sort().join(",")}-${(item.toppings || []).sort().join(",")}`;
  const existing = cart.find(c => c.key === key);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, key, qty: 1 });
  }
  saveCart(cart);
  showToast(`${item.name} added to cart!`);
}

function removeFromCart(key) {
  let cart = getCart().filter(i => i.key !== key);
  saveCart(cart);
  if (typeof renderCart === "function") renderCart();
}

function changeQty(key, delta) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(key);
  } else {
    saveCart(cart);
    if (typeof renderCart === "function") renderCart();
  }
}

function clearCart() {
  localStorage.removeItem("mcwer_cart");
  updateCartCount();
}

/* ========== TOAST ========== */
function showToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ========== PRODUCT PAGE ========== */
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat") || "food";
}

function renderProducts() {
  const cat = getCategoryFromURL();
  const items = MENU[cat] || [];
  const titles = { food: "Food Menu", drinks: "Drinks", desserts: "Desserts & Sweets" };

  const titleEl = document.getElementById("sectionTitle");
  if (titleEl) titleEl.textContent = titles[cat] || "Menu";

  const grid = document.getElementById("itemsGrid");
  if (!grid) return;

  grid.innerHTML = items.map(item => `
    <div class="item-card" onclick="openModal('${item.id}', '${cat}')">
      <img src="${item.img}" alt="${item.name}" loading="lazy">
      <div class="item-info">
        <h3>${item.name}</h3>
        <div class="price">$${item.price.toFixed(2)}</div>
        <div class="desc">${item.desc}</div>
      </div>
    </div>
  `).join("");
}

/* ========== MODAL ========== */
let currentItem = null;
let currentCat = null;
let selectedSize = "L";
let selectedAddons = [];
let selectedToppings = [];

function openModal(id, cat) {
  currentCat = cat;
  currentItem = (MENU[cat] || []).find(i => i.id === id);
  if (!currentItem) return;

  selectedSize = "L";
  selectedAddons = [];
  selectedToppings = [];

  const modal = document.getElementById("productModal");
  if (!modal) return;

  document.getElementById("modalImg").src = currentItem.img;
  document.getElementById("modalName").textContent = currentItem.name;
  document.getElementById("modalDesc").textContent = currentItem.desc;
  document.getElementById("modalBasePrice").textContent = `Base: $${currentItem.price.toFixed(2)}`;

  // Size options (only for food)
  const sizeGroup = document.getElementById("sizeGroup");
  if (cat === "food") {
    sizeGroup.style.display = "block";
    document.querySelectorAll(".size-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.size === "L");
    });
  } else {
    sizeGroup.style.display = "none";
  }

  // Addons (ketchup, mayo, mustard) for food
  const addonGroup = document.getElementById("addonGroup");
  if (currentItem.hasAddons) {
    addonGroup.style.display = "block";
    document.querySelectorAll(".addon-check").forEach(cb => {
      cb.checked = false;
    });
  } else {
    addonGroup.style.display = "none";
  }

  // Toppings (chocolate, nuts) for desserts
  const toppingGroup = document.getElementById("toppingGroup");
  if (currentItem.hasToppings) {
    toppingGroup.style.display = "block";
    document.querySelectorAll(".topping-check").forEach(cb => {
      cb.checked = false;
    });
  } else {
    toppingGroup.style.display = "none";
  }

  updateModalPrice();
  modal.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("productModal");
  if (modal) modal.classList.remove("active");
}

function selectSize(size) {
  selectedSize = size;
  document.querySelectorAll(".size-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.size === size);
  });
  updateModalPrice();
}

function toggleAddon(name, checked) {
  if (checked) {
    if (!selectedAddons.includes(name)) selectedAddons.push(name);
  } else {
    selectedAddons = selectedAddons.filter(a => a !== name);
  }
  updateModalPrice();
}

function toggleTopping(name, checked) {
  if (checked) {
    if (!selectedToppings.includes(name)) selectedToppings.push(name);
  } else {
    selectedToppings = selectedToppings.filter(t => t !== name);
  }
  updateModalPrice();
}

function calcPrice() {
  if (!currentItem) return 0;
  let price = currentItem.price;
  if (currentCat === "food") {
    price += SIZE_PRICES[selectedSize] || 0;
    price += selectedAddons.length * ADDON_PRICE;
  }
  if (currentItem.hasToppings) {
    price += selectedToppings.length * TOPPING_PRICE;
  }
  return Math.min(price, 6.00); // never exceed $6
}

function updateModalPrice() {
  const el = document.getElementById("modalTotal");
  if (el) el.textContent = `$${calcPrice().toFixed(2)}`;
}

function handleAddToCart() {
  if (!currentItem) return;
  const finalPrice = calcPrice();
  addToCart({
    id: currentItem.id,
    name: currentItem.name,
    img: currentItem.img,
    size: currentCat === "food" ? selectedSize : null,
    addons: [...selectedAddons],
    toppings: [...selectedToppings],
    price: finalPrice
  });
  closeModal();
}

/* ========== CART PAGE ========== */
function renderCart() {
  const container = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  const empty = document.getElementById("cartEmpty");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = "";
    if (summary) summary.style.display = "none";
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";
  if (summary) summary.style.display = "block";

  container.innerHTML = cart.map(item => {
    const extras = [];
    if (item.size) extras.push(`Size: ${item.size}`);
    if (item.addons && item.addons.length) extras.push(item.addons.join(", "));
    if (item.toppings && item.toppings.length) extras.push(item.toppings.join(", "));

    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <div class="details">${extras.join(" • ") || "Standard"}</div>
          <div class="item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.key}', -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.key}', 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.key}')" title="Remove">✕</button>
      </div>
    `;
  }).join("");

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const subEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");
  if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

function placeOrder() {
  const cart = getCart();
  if (cart.length === 0) return;

  const address = document.getElementById("addressInput")?.value.trim();
  if (!address) {
    showToast("Please enter your delivery address");
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  showToast(`Order placed! Total: $${total.toFixed(2)}`);
  clearCart();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1800);
}

/* ========== INIT ========== */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Product page
  if (document.getElementById("itemsGrid")) {
    renderProducts();
  }

  // Cart page
  if (document.getElementById("cartItems")) {
    renderCart();
  }

  // Close modal on overlay click
  const overlay = document.getElementById("productModal");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }
});