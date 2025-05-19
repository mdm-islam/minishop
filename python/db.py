# ✅ Import PostgreSQL database adapter
import psycopg2

# ✅ Function to establish a database connection
def get_connection():
    return psycopg2.connect(
        dbname="minishop",       # Database name
        user="postgres",         # PostgreSQL username
        password="root",         # PostgreSQL password
        host="localhost",        # Database server host
        port=5432                # Default PostgreSQL port
    )
