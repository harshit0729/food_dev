const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    isAvailable: { type: Boolean, default: true },
    isVegetarian: { type: Boolean, default: true },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    spiceLevel: { type: String, enum: ['mild', 'medium', 'hot'], default: 'medium' },
    preparationTime: { type: Number, default: 15 },
    orderCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    nutritionalInfo: { calories: Number, protein: Number, carbs: Number, fat: Number },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoodItem', foodItemSchema);
