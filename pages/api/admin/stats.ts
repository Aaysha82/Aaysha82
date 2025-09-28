import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Using SERVICE_ROLE to bypass RLS and get admin statistics
    const [usersResult, todosResult, messagesResult] = await Promise.all([
      supabaseAdmin.from('users').select('id'),
      supabaseAdmin.from('todos').select('id, completed'),
      supabaseAdmin.from('messages').select('id')
    ])

    const stats = {
      totalUsers: usersResult.data?.length || 0,
      totalTodos: todosResult.data?.length || 0,
      totalMessages: messagesResult.data?.length || 0,
      completedTodos: todosResult.data?.filter(todo => todo.completed).length || 0,
      timestamp: new Date().toISOString()
    }

    res.status(200).json(stats)
  } catch (error: any) {
    console.error('Admin stats error:', error)
    res.status(500).json({ error: 'Failed to fetch admin statistics' })
  }
}