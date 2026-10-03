const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ isAdmin: false });
    
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    // Calculate total revenue from paid/delivered orders
    const orders = await Order.find({ isPaid: true });
    const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name');

    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'New' });
    const contactedEnquiries = await Enquiry.countDocuments({ status: 'Contacted' });
    const resolvedEnquiries = await Enquiry.countDocuments({ status: 'Resolved' });
    const recentEnquiries = await Enquiry.find({}).sort({ createdAt: -1 }).limit(5);

    res.json({
      totalProducts,
      activeProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      revenue,
      recentOrders,
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      resolvedEnquiries,
      recentEnquiries
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats
};
