const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Payment Schema
const paymentSchema = new mongoose.Schema({
  orderId: {
  type: String,
  required: true,
  },
  paymentId: {
  type: String,
  },
  signature: {
  type: String,
  },
  amount: {
  type: Number,
  required: true,
  },
  currency: {
  type: String,
  required: true,
  },
  status: {
  type: String,
  default: 'pending',
  },
  }, { timestamps: true });
// Joi Validation Function
const validatePayment = (data) => {
  const paymentSchema = Joi.object({
    order: Joi.string().hex().length(24).required(),  // Validate MongoDB ObjectId for order
    amount: Joi.number().min(0).required(),  // Ensure amount is non-negative
    method: Joi.string().required(),  // Payment method validation
    status: Joi.string().required(),  // Payment status validation
    transactionId: Joi.string().alphanum().required(),  // Ensure transactionId is alphanumeric and within length limits
  });

  return paymentSchema.validate(data);
};

module.exports = {
  paymentModel: mongoose.model('Payment', paymentSchema),
  validatePayment,
};
