function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = total;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
  
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
        const item = cart.find(p => p.name === name);
        if (item) {
          item.quantity += 1;
        } else {
          cart.push({ name, price, quantity: 1 });
        }
  
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
      });
    });
  });
  