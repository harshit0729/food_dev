const express = require('express');
const router = express.Router();
const {
  recommendByMood, recommendByWeather, recommendByBudget,
  recommendHealthy, recommendTrending, smartSearch,
  getMealPlan, chatbot,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/recommend/mood', protect, recommendByMood);
router.post('/recommend/weather', protect, recommendByWeather);
router.post('/recommend/budget', protect, recommendByBudget);
router.post('/recommend/healthy', protect, recommendHealthy);
router.post('/recommend/trending', protect, recommendTrending);
router.post('/search', smartSearch);
router.post('/meal-plan', protect, getMealPlan);
router.post('/chat', chatbot);

module.exports = router;
