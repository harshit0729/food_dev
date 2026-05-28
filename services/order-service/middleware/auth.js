const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-replace-in-production';

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new ErrorResponse('Not authorized', 401));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return next(new ErrorResponse('User not found', 404));
    next();
  } catch {
    return next(new ErrorResponse('Not authorized', 401));
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(new ErrorResponse('Forbidden', 403));
  next();
};
