const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { 
      deliveryAddress, 
      paymentMethod = 'cash', 
      deliveryInstructions = '' 
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}` 
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    }));

    // Calculate totals
    const subtotal = cart.totalAmount;
    const deliveryFee = cart.deliveryFee;
    const discount = cart.discount;
    const tax = subtotal * 0.05; // 5% tax
    const totalAmount = subtotal + deliveryFee + tax - discount;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress: {
        ...deliveryAddress,
        location: {
          type: 'Point',
          coordinates: deliveryAddress.coordinates || [0, 0]
        }
      },
      paymentMethod,
      deliveryInstructions,
      subtotal,
      deliveryFee,
      discount,
      tax,
      totalAmount,
      timeline: [{ status: 'pending', timestamp: new Date(), note: 'Order placed' }]
    });

    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0, finalAmount: 0, discount: 0, couponCode: '' }
    );

    await order.populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('rider', 'name phone vehicleType rating')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('rider', 'name phone vehicleType rating totalDeliveries');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    if (order.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' &&
        (req.user.role !== 'rider' || order.rider?._id?.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin, Rider, or Owner)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note = '' } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    const isOwner = order.user.toString() === req.user._id.toString();
    const isRider = order.rider?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isRider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Customer can only cancel pending orders
    if (isOwner && !isAdmin && status === 'cancelled') {
      if (!['pending', 'confirmed'].includes(order.status)) {
        return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage' });
      }
    } else if (isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Customers can only cancel orders' });
    }

    // Valid status transitions
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready'],
      'ready': ['dispatched', 'cancelled'],
      'dispatched': ['picked_up'],
      'picked_up': ['in_transit'],
      'in_transit': ['delivered'],
      'delivered': ['refunded'],
      'cancelled': [],
      'refunded': []
    };

    if (!validTransitions[order.status]?.includes(status) && !isAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot transition from ${order.status} to ${status}` 
      });
    }

    order.status = status;
    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });

    // Set timestamps based on status
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
      order.paymentStatus = 'completed';
    }

    await order.save();
    await order.populate('rider', 'name phone');

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign rider to order (Admin only)
// @route   PUT /api/orders/:id/assign
// @access  Admin only
const assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if rider exists and is available
    const rider = await User.findOne({ _id: riderId, role: 'rider', isAvailable: true });
    if (!rider) {
      return res.status(400).json({ success: false, message: 'Rider not found or not available' });
    }

    order.rider = riderId;
    order.status = 'dispatched';
    order.timeline.push({
      status: 'dispatched',
      timestamp: new Date(),
      note: `Assigned to rider ${rider.name}`
    });
    order.estimatedDeliveryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await order.save();

    // Update rider availability
    await User.findByIdAndUpdate(riderId, { isAvailable: false });

    await order.populate('rider', 'name phone vehicleType');
    await order.populate('user', 'name email phone');

    res.json({
      success: true,
      message: 'Rider assigned successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rate order
// @route   POST /api/orders/:id/rate
// @access  Private (Order owner)
const rateOrder = async (req, res) => {
  try {
    const { rating, comment, riderRating } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to rate this order' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Can only rate delivered orders' });
    }

    if (order.rating?.value) {
      return res.status(400).json({ success: false, message: 'Order already rated' });
    }

    order.rating = {
      value: rating,
      comment: comment || '',
      riderRating: riderRating || rating
    };

    await order.save();

    // Update rider rating
    if (order.rider && riderRating) {
      const riderOrders = await Order.find({ 
        rider: order.rider, 
        status: 'delivered',
        'rating.riderRating': { $exists: true }
      });
      
      const avgRating = riderOrders.reduce((sum, o) => sum + o.rating.riderRating, 0) / riderOrders.length;
      await User.findByIdAndUpdate(order.rider, { 
        rating: Math.round(avgRating * 10) / 10,
        $inc: { totalDeliveries: 1 }
      });
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Admin only
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('rider', 'name phone vehicleType')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    // Get summary stats
    const summary = await Order.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      summary: summary[0] || {},
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  assignRider,
  rateOrder,
  getAllOrders
};
