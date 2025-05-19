const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('MiniShop API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});