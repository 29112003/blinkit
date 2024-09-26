const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      unique: true,  // Ensures category name is unique
    },
  },
  { timestamps: true }
);

// Joi Validation Function
const validateCategory = (data) => {
  const categorySchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),  // Name must be between 3-100 characters
  });

  return categorySchema.validate(data);
};

module.exports = {
  categoryModel: mongoose.model('Category', categorySchema),
  validateCategory,
};
