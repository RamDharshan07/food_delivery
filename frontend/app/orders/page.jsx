'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OrderHistoryPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [username, setUsername] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    const savedUsername = typeof window !== 'undefined' ? localStorage.getItem('authUsername') : null

    if (!savedToken) {
      router.replace('/login?next=/orders')
      return
    }

    setToken(savedToken)
    setUsername(savedUsername)
    fetchOrderHistory(savedUsername)
  }, [router])

  const fetchOrderHistory = async (user) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/orders?username=${encodeURIComponent(user)}`, {
        headers: {
          'x-auth-token': token || localStorage.getItem('authToken')
        }
      })

      if (!response.ok) {
        // If history cannot be fetched (e.g. no route / username), just show empty state without error
        console.error('Failed to fetch order history. Status:', response.status)
        setOrders([])
        setError('')
        return
      }

      const data = await response.json()
      setOrders(data)
      setError('')
    } catch (err) {
      setError('Failed to load order history. Please try again.')
      console.error('Error fetching order history:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading order history...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <Link href="/" className="back-button" style={{ display: 'inline-block', marginBottom: '10px', textDecoration: 'none' }}>
          ← Back to Restaurants
        </Link>
        <h1>📋 Order History</h1>
        {username && (
          <p style={{ marginTop: '10px', color: '#666' }}>Orders for: {username}</p>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {orders.length === 0 ? (
        <div className="loading" style={{ marginTop: '40px' }}>
          No orders found. Start ordering to see your history here!
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {orders.map((order) => (
            <div key={order.orderId} className="order-status" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>Order #{order.orderId}</h2>
                <Link href={`/order/${order.orderId}`}>
                  <button className="order-button" style={{ padding: '8px 16px' }}>
                    View Details
                  </button>
                </Link>
              </div>
              
              <p style={{ marginBottom: '10px' }}>
                <strong>Status:</strong> <span style={{ 
                  color: order.status === 'delivered' ? 'green' : 
                         order.status === 'out for delivery' ? 'blue' : 
                         order.status === 'preparing' ? 'orange' : '#333'
                }}>{order.status}</span>
              </p>
              
              <p style={{ marginBottom: '10px' }}>
                <strong>Restaurant ID:</strong> {order.restaurantId}
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong>Order Date:</strong> {formatDate(order.createdAt)}
              </p>

              {order.items && order.items.length > 0 && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                  <h3 style={{ marginBottom: '10px' }}>Items:</h3>
                  {order.items.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '8px',
                      padding: '8px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px'
                    }}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #ddd',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    <span>Total:</span>
                    <span>₹{getTotal(order.items)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

