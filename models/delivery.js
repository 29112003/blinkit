const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Delivery Schema
const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    deliveryBoy: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,  // Ensure valid name length
    },
    status: {
      type: String,
      enum: ['pending', 'dispatched', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending',  // Default delivery status is pending
      required: true,
    },
    trackingUrl: {
      type: String,
      match: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+)(\.[a-z]{2,})(\/[a-zA-Z0-9#]+\/?)*$/,  // URL format validation
      required: false,  // Optional field
    },
    estimatedDeliveryTime: {
      type: Number,
      required: true,
      min: 1,  // Delivery time should be at least 1 day or unit (in hours or days based on your requirement)
    },
  },
  { timestamps: true }
);

// Joi Validation Function
const validateDelivery = (data) => {
  const deliverySchema = Joi.object({
    order: Joi.string().hex().length(24).required(),  // Validate MongoDB ObjectId for order
    deliveryBoy: Joi.string().min(3).max(100).required(),  // Delivery boy name validation
    status: Joi.string().valid('pending', 'dispatched', 'in_transit', 'delivered', 'cancelled').required(),  // Status validation
    trackingUrl: Joi.string().uri().optional().allow(null, ''),  // Optional URL validation for tracking
    estimatedDeliveryTime: Joi.number().min(1).required(),  // Ensure delivery time is positive
  });

  return deliverySchema.validate(data);
};

module.exports = {
  deliveryModel: mongoose.model('Delivery', deliverySchema),
  validateDelivery,
};
