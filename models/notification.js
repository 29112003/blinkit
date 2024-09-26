const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Notification Schema
const notificationSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000,  // Adjust as needed for message length
  },
  read: {
    type: Boolean,
    default: false,  // Default to false if not provided
  },
}, { timestamps: true });

// Joi Validation Function
const validateNotification = (data) => {
  const schema = Joi.object({
    user: Joi.string().min(3).max(100).required(),
    message: Joi.string().min(1).max(1000).required(),
    read: Joi.boolean(),  // Optional field
  });

  return schema.validate(data);
};

module.exports = {
  notificationModel: mongoose.model('Notification', notificationSchema),
  validateNotification,
};
