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

const emailExists = async (email) => {
  const emailExist = await models.emailExists('users', email);
  if (emailExist) {
    return true;
  }
  return false;
}

module.exports = {
  createUser,
  logIn,
  emailExists,
};
