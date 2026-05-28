const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return next(new ErrorResponse('Email already registered', 400));
  const user = await User.create({ name, email, password });
  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ErrorResponse('Provide email and password', 400));
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ErrorResponse('Invalid credentials', 401));
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));
  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const fields = { name: req.body.name, phone: req.body.phone, preferences: req.body.preferences };
  Object.keys(fields).forEach((k) => fields[k] === undefined && delete fields[k]);
  const user = await User.findByIdAndUpdate(req.user.id, fields, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: user });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) return next(new ErrorResponse('Current password is incorrect', 401));
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, data: user.addresses });
});

exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
  await user.save();
  res.status(200).json({ success: true, data: user.addresses });
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar, addresses: user.addresses, preferences: user.preferences },
  });
};
