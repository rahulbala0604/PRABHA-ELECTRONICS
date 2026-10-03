const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: 'Sample Name',
      brand: 'Sample Brand',
      category: 'Sample Category',
      originalPrice: 0,
      salePrice: 0,
      stock: 0,
      images: ['/images/sample.jpg'],
      description: 'Sample Description',
      features: ['Sample Feature'],
      specifications: { key: 'value' },
      isActive: true,
      user: req.user._id
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, brand, category, originalPrice, salePrice, stock, images, description, features, specifications, isActive } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
      product.salePrice = salePrice !== undefined ? salePrice : product.salePrice;
      product.stock = stock !== undefined ? stock : product.stock;
      product.images = images || product.images;
      product.description = description || product.description;
      product.features = features || product.features;
      product.specifications = specifications || product.specifications;
      product.isActive = isActive !== undefined ? isActive : product.isActive;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isActive = false; // Soft delete
      await product.save();
      res.json({ message: 'Product disabled (soft deleted)' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
