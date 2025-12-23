'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function OrderPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
  const params = useParams()
  const orderId = params.id
  const [orderStatus, setOrderStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [token, setToken] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    setToken(savedToken)
    setAuthChecked(true)
  }, [orderId])

  useEffect(() => {
    if (!authChecked) return
    if (!token) {
      setError('Please login to view order status.')
      setLoading(false)
      return
    }

    fetchOrderStatus()
    const interval = setInterval(fetchOrderStatus, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [orderId, token, authChecked])

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/order/${orderId}`, {
        headers: {
          'x-auth-token': token || ''
        }
      })
      if (!response.ok) throw new Error('Failed to fetch order status')
      const data = await response.json()
      setOrderStatus(data)
      setError('') // Clear error on success
    } catch (err) {
      // Only show error if we don't have order data yet
      if (!orderStatus) {
        setError('Failed to load order status')
      }
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !orderStatus) {
    return (
      <div className="container">
        <div className="loading">Loading order status...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Order Status</h1>
      </div>

      {error && !orderStatus && <div className="error">{error}</div>}

      {orderStatus && (
        <div className="order-status">
          <h2>Order #{orderStatus.orderId}</h2>
          <p><strong>Status:</strong> {orderStatus.status}</p>
          <p><strong>Restaurant ID:</strong> {orderStatus.restaurantId}</p>
          {orderStatus.items && orderStatus.items.length > 0 && (
            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <h3>Items:</h3>
              {orderStatus.items.map((item, index) => (
                <div key={index} style={{ marginTop: '10px' }}>
                  <p>{item.name} x{item.quantity} - ₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          )}
          <Link href="/">
            <button className="back-button">Back to Restaurants</button>
          </Link>
        </div>
      )}
    </div>
  )
}

