const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const validator = require('email-validator');
const servicesUsers = require('../services/servicesUsers');
require('dotenv').config();

const romanNum = {
  I: true,
  V: true,
  X: true,
  L: true,
  C: true,
  D: true,
  M: true,
}

const errorMessage = (message) => ({
  message,
});

const schemaRomans = Joi.object({
  romans: Joi.array().items(Joi.string()).min(2).required(),
});

const verifyromansFields = async (req, res, next) => {
  const { error } = schemaRomans.validate(req.body);
  if (error && error.details.find((err) => err)) {
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessage(error.message));
  }

  const { romans } = req.body;

  if (!romans.join('').split('').every((el) => romanNum[el])) {
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessage('"romans[2]" must be one of [I, V, X, L, C, D, M]'));
  }

  return next();
};

const validToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json(errorMessage('missing auth token'));
  }
  return jwt.verify(authorization, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json(errorMessage(err.message));
    }
    const id = '_id';
    req.userId = decoded[id];
    return next();
  });
};

module.exports = {
  verifyromansFields,
  validToken,
};
