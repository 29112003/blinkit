const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,  // Ensure price cannot be negative
    },
    category: {
      type: String,
      required: true,
      // enum: ['Electronics', 'Clothing', 'Home', 'Food', 'Books', 'Other'],  // Predefined categories
    },
    stock: {
      type: Number,
      default: true,  // Default value for stock is true
    },
    description: {
      type: String,
    },
    image: {
      type: Buffer
    },
  },
  { timestamps: true }
);

// Joi Validation Function
const validateProduct = (data) => {
  const productSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().min(0).required(),  // Price cannot be negative
    category: Joi.string(),
    stock: Joi.number().required(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),  // Ensures image is a valid URL
  });

  return productSchema.validate(data);
};

module.exports = {
  productModel: mongoose.model('Product', productSchema),
  validateProduct,
};
