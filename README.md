# 🛍️ MiniShop - E-commerce Web App

MiniShop is a full-stack e-commerce web application built with **HTML/CSS**, **Bootstrap**, **JavaScript**, **Python (Flask)**, and **PostgreSQL**. It supports customer orders, Stripe payments, email confirmations with PDF invoices, and an admin dashboard for product and order management.

---

## 🚀 Features

- ✅ Product listing by category
- ✅ Product details with reviews
- ✅ Shopping cart & checkout
- ✅ Stripe payment integration (Test Mode)
- ✅ PDF invoice generation
- ✅ Email confirmation with invoice attached
- ✅ Admin panel for:
  - Product CRUD operations (Create/Read/Update/Delete)
  - Inventory management (stock tracking)
  - Order tracking and status updates
  - Dashboard statistics
  - Action logs

---

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, Bootstrap, JavaScript
- **Backend**: Python, Flask
- **Database**: PostgreSQL
- **Payment**: Stripe API
- **PDF & Email**: ReportLab, smtplib
- **Hosting**: PythonAnywhere / Render (optional)

---

## 🧪 Test Stripe

To test the payment system, use the following Stripe test card:

- **Card Number**: `4242 4242 4242 4242`
- **Expiration**: Any future date (e.g. `12/34`)
- **CVC**: `123`
- **ZIP**: Any 5-digit ZIP code (e.g. `10001`)

This will simulate a successful payment using Stripe's test mode.

---

## 📦 Installation (Local Setup)

1. **Clone the repository**
   ```bash
   git clone https://github.com/mdm-islam/minishop.git
   cd minishop
