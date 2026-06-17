const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'accepted', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled'],
    default: 'assigned'
  },
  
  // Pickup details
  pickupAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    }
  },
  
  // Delivery details
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    }
  },
  
  // Distance and route info
  estimatedDistance: { type: Number, default: 0 }, // in km
  estimatedTime: { type: Number, default: 0 }, // in minutes
  
  // Real-time tracking
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  
  // Tracking history
  trackingHistory: [{
    status: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' }
  }],
  
  // Timestamps
  assignedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date },
  pickedUpAt: { type: Date },
  deliveredAt: { type: Date },
  
  // Delivery confirmation
  deliveryProof: {
    photo: { type: String, default: '' },
    signature: { type: String, default: '' },
    otp: { type: String, default: '' },
    verified: { type: Boolean, default: false }
  },
  
  // Earnings
  riderEarning: { type: Number, default: 0 },
  
  // Notes
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

dispatchSchema.index({ rider: 1, status: 1 });
dispatchSchema.index({ order: 1 });
dispatchSchema.index({ currentLocation: '2dsphere' });
dispatchSchema.index({ assignedAt: -1 });

module.exports = mongoose.model('Dispatch', dispatchSchema);
