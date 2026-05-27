const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a food item name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be positive'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price must be positive'],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Appetizer', 'Main Course', 'Dessert', 'Beverage',
        'Snack', 'Salad', 'Soup', 'Breakfast', 'Lunch', 'Dinner',
        'Vegan', 'Vegetarian', 'Non-Veg', 'Continental', 'Chinese',
        'Italian', 'Indian', 'Mexican', 'Japanese', 'Thai',
      ],
    },
    cuisine: {
      type: String,
      required: [true, 'Please add cuisine type'],
    },
    image: {
      type: String,
      default: '',
    },
    ingredients: [String],
    nutritionalInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'extra hot'],
      default: 'medium',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    aiDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

foodItemSchema.index({ restaurant: 1, category: 1 });
foodItemSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('FoodItem', foodItemSchema);
