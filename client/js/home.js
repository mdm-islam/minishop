document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("featured-products");
  
    try {
      const res = await fetch("/api/products");
      const products = await res.json();
  
      const featured = products.slice(0, 4); // pick first 4 as featured
  
      featured.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-4";
        col.innerHTML = `
          <div class="card product-card text-center h-100 shadow-sm">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text">$${p.price.toFixed(2)}</p>
              <button class="btn btn-primary add-to-cart-btn mb-2" data-name="${p.name}" data-price="${p.price}">
                Add to Cart
              </button>
              <a href="product-details.html?id=${p.id}" class="btn btn-outline-secondary details-btn">View Details</a>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
  
      document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
          const name = button.dataset.name;
          const price = parseFloat(button.dataset.price);
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
          const item = cart.find(p => p.name === name);
          if (item) {
            item.quantity += 1;
          } else {
            cart.push({ name, price, quantity: 1 });
          }
  
          localStorage.setItem('cart', JSON.stringify(cart));
          alert(`${name} added to cart!`);
        });
      });
  
    } catch (err) {
      console.error("Failed to load featured products:", err);
      container.innerHTML = "<p class='text-danger'>Unable to load featured products.</p>";
    }
  });
  