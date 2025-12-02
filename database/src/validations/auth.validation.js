// src/validations/auth.validation.js
const Joi = require('joi');

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  params: Joi.object().optional(),
  query: Joi.object().optional()
});

module.exports = {
  loginSchema
};
