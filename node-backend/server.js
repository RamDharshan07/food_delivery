require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const connectDB = require('./config/database')
const Order = require('./models/Order')

const app = express()
const PORT = process.env.PORT || 4000
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:6000'
const AUTH_USERNAME = process.env.AUTH_USERNAME || 'demo'
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'password123'
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'demo-token'

// Connect to MongoDB
connectDB()

app.use(cors())
app.use(express.json())

// Logging middleware to show which instance handled the request
app.use((req, res, next) => {
  console.log(`[Node.js Instance ${PORT}] ${req.method} ${req.path}`)
  next()
})

// Very simple token-based auth (no JWT/3rd party)
const authenticate = (req, res, next) => {
  const bearer = req.header('authorization') || ''
  const headerToken = req.header('x-auth-token')
  const token = headerToken || bearer.replace('Bearer ', '')

  if (token === AUTH_TOKEN) {
    return next()
  }

  return res.status(401).json({ error: 'Unauthorized' })
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    port: PORT, 
    service: 'Node.js API Gateway',
    database: 'MongoDB Connected'
  })
})

// Dummy login that returns a static token
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {}

  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    return res.json({ 
      token: AUTH_TOKEN,
      user: { username }
    })
  }

  return res.status(401).json({ error: 'Invalid credentials' })
})

// Get restaurants - forward to Python service
app.get('/restaurants', async (req, res) => {
  try {
    console.log(`[Node.js ${PORT}] Forwarding /restaurants to Python service`)
    const response = await axios.get(`${PYTHON_SERVICE_URL}/restaurants`)
    res.json(response.data)
  } catch (error) {
    console.error(`[Node.js ${PORT}] Error forwarding to Python:`, error.message)
    res.status(500).json({ error: 'Failed to fetch restaurants' })
  }
})

// Get restaurant menu - forward to Python service
app.get('/restaurants/:id/menu', async (req, res) => {
  try {
    const restaurantId = req.params.id
    console.log(`[Node.js ${PORT}] Forwarding /restaurants/${restaurantId}/menu to Python service`)
    const response = await axios.get(`${PYTHON_SERVICE_URL}/restaurants/${restaurantId}/menu`)
    res.json(response.data)
  } catch (error) {
    console.error(`[Node.js ${PORT}] Error forwarding to Python:`, error.message)
    res.status(500).json({ error: 'Failed to fetch menu' })
  }
})

// Create order - handled by Node.js service with MongoDB
app.post('/order', authenticate, async (req, res) => {
  try {
    const { restaurantId, items, username } = req.body
    
    if (!restaurantId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' })
    }

    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    // Get the next order ID
    const lastOrder = await Order.findOne().sort({ orderId: -1 }).limit(1)
    const orderId = lastOrder ? lastOrder.orderId + 1 : 1000

    const order = new Order({
      orderId,
      restaurantId,
      username,
      items,
      status: 'pending'
    })

    await order.save()

    console.log(`[Node.js ${PORT}] Order created in MongoDB: ${orderId} for user: ${username}`)
    res.status(201).json({ orderId, status: order.status })
  } catch (error) {
    console.error(`[Node.js ${PORT}] Error creating order:`, error.message)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Get order status - handled by Node.js service with MongoDB
app.get('/order/:id', authenticate, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id)
    const order = await Order.findOne({ orderId })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Simulate order status progression
    const statuses = ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered']
    const currentIndex = statuses.indexOf(order.status)
    
    // Randomly progress order status (for demo)
    if (currentIndex < statuses.length - 1 && Math.random() > 0.7) {
      order.status = statuses[currentIndex + 1]
      order.updatedAt = new Date()
      await order.save()
    }

    console.log(`[Node.js ${PORT}] Order status requested from MongoDB: ${orderId} - ${order.status}`)
    res.json({
      orderId: order.orderId,
      restaurantId: order.restaurantId,
      items: order.items,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    })
  } catch (error) {
    console.error(`[Node.js ${PORT}] Error fetching order:`, error.message)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// Get order history for a user
app.get('/orders', authenticate, async (req, res) => {
  try {
    const username = req.query.username

    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    const orders = await Order.find({ username }).sort({ createdAt: -1 })

    console.log(`[Node.js ${PORT}] Order history requested for user: ${username} - Found ${orders.length} orders`)
    res.json(orders.map(order => ({
      orderId: order.orderId,
      restaurantId: order.restaurantId,
      items: order.items,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    })))
  } catch (error) {
    console.error(`[Node.js ${PORT}] Error fetching order history:`, error.message)
    res.status(500).json({ error: 'Failed to fetch order history' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Node.js API Gateway running on port ${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/health`)
  console.log(`   MongoDB URI: ${process.env.MONGODB_URI}`)
})
