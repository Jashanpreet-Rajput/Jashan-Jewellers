const Jewellery = require('../models/jewelleryModel');
const logger = require('../utils/logger');

exports.getAllJewellery = async (req, res, next) => {
  try {
    const { category, metal_type, weight_range, occasion, search, limit = 20, offset = 0 } = req.query;
    const filters = { category, metal_type, weight_range, occasion, search, limit: parseInt(limit), offset: parseInt(offset) };
    
    const jewellery = await Jewellery.findAll(filters);
    res.status(200).json(jewellery);
  } catch (error) {
    logger.error(`Error fetching all jewellery: ${error.message}`);
    next(error);
  }
};

exports.getJewelleryById = async (req, res, next) => {
  try {
    const jewellery = await Jewellery.findById(req.params.id);
    if (!jewellery) {
      return res.status(404).json({ message: 'Jewellery not found' });
    }
    res.status(200).json(jewellery);
  } catch (error) {
    logger.error(`Error fetching jewellery with ID ${req.params.id}: ${error.message}`);
    next(error);
  }
};

exports.createJewellery = async (req, res, next) => {
  const {
    design_code,
    name,
    description,
    metal_type,
    expected_weight_min,
    expected_weight_max,
    image_url,
    category_id,
    occasion,
    is_trending,
    is_bridal,
    is_lightweight
  } = req.body;
  try {
    const newJewellery = await Jewellery.create(
      design_code, name, description, metal_type, expected_weight_min, expected_weight_max,
      image_url, category_id, occasion, is_trending, is_bridal, is_lightweight
    );
    res.status(201).json({ message: 'Jewellery created successfully', jewellery: newJewellery });
  } catch (error) {
    logger.error(`Error creating jewellery: ${error.message}`);
    next(error);
  }
};

exports.updateJewellery = async (req, res, next) => {
  const {
    design_code,
    name,
    description,
    metal_type,
    expected_weight_min,
    expected_weight_max,
    image_url,
    category_id,
    occasion,
    is_trending,
    is_bridal,
    is_lightweight
  } = req.body;
  try {
    const updatedJewellery = await Jewellery.update(
      req.params.id, design_code, name, description, metal_type, expected_weight_min, expected_weight_max,
      image_url, category_id, occasion, is_trending, is_bridal, is_lightweight
    );
    if (!updatedJewellery) {
      return res.status(404).json({ message: 'Jewellery not found' });
    }
    res.status(200).json({ message: 'Jewellery updated successfully', jewellery: updatedJewellery });
  } catch (error) {
    logger.error(`Error updating jewellery with ID ${req.params.id}: ${error.message}`);
    next(error);
  }
};

exports.deleteJewellery = async (req, res, next) => {
  try {
    const deleted = await Jewellery.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Jewellery not found' });
    }
    res.status(200).json({ message: 'Jewellery deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting jewellery with ID ${req.params.id}: ${error.message}`);
    next(error);
  }
};