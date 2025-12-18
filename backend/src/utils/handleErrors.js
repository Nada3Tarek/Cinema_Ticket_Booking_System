const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  // Incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'Email is not registered';
  }

  // Incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'Password is incorrect';
  }

  // Duplicate email error
  if (err.code === 11000) {
    errors.email = 'Email already exists';
    return errors;
  }

  // Validation errors
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
module.exports = handleErrors;