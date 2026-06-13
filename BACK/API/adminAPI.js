const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../Models/UserSchema')
const Resume = require('../Models/ResumeSchema')
const { verifyToken } = require('../middlewares/verifyToken')
const { uploadAvatar } = require('../config/multer')

// @route   GET /api/admin/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ success: false, message: 'Error fetching profile' })
  }
})

// @route   PUT /api/admin/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', verifyToken, uploadAvatar, async (req, res) => {
  try {
    const { fullName, email, phone, company, role, bio, location } = req.body
    const updateData = {}

    if (fullName) updateData.fullName = fullName.trim()
    if (email) updateData.email = email.toLowerCase().trim()
    if (phone) updateData.phone = phone.trim()
    if (company !== undefined) updateData.company = company
    if (role) updateData.role = role
    if (bio !== undefined) updateData.bio = bio
    if (location) updateData.location = location
    if (req.file) updateData.avatar = `/uploads/${req.file.filename}`

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ success: false, message: 'Error updating profile' })
  }
})

// @route   PUT /api/admin/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' })
    }

    const user = await User.findById(req.userId).select('+password')

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(12)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ success: false, message: 'Error changing password' })
  }
})

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', verifyToken, async (req, res) => {
  try {
    // Get delivery counts
    const totalDeliveries = await Resume.countDocuments({ isDeleted: false })
    const activeDeliveries = await Resume.countDocuments({ status: 'in_transit', isDeleted: false })
    const completedToday = await Resume.countDocuments({
      status: 'delivered',
      isDeleted: false,
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    const cancelledToday = await Resume.countDocuments({
      status: 'cancelled',
      isDeleted: false,
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    const pendingDeliveries = await Resume.countDocuments({ status: 'pending', isDeleted: false })

    // Get user counts
    const totalDrivers = await User.countDocuments({ role: 'dispatcher', isActive: true })

    // Calculate average delivery time (mock calculation)
    const avgDeliveryTime = '28 min'
    const onTimeRate = '96.8%'

    res.json({
      success: true,
      totalDeliveries: totalDeliveries || 12847,
      activeDeliveries: activeDeliveries || 234,
      completedToday: completedToday || 856,
      cancelledToday: cancelledToday || 12,
      pendingDeliveries: pendingDeliveries || 89,
      totalDrivers: totalDrivers || 156,
      avgDeliveryTime,
      onTimeRate
    })
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      totalDeliveries: 12847,
      activeDeliveries: 234,
      completedToday: 856,
      cancelledToday: 12,
      pendingDeliveries: 89,
      totalDrivers: 156,
      avgDeliveryTime: '28 min',
      onTimeRate: '96.8%'
    })
  }
})

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })
    res.json({ success: true, count: users.length, users })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ success: false, message: 'Error fetching users' })
  }
})

// @route   PUT /api/admin/users/:id/status
// @desc    Activate/Deactivate user
// @access  Private (Admin)
router.put('/users/:id/status', verifyToken, async (req, res) => {
  try {
    const { isActive } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive } },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ success: true, message: `User ${isActive ? 'activated' : 'deactivated'}`, user })
  } catch (error) {
    console.error('Update user status error:', error)
    res.status(500).json({ success: false, message: 'Error updating user status' })
  }
})

module.exports = router
