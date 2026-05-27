const Order = require('../models/Order');
const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { deliveryAddress, paymentMethod, specialInstructions } = req.body;

  const cart = await Cart.findOne({ user: req.user.id }).populate('items.foodItem');
  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse('Cart is empty', 400));
  }

  const restaurant = await Restaurant.findById(cart.restaurant);
  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  for (const item of cart.items) {
    const foodItem = await FoodItem.findById(item.foodItem._id);
    if (!foodItem || !foodItem.isAvailable) {
      return next(new ErrorResponse(`${item.name} is no longer available`, 400));
    }
  }

  const order = await Order.create({
    user: req.user.id,
    restaurant: cart.restaurant,
    items: cart.items.map((item) => ({
      foodItem: item.foodItem._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      specialInstructions: item.specialInstructions,
    })),
    deliveryAddress: deliveryAddress || cart.deliveryAddress,
    paymentMethod: paymentMethod || 'cash',
    subtotal: cart.subtotal,
    deliveryFee: cart.deliveryFee,
    tax: cart.tax,
    discount: cart.promoCode?.discount || 0,
    total: cart.total,
    specialInstructions,
    estimatedDeliveryTime: restaurant.deliveryTime,
    statusHistory: [{ status: 'pending', note: 'Order placed successfully' }],
  });

  for (const item of cart.items) {
    await FoodItem.findByIdAndUpdate(item.foodItem._id, {
      $inc: { orderCount: item.quantity },
    });
  }

  await Restaurant.findByIdAndUpdate(cart.restaurant, {
    $inc: { orderCount: 1 },
  });

  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json({ success: true, data: order });
});

exports.getOrders = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = { user: req.user.id };

  if (status) query.status = status;

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('restaurant', 'name image')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: orders,
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name image contact phone')
    .populate('items.foodItem', 'name image price');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this order', 403));
  }

  res.status(200).json({ success: true, data: order });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    note: note || `Order ${status}`,
  });

  if (status === 'delivered') {
    order.deliveredAt = Date.now();
    order.paymentStatus = 'completed';
  }

  if (status === 'cancelled' && order.paymentStatus === 'completed') {
    order.paymentStatus = 'refunded';
  }

  await order.save();

  res.status(200).json({ success: true, data: order });
});

exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to cancel this order', 403));
  }

  if (!['pending', 'confirmed'].includes(order.status)) {
    return next(new ErrorResponse('Order cannot be cancelled at this stage', 400));
  }

  order.status = 'cancelled';
  order.statusHistory.push({
    status: 'cancelled',
    note: 'Cancelled by user',
  });

  await order.save();

  res.status(200).json({ success: true, data: order });
});

exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};

  if (status) query.status = status;

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: orders,
  });
});
