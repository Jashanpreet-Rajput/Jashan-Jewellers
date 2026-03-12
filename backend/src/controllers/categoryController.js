const Category = require('../models/categoryModel');
const logger = require('../utils/logger');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    logger.error(`Error fetching all categories: ${error.message}`);
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    logger.error(`Error fetching category with ID ${req.params.id}: ${error.message}`);
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  const { name, icon_url } = req.body;
  try {
    const newCategory = await Category.create(name, icon_url);
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    logger.error(`Error creating category: ${error.message}`);
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  const { name, icon_url } = req.body;
  try {
    const updatedCategory = await Category.update(req.params.id, name, icon_url);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    logger.error(`Error updating category with ID ${req.params.id}: ${error.message}`);
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const deleted = await Category.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting category with ID ${req.params.id}: ${error.message}`);
    next(error);
  }
};