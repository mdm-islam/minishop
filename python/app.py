
# MiniShop Invoice Generator with Admin API, Email & Static File Hosting

from flask import Flask, request, send_file, send_from_directory, jsonify
from flask_cors import CORS
from pathlib import Path
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor
from datetime import datetime, timedelta
import os, json, stripe, smtplib
from email.message import EmailMessage
from db import get_connection
from admin_api import admin_api
import os

# ✅ Initialize Flask App & Register Admin API
app = Flask(__name__)
CORS(app)
app.register_blueprint(admin_api)

# ✅ Stripe API Key Setup
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# ✅ Email Sending with PDF Invoice Attached
def send_email_with_invoice(to_email, pdf_path):
    msg = EmailMessage()
    msg['Subject'] = 'Your MiniShop Invoice'
    msg['From'] = os.getenv("EMAIL_USER")
    msg['To'] = to_email
    msg.set_content("Thank you for your order! Please find your invoice attached.")
    with open(pdf_path, 'rb') as f:
        msg.add_attachment(f.read(), maintype='application', subtype='pdf', filename=os.path.basename(pdf_path))
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp_email = os.getenv("EMAIL_USER")
            smtp_password = os.getenv("EMAIL_PASSWORD")
            smtp.login(smtp_email, smtp_password)
            smtp.send_message(msg)
            print("✅ Email sent successfully.")
    except Exception as e:
        print("❌ Email send failed:", e)


# ✅ Generate Styled PDF Invoice
def generate_styled_invoice(data):
    customer = data.get("customer_name", "Guest")
    email = data.get("email", "guest@example.com")
    phone = data.get("phone", "N/A")
    address = data.get("address", "No address")
    items = data.get("items", [])

    subtotal = sum(item['price'] * item['quantity'] for item in items)
    tax = round(subtotal * 0.08875, 2)
    shipping = 10.00
    total = round(subtotal + tax + shipping, 2)

    invoice_id = f"INV-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    order_id = f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    invoice_date = datetime.now().strftime('%Y-%m-%d')
    due_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')

    os.makedirs("invoices", exist_ok=True)
    filename = f"invoices/{invoice_id}.pdf"
    c = canvas.Canvas(filename, pagesize=LETTER)

    primary = HexColor("#1a73e8")
    light_gray = HexColor("#f1f3f4")

    c.setFillColor(primary)
    c.rect(0, 730, 612, 60, fill=1)
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor("white")
    c.drawString(50, 755, "MiniShop Invoice")

    c.setFont("Helvetica", 10)
    c.setFillColor("black")
    c.drawString(400, 755, "MiniShop Inc.")
    c.drawString(400, 740, "123 Market Street")
    c.drawString(400, 725, "New York, NY 10001")

    y = 700
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, f"Invoice #: {invoice_id}")
    c.setFont("Helvetica", 10)
    c.drawString(50, y - 15, f"Order ID: {order_id}")
    c.drawString(50, y - 30, f"Invoice Date: {invoice_date}")
    c.drawString(50, y - 45, f"Due Date: {due_date}")

    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y - 75, "Bill To:")
    c.setFont("Helvetica", 10)
    c.drawString(50, y - 90, customer)
    c.drawString(50, y - 105, email)
    c.drawString(50, y - 120, phone)
    c.drawString(50, y - 135, address)

    y = y - 165
    c.setFillColor(light_gray)
    c.rect(50, y, 500, 20, fill=1)
    c.setFillColor("black")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(52, y + 5, "Item")
    c.drawString(250, y + 5, "Qty")
    c.drawString(320, y + 5, "Price")
    c.drawString(400, y + 5, "Total")

    y -= 25
    c.setFont("Helvetica", 10)
    for item in items:
        c.drawString(52, y, item.get("name", "Item"))
        c.drawString(250, y, str(item.get("quantity", 1)))
        c.drawString(320, y, f"${item.get('price', 0):.2f}")
        c.drawString(400, y, f"${item['price'] * item['quantity']:.2f}")
        y -= 20

    c.setFont("Helvetica-Bold", 10)
    y -= 10
    c.drawString(320, y, "Subtotal:")
    c.drawString(400, y, f"${subtotal:.2f}")
    y -= 20
    c.drawString(320, y, "Tax:")
    c.drawString(400, y, f"${tax:.2f}")
    y -= 20
    c.drawString(320, y, "Shipping:")
    c.drawString(400, y, f"${shipping:.2f}")
    y -= 20
    c.setFillColor(primary)
    c.drawString(320, y, "Total:")
    c.drawString(400, y, f"${total:.2f}")

    c.setFillColor("black")
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(50, 80, "Thank you for shopping with MiniShop!")
    c.save()
    return filename

