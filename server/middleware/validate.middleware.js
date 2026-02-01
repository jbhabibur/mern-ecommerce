export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log("Validation Error:", error.details[0].message);
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      field: error.details[0].path[0],
    });
  }
  next();
};
