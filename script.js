// Sample data
const products = [
  {
    id: 'p1',
    name: 'LogiTech MX Master 3 Mouse',
    brand: 'LogiTech',
    type: 'Chargers',
    price: 99.99,
    desc: 'Premium wireless mouse with ergonomic design and multi-device connectivity.',
    image: 'assets/mouse.jpg'
  },
  {
    id: 'p2',
    name: 'Anker 65W USB-C GaN Charger',
    brand: 'Anker',
    type: 'Chargers',
    price: 39.99,
    desc: 'Powerful USB-C charger with compact design and GaN tech.',
    image: 'assets/charger.jpg'
  },
  {
    id: 'p3',
    name: 'Samsung Galaxy Buds Pro',
    brand: 'Samsung',
    type: 'Headphones',
    price: 149.99,
    desc: 'Immersive sound with ANC and comfortable fit.',
    image: 'assets/earbuds.jpg'
  },
  {
    id: 'p4',
    name: 'Apple USB-C to USB-C Cable (2m)',
    brand: 'Apple',
    type: 'USB-C Hubs',
    price: 19.99,
    desc: 'High-quality USB-C to USB-C cable, 2 meters.',
    image: 'assets/cable.jpg'
  },
  // Add more products as needed
];

// DOM elements
const productGrid = document.getElementById('products');
const searchInput = document.getElementById('search');
const brandFilter = document.getElementById('brandFilter');
const typeFilter = document.getElementById('typeFilter');
const clearFiltersBtn = document.getElementById('clearFilters');

const cartDrawer = document.getElementById('cartDrawer');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const subtotalDisplay = document.getElementById('subtotalDisplay');

const productCardTemplate = document.getElementById('productCardTemplate');
const productModalTemplate = document.getElementById('productModalTemplate');

// Simple cart state
let cart = [];

// Render product cards
function renderProducts(list) {
  productGrid.innerHTML = '';
  list.forEach(p => {
    const clone = productCardTemplate.content.cloneNode(true);
    const card = clone.querySelector('.card');
    card.dataset.id = p.id;
    const img = clone.querySelector('img');
    const title = clone.querySelector('.card-title');
    const desc = clone.querySelector('.card-desc');
    const price = clone.querySelector('.price');
    const addBtn = clone.querySelector('.btn-add');

    img.src = p.image;
    img.alt = p.name;
    title.textContent = p.name;
    desc.textContent = p.desc;
    price.textContent = `$${p.price.toFixed(2)}`;

    // Bind events
    addBtn.addEventListener('click', () => addToCart(p));
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add')) return;
      openProductModal(p);
    });

    productGrid.appendChild(clone);
  });
}

// Open product detail modal
function openProductModal(p) {
  const tpl = productModalTemplate.content.cloneNode(true);
  const overlay = tpl.querySelector('.modal-overlay');
  const modal = tpl.querySelector('.modal');
  const img = tpl.querySelector('.modal-media img');
  const title = tpl.querySelector('.modal-title');
  const desc = tpl.querySelector('.modal-desc');
  const price = tpl.querySelector('.modal-price');
  const closeBtn = tpl.querySelector('.modal-close');
  const addBtn = tpl.querySelector('#modalAdd');

  img.src = p.image;
  img.alt = p.name;
  title.textContent = p.name;
  desc.textContent = p.desc;
  price.textContent = `$${p.price.toFixed(2)}`;

  // actions
  closeBtn.addEventListener('click', () => document.body.removeChild(overlay.parentElement));
  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) document.body.removeChild(overlay.parentElement);
  });
  addBtn.addEventListener('click', () => {
    addToCart(p);
    document.body.removeChild(overlay.parentElement);
  });

  document.body.appendChild(overlay.parentElement);
  // simple fade-in
  requestAnimationFrame(() => overlay.parentElement.classList.add('open'));
}

// Add to cart
function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });
  renderCart();
}

// Render cart
function renderCart() {
  cartItemsEl.innerHTML = '';
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    subtotalDisplay.textContent = '$0.00';
    return;
  }
  cart.forEach(ci => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${ci.image}" alt="${ci.name}">
      <div class="cart-item-info" style="flex:1;">
        <div class="cart-item-name">${ci.name}</div>
        <div>Price: $${ci.price.toFixed(2)} • Qty: ${ci.qty}</div>
      </div>
      <div class="cart-item-qty">
        <button class="btn-secondary" data-id="${ci.id}" data-action="dec">-</button>
        <span>${ci.qty}</span>
        <button class="btn-secondary" data-id="${ci.id}" data-action="inc">+</button>
      </div>
    `;
    // bind qty buttons
    const buttons = div.querySelectorAll('button[data-id]');
    buttons.forEach(b => b.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const act = e.currentTarget.dataset.action;
      const item = cart.find(x => x.id === id);
      if (!item) return;
      if (act === 'inc') item.qty += 1;
      if (act === 'dec') {
        item.qty -= 1;
        if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
      }
      renderCart();
    }));
    cartItemsEl.appendChild(div);
  });
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
}

// Filter helpers
function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const brand = brandFilter.value;
  const type = typeFilter.value;

  const filtered = products.filter(p => {
    const matchesQuery = !query || [p.name, p.desc, p.brand].join(' ').toLowerCase().includes(query);
    const matchesBrand = !brand || p.brand === brand;
    const matchesType = !type || p.type === type;
    return matchesQuery && matchesBrand && matchesType;
  });
  renderProducts(filtered);
}

// Init
function init() {
  renderProducts(products);
  renderCart();

  searchInput.addEventListener('input', applyFilters);
  brandFilter.addEventListener('change', applyFilters);
  typeFilter.addEventListener('change', applyFilters);
  clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    brandFilter.value = '';
    typeFilter.value = '';
    applyFilters();
  });

  openCartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
  closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));
  // allow clicking outside to close (optional)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cartDrawer.classList.remove('open');
  });

  // Contact form (basic demo)
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    alert(`Thanks, ${name}! Your message has been received. We will contact you at ${email}.`);
    contactForm.reset();
  });
}

document.addEventListener('DOMContentLoaded', init);
