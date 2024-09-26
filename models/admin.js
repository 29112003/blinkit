const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Admin Schema
const adminSchema = new mongoose.Schema(
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
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,  // Email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,  // Secure passwords (suitable for hashed passwords)
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'superadmin'],  // Only 'admin' or 'superadmin' are valid roles
      default: 'admin',  // Default role is 'admin'
    },
  },
  { timestamps: true }
);

// Joi Validation Function
const validateAdmin = (data) => {
  const adminSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/, 'password')  // Strong password validation
      .required()
      .messages({
        'string.pattern.name': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
      }),
    role: Joi.string().valid('admin', 'superadmin').required(),  // Role can only be 'admin' or 'superadmin'
  });

  return adminSchema.validate(data);
};

module.exports = {
  adminModel: mongoose.model('Admin', adminSchema),
  validateAdmin,
};
