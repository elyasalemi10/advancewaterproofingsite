import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, supabaseKey)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const supabase = getSupabaseClient()

  if (req.method === 'GET') {
    try {
      const token = req.query.token
      if (!token) return res.status(400).json({ error: 'Missing token' })
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_id, address, service, date, time, preferred_time, notes, customer_confirmed_at, customer_rescheduled_time')
        .eq('customer_access_token', token)
        .single()
      if (error || !data) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json({ booking: data })
    } catch (e) {
      return res.status(500).json({ error: 'Failed to load' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { token, action, newTime } = req.body
      const { data: booking, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_access_token', token)
        .single()
      if (error || !booking) return res.status(404).json({ error: 'Not found' })

      if (action === 'confirm') {
        const { error: updErr } = await supabase
          .from('bookings')
          .update({ customer_confirmed_at: new Date().toISOString() })
          .eq('id', booking.id)
        if (updErr) return res.status(500).json({ error: 'Failed to confirm' })
        return res.status(200).json({ success: true, status: 'confirmed' })
      }

      if (action === 'reschedule') {
        if (!newTime) return res.status(400).json({ error: 'newTime required' })
        const dt = new Date(newTime)
        const formattedDate = dt.toISOString()
        const formattedTime = dt.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
        const { error: updErr } = await supabase
          .from('bookings')
          .update({
            customer_reschedule_requested_at: new Date().toISOString(),
            customer_rescheduled_time: newTime,
            status: 'pending',
            preferred_time: newTime,
            date: formattedDate,
            time: formattedTime
          })
          .eq('id', booking.id)
        if (updErr) return res.status(500).json({ error: 'Failed to reschedule' })
        return res.status(200).json({ success: true, status: 'rescheduled' })
      }

      return res.status(400).json({ error: 'Unsupported action' })
    } catch (e) {
      return res.status(500).json({ error: 'Failed to update' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}


