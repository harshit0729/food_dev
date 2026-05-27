const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getRestaurants = asyncHandler(async (req, res, next) => {
  const { cuisine, rating, priceRange, search, page = 1, limit = 20, sort } = req.query;

  const query = { isActive: true };

  if (cuisine) query.cuisine = { $in: cuisine.split(',') };
  if (rating) query.rating = { $gte: parseFloat(rating) };
  if (priceRange) query.priceRange = priceRange;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { cuisine: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  let sortOption = {};
  if (sort === 'rating') sortOption = { rating: -1 };
  else if (sort === 'delivery') sortOption = { deliveryFee: 1 };
  else sortOption = { featured: -1, rating: -1 };

  const total = await Restaurant.countDocuments(query);
  const restaurants = await Restaurant.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: restaurants.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: restaurants,
  });
});

exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  const menuItems = await FoodItem.find({ restaurant: req.params.id, isAvailable: true });

  res.status(200).json({
    success: true,
    data: { restaurant, menuItems },
  });
});

exports.getFeaturedRestaurants = asyncHandler(async (req, res, next) => {
  const restaurants = await Restaurant.find({ featured: true, isActive: true })
    .sort({ rating: -1 })
    .limit(8);

  res.status(200).json({ success: true, data: restaurants });
});

exports.createRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({ success: true, data: restaurant });
});

exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  res.status(200).json({ success: true, data: restaurant });
});

exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  await FoodItem.deleteMany({ restaurant: req.params.id });
  await restaurant.remove();

  res.status(200).json({ success: true, message: 'Restaurant removed' });
});
