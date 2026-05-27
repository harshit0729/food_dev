const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a restaurant name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    cuisine: {
      type: [String],
      required: [true, 'Please add at least one cuisine type'],
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
    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    minOrder: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: String,
      default: '20-30 min',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    image: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    contact: {
      phone: String,
      email: String,
    },
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    menuCount: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
