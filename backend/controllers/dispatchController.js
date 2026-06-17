const Dispatch = require('../models/Dispatch');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get all dispatches (Admin)
// @route   GET /api/dispatch
// @access  Admin only
const getAllDispatches = async (req, res) => {
  try {
    const { status, rider, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status && status !== 'all') query.status = status;
    if (rider) query.rider = rider;

    const dispatches = await Dispatch.find(query)
      .populate('order', 'orderNumber status totalAmount deliveryAddress')
      .populate('rider', 'name phone vehicleType rating')
      .sort('-assignedAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Dispatch.countDocuments(query);

    res.json({
      success: true,
      count: dispatches.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      dispatches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get rider's dispatches
// @route   GET /api/dispatch/my-dispatches
// @access  Private (Rider)
const getMyDispatches = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { rider: req.user._id };
    if (status && status !== 'all') query.status = status;

    const dispatches = await Dispatch.find(query)
      .populate({
        path: 'order',
        populate: { path: 'user', select: 'name phone' }
      })
      .sort('-assignedAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Dispatch.countDocuments(query);

    res.json({
      success: true,
      count: dispatches.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      dispatches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create dispatch (Admin)
// @route   POST /api/dispatch
// @access  Admin only
const createDispatch = async (req, res) => {
  try {
    const { orderId, riderId, pickupAddress, deliveryAddress, estimatedDistance, estimatedTime, notes } = req.body;

    // Check order exists and is ready for dispatch
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'ready' && order.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Order is not ready for dispatch' });
    }

    // Check rider
    const rider = await User.findOne({ _id: riderId, role: 'rider' });
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }

    // Check if dispatch already exists for this order
    const existingDispatch = await Dispatch.findOne({ order: orderId, status: { $nin: ['delivered', 'cancelled', 'failed'] } });
    if (existingDispatch) {
      return res.status(400).json({ success: false, message: 'Active dispatch already exists for this order' });
    }

    // Create dispatch
    const dispatch = await Dispatch.create({
      order: orderId,
      rider: riderId,
      pickupAddress: pickupAddress || order.deliveryAddress,
      deliveryAddress: deliveryAddress || order.deliveryAddress,
      estimatedDistance: estimatedDistance || 5,
      estimatedTime: estimatedTime || 30,
      notes: notes || ''
    });

    // Update order
    order.status = 'dispatched';
    order.rider = riderId;
    order.timeline.push({
      status: 'dispatched',
      timestamp: new Date(),
      note: `Dispatched to rider ${rider.name}`
    });
    await order.save();

    // Update rider availability
    await User.findByIdAndUpdate(riderId, { isAvailable: false });

    await dispatch.populate('order', 'orderNumber totalAmount status');
    await dispatch.populate('rider', 'name phone vehicleType');

    res.status(201).json({
      success: true,
      message: 'Dispatch created successfully',
      dispatch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update dispatch status (Rider)
// @route   PUT /api/dispatch/:id/status
// @access  Private (Rider)
const updateDispatchStatus = async (req, res) => {
  try {
    const { status, location, note } = req.body;
    const dispatchId = req.params.id;

    const dispatch = await Dispatch.findOne({
      _id: dispatchId,
      rider: req.user._id
    });

    if (!dispatch) {
      return res.status(404).json({ success: false, message: 'Dispatch not found or not assigned to you' });
    }

    // Valid status transitions for rider
    const validTransitions = {
      'assigned': ['accepted', 'cancelled'],
      'accepted': ['picked_up', 'cancelled'],
      'picked_up': ['in_transit'],
      'in_transit': ['delivered', 'failed']
    };

    if (!validTransitions[dispatch.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${dispatch.status} to ${status}`
      });
    }

    dispatch.status = status;

    // Update timestamps
    if (status === 'accepted') dispatch.acceptedAt = new Date();
    if (status === 'picked_up') dispatch.pickedUpAt = new Date();
    if (status === 'delivered') dispatch.deliveredAt = new Date();

    // Update current location
    if (location && location.coordinates) {
      dispatch.currentLocation = {
        type: 'Point',
        coordinates: location.coordinates
      };
    }

    // Add to tracking history
    dispatch.trackingHistory.push({
      status,
      location: location?.coordinates ? {
        type: 'Point',
        coordinates: location.coordinates
      } : dispatch.currentLocation,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });

    await dispatch.save();

    // Update corresponding order status
    const orderStatusMap = {
      'accepted': 'dispatched',
      'picked_up': 'picked_up',
      'in_transit': 'in_transit',
      'delivered': 'delivered',
      'failed': 'cancelled'
    };

    if (orderStatusMap[status]) {
      await Order.findByIdAndUpdate(dispatch.order, {
        status: orderStatusMap[status],
        $push: {
          timeline: {
            status: orderStatusMap[status],
            timestamp: new Date(),
            note: note || `Dispatch ${status}`
          }
        }
      });
    }

    // If delivered or failed, make rider available again
    if (status === 'delivered' || status === 'failed') {
      await User.findByIdAndUpdate(req.user._id, { isAvailable: true });
    }

    await dispatch.populate('order', 'orderNumber status');

    res.json({
      success: true,
      message: 'Dispatch status updated',
      dispatch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update rider location
// @route   PUT /api/dispatch/:id/location
// @access  Private (Rider)
const updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const dispatchId = req.params.id;

    const dispatch = await Dispatch.findOne({
      _id: dispatchId,
      rider: req.user._id
    });

    if (!dispatch) {
      return res.status(404).json({ success: false, message: 'Dispatch not found' });
    }

    dispatch.currentLocation = {
      type: 'Point',
      coordinates
    };

    dispatch.trackingHistory.push({
      status: dispatch.status,
      location: {
        type: 'Point',
        coordinates
      },
      timestamp: new Date(),
      note: 'Location updated'
    });

    await dispatch.save();

    res.json({
      success: true,
      message: 'Location updated',
      dispatch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get available riders
// @route   GET /api/dispatch/available-riders
// @access  Admin only
const getAvailableRiders = async (req, res) => {
  try {
    const riders = await User.find({
      role: 'rider',
      isActive: true,
      isAvailable: true
    }).select('name phone vehicleType vehicleNumber rating totalDeliveries location');

    res.json({
      success: true,
      count: riders.length,
      riders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dispatch details
// @route   GET /api/dispatch/:id
// @access  Private (Admin, involved Rider, or Order owner)
const getDispatch = async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id)
      .populate('order')
      .populate('rider', 'name phone vehicleType rating');

    if (!dispatch) {
      return res.status(404).json({ success: false, message: 'Dispatch not found' });
    }

    // Check authorization
    const order = await Order.findById(dispatch.order._id || dispatch.order);
    const isRider = dispatch.rider._id?.toString() === req.user._id.toString() || dispatch.rider.toString() === req.user._id.toString();
    const isOwner = order?.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRider && !isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      dispatch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update rider availability
// @route   PUT /api/dispatch/rider/availability
// @access  Private (Rider)
const updateRiderAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isAvailable },
      { new: true }
    );

    res.json({
      success: true,
      message: `You are now ${isAvailable ? 'available' : 'unavailable'} for deliveries`,
      isAvailable: user.isAvailable
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active dispatch for rider
// @route   GET /api/dispatch/active
// @access  Private (Rider)
const getActiveDispatch = async (req, res) => {
  try {
    const dispatch = await Dispatch.findOne({
      rider: req.user._id,
      status: { $in: ['assigned', 'accepted', 'picked_up', 'in_transit'] }
    })
    .populate({
      path: 'order',
      populate: { path: 'user', select: 'name phone address' }
    });

    if (!dispatch) {
      return res.json({
        success: true,
        hasActiveDispatch: false,
        message: 'No active dispatch'
      });
    }

    res.json({
      success: true,
      hasActiveDispatch: true,
      dispatch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel dispatch (Admin)
// @route   PUT /api/dispatch/:id/cancel
// @access  Admin only
const cancelDispatch = async (req, res) => {
  try {
    const { reason } = req.body;
    const dispatch = await Dispatch.findById(req.params.id);

    if (!dispatch) {
      return res.status(404).json({ success: false, message: 'Dispatch not found' });
    }

    dispatch.status = 'cancelled';
    dispatch.trackingHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: reason || 'Dispatch cancelled by admin'
    });
    await dispatch.save();

    // Update order back to ready
    await Order.findByIdAndUpdate(dispatch.order, {
      status: 'ready',
      rider: null,
      $push: {
        timeline: {
          status: 'ready',
          timestamp: new Date(),
          note: reason || 'Dispatch cancelled, ready for reassignment'
        }
      }
    });

    // Make rider available
    await User.findByIdAndUpdate(dispatch.rider, { isAvailable: true });

    res.json({
      success: true,
      message: 'Dispatch cancelled',
      dispatch
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
