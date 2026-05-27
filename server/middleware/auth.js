const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DSY29QURD12R23TFNO1FFFTY13');
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('Not authorized to perform this action', 403));
    }
    next();
  };
};
