const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllDispatches,
  getMyDispatches,
  createDispatch,
  updateDispatchStatus,
  updateLocation,
  getAvailableRiders,
  getDispatch,
  updateRiderAvailability,
  getActiveDispatch,
  cancelDispatch
} = require('../controllers/dispatchController');

// Rider routes
router.get('/my-dispatches', protect, authorize('rider', 'admin'), getMyDispatches);
router.get('/active', protect, authorize('rider'), getActiveDispatch);
router.put('/rider/availability', protect, authorize('rider'), updateRiderAvailability);
router.put('/:id/status', protect, authorize('rider'), updateDispatchStatus);
router.put('/:id/location', protect, authorize('rider'), updateLocation);

// Admin routes
router.get('/', protect, authorize('admin'), getAllDispatches);
router.post('/', protect, authorize('admin'), createDispatch);
router.get('/available-riders', protect, authorize('admin'), getAvailableRiders);
router.get('/:id', protect, authorize('admin', 'rider', 'customer'), getDispatch);
router.put('/:id/cancel', protect, authorize('admin'), cancelDispatch);

module.exports = router;