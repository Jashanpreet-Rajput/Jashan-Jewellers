const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  icon_url: Joi.string().uri().max(255).allow(null, '').optional(),
});

const jewellerySchema = Joi.object({
  design_code: Joi.string().min(2).max(50).required(),
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).allow(null, '').optional(),
  metal_type: Joi.string().valid('Gold', 'Silver').required(),
  expected_weight_min: Joi.number().precision(2).min(0).optional().allow(null),
  expected_weight_max: Joi.number().precision(2).min(Joi.ref('expected_weight_min', { adjust: (v) => v || 0 })).optional().allow(null),
  image_url: Joi.string().uri().max(255).allow(null, '').optional(),
  category_id: Joi.number().integer().min(1).required(),
  occasion: Joi.string().valid('Daily Wear', 'Wedding', 'Party Wear', 'Traditional').allow(null, '').optional(),
  is_trending: Joi.boolean().default(false).optional(),
  is_bridal: Joi.boolean().default(false).optional(),
  is_lightweight: Joi.boolean().default(false).optional(),
});

const customRequestSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone_number: Joi.string().pattern(/^\+?[0-9]{7,15}$/).required(), // Basic phone validation
  jewellery_type: Joi.string().min(3).max(100).required(),
  expected_weight: Joi.string().max(100).allow(null, '').optional(),
  design_image_url: Joi.string().uri().max(255).allow(null, '').optional(),
  message: Joi.string().max(1000).allow(null, '').optional(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed', 'Rejected').optional(), // Admin-only field, not for creation
});

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).max(50).required(), // Add stronger password policies as needed
});

const validate = (schema, property) => (req, res, next) => {
  const { error } = schema.validate(req[property], { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ message: errorMessage });
  }
  next();
};

exports.validateCategory = validate(categorySchema, 'body');
exports.validateJewellery = validate(jewellerySchema, 'body');
exports.validateCustomRequest = validate(customRequestSchema, 'body');
exports.validateUser = validate(userSchema, 'body');

// Specific validation for updating custom request, allowing status to be updated
exports.validateCustomRequestUpdate = (req, res, next) => {
  const schema = customRequestSchema.keys({
    status: Joi.string().valid('Pending', 'In Progress', 'Completed', 'Rejected').optional(),
  }).min(1); // At least one field required for update
  
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ message: errorMessage });
  }
  next();
};