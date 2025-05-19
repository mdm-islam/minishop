// ✅ Update cart count in the navbar
export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = total;
  }
}

// ✅ Show toast notification (Bootstrap 5)
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.style.position = 'fixed';
  toast.style.bottom = '1rem';
  toast.style.right = '1rem';
  toast.style.zIndex = '1055';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  document.body.appendChild(toast);

  // 🟡 Initialize Bootstrap Toast
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  // 🧹 Clean up toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ✅ Check admin token with optional redirect
export function checkAdminLogin(redirectTo = 'admin-login.html') {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = redirectTo;
  }
}
