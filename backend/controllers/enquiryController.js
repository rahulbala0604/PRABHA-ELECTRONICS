const Enquiry = require('../models/Enquiry');

const createEnquiry = async (req, res) => {
  try {
    const { customerName, phone, location, email, message, products } = req.body;
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
