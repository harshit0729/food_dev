const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: String,
    coverImage: String,
    cuisine: [String],
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    contact: { phone: String, email: String },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    deliveryTime: { type: String, default: '30-40 min' },
    minOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isOpen: { type: Boolean, default: true },
    openingHours: { open: String, close: String },
    orderCount: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
