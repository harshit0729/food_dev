const asyncHandler = require('../utils/asyncHandler');
const aiService = require('../services/aiService');

exports.recommendByMood = asyncHandler(async (req, res, next) => {
  const { mood } = req.body;
  const recommendations = await aiService.getRecommendations(mood, 'mood', req.user?.id);
  res.status(200).json({ success: true, type: 'mood', query: mood, data: recommendations });
});

exports.recommendByWeather = asyncHandler(async (req, res, next) => {
  const { weather } = req.body;
  const recommendations = await aiService.getRecommendations(weather, 'weather', req.user?.id);
  res.status(200).json({ success: true, type: 'weather', query: weather, data: recommendations });
});

exports.recommendByBudget = asyncHandler(async (req, res, next) => {
  const { budget } = req.body;
  const recommendations = await aiService.getRecommendations(budget, 'budget', req.user?.id);
  res.status(200).json({ success: true, type: 'budget', query: budget, data: recommendations });
});

exports.recommendHealthy = asyncHandler(async (req, res, next) => {
  const { query } = req.body;
  const recommendations = await aiService.getRecommendations(query || 'healthy meals', 'healthy', req.user?.id);
  res.status(200).json({ success: true, type: 'healthy', query: query || 'healthy meals', data: recommendations });
});

exports.recommendTrending = asyncHandler(async (req, res, next) => {
  const recommendations = await aiService.getRecommendations('trending dishes right now', 'trending', req.user?.id);
  res.status(200).json({ success: true, type: 'trending', data: recommendations });
});

exports.smartSearch = asyncHandler(async (req, res, next) => {
  const { query } = req.body;
  const results = await aiService.smartSearch(query);
  res.status(200).json({ success: true, query, data: results });
});

exports.getMealPlan = asyncHandler(async (req, res, next) => {
  const { goal, preferences } = req.body;
  const mealPlan = await aiService.getMealPlan(goal, preferences);
  res.status(200).json({ success: true, goal, data: mealPlan });
});

exports.chatbot = asyncHandler(async (req, res, next) => {
  const { message, conversationHistory } = req.body;
  const response = await aiService.chatWithAI(message, conversationHistory || []);
  res.status(200).json({ success: true, data: response });
});
