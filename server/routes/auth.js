const express = require('express');
const router = express.Router();
const {
  register, login, logout, getMe,
  updateProfile, updatePassword,
  addAddress, deleteAddress,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);

module.exports = router;
