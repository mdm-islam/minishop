// 🔄 Update the cart count badge in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = total;
  }
  
  // 📦 Render cart items in the table
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
  
    if (cart.length === 0) {
      cartItems.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
      cartTotal.textContent = "0.00";
      showToast('Your cart is now empty', 'bg-warning');
      return;
    }
  
    let total = 0;
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Remove</button>
        </td>
      `;
      cartItems.appendChild(row);
    });
  
    cartTotal.textContent = total.toFixed(2);
  }
  
  // ❌ Remove item from cart by index
  function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const removedItem = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
    showToast(`${removedItem.name} removed from cart`, 'bg-danger');
  
    if (cart.length === 0) {
      showToast('Your cart is now empty', 'bg-warning');
    }
  }
  
  // 🔔 Show toast notification with custom message & color
  function showToast(message, bg = 'bg-success') {
    const toastEl = document.getElementById('toast-alert');
    const toastMsg = document.getElementById('toast-message');
  
    toastEl.className = `toast align-items-center text-white ${bg} border-0`;
    toastMsg.textContent = message;
  
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
  
  // 🚀 Initialize cart on page load
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCount();
  });
  