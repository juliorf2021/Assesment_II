const validateRequest = (schema) => async (req, res, next) => {
  try {
    const validatedBody = await schema.validate(req.body);
    req.body = validatedBody;

    return next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = validateRequest;
