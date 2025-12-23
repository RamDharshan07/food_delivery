const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    required: true,
    unique: true
  },
  restaurantId: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  items: [{
    menuItemId: Number,
    name: String,
    quantity: Number,
    price: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model('Order', orderSchema)


