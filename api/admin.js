import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../lib/serverAuth.js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(url, key)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()
  const auth = requireAuth(req, res)
  if (!auth) return
  const supabase = getSupabase()
  try {
    const { data: bookings } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(50)
    const total = bookings?.length || 0
    const pending = bookings?.filter(b => b.status === 'pending').length || 0
    const accepted = bookings?.filter(b => b.status === 'accepted').length || 0
    const cancelled = bookings?.filter(b => b.status === 'cancelled').length || 0
    return res.status(200).json({ stats: { total, pending, accepted, cancelled }, bookings: bookings || [] })
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load' })
  }
}


