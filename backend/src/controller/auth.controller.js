const authService = require('../services/auth.service');
const handleErrors = require('../utils/handleErrors');

module.exports.signup_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await authService.signup({
      email,
      password,
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: authService.maxAge * 1000
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
  console.error('SIGNUP ERROR 👉', err);
  const errors = handleErrors(err);
  res.status(400).json({ errors });
  }

};

module.exports.login_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await authService.login({ email, password });

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: authService.maxAge * 1000
    });

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'Logged out' });
};
