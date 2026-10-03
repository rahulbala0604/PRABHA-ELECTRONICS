const Product = require('../models/Product');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');
const Category = require('../models/Category');
const Brand = require('../models/Brand');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ isAdmin: false });
    
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'New' });
    const contactedEnquiries = await Enquiry.countDocuments({ status: 'Contacted' });
    const resolvedEnquiries = await Enquiry.countDocuments({ status: 'Resolved' });
    const recentEnquiries = await Enquiry.find({}).sort({ createdAt: -1 }).limit(5);

    const totalCategories = await Category.countDocuments();
    const totalBrands = await Brand.countDocuments();

    res.json({
      totalProducts,
      activeProducts,
      totalCustomers,
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      resolvedEnquiries,
      recentEnquiries,
      totalCategories,
      totalBrands
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats
};
