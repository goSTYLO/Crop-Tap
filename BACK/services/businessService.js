const db = require('../models');
const Product = db.Product;
const User = db.User;
const Cart = db.Cart;
const CartItem = db.CartItem;
const Order = db.Order;
const OrderItem = db.OrderItem;

const extractFarmerIdFromProduct = async (product_id) => {
  if (!product_id) {
    throw new Error('product_id is required to determine farmer_id');
  }

  const product = await Product.findByPk(product_id);
  if (!product) {
    throw new Error('Product not found');
  }

  const farmer = await User.findByPk(product.farmer_id);
  if (!farmer || farmer.role !== 'farmer') {
    throw new Error('Invalid farmer associated with product');
  }

  return farmer.user_id;
};

const addToCart = async (buyer_id, product_id, quantity = 1, existingCartId = null) => {
  console.log(`🔍 addToCart called with buyer_id=${buyer_id}, product_id=${product_id}, quantity=${quantity}, existingCartId=${existingCartId}`);

  const farmer_id = await extractFarmerIdFromProduct(product_id);
  console.log(`✅ Farmer ID extracted: ${farmer_id}`);

  let cart = existingCartId
  ? await Cart.findByPk(existingCartId)
  : await Cart.create({ buyer_id, farmer_id });

  if (cart) {
    console.log(`📦 Reusing existing cart: cart_id=${cart.cart_id}`);
  } else {
    cart = await Cart.create({ buyer_id, farmer_id });
    console.log(`🆕 Created new cart: cart_id=${cart.cart_id}`);
  }

  if (cart.farmer_id !== farmer_id) {
    console.error(`❌ Farmer mismatch: cart.farmer_id=${cart.farmer_id}, product.farmer_id=${farmer_id}`);
    throw new Error('All items in cart must belong to the same farmer');
  }

  const existingItem = await CartItem.findOne({
    where: { cart_id: cart.cart_id, product_id }
  });

  const product = await Product.findByPk(product_id);
  if (!product) {
    console.error(`❌ Product not found for ID: ${product_id}`);
    throw new Error('Product not found');
  }

  console.log(`💰 Product price: ${product.price}`);

  if (existingItem) {
    console.log(`🔄 Updating existing CartItem: cart_item_id=${existingItem.cart_item_id}`);
    existingItem.quantity += quantity;
    await existingItem.save();
  } else {
    console.log(`➕ Creating new CartItem for cart_id=${cart.cart_id}, product_id=${product_id}`);
    await CartItem.create({
      cart_id: cart.cart_id,
      product_id,
      quantity,
      price_at_add: product.price
    });
  }

  console.log(`✅ CartItem operation complete for cart_id=${cart.cart_id}`);
  return cart;
};

const getCartTotal = async (cart_id) => {
  const items = await CartItem.findAll({ where: { cart_id }, include: [Product] });

  return items.reduce((sum, item) => {
    const price = item.Product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
};

const createOrderFromCart = async (cart_id, shipping_address) => {
  const cart = await Cart.findByPk(cart_id);
  if (!cart) {
    throw new Error('Cart not found');
  }

  const items = await CartItem.findAll({ where: { cart_id }, include: [Product] });
  if (items.length === 0) {
    throw new Error('Cart is empty');
  }

  const total_amount = await getCartTotal(cart_id);

  const order = await Order.create({
    buyer_id: cart.buyer_id,
    farmer_id: cart.farmer_id,
    total_amount,
    shipping_address
  });

  for (const item of items) {
    await OrderItem.create({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.Product?.price || 0
    });
  }

  return order;
};

const clearCart = async (cart_id, removeCart = false) => {
  const cart = await Cart.findByPk(cart_id);
  if (!cart) {
    throw new Error('Cart not found');
  }

  await CartItem.destroy({ where: { cart_id } });

  if (removeCart) {
    await Cart.destroy({ where: { cart_id } });
  }

  return { message: 'Cart cleared', cart_id };
};

module.exports = {
  extractFarmerIdFromProduct,
  addToCart,
  getCartTotal,
  createOrderFromCart,
  clearCart
};