const Category = require('../models/Category');
const { isAdmin } = require('../utils/authCheck');

const getCategories = async (req, res) => {
  const adminReq = req.query.admin === 'true' && (await isAdmin(req));
  const query = adminReq ? {} : { isActive: true };
  const categories = await Category.find(query);
  res.json(categories);
};

const createCategory = async (req, res) => {
  const { name, description, image, isActive } = req.body;
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) return res.status(409).json({ message: 'Category already exists' });

  const category = await Category.create({ name, description, image, isActive });
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = req.body.name || category.name;
    category.description = req.body.description !== undefined ? req.body.description : category.description;
    category.image = req.body.image || category.image;
    category.isActive = req.body.isActive !== undefined ? req.body.isActive : category.isActive;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    category.isActive = false; // Soft delete
    await category.save();
    res.json({ message: 'Category deactivated' });
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
