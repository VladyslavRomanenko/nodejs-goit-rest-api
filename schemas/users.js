const Joi = require("joi");
const { emailRegexp } = require("../constants/user-constants");

const userSignUpSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required().min(6),
  subscription: Joi.string(),
});

const userSignInSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required().min(6),
});

const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

module.exports = {
  userSignInSchema,
  userSignUpSchema,
  userEmailSchema,
};
