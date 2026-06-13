const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../Models/UserSchema')
const { generateToken } = require('../middlewares/verifyToken')
const { uploadAvatar } = require('../config/multer')

// @route   POST /api/common/register
// @desc    Register a new user
// @access  Public
router.post('/register', uploadAvatar, async (req, res) => {
  try {
    const { fullName, email, password, phone, company, role, bio, location } = req.body

    // Validation
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, email, password, phone'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Handle avatar upload
    let avatarUrl = ''
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`
    }

    // Create user
    const user = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      company: company || '',
      role: role || 'dispatcher',
      avatar: avatarUrl,
      bio: bio || '',
      location: location || 'San Francisco, CA'
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    // Return user data (without password)
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
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
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating account. Please try again.'
    })
  }
})

// @route   POST /api/common/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact admin.'
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
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
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Error during login. Please try again.'
    })
  }
})

// @route   GET /api/common/verify
// @desc    Verify token validity
// @access  Public (with token)
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const jwt = require('jsonwebtoken')
    const { JWT_SECRET } = require('../middlewares/verifyToken')
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    res.json({ success: true, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } })
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
})

// @route   POST /api/common/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(200).json({ success: true, message: 'If an account exists, a reset link will be sent.' })
    }

    // In production, send email with reset link
    res.status(200).json({ success: true, message: 'Password reset instructions sent to your email.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

module.exports = router
