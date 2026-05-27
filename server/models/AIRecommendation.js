const mongoose = require('mongoose');

const aiRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    queryType: {
      type: String,
      enum: [
        'mood', 'weather', 'budget', 'healthy',
        'trending', 'meal_plan', 'search', 'chat',
      ],
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    recommendations: [
      {
        foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
        name: String,
        reason: String,
        score: Number,
      },
    ],
    feedback: {
      wasHelpful: Boolean,
      userRating: { type: Number, min: 1, max: 5 },
    },
    isCached: {
      type: Boolean,
      default: false,
    },
    cacheExpiry: Date,
  },
  {
    timestamps: true,
  }
);

aiRecommendationSchema.index({ user: 1, createdAt: -1 });
aiRecommendationSchema.index({ queryType: 1 });

module.exports = mongoose.model('AIRecommendation', aiRecommendationSchema);
