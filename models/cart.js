const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Cart Schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,  // Total price can't be negative
  },
}, { timestamps: true });

// Joi Validation Function
const validateCart = (data) => {
  const cartSchema = Joi.object({
    user: Joi.string().hex().length(24).required(),  // Validate MongoDB ObjectId for user
    products: Joi.array().items(Joi.string().hex().length(24).required()).min(1).required(),  // Validate product ObjectIds
    totalPrice: Joi.number().min(0).required(),  // Ensure totalPrice is non-negative
  });

  return cartSchema.validate(data);
};

module.exports = {
  cartModel: mongoose.model('Cart', cartSchema),
  validateCart,
};
