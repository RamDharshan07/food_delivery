'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [username, setUsername] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('authUsername') : null

    if (!savedToken) {
      router.replace('/login?next=/')
      return
    }

    setUsername(savedUser)
    setAuthChecked(true)
    fetchRestaurants()
  }, [router])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants)
    } else {
      const filtered = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredRestaurants(filtered)
    }
  }, [searchQuery, restaurants])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/restaurants')
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }
      const data = await response.json()
      setRestaurants(data)
      setFilteredRestaurants(data)
      setError('')
    } catch (err) {
      setError('Failed to load restaurants. Make sure all services are running.')
      console.error('Error fetching restaurants:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!authChecked) {
    return null
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🍕 Food Delivery App</h1>
        <div style={{ marginLeft: 'auto', fontSize: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          {username ? (
            <>
              <Link href="/orders">
                <button style={{ padding: '4px 10px', cursor: 'pointer' }}>
                  View Order History
                </button>
              </Link>
              <span>Hi, {username}</span>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search restaurants or cuisines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading restaurants...</div>
      ) : (
        <>
          {filteredRestaurants.length === 0 ? (
            <div className="loading">
              {searchQuery ? 'No restaurants found matching your search.' : 'No restaurants available.'}
            </div>
          ) : (
            <div className="restaurant-grid">
              {filteredRestaurants.map((restaurant) => (
                <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                  <div className="restaurant-card">
                    <h3>{restaurant.name}</h3>
                    <p>🍽️ {restaurant.cuisine}</p>
                    <p>⭐ {restaurant.rating}/5</p>
                    <p>⏱️ {restaurant.deliveryTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

