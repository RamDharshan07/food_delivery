'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      router.replace(next)
    }
  }, [router, next])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Dummy login: accept any input, show brief loading, then store demo token
      await new Promise(resolve => setTimeout(resolve, 800))
      localStorage.setItem('authToken', 'demo-token')
      localStorage.setItem('authUsername', username || 'user')
      router.replace(next)
    } catch (err) {
      setError('Could not login. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Login</h1>
        <Link href="/" style={{ marginLeft: 'auto', fontSize: '14px' }}>
          ← Back
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="search-input"
            placeholder="demo"
            required
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="search-input"
            placeholder="password123"
            required
          />
        </div>
        <button
          type="submit"
          className="place-order-button"
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        Demo credentials: demo / password123
      </div>
    </div>
  )
}

