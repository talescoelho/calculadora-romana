const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const createUser = async (item) => {
  const { password } = item;
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  const users = await models.insertOne('users', { ...item, password: newPassword });
  const {
    name, email, userId,
  } = users;
  return {
    name, email, userId,
  };
};

const logIn = async ({ email, password }) => {
  const user = await models.emailExists('users', email);
  if (!user) {
    return { message: '"email" or "password" do not match' };
  }

  const verifyPassword = await bcrypt.compare(password, user.password)

  if (!verifyPassword) {
    return { message: '"email" or "password" do not match' };
  }

  const {
    name, userId
  } = user;
  const token = jwt.sign({
    name, userId
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
