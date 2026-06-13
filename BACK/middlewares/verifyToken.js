const jwt = require('jsonwebtoken')
const User = require('../Models/UserSchema')

const JWT_SECRET = process.env.JWT_SECRET || 'hyperlocal_delivery_secret_key_2025'

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.'
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact admin.'
      })
    }

    req.user = user
    req.userId = user._id
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please sign in again.'
      })
    }
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    })
  }
}

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })
}

// Optional auth middleware (doesn't require auth but uses it if present)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await User.findById(decoded.id).select('-password')
      if (user && user.isActive) {
        req.user = user
        req.userId = user._id
      }
    }
    next()
  } catch {
    next()
  }
}

module.exports = {
  verifyToken,
  generateToken,
  optionalAuth,
  JWT_SECRET
}
