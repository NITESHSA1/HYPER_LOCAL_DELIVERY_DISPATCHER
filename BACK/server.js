const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config()

// Import API routes
const commonAPI = require('./API/commonAPI')
const adminAPI = require('./API/adminAPI')
const resumeAPI = require('./API/resumeAPI')

// Initialize Express app
const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Hyper Local Delivery Dispatcher API is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// API Routes
app.use('/api/common', commonAPI)
app.use('/api/admin', adminAPI)
app.use('/api/resume', resumeAPI)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Hyper Local Delivery Dispatcher API',
    version: '1.0.0',
    endpoints: {
      common: '/api/common',
      admin: '/api/admin',
      resume: '/api/resume',
      health: '/health'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// MongoDB connection
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hyperlocal_delivery'

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`API Base URL: http://localhost:${PORT}/api`)
      console.log(`Health Check: http://localhost:${PORT}/health`)
    })
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error.message)
    console.log('Starting server without MongoDB...')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without MongoDB)`)
    })
  })

module.exports = app
