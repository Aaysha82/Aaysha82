import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Using SERVICE_ROLE to perform admin cleanup
    // This bypasses RLS and can delete ALL messages regardless of ownership
    const { error } = await supabaseAdmin
      .from('messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (error) {
      throw error
    }

    res.status(200).json({ 
      message: 'All messages deleted successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Admin cleanup error:', error)
    res.status(500).json({ error: 'Failed to cleanup messages' })
  }
}