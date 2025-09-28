import { useState } from 'react'

export default function ServiceRoleDemo() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAdminStats = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats')
      }
      
      setStats(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteAllMessages = async () => {
    if (!confirm('Are you sure you want to delete all messages? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cleanup')
      }
      
      alert('Messages cleaned up successfully!')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="demo-section">
      <h2>🔑 SERVICE_ROLE Demo</h2>
      <p>
        <strong>⚠️ IMPORTANT:</strong> SERVICE_ROLE key bypasses Row Level Security (RLS) and should only be used server-side.
        This demo shows admin operations that regular users cannot perform.
      </p>
      
      {error && <div className="error">{error}</div>}
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={fetchAdminStats}
          className="button"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Admin Stats'}
        </button>
        <button
          onClick={deleteAllMessages}
          className="button secondary"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete All Messages (Admin)'}
        </button>
      </div>

      {stats && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#059669' }}>Admin Statistics</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Total Users: <strong>{stats.totalUsers}</strong></li>
            <li>Total Todos: <strong>{stats.totalTodos}</strong></li>
            <li>Total Messages: <strong>{stats.totalMessages}</strong></li>
            <li>Completed Todos: <strong>{stats.completedTodos}</strong></li>
          </ul>
        </div>
      )}

      <div className="code-block">
        <pre>{`// SERVER-SIDE ONLY - Never expose SERVICE_ROLE key to client!
import { supabaseAdmin } from '../lib/supabase'

// Admin operations that bypass RLS
export async function getAdminStats() {
  // This bypasses RLS and can access ALL data
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id')
    
  const { data: todos } = await supabaseAdmin
    .from('todos')
    .select('id, completed')
    
  return {
    totalUsers: users?.length || 0,
    totalTodos: todos?.length || 0,
    completedTodos: todos?.filter(t => t.completed).length || 0
  }
}

// ⚠️ DANGER: This can delete ALL data regardless of user ownership
export async function adminCleanup() {
  const { error } = await supabaseAdmin
    .from('messages')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
  if (error) throw error
}`}</pre>
      </div>

      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.375rem',
        padding: '1rem',
        marginTop: '1rem'
      }}>
        <h4 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>🚨 SERVICE_ROLE Security Notes:</h4>
        <ul style={{ color: '#7f1d1d', fontSize: '0.875rem', paddingLeft: '1rem' }}>
          <li>SERVICE_ROLE key bypasses ALL Row Level Security policies</li>
          <li>Never expose this key in client-side code or environment variables</li>
          <li>Only use in server-side API routes or backend services</li>
          <li>Can read, insert, update, delete ANY data in your database</li>
          <li>Use with extreme caution - prefer regular authenticated operations when possible</li>
        </ul>
      </div>
    </div>
  )
}