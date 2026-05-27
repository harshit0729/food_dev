const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    images: [String],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    aiSummary: {
      sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
      },
      summary: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ foodItem: 1 });
reviewSchema.index({ restaurant: 1 });
reviewSchema.index({ user: 1 });

module.exports = mongoose.model('Review', reviewSchema);
