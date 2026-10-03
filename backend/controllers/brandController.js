const Brand = require('../models/Brand');

const getBrands = async (req, res) => {
  const brands = await Brand.find({});
  res.json(brands);
};

const createBrand = async (req, res) => {
  const { name, description, logo, isActive } = req.body;
  const brandExists = await Brand.findOne({ name });
  if (brandExists) return res.status(409).json({ message: 'Brand already exists' });

  const brand = await Brand.create({ name, description, logo, isActive });
  res.status(201).json(brand);
};

const updateBrand = async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (brand) {
    brand.name = req.body.name || brand.name;
    brand.description = req.body.description !== undefined ? req.body.description : brand.description;
    brand.logo = req.body.logo || brand.logo;
    brand.isActive = req.body.isActive !== undefined ? req.body.isActive : brand.isActive;
    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } else {
    res.status(404).json({ message: 'Brand not found' });
  }
};

const deleteBrand = async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (brand) {
    brand.isActive = false; // Soft delete
    await brand.save();
    res.json({ message: 'Brand deactivated' });
  } else {
    res.status(404).json({ message: 'Brand not found' });
  }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };
