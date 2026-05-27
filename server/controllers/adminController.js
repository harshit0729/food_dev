const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const [
    totalUsers,
    totalRestaurants,
    totalMenuItems,
    totalOrders,
    totalRevenue,
    recentOrders,
    ordersByStatus,
    topRestaurants,
    topItems,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Restaurant.countDocuments(),
    FoodItem.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.find()
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Restaurant.find().sort({ orderCount: -1 }).limit(5).select('name orderCount rating'),
    FoodItem.find().sort({ orderCount: -1 }).limit(5).select('name orderCount price'),
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalRestaurants,
        totalMenuItems,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentOrders,
      ordersByStatus,
      topRestaurants,
      topItems,
    },
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: users,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.status(200).json({ success: true, message: 'User deactivated' });
});
