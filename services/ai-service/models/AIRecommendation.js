const mongoose = require('mongoose');

const aiRecommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    queryType: { type: String, enum: ['mood', 'weather', 'budget', 'healthy', 'trending', 'meal_plan', 'search', 'chat', 'summarize'], required: true },
    query: { type: String, required: true },
    response: mongoose.Schema.Types.Mixed,
    recommendations: [{ name: String, description: String, confidence: Number }],
    feedback: { type: String, enum: ['helpful', 'not_helpful'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIRecommendation', aiRecommendationSchema);
