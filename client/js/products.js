document.addEventListener("DOMContentLoaded", async () => {
    updateCartCount();
    const container = document.getElementById("product-container");
  
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
  
      if (!res.ok || !Array.isArray(data)) {
        console.error("❌ API Error:", data.error || data);
        container.innerHTML = `<p class="text-danger">Unable to load products. Please try again later.</p>`;
        return;
      }
  
      const products = data;
      const categories = {};
  
      products.forEach(p => {
        const cat = p.category || "Other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(p);
      });
  
      for (const category in categories) {
        const section = document.createElement("section");
        section.className = "container my-5";
        section.innerHTML = `<h3 class="mb-4">${category}</h3><div class="row"></div>`;
        const row = section.querySelector(".row");
  
        categories[category].forEach(product => {
          const col = document.createElement("div");
          col.className = "col-md-3 mb-4";
          col.innerHTML = `
            <div class="card product-card h-100 shadow-sm">
              <img src="${product.image}" class="card-img-top" alt="${product.name}">
              <div class="card-body text-center">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">$${product.price.toFixed(2)}</p>
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-primary add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                  <a href="product-details.html?id=${product.id}" class="btn btn-outline-secondary">Details</a>
                </div>
              </div>
            </div>
          `;
          row.appendChild(col);
        });
  
        container.appendChild(section);
      }
  
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
          const name = button.dataset.name;
          const price = parseFloat(button.dataset.price);
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          const existing = cart.find(item => item.name === name);
          if (existing) {
            existing.quantity += 1;
          } else {
            cart.push({ name, price, quantity: 1 });
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartCount();
          alert(`${name} added to cart!`);
        });
      });
  
    } catch (err) {
      console.error("Failed to fetch products:", err);
      container.innerHTML = "<p class='text-danger'>Unable to load products due to a network error.</p>";
    }
  });
  
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
  }
  