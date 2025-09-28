import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function RealtimeDemo() {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch initial messages
    fetchMessages()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('Real-time update:', payload)
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setMessages(data || [])
    } catch (error: any) {
      console.error('Error fetching messages:', error.message)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage,
            user_email: (await supabase.auth.getUser()).data.user?.email || 'Anonymous'
          }
        ])

      if (error) throw error
      setNewMessage('')
    } catch (error: any) {
      console.error('Error sending message:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="demo-section">
      <h2>⚡ Real-time Demo</h2>
      <p>Messages update in real-time across all connected clients using WebSocket subscriptions.</p>
      
      <form onSubmit={sendMessage} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Send a real-time message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input"
            style={{ margin: 0, flex: 1 }}
          />
          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No messages yet. Send one above!
          </p>
        ) : (
          messages.map((message) => (
            <div key={message.id} style={{
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              marginBottom: '0.5rem',
              background: '#f9fafb'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                {message.user_email}
              </div>
              <div>{message.content}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {new Date(message.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="code-block">
        <pre>{`// Real-time subscriptions
const channel = supabase
  .channel('messages')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('Real-time update:', payload)
      // Handle real-time updates
    }
  )
  .subscribe()

// Cleanup
return () => supabase.removeChannel(channel)`}</pre>
      </div>
    </div>
  )
}