const pool = require('../db');

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server error');
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Product not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllProducts,
  getProductById
};
