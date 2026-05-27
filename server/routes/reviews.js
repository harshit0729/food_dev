const express = require('express');
const router = express.Router();
const {
  getReviews, createReview, summarizeReviews, deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/', getReviews);
router.post('/', protect, createReview);
router.get('/summarize/:restaurantId', summarizeReviews);
router.get('/summarize/:restaurantId/:foodItemId', summarizeReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
