const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String },
  message: { type: String },
  products: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      }
    }
  ],
  status: { type: String, default: 'New', enum: ['New', 'Contacted', 'Resolved'] }
}, {
  timestamps: true
});

module.exports = mongoose.model('Enquiry', enquirySchema);
