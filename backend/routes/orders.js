const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  assignRider,
  rateOrder,
  getAllOrders
} = require('../controllers/orderController');

// User routes
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateOrderStatus);
router.post('/:id/rate', protect, rateOrder);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/:id/assign', protect, authorize('admin'), assignRider);

module.exports = router;