// ✅ Import required utilities
import { checkAdminLogin, showToast } from './utils.js';

// ✅ Check if admin is logged in
checkAdminLogin();

// ✅ Tab Switching Logic
// Dynamically show/hide tab sections based on clicked sidebar button
const sections = {
  products: document.getElementById('products-section'),
  orders: document.getElementById('orders-section'),
  stats: document.getElementById('stats-section'),
  "product-list": document.getElementById('product-list-section'),
  settings: document.getElementById('settings-section'),
  maintenance: document.getElementById('maintenance-section')
};

document.querySelectorAll('.sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    Object.entries(sections).forEach(([key, section]) => {
      if (section) section.classList.add('d-none');
    });

    if (sections[tab]) sections[tab].classList.remove('d-none');
    if (tab === 'product-list') loadProductListTable();
  });
});

// ✅ DOM Elements
const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const orderTableBody = document.getElementById('orders-body');
const statsBox = document.getElementById('stats-cards');
const productListTable = document.getElementById('product-list-table');

// ✅ Handle Product Form Submission (Add Product)
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('product-name').value;
  const price = document.getElementById('product-price').value;
  const category = document.getElementById('product-category').value;
  const description = document.getElementById('product-description').value;
  const stock = document.getElementById('product-stock').value;
  const imageFile = document.getElementById('product-image').files[0];

  const imageForm = new FormData();
  imageForm.append('image', imageFile);

  const uploadRes = await fetch('/api/admin/upload', {
    method: 'POST',
    body: imageForm
  });
  const imgData = await uploadRes.json();
  if (!uploadRes.ok) return showToast(imgData.error || 'Upload failed', 'danger');

  const product = { name, price, category, image: imgData.image_url, description, stock };

  const saveRes = await fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

  const saveData = await saveRes.json();
  if (saveRes.ok) {
    showToast('✅ Product added', 'success');
    form.reset();
    loadProducts();
    loadProductListTable();
  } else {
    showToast(saveData.error || 'Failed to save product', 'danger');
  }
});

// ✅ Load Products to Product Card Section
async function loadProducts() {
  productList.innerHTML = '';
  const res = await fetch('/api/admin/products');
  const data = await res.json();

  data.forEach(p => {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-4';
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${p.image_url}" class="card-img-top" alt="${p.name}">
        <div class="card-body text-center">
          <h5 class="card-title">${p.name}</h5>
          <p>$${p.price} | Stock: ${p.stock}</p>
          <p class="text-muted">${p.category}</p>
          <p>${p.description}</p>
          <button class="btn btn-sm btn-warning me-2 edit-btn" data-id="${p.id}">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${p.id}">Delete</button>
        </div>
      </div>`;
    productList.appendChild(card);
  });
}

// ✅ Handle Edit Button Click
productList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.dataset.id;
    const res = await fetch(`/api/admin/products`);
    const products = await res.json();
    const product = products.find(p => p.id == id);
    if (!product) return showToast("Product not found", "danger");

    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-stock').value = product.stock;

    form.setAttribute('data-editing-id', id);
    showToast("📝 Ready to edit. Make changes and click Save.", "info");
  }
});

// ✅ Handle Delete Button Click
productList.addEventListener('click', async e => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      showToast('🗑️ Product deleted', 'success');
      loadProducts();
      loadProductListTable();
    } else {
      showToast(data.error, 'danger');
    }
  }
});

// ✅ Load Customer Orders Table
async function loadOrders() {
  orderTableBody.innerHTML = '';
  const res = await fetch('/api/admin/orders');
  const orders = await res.json();

  orders.forEach(o => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.email}</td>
      <td>$${o.total}</td>
      <td>
        <select data-id="${o.id}" class="form-select form-select-sm status-select">
          <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>`;
    orderTableBody.appendChild(row);
  });
}

// ✅ Handle Order Status Change
orderTableBody.addEventListener('change', async e => {
  if (e.target.classList.contains('status-select')) {
    const id = e.target.dataset.id;
    const status = e.target.value;
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    showToast('📦 Order status updated');
  }
});

// ✅ Load Statistics Summary Cards
async function loadStats() {
  const res = await fetch('/api/admin/stats');
  const stats = await res.json();
  statsBox.innerHTML = `
    <div class="col-md-4">
      <div class="card text-bg-primary p-3">
        <h4>Total Orders</h4>
        <p>${stats.total_orders}</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-bg-success p-3">
        <h4>Total Sales</h4>
        <p>$${stats.total_sales.toFixed(2)}</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-bg-warning p-3">
        <h4>New Customers</h4>
        <p>${stats.new_customers}</p>
      </div>
    </div>`;
}

// ✅ Load Product List Table View
async function loadProductListTable() {
  const res = await fetch('/api/admin/products');
  const data = await res.json();
  const container = document.getElementById('product-list-table');

  if (!res.ok) {
    container.innerHTML = '<p class="text-danger">Failed to load products.</p>';
    return;
  }

  let html = `
    <table class="table table-bordered table-striped">
      <thead>
        <tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Action</th></tr>
      </thead>
      <tbody>
  `;

  data.forEach(p => {
    html += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td>${p.category}</td>
        <td>${p.stock}</td>
        <td><button class="btn btn-sm btn-warning edit-btn" data-id="${p.id}">Edit</button></td>
      </tr>`;
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

// ✅ Logout and Clear Admin Session
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('admin_token');
  location.href = 'admin-login.html';
});

// ✅ Initial Load
loadProducts();
loadOrders();
loadStats();
