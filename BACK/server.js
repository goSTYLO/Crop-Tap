require('dotenv').config(); // Load .env variables

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models'); // Sequelize models

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/user_routes');
const productRoutes = require('./routes/product_routes');
const cartRoutes = require('./routes/cart_routes');
const cartItemRoutes = require('./routes/cartItem_routes');
const orderRoutes = require('./routes/order_routes');
const orderItemRoutes = require('./routes/orderItem_routes');
const paymentRoutes = require('./routes/payment_routes');

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/cart-items', cartItemRoutes);
app.use('/orders', orderRoutes);
app.use('/order-items', orderItemRoutes);
app.use('/payments', paymentRoutes);
app.use('/productImgs', express.static('productImgs'));

// Health check
app.get('/', (req, res) => {
  res.send('Crop-Tap API is running');
});

// Sync DB and start server
const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true }) // use { force: true } for full reset
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to sync database:', err);
  });