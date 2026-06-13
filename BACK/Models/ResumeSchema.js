const mongoose = require('mongoose')

const ResumeSchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' }
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    }
  },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    weight: { type: Number, default: 0 },
    price: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  driver: {
    name: { type: String, default: 'Unassigned' },
    phone: { type: String, default: '' },
    vehicle: { type: String, default: '' },
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  zone: {
    type: String,
    default: 'General'
  },
  amount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  timeline: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' }
  }],
  // Soft delete fields
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  cancelReason: {
    type: String,
    enum: ['customer_request', 'address_issue', 'item_unavailable', 'delivery_failed', 'weather_delay', 'other', ''],
    default: ''
  },
  cancelledBy: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

// Indexes
ResumeSchema.index({ deliveryId: 1 })
ResumeSchema.index({ status: 1 })
ResumeSchema.index({ isDeleted: 1 })
ResumeSchema.index({ zone: 1 })
ResumeSchema.index({ 'driver.id': 1 })
ResumeSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Resume', ResumeSchema)
