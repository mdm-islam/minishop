// ✅ Initialize Stripe
const stripe = Stripe("pk_test_51RL7STH4VW3hOF8RFDSkae6wgqyiO063TGcw75CPnUp5dUTYKCfewcyzFrqwWYxCtt19seE5A0RIqAcPUSBI4MwE00Uno55FkT");
const elements = stripe.elements();
const card = elements.create("card");
card.mount("#card-element");

// ✅ Handle Form Submission
const form = document.getElementById("payment-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 🧾 Collect User Input
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zip = document.getElementById("zip").value;
  const fullAddress = `${address}, ${city}, ${state} ${zip}`;

  // 🛒 Get Cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.length) {
    alert("Cart is empty.");
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    // 💳 Step 1: Create Payment Intent
    const paymentIntentRes = await fetch("http://localhost:5000/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount })
    });
    const { clientSecret } = await paymentIntentRes.json();

    // 💳 Step 2: Confirm Payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: fullName,
          email: email,
          phone: phone,
          address: {
            line1: address,
            city: city,
            state: state,
            postal_code: zip
          }
        }
      }
    });

    // ❌ If error from Stripe
    if (result.error) {
      document.getElementById("card-errors").textContent = result.error.message;
      return;
    }

    // ✅ Step 3: Handle success and send invoice
    if (result.paymentIntent.status === "succeeded") {
      const invoiceRes = await fetch("http://localhost:5000/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: fullName,
          email: email,
          address: fullAddress,
          items: cart,
          total_amount: totalAmount
        })
      });

      if (invoiceRes.ok) {
        sessionStorage.setItem("customer_name", fullName);
        sessionStorage.setItem("customer_email", email);
        localStorage.removeItem("cart");
        window.location.href = "success.html";
      } else {
        alert("Payment succeeded but invoice failed.");
      }
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong during checkout.");
  }
});
