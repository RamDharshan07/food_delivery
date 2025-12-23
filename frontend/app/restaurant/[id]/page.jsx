'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RestaurantPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ordering, setOrdering] = useState(false)
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    // Load saved token and username (dummy auth)
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    const savedUsername = typeof window !== 'undefined' ? localStorage.getItem('authUsername') : null
    setToken(savedToken)
    setUsername(savedUsername)
    fetchRestaurantDetails()
    fetchMenu()
  }, [restaurantId])

  const fetchRestaurantDetails = async () => {
    try {
      const response = await fetch(`${API_BASE}/restaurants`)
      if (!response.ok) throw new Error('Failed to fetch restaurant')
      const restaurants = await response.json()
      const found = restaurants.find((r) => r.id === parseInt(restaurantId))
      if (found) {
        setRestaurant(found)
      }
    } catch (err) {
      setError('Failed to load restaurant details')
      console.error('Error:', err)
    }
  }

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${API_BASE}/restaurants/${restaurantId}/menu`)
      if (!response.ok) throw new Error('Failed to fetch menu')
      const data = await response.json()
      setMenu(data)
      setError('')
    } catch (err) {
      setError('Failed to load menu')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === item.id)
      if (existing) {
        return prev.map(c =>
          c.menuItem.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      }
      return [...prev, { menuItem: item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map(c =>
          c.menuItem.id === itemId
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
      }
      return prev.filter(c => c.menuItem.id !== itemId)
    })
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
  }

  const placeOrder = async () => {
    if (cart.length === 0) return

    if (!token) {
      router.push(`/login?next=/restaurant/${restaurantId}`)
      return
    }

    try {
      setOrdering(true)
      const orderItems = cart.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price
      }))

      const response = await fetch(`${API_BASE}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          restaurantId: parseInt(restaurantId),
          items: orderItems,
          username: username
        }),
      })

      if (response.status === 401) {
        setError('Please login to place an order.')
        setOrdering(false)
        router.push(`/login?next=/restaurant/${restaurantId}`)
        return
      }

      if (!response.ok) throw new Error('Failed to place order')
      const order = await response.json()
      router.push(`/order/${order.orderId}`)
    } catch (err) {
      setError('Failed to place order. Please try again.')
      console.error('Error placing order:', err)
      setOrdering(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading menu...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <Link href="/" className="back-button" style={{ display: 'inline-block', marginBottom: '10px', textDecoration: 'none' }}>
          ← Back to Restaurants
        </Link>
        {restaurant && (
          <>
            <h1>{restaurant.name}</h1>
            <p>🍽️ {restaurant.cuisine} | ⭐ {restaurant.rating}/5 | ⏱️ {restaurant.deliveryTime}</p>
          </>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '20px' }}>
        <div>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Menu</h2>
          {menu.length === 0 ? (
            <div className="loading">No menu items available</div>
          ) : (
            menu.map((item) => {
              const cartItem = cart.find(c => c.menuItem.id === item.id)
              const quantity = cartItem?.quantity || 0
              return (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-info">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <p className="menu-item-price">₹{item.price}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {quantity > 0 && (
                      <>
                        <button
                          className="order-button"
                          onClick={() => removeFromCart(item.id)}
                          style={{ padding: '5px 10px' }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
                      </>
                    )}
                    <button
                      className="order-button"
                      onClick={() => addToCart(item)}
                    >
                      {quantity > 0 ? '+' : 'Add'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="order-summary">
            <h2>Your Order</h2>
            {cart.map((item) => (
              <div key={item.menuItem.id} className="order-item">
                <div>
                  <strong>{item.menuItem.name}</strong>
                  <span style={{ marginLeft: '10px', color: '#666' }}>x{item.quantity}</span>
                </div>
                <div>₹{item.menuItem.price * item.quantity}</div>
              </div>
            ))}
            <div className="total">
              <span>Total:</span>
              <span>₹{getTotal()}</span>
            </div>
            <button
              className="place-order-button"
              onClick={placeOrder}
              disabled={ordering}
            >
              {ordering ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

