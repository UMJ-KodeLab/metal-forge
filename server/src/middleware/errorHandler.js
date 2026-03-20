const config = require('../config');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      message: 'Validation error',
      errors: messages,
    });
  }

  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || 'Internal server error',
  };

  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
