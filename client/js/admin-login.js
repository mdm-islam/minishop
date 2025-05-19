// ✅ Handle admin login form submission
document.getElementById('adminLoginForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent default form submission

  // ✅ Get user input
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    // ✅ Send login request to backend
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    // ✅ Parse response JSON
    const data = await res.json();

    // ✅ If login is successful, store token and redirect
    if (res.ok) {
      localStorage.setItem('admin_token', data.token);
      window.location.href = 'admin-dashboard.html';
    } else {
      // ❌ Show error if credentials are invalid
      document.getElementById('loginError').classList.remove('d-none');
    }
  } catch (err) {
    // ❌ Show error if request fails
    console.error('Login error:', err);
    document.getElementById('loginError').classList.remove('d-none');
  }
});
