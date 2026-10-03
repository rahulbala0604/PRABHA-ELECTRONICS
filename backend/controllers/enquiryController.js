const Enquiry = require('../models/Enquiry');
const Product = require('../models/Product');

const createEnquiry = async (req, res) => {
  try {
    const { customerName, phone, location, email, message, products } = req.body;
    
    // Validate if products are still active
    if (products && products.length > 0) {
      const productIds = products.map(p => p.product);
      const activeProducts = await Product.find({ _id: { $in: productIds }, isActive: true });
      if (activeProducts.length !== products.length) {
        return res.status(400).json({ message: 'One or more products in your enquiry are no longer available. Please update your cart.' });
      }
    }

    const enquiry = await Enquiry.create({
      customerName, phone, location, email, message, products
    });
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create enquiry' });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enquiries' });
  }
};

const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (enquiry) res.json(enquiry);
    else res.status(404).json({ message: 'Enquiry not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (enquiry) {
      enquiry.status = req.body.status || enquiry.status;
      const updated = await enquiry.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

module.exports = { createEnquiry, getEnquiries, getEnquiryById, updateEnquiryStatus };
