const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserFactory = require('../factories/user.factory');

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });

/**
 * SIGNUP
 */
const signup = async ({ email, password, adminKey }) => {
  const userData = UserFactory.createUser({
    email,
    password,
    adminKey
  });

  const user = await User.create(userData);
  const token = createToken(user._id);

  return { user, token };
};

/**
 * LOGIN (customer & admin)
 */
const login = async ({ email, password }) => {
  const user = await User.login(email, password);
  const token = createToken(user._id);

  return { user, token };
};

module.exports = {
  signup,
  login,
  maxAge
};