# ✅ Create Stripe PaymentIntent API
@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        data = request.json
        amount = int(data['amount'] * 100)
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            payment_method_types=["card"]
        )
        return {"clientSecret": intent['client_secret']}
    except Exception as e:
        return {"error": str(e)}, 500

# ✅ Handle Invoice Creation and Email Sending
@app.route('/api/invoice', methods=['POST'])
def create_invoice():
    data = request.json
    if not data:
        return {"error": "No data received"}, 400
    try:
        conn = get_connection()
        cur = conn.cursor()
        total = round(sum(item['price'] * item['quantity'] for item in data['items']) * 1.08875 + 10, 2)
        cur.execute("""
            INSERT INTO orders (customer_name, email, phone, address, items, total_amount)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data.get("customer_name"),
            data.get("email"),
            data.get("phone"),
            data.get("address"),
            json.dumps(data.get("items", [])),
            total
        ))
        conn.commit()
        cur.close(); conn.close()
    except Exception as e:
        print("❌ Order save failed:", e)

    pdf_path = generate_styled_invoice(data)
    send_email_with_invoice(data.get("email"), pdf_path)
    return send_file(pdf_path, as_attachment=True)

# ✅ Serve Frontend Static Files
@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_static(path):
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'client'))
    return send_from_directory(root_dir, path)

# ✅ Public API: Get All Products
@app.route('/api/products', methods=['GET'])
def get_products_public():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, name, price, category, image_url, description, stock FROM products ORDER BY id DESC")
        products = [{
            "id": row[0],
            "name": row[1],
            "price": float(row[2]),
            "category": row[3],
            "image": row[4],
            "description": row[5],
            "stock": row[6]
        } for row in cur.fetchall()]
        cur.close(); conn.close()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Public API: Get Product by ID
@app.route('/api/products/<int:id>', methods=['GET'])
def get_product_by_id(id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, name, price, category, image_url, description, stock FROM products WHERE id = %s", (id,))
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return jsonify({"error": "Product not found"}), 404
        return jsonify({
            "id": row[0],
            "name": row[1],
            "price": float(row[2]),
            "category": row[3],
            "image": row[4],
            "description": row[5],
            "stock": row[6]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Public API: Get Product Reviews
@app.route('/api/products/<int:product_id>/reviews', methods=['GET'])
def get_reviews(product_id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT user_name, comment, created_at
            FROM reviews
            WHERE product_id = %s
            ORDER BY created_at DESC
        """, (product_id,))
        reviews = [{"user": r[0], "comment": r[1], "date": r[2].strftime('%Y-%m-%d')} for r in cur.fetchall()]
        cur.close(); conn.close()
        return jsonify(reviews)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ✅ Public API: POST Product Review
@app.route('/api/products/<int:product_id>/reviews', methods=['POST'])
def post_review(product_id):
    data = request.get_json()
    user = data.get('user')
    comment = data.get('comment')

    if not user or not comment:
        return jsonify({"error": "Missing user or comment"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO reviews (product_id, user_name, comment)
            VALUES (%s, %s, %s)
        """, (product_id, user, comment))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "✅ Review submitted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Run Flask App
if __name__ == '__main__':
    app.run(port=5000)
