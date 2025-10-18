import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../lib/serverAuth.js'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, supabaseKey)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const auth = requireAuth(req, res)
    if (!auth) return
    const { bookingId, date, time } = req.body
    if (!bookingId || !date || !time) return res.status(400).json({ error: 'Missing fields' })

    // Fetch booking
    const supabase = getSupabaseClient()
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_id', bookingId)
      .single()
    if (fetchError || !booking) return res.status(404).json({ error: 'Booking not found' })

    // Send email via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
    const formattedRequested = new Date(booking.preferred_time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZone: 'Australia/Melbourne' })
    const suggestedDate = new Date(date)
    const [hStr, mStr] = String(time).split(':')
    if (hStr) suggestedDate.setHours(parseInt(hStr, 10), parseInt(mStr || '0', 10), 0, 0)
    const formattedSuggested = suggestedDate.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZone: 'Australia/Melbourne' })

    const baseUrl = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || 'https://advancewaterproofing.com.au'
    const url = `${baseUrl}/customer/${booking.customer_access_token}`

    const emailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Time Suggestion</title>
  <style>*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit;color:#101112}@media (max-width:540px){.row-content{width:100%!important}.stack .column{display:block;width:100%!important}}</style>
</head>
<body style="background:#ffffff;margin:0;padding:0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center">
      <table role="presentation" class="row-content" width="520" cellpadding="0" cellspacing="0" style="width:520px;max-width:520px;color:#000;margin:0 auto;">
        <tr><td class="column" style="padding:5px 0;text-align:left;vertical-align:top;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0;"><div style="max-width:156px;"><img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" width="156" alt="Logo" style="display:block;width:100%;height:auto;border:0;"/></div></td></tr></table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px;"><h1 style="margin:0;color:#3585c3;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:700;line-height:1.2;text-align:center;">Alternative Time Suggested</h1></td></tr></table>
          <div style="height:40px;line-height:40px;font-size:1px;">&nbsp;</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px;">
            <div style="color:#101112;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:400;line-height:1.4;text-align:center;">
              <p style="margin-bottom:16px;">Sorry we are not available at ${formattedRequested} but we are on ${formattedSuggested}.</p>
              <p style="margin-bottom:16px;">Date: ${suggestedDate.toLocaleDateString('en-AU', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
              <p>Service: ${booking.service}<br/>Address: ${booking.address}</p>
            </div>
          </td></tr></table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:10px;">
            <a href="${url}" target="_blank" style="text-decoration:none;color:#ffffff;">
              <span style="display:inline-block;background-color:#3585c3;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:400;padding:8px 20px;border-radius:4px;text-align:center;">Review & Confirm</span>
            </a>
          </td></tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const emailResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
        to: [booking.email],
        subject: 'Alternative Time Suggested',
        html: emailHTML
      })
    })
    if (!emailResp.ok) {
      const details = await emailResp.json()
      return res.status(emailResp.status).json({ error: 'Failed to send suggestion email', details })
    }
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error('suggest-booking-time error', e)
    return res.status(500).json({ error: 'Internal server error', message: e.message })
  }
}


