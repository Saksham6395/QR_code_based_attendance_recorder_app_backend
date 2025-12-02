// src/middlewares/validate.middleware.js
function validate(schema) {
    return (req, res, next) => {
      const payload = {
        body: req.body,
        params: req.params,
        query: req.query
      };
  
      const { error, value } = schema.validate(payload, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
      });
  
      if (error) {
        const errors = error.details.map(d => d.message);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        });
      }
  
      req.body = value.body || req.body;
      req.params = value.params || req.params;
      req.query = value.query || req.query;
  
      next();
    };
  }
  
  module.exports = validate;
  