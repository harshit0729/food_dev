const express = require('express');
const router = express.Router();
const {
  getFoodItems, getFoodItem, getFeaturedItems,
  createFoodItem, updateFoodItem, deleteFoodItem,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getFoodItems);
router.get('/featured', getFeaturedItems);
router.get('/:id', getFoodItem);
router.post('/', protect, authorize('admin'), createFoodItem);
router.put('/:id', protect, authorize('admin'), updateFoodItem);
router.delete('/:id', protect, authorize('admin'), deleteFoodItem);

module.exports = router;
