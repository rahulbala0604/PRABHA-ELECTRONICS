const Cart = require('../models/Cart');

// @desc    Get user cart items
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id }).populate('product', 'name brand salePrice images');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    let cartItem = await Cart.findOne({ user: req.user._id, product: productId });
    
    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ user: req.user._id, product: productId, quantity });
    }
    
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id, product: req.params.productId });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
