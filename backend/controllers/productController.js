const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const query = req.query.admin === 'true' ? {} : { isActive: true };
    const products = await Product.find(query);
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
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id);
    if (product) {
      if (!product.isActive && req.query.admin !== 'true') {
        return res.status(404).json({ message: 'Product is inactive or not found' });
      }
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
    const { name, sku, brand, category, originalPrice, salePrice, stock, images, description, features, specifications, isActive, warranty } = req.body;
    const product = new Product({
      name,
      sku,
      brand,
      category,
      originalPrice: originalPrice || 0,
      salePrice: salePrice || 0,
      stock: stock || 0,
      images: images || [],
      description,
      features: features || [],
      specifications: specifications || {},
      isActive: isActive !== undefined ? isActive : true,
      warranty: warranty || '',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, sku, brand, category, originalPrice, salePrice, stock, images, description, features, specifications, isActive, warranty } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.sku = sku !== undefined ? sku : product.sku;
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
      product.warranty = warranty !== undefined ? warranty : product.warranty;

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
      res.json({ message: 'Product deactivated successfully' });
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
