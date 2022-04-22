const yup = require('yup');

const userValidator = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

module.exports = userValidator;
