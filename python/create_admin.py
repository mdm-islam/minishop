# ✅ Import bcrypt for password hashing and DB connection function
import bcrypt
from db import get_connection

# ✅ Define admin username and plain-text password
username = "admin"
password = "admin123"

# ✅ Hash the password using bcrypt
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# ✅ Establish database connection
conn = get_connection()
cur = conn.cursor()

# ✅ Optional: Delete existing user with the same username
cur.execute("DELETE FROM admin_users WHERE username = %s", (username,))

# ✅ Insert new admin user with hashed password
cur.execute("INSERT INTO admin_users (username, password) VALUES (%s, %s)", (username, hashed))

# ✅ Commit changes and close connection
conn.commit()
cur.close()
conn.close()

# ✅ Confirmation message
print("✅ Admin user created.")

