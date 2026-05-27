const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id })
    .populate('items.foodItem')
    .populate('restaurant', 'name image deliveryFee');

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({ success: true, data: cart });
});

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { foodItemId, quantity = 1, specialInstructions } = req.body;

  const foodItem = await FoodItem.findById(foodItemId);
  if (!foodItem) {
    return next(new ErrorResponse('Food item not found', 404));
  }

  if (!foodItem.isAvailable) {
    return next(new ErrorResponse('Food item is not available', 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      restaurant: foodItem.restaurant,
      items: [],
    });
  }

  if (cart.restaurant && cart.restaurant.toString() !== foodItem.restaurant.toString()) {
    return next(new ErrorResponse(
      'Cannot add items from different restaurants. Clear cart first.',
      400
    ));
  }

  cart.restaurant = foodItem.restaurant;

  const existingIndex = cart.items.findIndex(
    (item) => item.foodItem.toString() === foodItemId
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({
      foodItem: foodItemId,
      name: foodItem.name,
      price: foodItem.price,
      image: foodItem.image,
      quantity,
      specialInstructions,
    });
  }

  await calculateCartTotals(cart);
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.foodItem')
    .populate('restaurant', 'name image deliveryFee');

  res.status(200).json({ success: true, data: cart });
});

exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity, specialInstructions } = req.body;
  const { itemId } = req.params;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const item = cart.items.id(itemId);
  if (!item) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  if (quantity !== undefined) {
    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }
  }

  if (specialInstructions !== undefined) {
    item.specialInstructions = specialInstructions;
  }

  await calculateCartTotals(cart);
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.foodItem')
    .populate('restaurant', 'name image deliveryFee');

  res.status(200).json({ success: true, data: cart });
});

exports.removeFromCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items.pull(req.params.itemId);

  if (cart.items.length === 0) {
    cart.restaurant = undefined;
  }

  await calculateCartTotals(cart);
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.foodItem')
    .populate('restaurant', 'name image deliveryFee');

  res.status(200).json({ success: true, data: cart });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [], restaurant: undefined, subtotal: 0, deliveryFee: 0, tax: 0, total: 0 },
    { new: true }
  );

  res.status(200).json({ success: true, data: cart });
});

const calculateCartTotals = async (cart) => {
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const deliveryFee = cart.deliveryFee || 0;
  const tax = subtotal * 0.05;

  cart.subtotal = subtotal;
  cart.deliveryFee = deliveryFee;
  cart.tax = tax;

  const discount = cart.promoCode?.discount || 0;
  cart.total = subtotal + deliveryFee + tax - discount;
};
