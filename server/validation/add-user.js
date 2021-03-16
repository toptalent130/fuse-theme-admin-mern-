const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddUserInput(data) {
  let errors = {};

  data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
  data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
  data.email = !isEmpty(data.email) ? data.email : '';

  if (!Validator.isLength(data.first_name, { min: 2, max: 30 })) {
    errors.first_name = 'First name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.first_name)) {
    errors.first_name = 'First name field is required';
  }
  if (!Validator.isLength(data.last_name, { min: 2, max: 30 })) {
    errors.last_name = 'Last name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.last_name)) {
    errors.last_name = 'Last name field is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
