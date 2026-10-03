const Order = require('../models/Order');
const Product = require('../models/Product');

const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  // Recalculate prices from DB to avoid frontend tampering
  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  const dbOrderItems = [];
  for (const itemFromClient of orderItems) {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );

    if (!matchingItemFromDB) {
      res.status(404).json({ message: `Product not found: ${itemFromClient.name}` });
      return;
    }

    if (matchingItemFromDB.stock < itemFromClient.qty) {
      res.status(400).json({ message: `Insufficient stock for ${matchingItemFromDB.name}. Available: ${matchingItemFromDB.stock}` });
      return;
    }

    dbOrderItems.push({
      ...itemFromClient,
      product: itemFromClient._id,
      price: matchingItemFromDB.salePrice,
      _id: undefined,
    });
  }

  const itemsPrice = dbOrderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  
  const shippingPrice = itemsPrice > 0 && itemsPrice < 10000 ? 500 : 0;
  const taxPrice = 0; // Assuming inclusive tax for now as per UI
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    status: paymentMethod === 'cod' ? 'Confirmed' : 'Pending', // Mark Confirmed if COD
  });

  const createdOrder = await order.save();

  // Deduct stock
  for (const item of dbOrderItems) {
    const product = await Product.findById(item.product);
    product.stock -= item.qty;
    await product.save();
  }

  res.status(201).json(createdOrder);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order && (req.user.isAdmin || order.user._id.toString() === req.user._id.toString())) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found or unauthorized' });
  }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    if(req.body.status === 'Delivered') {
        order.isPaid = true;
        order.paidAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus
};
