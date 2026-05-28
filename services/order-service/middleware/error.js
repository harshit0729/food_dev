const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  if (err.name === 'CastError') error = new ErrorResponse('Resource not found', 404);
  if (err.code === 11000) error = new ErrorResponse('Duplicate value', 400);
  if (err.name === 'ValidationError') {
    error = new ErrorResponse(Object.values(err.errors).map((v) => v.message).join(', '), 400);
  }
  if (err.name === 'JsonWebTokenError') error = new ErrorResponse('Invalid token', 401);
  if (err.name === 'TokenExpiredError') error = new ErrorResponse('Token expired', 401);

  res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Server Error' });
};

module.exports = errorHandler;
