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
  const { bookingId, quoteId } = req.query
  if (!bookingId && !quoteId) return res.status(400).json({ error: 'bookingId or quoteId required' })
  const supabase = getSupabase()
  try {
    if (bookingId) {
      const { data } = await supabase.from('job_files').select('*').eq('booking_id', bookingId).order('created_at', { ascending: false })
      return res.status(200).json({ files: data || [] })
    }
    if (quoteId) {
      const { data } = await supabase.from('quote_files').select('*').eq('quote_id', quoteId).order('created_at', { ascending: false })
      return res.status(200).json({ files: data || [] })
    }
    return res.status(400).json({ error: 'Invalid request' })
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load files' })
  }
}


