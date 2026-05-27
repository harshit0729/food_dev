const FoodItem = require('../models/FoodItem');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getFoodItems = asyncHandler(async (req, res, next) => {
  const {
    restaurant, category, cuisine, isVegetarian, isVegan,
    isGlutenFree, minPrice, maxPrice, spiceLevel, search,
    page = 1, limit = 20, sort,
  } = req.query;

  const query = { isAvailable: true };

  if (restaurant) query.restaurant = restaurant;
  if (category) query.category = { $in: category.split(',') };
  if (cuisine) query.cuisine = { $in: cuisine.split(',') };
  if (isVegetarian) query.isVegetarian = isVegetarian === 'true';
  if (isVegan) query.isVegan = isVegan === 'true';
  if (isGlutenFree) query.isGlutenFree = isGlutenFree === 'true';
  if (spiceLevel) query.spiceLevel = spiceLevel;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
      { cuisine: { $regex: search, $options: 'i' } },
    ];
  }

  let sortOption = {};
  if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };
  else if (sort === 'popular') sortOption = { orderCount: -1 };
  else sortOption = { isFeatured: -1, rating: -1 };

  const total = await FoodItem.countDocuments(query);
  const items = await FoodItem.find(query)
    .populate('restaurant', 'name cuisine rating deliveryTime deliveryFee')
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: items,
  });
});

exports.getFoodItem = asyncHandler(async (req, res, next) => {
  const item = await FoodItem.findById(req.params.id)
    .populate('restaurant', 'name cuisine rating image deliveryTime deliveryFee');

  if (!item) {
    return next(new ErrorResponse('Food item not found', 404));
  }

  res.status(200).json({ success: true, data: item });
});

exports.getFeaturedItems = asyncHandler(async (req, res, next) => {
  const items = await FoodItem.find({ isFeatured: true, isAvailable: true })
    .populate('restaurant', 'name cuisine')
    .sort({ rating: -1 })
    .limit(8);

  res.status(200).json({ success: true, data: items });
});

exports.createFoodItem = asyncHandler(async (req, res, next) => {
  const item = await FoodItem.create(req.body);

  await item.constructor.populate(item, { path: 'restaurant', select: 'name' });

  res.status(201).json({ success: true, data: item });
});

exports.updateFoodItem = asyncHandler(async (req, res, next) => {
  const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    return next(new ErrorResponse('Food item not found', 404));
  }

  res.status(200).json({ success: true, data: item });
});

exports.deleteFoodItem = asyncHandler(async (req, res, next) => {
  const item = await FoodItem.findById(req.params.id);
  if (!item) {
    return next(new ErrorResponse('Food item not found', 404));
  }

  await item.remove();
  res.status(200).json({ success: true, message: 'Food item removed' });
});
