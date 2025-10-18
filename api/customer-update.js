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
      // Notify admin (styled email)
      try {
        const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co'
        const formattedDate = new Date(booking.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        const formattedTime = booking.preferred_time ? new Date(booking.preferred_time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZone: 'Australia/Melbourne' }) : booking.time
        const adminHTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif}</style></head><body>
  <table role="presentation" width="100%" style="background:#fff"><tr><td>
    <table role="presentation" align="center" width="600" style="margin:0 auto;color:#000">
      <tr><td style="text-align:center;padding:16px 0"><img src="https://683f2eb45c.imgdist.com/pub/bfra/xmaci52l/e90/92q/kmw/logo-removebg-preview.png" width="156" alt="Logo"/></td></tr>
      <tr><td style="padding:10px 16px;text-align:center"><h1 style="margin:0;color:#3585c3;font-size:32px;font-weight:700">Customer Confirmed</h1></td></tr>
      <tr><td style="padding:10px 16px"><hr style="border:none;border-top:1px solid #ddd"/></td></tr>
      <tr><td style="padding:10px 16px;text-align:center;font-size:16px;color:#101112">
        <p style="margin:0 0 12px">The customer has confirmed the booking.</p>
        <p style="margin:0 0 12px">Date: ${formattedDate}<br>Time: ${formattedTime}<br>Address: ${booking.address}<br>Service: ${booking.service}</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
            to: ['info@advancewaterproofing.com.au'],
            subject: `Customer Confirmed - ${booking.name}`,
            html: adminHTML
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
      // Notify admin (styled email)
      try {
        const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co'
        const formattedNew = new Date(newTime).toLocaleString('en-AU')
        const adminHTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif}</style></head><body>
  <table role="presentation" width="100%" style="background:#fff"><tr><td>
    <table role="presentation" align="center" width="600" style="margin:0 auto;color:#000">
      <tr><td style="text-align:center;padding:16px 0"><img src="https://683f2eb45c.imgdist.com/pub/bfra/xmaci52l/e90/92q/kmw/logo-removebg-preview.png" width="156" alt="Logo"/></td></tr>
      <tr><td style="padding:10px 16px;text-align:center"><h1 style="margin:0;color:#3585c3;font-size:32px;font-weight:700">Reschedule Requested</h1></td></tr>
      <tr><td style="padding:10px 16px"><hr style="border:none;border-top:1px solid #ddd"/></td></tr>
      <tr><td style="padding:10px 16px;text-align:center;font-size:16px;color:#101112">
        <p style="margin:0 0 12px">The customer has requested a new time.</p>
        <p style="margin:0 0 12px">New requested time: ${formattedNew}<br>Address: ${booking.address}<br>Service: ${booking.service}</p>
        <p style="margin:0 0 16px">Please review and accept or decline:</p>
        <p style="margin:0"><a href="${(req.headers.origin || '').replace(/\/$/, '')}/manage-booking?id=${booking.booking_id}" style="display:inline-block;padding:10px 18px;background:#3585c3;color:#fff;border-radius:4px;text-decoration:none">Open Booking</a></p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
            to: ['info@advancewaterproofing.com.au'],
            subject: `Reschedule Requested - ${booking.name}`,
            html: adminHTML
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


