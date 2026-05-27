const express = require('express');
const router = express.Router();
const {
  getRestaurants, getRestaurant, getFeaturedRestaurants,
  createRestaurant, updateRestaurant, deleteRestaurant,
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getRestaurants);
router.get('/featured', getFeaturedRestaurants);
router.get('/:id', getRestaurant);
router.post('/', protect, authorize('admin'), createRestaurant);
router.put('/:id', protect, authorize('admin'), updateRestaurant);
router.delete('/:id', protect, authorize('admin'), deleteRestaurant);

module.exports = router;
