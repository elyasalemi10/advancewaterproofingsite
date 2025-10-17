import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24'
  return createClient(supabaseUrl, supabaseKey)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { token, action, newTime } = req.body || {}
  if (!token || !action) return res.status(400).json({ error: 'Token and action required' })

  try {
    const supabase = getSupabaseClient()
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
      // Notify admin
      try {
        const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co'
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
            to: ['info@advancewaterproofing.com.au'],
            subject: `Customer Confirmed Booking - ${booking.name}`,
            html: `<p>The customer has confirmed the booking for ${booking.address} on ${new Date(booking.date).toLocaleDateString('en-AU')}.</p>`
          })
        })
      } catch {}
      return res.status(200).json({ success: true, status: 'confirmed' })
    }

    if (action === 'reschedule') {
      if (!newTime) return res.status(400).json({ error: 'newTime required' })
      const { error: updErr } = await supabase
        .from('bookings')
        .update({ customer_reschedule_requested_at: new Date().toISOString(), customer_rescheduled_time: newTime, status: 'pending' })
        .eq('id', booking.id)
      if (updErr) return res.status(500).json({ error: 'Failed to reschedule' })
      // Notify admin
      try {
        const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co'
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
            to: ['info@advancewaterproofing.com.au'],
            subject: `Reschedule Requested - ${booking.name}`,
            html: `<p>The customer has requested a reschedule for ${booking.address}.<br/>New time requested: ${new Date(newTime).toLocaleString('en-AU')}<br/>Please review and accept/decline.</p>`
          })
        })
      } catch {}
      return res.status(200).json({ success: true, status: 'rescheduled' })
    }

    return res.status(400).json({ error: 'Invalid action' })
  } catch (e) {
    console.error('customer-update error', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


