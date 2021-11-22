const models = require('../models');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const createUser = async (item) => {
  const users = await models.insertOne('users', item);
  const {
    name, email, userId,
  } = users;
  return {
    name, email, userId,
  };
};

const logIn = async (item) => {
  const user = await models.logIn('users', item);
  if (!user) {
    return { message: 'Email or password do not match' };
  }
  const {
    name, area, _id, role,
  } = user;
  const token = jwt.sign({
    name, area, _id, role,
  }, SECRET_KEY);
  return token;
};

module.exports = {
  createUser,
  logIn,
};
