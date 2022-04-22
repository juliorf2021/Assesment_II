const yup = require('yup');

const favsListValidator = yup.object().shape({
  name: yup.string().required(),
});

module.exports = favsListValidator;
