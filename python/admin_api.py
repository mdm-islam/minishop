# MiniShop Admin API: Product, Order, Login, Upload, Stats

from flask import Blueprint, request, jsonify
from db import get_connection
import bcrypt
import os
from werkzeug.utils import secure_filename
from pathlib import Path
import uuid

admin_api = Blueprint('admin_api', __name__)

# 📁 Upload Configuration
base_dir = Path(__file__).resolve().parent
UPLOAD_FOLDER = base_dir.parent / 'client' / 'images' / 'products'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# ✅ Check Allowed File Extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 📤 Upload Product Image
@admin_api.route('/api/admin/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
        file.save(str(UPLOAD_FOLDER / filename))
        return jsonify({"image_url": f"images/products/{filename}"}), 200
    return jsonify({"error": "Invalid file format"}), 400

# 🔐 Admin Login Endpoint
@admin_api.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT password FROM admin_users WHERE username = %s", (username,))
        result = cur.fetchone()
        cur.close(); conn.close()
        if result and bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8')):
            return jsonify({"token": "admin_logged_in_token"}), 200
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📜 Log Admin Actions
def log_action(action, product_id=None, admin_username="admin"):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO admin_logs (action, product_id, admin_username)
        VALUES (%s, %s, %s)
    """, (action, product_id, admin_username))
    conn.commit(); cur.close(); conn.close()

# ➕ Add New Product
@admin_api.route('/api/admin/products', methods=['POST'])
def add_product():
    data = request.json
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO products (name, price, category, image_url, description, stock)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
        """, (data['name'], data['price'], data['category'], data['image'], data['description'], data.get('stock', 0)))
        product_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()
        log_action("add", product_id)
        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📥 Get All Products
@admin_api.route('/api/admin/products', methods=['GET'])
def get_products():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, name, price, category, image_url, description, stock FROM products ORDER BY id DESC")
        products = [{
            "id": row[0],
            "name": row[1],
            "price": float(row[2]),
            "category": row[3],
            "image_url": row[4],
            "description": row[5],
            "stock": row[6]
        } for row in cur.fetchall()]
        cur.close(); conn.close()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✏️ Update Product by ID
@admin_api.route('/api/admin/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE products
            SET name = %s, price = %s, category = %s, image_url = %s, description = %s, stock_quantity = %s
            WHERE id = %s
        """, (data['name'], data['price'], data['category'], data['image'], data['description'], data['stock'], product_id))
        conn.commit()
        cur.close(); conn.close()
        log_action("edit", product_id)
        return jsonify({"message": "Product updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ❌ Delete Product by ID
@admin_api.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
        conn.commit()
        cur.close(); conn.close()
        log_action("delete", product_id)
        return jsonify({"message": "Product deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📦 Get All Orders
@admin_api.route('/api/admin/orders', methods=['GET'])
def get_orders():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, customer_name, email, total_amount, status FROM orders ORDER BY id DESC")
    orders = [{"id": row[0], "customer": row[1], "email": row[2], "total": float(row[3]), "status": row[4]} for row in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(orders)

# 🔄 Update Order Status by ID
@admin_api.route('/api/admin/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    status = request.json.get('status')
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE orders SET status = %s WHERE id = %s", (status, order_id))
    conn.commit(); cur.close(); conn.close()
    return jsonify({"message": "Order status updated"})

# 📊 Get Dashboard Stats
@admin_api.route('/api/admin/stats', methods=['GET'])
def get_dashboard_stats():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM orders")
    total_orders = cur.fetchone()[0]
    cur.execute("SELECT SUM(total_amount) FROM orders")
    total_sales = float(cur.fetchone()[0] or 0)
    cur.execute("SELECT COUNT(DISTINCT email) FROM orders")
    new_customers = cur.fetchone()[0]
    cur.close(); conn.close()
    return jsonify({
        "total_orders": total_orders,
        "total_sales": total_sales,
        "new_customers": new_customers
    })
