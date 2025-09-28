import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AuthDemo from '../components/AuthDemo'
import TodoDemo from '../components/TodoDemo'
import RealtimeDemo from '../components/RealtimeDemo'
import ServiceRoleDemo from '../components/ServiceRoleDemo'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🚀 Supabase Demo</h1>
        <p>A comprehensive demo showcasing Supabase features including SERVICE_ROLE usage</p>
      </div>

      {!user ? (
        <AuthDemo />
      ) : (
        <div>
          <div className="demo-section">
            <h2>Welcome, {user.email}!</h2>
            <button
              className="button secondary"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </button>
          </div>

          <TodoDemo user={user} />
          <RealtimeDemo />
          <ServiceRoleDemo />
        </div>
      )}

      <div className="feature-grid">
        <div className="feature-card">
          <h3>🔐 Authentication</h3>
          <p>Secure user authentication with email/password, social providers, and more.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Database</h3>
          <p>PostgreSQL database with Row Level Security (RLS) and real-time subscriptions.</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Real-time</h3>
          <p>Live updates across clients using WebSocket connections.</p>
        </div>
        <div className="feature-card">
          <h3>🔑 SERVICE_ROLE</h3>
          <p>Admin-level access for server-side operations that bypass RLS.</p>
        </div>
      </div>
    </div>
  )
}