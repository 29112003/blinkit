const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,  // Total price must be non-negative
    },
    address: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,  // Limit address length
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',  // Default order status
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery',
      required: true,
    },
  },
  { timestamps: true }
);

// Joi Validation Function
const validateOrder = (data) => {
  const orderSchema = Joi.object({
    user: Joi.string().hex().length(24).required(),  // Validate MongoDB ObjectId for user
    product: Joi.array().items(Joi.string().hex().length(24).required()).min(1).required(),  // Validate product ObjectIds
    totalPrice: Joi.number().min(0).required(),  // Total price cannot be negative
    address: Joi.string().min(10).max(500).required(),  // Address length validation
    status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').required(),  // Order status validation
    payment: Joi.string().hex().length(24).required(),  // Validate MongoDB ObjectId for payment
    delivery: Joi.string().hex().length(24).required(),  // Validate MongoDB ObjectId for delivery
  });

  return orderSchema.validate(data);
};

module.exports = {
  orderModel: mongoose.model('Order', orderSchema),
  validateOrder,
};
