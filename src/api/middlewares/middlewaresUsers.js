const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const validator = require('email-validator');
const servicesUsers = require('../services/servicesUsers');

const errorMessage = (message) => ({
  message,
});

const schemaRegister = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const verifyRegisterFields = async (req, res, next) => {
  const { error } = schemaRegister.validate(req.body);
  if (error && error.details.find((err) => err)) {
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessage(error.message));
  }

  const { email } = req.body;

  if (!validator.validate(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessage('"email" malformated'));
  }

  const verifyEmail = await servicesUsers.emailExists(email);
  if (verifyEmail) {
    return res.status(StatusCodes.CONFLICT).json(errorMessage('"email" already registered'));
  }

  return next();
};

const verifyLoginFields = async (req, res, next) => {
  const { error } = schemaLogin.validate(req.body);
  if (error && error.details.find((err) => err)) {
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessage(error.message));
  }

  const { email } = req.body;

  if (!validator.validate(email)) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(errorMessage('"email" or "password" do not match'));
  }

  return next();
};

module.exports = {
  verifyRegisterFields,
  verifyLoginFields,
};
