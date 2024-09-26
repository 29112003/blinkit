const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Address Schema
const AddressSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  zip: {
    type: Number,
    required: true,
    minlength: 5,
    maxlength: 8,
  },
  city: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
});

// Mongoose User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,  // Email regex for better validation
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 1024,  // Increased length to ensure secure passwords (bcrypt, etc.)
    },
    phone: {
      type: String,  // Store phone as a string for handling international formats
      unique: true,
      match: /^[0-9]{10,15}$/,  // Regex to allow 10-15 digit phone numbers
    },
    addresses: {
      type: [AddressSchema],
    },
  },
  { timestamps: true }
);

// Joi Validation Function
const validateUser = (data) => {
  const addressSchema = Joi.object({
    state: Joi.string().min(2).max(100).required(),
    zip: Joi.string().pattern(/^[0-9]{5,10}$/).required(),  // ZIP code should be 5-10 digits
    city: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(5).max(255).required(),
  });

  const userSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/, 'password')  // Ensures a strong password
      .messages({
        'string.pattern.name': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
      }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .messages({
        'string.pattern.base': 'Phone number must be 10-15 digits long.',
      }),
    addresses: Joi.array().items(addressSchema).min(1).required(),
  });

  return userSchema.validate(data);
};

module.exports = {
  userModel: mongoose.model('User', userSchema),
  validateUser,
};
