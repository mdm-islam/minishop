// 🔄 Extract product ID from URL first
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

if (!id || isNaN(id)) {
  document.getElementById('product-detail').innerHTML = '<p class="text-danger">Invalid product ID.</p>';
  throw new Error('Invalid product ID');
}

// ✅ Load Product Details
async function loadProductDetails() {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) {
      console.error('Product fetch failed:', await res.text());
      document.getElementById('product-detail').innerHTML = '<p class="text-danger">Product not found.</p>';
      return;
    }

    const p = await res.json();

    const stockBadge = p.stock > 0
      ? `<span class="stock-badge">In Stock: ${p.stock}</span>`
      : `<span class="stock-badge out-of-stock">Out of Stock</span>`;

    document.getElementById('product-detail').innerHTML = `
      <div class="col-md-6">
        <img src="${p.image}" alt="${p.name}" class="product-image"/>
      </div>
      <div class="col-md-6">
        <h1 class="product-name">${p.name}</h1>
        <div class="product-category">${p.category}</div>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <div class="product-description">${p.description}</div>
        ${stockBadge}
        <br/>
        <button class="btn btn-primary btn-cart mt-3" onclick="addToCart('${p.name}', ${p.price})" ${p.stock <= 0 ? 'disabled' : ''}>
          <i class="bi bi-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  } catch (error) {
    console.error("❌ Failed to load product details:", error);
    document.getElementById('product-detail').innerHTML = '<p class="text-danger">An error occurred while loading product.</p>';
  }
}

// 🛒 Add to Cart Handler
function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${name} added to cart!`);
}

// 🧠 Load Reviews
async function loadReviews() {
  try {
    const res = await fetch(`/api/products/${id}/reviews`);
    if (!res.ok) {
      console.warn("Reviews not available:", await res.text());
      document.getElementById('reviews-list').innerHTML = '<p class="text-muted">Reviews not available.</p>';
      return;
    }

    const reviews = await res.json();
    const list = document.getElementById('reviews-list');
    list.innerHTML = reviews.length
      ? reviews.map(r => `
          <div class="border-bottom pb-2 mb-3">
            <strong>${r.user}</strong>
            <small class="text-muted float-end">${r.date}</small><br/>
            <span>${r.comment}</span>
          </div>
        `).join('')
      : `<p class="text-muted">No reviews yet. Be the first to write one!</p>`;
  } catch (error) {
    console.error("❌ Failed to load reviews:", error);
    document.getElementById('reviews-list').innerHTML = '<p class="text-danger">Error loading reviews.</p>';
  }
}

// ✍️ Submit New Review
document.getElementById('review-form').addEventListener('submit', async e => {
  e.preventDefault();
  const user = document.getElementById('review-user').value.trim();
  const comment = document.getElementById('review-text').value.trim();
  if (!user || !comment) return;

  const res = await fetch(`/api/products/${id}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, comment })
  });

  if (res.ok) {
    document.getElementById('review-user').value = '';
    document.getElementById('review-text').value = '';
    loadReviews();
  } else {
    alert("❌ Failed to submit review.");
  }
});

// 🔄 Suggested Products
async function loadSuggestions(currentId) {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    const filtered = products.filter(p => p.id != currentId).slice(0, 3);
    const container = document.getElementById('suggested-products');

    container.innerHTML = filtered.map(p => `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${p.image}" class="card-img-top" alt="${p.name}" />
          <div class="card-body text-center">
            <h5>${p.name}</h5>
            <p class="text-success">$${p.price.toFixed(2)}</p>
            <a href="product-details.html?id=${p.id}" class="btn btn-outline-secondary">View</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("❌ Failed to load suggestions:", error);
  }
}

// ✅ Init
loadProductDetails().then(() => {
  loadSuggestions(id);
  loadReviews();
});
