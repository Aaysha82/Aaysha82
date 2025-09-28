import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthDemo() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) throw error
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="demo-section">
      <h2>🔐 Authentication Demo</h2>
      <p>Sign up or sign in to access the full demo features.</p>
      
      <div className="auth-form">
        {message && (
          <div className={message.includes('error') || message.includes('Invalid') ? 'error' : 'success'}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <button
            type="submit"
            className="button"
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="button secondary"
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>

        <button
          onClick={handleGoogleAuth}
          className="button"
          disabled={loading}
          style={{ width: '100%', backgroundColor: '#4285f4' }}
        >
          Continue with Google
        </button>
      </div>

      <div className="code-block">
        <pre>{`// Authentication with Supabase
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// OAuth with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})`}</pre>
      </div>
    </div>
  )
}