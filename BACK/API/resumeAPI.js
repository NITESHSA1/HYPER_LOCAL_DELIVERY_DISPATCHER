const express = require('express')
const router = express.Router()
const Resume = require('../Models/ResumeSchema')
const { verifyToken } = require('../middlewares/verifyToken')

// Generate unique delivery ID
const generateDeliveryId = () => {
  const prefix = 'DLV'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}${random}`
}

// @route   POST /api/resume/create
// @desc    Create a new delivery
// @access  Private
router.post('/create', verifyToken, async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      items,
      zone,
      amount,
      notes,
      priority,
      scheduledFor
    } = req.body

    if (!customerName || !customerPhone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name, phone, and address'
      })
    }

    const deliveryId = generateDeliveryId()

    const delivery = new Resume({
      deliveryId,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail || ''
      },
      address: typeof address === 'string' ? { street: address, city: '' } : address,
      items: items || [],
      zone: zone || 'General',
      amount: amount || 0,
      notes: notes || '',
      priority: priority || 'normal',
      scheduledFor: scheduledFor || null,
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Delivery created'
      }]
    })

    await delivery.save()

    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      delivery
    })
  } catch (error) {
    console.error('Create delivery error:', error)
    res.status(500).json({ success: false, message: 'Error creating delivery' })
  }
})

// @route   GET /api/resume/all
// @desc    Get all active deliveries (not deleted)
// @access  Private
router.get('/all', verifyToken, async (req, res) => {
  try {
    const { status, zone, page = 1, limit = 20, search } = req.query
    const filter = { isDeleted: false }

    if (status) filter.status = status
    if (zone) filter.zone = zone
    if (search) {
      filter.$or = [
        { deliveryId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'address.street': { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const deliveries = await Resume.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Resume.countDocuments(filter)

    res.json({
      success: true,
      count: deliveries.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      deliveries
    })
  } catch (error) {
    console.error('Get deliveries error:', error)
    res.status(500).json({ success: false, message: 'Error fetching deliveries' })
  }
})

// @route   GET /api/resume/recent
// @desc    Get recent deliveries
// @access  Private
router.get('/recent', verifyToken, async (req, res) => {
  try {
    const deliveries = await Resume.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({ success: true, count: deliveries.length, deliveries })
  } catch (error) {
    console.error('Get recent deliveries error:', error)
    res.status(500).json({ success: false, message: 'Error fetching recent deliveries' })
  }
})

// @route   GET /api/resume/:id
// @desc    Get single delivery by ID
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const delivery = await Resume.findOne({
      $or: [{ _id: req.params.id }, { deliveryId: req.params.id }],
      isDeleted: false
    })

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' })
    }

    res.json({ success: true, delivery })
  } catch (error) {
    console.error('Get delivery error:', error)
    res.status(500).json({ success: false, message: 'Error fetching delivery' })
  }
})

// @route   PUT /api/resume/:id
// @desc    Update delivery
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updateData = {}
    const allowedFields = [
      'customer', 'address', 'items', 'status', 'driver',
      'zone', 'amount', 'notes', 'priority', 'scheduledFor'
    ]

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field]
    })

    // Add timeline entry if status changed
    if (req.body.status) {
      updateData.$push = {
        timeline: {
          status: req.body.status,
          timestamp: new Date(),
          note: req.body.timelineNote || `Status updated to ${req.body.status}`
        }
      }
    }

    const delivery = await Resume.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { deliveryId: req.params.id }], isDeleted: false },
      updateData,
      { new: true }
    )

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' })
    }

    res.json({ success: true, message: 'Delivery updated', delivery })
  } catch (error) {
    console.error('Update delivery error:', error)
    res.status(500).json({ success: false, message: 'Error updating delivery' })
  }
})

// @route   PUT /api/resume/:id/assign-driver
// @desc    Assign driver to delivery
// @access  Private
router.put('/:id/assign-driver', verifyToken, async (req, res) => {
  try {
    const { driverName, driverPhone, driverId, vehicle } = req.body

    const delivery = await Resume.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { deliveryId: req.params.id }], isDeleted: false },
      {
        $set: {
          driver: {
            name: driverName,
            phone: driverPhone || '',
            vehicle: vehicle || '',
            id: driverId || null
          },
          status: 'assigned'
        },
        $push: {
          timeline: {
            status: 'assigned',
            timestamp: new Date(),
            note: `Driver ${driverName} assigned`
          }
        }
      },
      { new: true }
    )

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' })
    }

    res.json({ success: true, message: 'Driver assigned', delivery })
  } catch (error) {
    console.error('Assign driver error:', error)
    res.status(500).json({ success: false, message: 'Error assigning driver' })
  }
})

// @route   PUT /api/resume/:id/update-status
// @desc    Update delivery status
// @access  Private
router.put('/:id/update-status', verifyToken, async (req, res) => {
  try {
    const { status, note } = req.body

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' })
    }

    const delivery = await Resume.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { deliveryId: req.params.id }], isDeleted: false },
      {
        $set: { status },
        $push: {
          timeline: {
            status,
            timestamp: new Date(),
            note: note || `Status updated to ${status}`
          }
        }
      },
      { new: true }
    )

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' })
    }

    res.json({ success: true, message: 'Status updated', delivery })
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ success: false, message: 'Error updating status' })
  }
})

// @route   PUT /api/resume/:id/cancel
// @desc    Cancel delivery (soft delete)
// @access  Private
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { reason, note } = req.body

    const delivery = await Resume.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { deliveryId: req.params.id }], isDeleted: false },
      {
        $set: {
          status: 'cancelled',
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: req.userId,
          cancelReason: reason || 'other',
          cancelledBy: req.user?.fullName || 'System'
        },
        $push: {
          timeline: {
            status: 'cancelled',
            timestamp: new Date(),
            note: note || `Delivery cancelled. Reason: ${reason || 'other'}`
          }
        }
      },
      { new: true }
    )

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' })
    }

    res.json({ success: true, message: 'Delivery cancelled', delivery })
  } catch (error) {
    console.error('Cancel delivery error:', error)
    res.status(500).json({ success: false, message: 'Error cancelling delivery' })
  }
})

// @route   GET /api/resume/trash
// @desc    Get all cancelled/deleted deliveries
// @access  Private
router.get('/trash', verifyToken, async (req, res) => {
  try {
    const { reason, page = 1, limit = 20 } = req.query
    const filter = { isDeleted: true }

    if (reason) filter.cancelReason = reason

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const items = await Resume.find(filter)
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Resume.countDocuments(filter)

    res.json({
      success: true,
      count: items.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      items
    })
  } catch (error) {
    console.error('Get trash error:', error)
    res.status(500).json({ success: false, message: 'Error fetching trash items' })
  }
})

// @route   PUT /api/resume/restore/:id
// @desc    Restore a cancelled delivery
// @access  Private
router.put('/restore/:id', verifyToken, async (req, res) => {
  try {
    const delivery = await Resume.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { deliveryId: req.params.id }], isDeleted: true },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          status: 'pending',
          cancelReason: '',
          cancelledBy: ''
        },
        $push: {
          timeline: {
            status: 'restored',
            timestamp: new Date(),
            note: 'Delivery restored from trash'
          }
        }
      },
      { new: true }
    )

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found in trash' })
    }

    res.json({ success: true, message: 'Delivery restored', delivery })
  } catch (error) {
    console.error('Restore delivery error:', error)
    res.status(500).json({ success: false, message: 'Error restoring delivery' })
  }
})

// @route   DELETE /api/resume/permanent/:id
// @desc    Permanently delete a delivery
// @access  Private
router.delete('/permanent/:id', verifyToken, async (req, res) => {
  try {
    const delivery = await Resume.findOneAndDelete({
      $or: [{ _id: req.params.id }, { deliveryId: req.params.id }],
      isDeleted: true
    })

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found in trash' })
    }

    res.json({ success: true, message: 'Delivery permanently deleted' })
  } catch (error) {
    console.error('Permanent delete error:', error)
    res.status(500).json({ success: false, message: 'Error deleting delivery' })
  }
})

// @route   GET /api/resume/stats/overview
// @desc    Get delivery statistics overview
// @access  Private
router.get('/stats/overview', verifyToken, async (req, res) => {
  try {
    const total = await Resume.countDocuments({ isDeleted: false })
    const delivered = await Resume.countDocuments({ status: 'delivered', isDeleted: false })
    const inTransit = await Resume.countDocuments({ status: 'in_transit', isDeleted: false })
    const pending = await Resume.countDocuments({ status: 'pending', isDeleted: false })
    const cancelled = await Resume.countDocuments({ status: 'cancelled', isDeleted: false })
    const assigned = await Resume.countDocuments({ status: 'assigned', isDeleted: false })

    // Get zone distribution
    const zoneStats = await Resume.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$zone', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Get daily stats for last 7 days
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const dailyStats = await Resume.aggregate([
      { $match: { isDeleted: false, createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.json({
      success: true,
      overview: { total, delivered, inTransit, pending, cancelled, assigned },
      zoneStats,
      dailyStats
    })
  } catch (error) {
    console.error('Stats overview error:', error)
    res.status(500).json({ success: false, message: 'Error fetching stats' })
  }
})

module.exports = router
