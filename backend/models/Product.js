const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  features: [{ type: String }],
  specifications: { type: Map, of: String },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sku: { type: String, default: '' },
  warranty: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
