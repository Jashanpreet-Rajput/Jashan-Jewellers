const CustomRequest = require('../models/customRequestModel');
const logger = require('../utils/logger');

exports.createCustomRequest = async (req, res, next) => {
  const { name, phone_number, jewellery_type, expected_weight, design_image_url, message } = req.body;
  try {
    const newRequest = await CustomRequest.create(
      name, phone_number, jewellery_type, expected_weight, design_image_url, message
    );
    res.status(201).json({ message: 'Custom request submitted successfully', request: newRequest });
  } catch (error) {
    logger.error(`Error creating custom request: ${error.message}`);
    next(error);
  }
};

exports.getAllCustomRequests = async (req, res, next) => {
  try {
    const requests = await CustomRequest.findAll();
    res.status(200).json(requests);
  } catch (error) {
    logger.error(`Error fetching all custom requests: ${error.message}`);
    next(error);
  }
};

exports.getCustomRequestById = async (req, res, next) => {
  try {
    const request = await CustomRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Custom request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    logger.error(`Error fetching custom request with ID ${req.params.id}: ${error.message}`);
    next(error);
  }
};

exports.updateCustomRequest = async (req, res, next) => {
  const { name, phone_number, jewellery_type, expected_weight, design_image_url, message, status } = req.body;
  try {
    const updatedRequest = await CustomRequest.update(
      req.params.id, name, phone_number, jewellery_type, expected_weight, design_image_url, message, status
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Custom request not found' });
    }
    res.status(200).json({ message: 'Custom request updated successfully', request: updatedRequest });
  } catch (error) {
    logger.error(`Error updating custom request with ID ${req.params.id}: ${error.message}`);
    next(error);
  }
};

exports.deleteCustomRequest = async (req, res, next) => {
  try {
    const deleted = await CustomRequest.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Custom request not found' });
    }
    res.status(200).json({ message: 'Custom request deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting custom request with ID ${req.params.id}: ${error.message}`);
    next(error);
  }
};