const Review = require('../models/Review');
const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const aiService = require('../services/aiService');

exports.getReviews = asyncHandler(async (req, res, next) => {
  const { foodItem, restaurant, page = 1, limit = 10 } = req.query;
  const query = { isActive: true };

  if (foodItem) query.foodItem = foodItem;
  if (restaurant) query.restaurant = restaurant;

  const total = await Review.countDocuments(query);
  const reviews = await Review.find(query)
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const averageRating = await Review.aggregate([
    { $match: query },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    averageRating: averageRating[0]?.avgRating || 0,
    ratingCount: averageRating[0]?.count || 0,
    data: reviews,
  });
});

exports.createReview = asyncHandler(async (req, res, next) => {
  const { foodItem, restaurant, rating, title, comment } = req.body;

  const existingReview = await Review.findOne({
    user: req.user.id,
    foodItem,
    restaurant,
  });

  const order = await Order.findOne({
    user: req.user.id,
    restaurant,
    status: 'delivered',
    isRated: false,
  });

  const review = await Review.create({
    user: req.user.id,
    foodItem,
    restaurant,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!order,
  });

  if (order) {
    order.isRated = true;
    order.rating = rating;
    await order.save();
  }

  const stats = await Review.aggregate([
    { $match: { restaurant: review.restaurant } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(restaurant, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      totalRatings: stats[0].count,
    });
  }

  if (foodItem) {
    const itemStats = await Review.aggregate([
      { $match: { foodItem: review.foodItem } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (itemStats.length > 0) {
      await FoodItem.findByIdAndUpdate(foodItem, {
        rating: Math.round(itemStats[0].avgRating * 10) / 10,
        totalRatings: itemStats[0].count,
      });
    }
  }

  const populated = await Review.findById(review._id)
    .populate('user', 'name avatar');

  res.status(201).json({ success: true, data: populated });
});

exports.summarizeReviews = asyncHandler(async (req, res, next) => {
  const { restaurantId, foodItemId } = req.params;

  const query = { isActive: true };
  if (foodItemId) query.foodItem = foodItemId;
  else query.restaurant = restaurantId;

  const reviews = await Review.find(query).select('comment rating').limit(20);

  if (reviews.length === 0) {
    return next(new ErrorResponse('No reviews to summarize', 404));
  }

  const name = foodItemId ? 'this item' : 'this restaurant';
  const summary = await aiService.summarizeReviews(reviews, name);

  res.status(200).json({ success: true, data: summary });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized', 403));
  }

  review.isActive = false;
  await review.save();

  res.status(200).json({ success: true, message: 'Review removed' });
});
