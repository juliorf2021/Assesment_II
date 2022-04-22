const yup = require('yup');

const favsItemValidator = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  link: yup.string().url().required(),
});

module.exports = favsItemValidator;
