// ShopEase demo shopping cart: products are sample items and checkout is simulated.
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1299,
    rating: "4.4",
    reviews: 128,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Classic Wrist Watch",
    category: "Accessories",
    price: 899,
    rating: "4.2",
    reviews: 86,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Everyday Sneakers",
    category: "Footwear",
    price: 1599,
    rating: "4.5",
    reviews: 204,
    badge: "Top rated",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Travel Backpack",
    category: "Bags",
    price: 799,
    rating: "4.3",
    reviews: 67,
    badge: "Everyday pick",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 499,
    rating: "4.1",
    reviews: 53,
    badge: "Deal",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Reusable Water Bottle",
    category: "Lifestyle",
    price: 299,
    rating: "4.6",
    reviews: 145,
    badge: "Value pick",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"
  }
];

// Each cart entry contains a product's fields and a quantity.
let cart = [];
const rupees = amount => `₹${amount.toLocaleString("en-IN")}`;

const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const cartItemCount = document.getElementById("cart-item-count");
const clearCartButton = document.getElementById("clear-cart");
const checkoutMessage = document.getElementById("message");

function displayProducts() {
  productList.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.badge}</span>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="rating">★ ${product.rating}<span>(${product.reviews} reviews)</span></p>
        <div class="product-bottom">
          <span class="product-price">${rupees(product.price)}</span>
          <button class="add-button" type="button" data-add="${product.id}">＋ Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  checkoutMessage.textContent = "";
  displayCart();
}

function changeQuantity(id, change) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }
  checkoutMessage.textContent = "";
  displayCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  checkoutMessage.textContent = "";
  displayCart();
}

function clearCart() {
  cart = [];
  checkoutMessage.textContent = "";
  displayCart();
}

function calculateBill() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Demo rules: free delivery at ₹999 and 10% off at ₹1,500.
  const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 50;
  const discount = subtotal >= 1500 ? Math.round(subtotal * 0.10) : 0;
  const total = subtotal + delivery - discount;

  document.getElementById("subtotal").textContent = rupees(subtotal);
  document.getElementById("delivery").textContent = subtotal === 0 ? rupees(0) : delivery === 0 ? "FREE" : rupees(delivery);
  document.getElementById("discount").textContent = `−${rupees(discount)}`;
  document.getElementById("total-price").textContent = rupees(total);

  const note = document.getElementById("delivery-note");
  if (subtotal === 0) {
    note.textContent = "Add items to see your order total.";
  } else if (subtotal < 999) {
    note.textContent = `Add ${rupees(999 - subtotal)} more to unlock free delivery.`;
  } else if (subtotal < 1500) {
    note.textContent = "Great! Your delivery is free.";
  } else {
    note.textContent = "Great! Free delivery and 10% discount applied.";
  }
}

function displayCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
  cartItemCount.textContent = `(${totalQuantity} ${totalQuantity === 1 ? "item" : "items"})`;
  clearCartButton.hidden = cart.length === 0;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart">
        <span class="empty-icon" aria-hidden="true">🛍️</span>
        <strong>Your cart is empty</strong>
        <span>Explore the items above and add something you like.</span>
      </div>`;
  } else {
    cartList.innerHTML = cart.map(item => `
      <article class="cart-item">
        <img class="cart-thumb" src="${item.image}" alt="${item.name}">
        <div class="cart-product-info">
          <p class="cart-product-name">${item.name}</p>
          <p class="cart-unit-price">${rupees(item.price)} each</p>
          <button class="remove-button" type="button" data-remove="${item.id}">Remove</button>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control" aria-label="Quantity for ${item.name}">
            <button class="qty-button" type="button" data-change="-1" data-id="${item.id}" aria-label="Decrease ${item.name} quantity">−</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-button" type="button" data-change="1" data-id="${item.id}" aria-label="Increase ${item.name} quantity">＋</button>
          </div>
          <div class="cart-item-total">${rupees(item.price * item.quantity)}</div>
        </div>
      </article>
    `).join("");
  }

  calculateBill();
}

// Event delegation keeps all dynamically rendered buttons working.
productList.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

cartList.addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
    return;
  }

  const quantityButton = event.target.closest("[data-change]");
  if (quantityButton) {
    changeQuantity(Number(quantityButton.dataset.id), Number(quantityButton.dataset.change));
  }
});

clearCartButton.addEventListener("click", clearCart);

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    checkoutMessage.textContent = "Your cart is empty. Add a product before checkout.";
    return;
  }
  checkoutMessage.textContent = "Your demo order summary is ready. No real order or payment has been placed.";
});

displayProducts();
displayCart();
