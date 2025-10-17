import { createClient } from '@supabase/supabase-js';
import { requireAuth } from './_auth.js'

// Initialize Supabase
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24';
  return createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = requireAuth(req, res)
    if (!auth) return
    const { bookingId, cancel } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID required' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co';
    
    // Get booking from Supabase
    const supabase = getSupabaseClient();
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_id', bookingId)
      .single();
    
    if (fetchError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!cancel) {
      if (booking.status !== 'pending') {
        return res.status(400).json({ error: 'Booking already processed' });
      }
    }

    // If cancelling
    if (cancel) {
      const { error: cancelErr } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('booking_id', bookingId)
      if (cancelErr) {
        return res.status(500).json({ error: 'Failed to cancel booking' })
      }

      const dateObj = new Date(booking.date);
      const formattedDate = dateObj.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = new Date(booking.preferred_time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZone: 'Australia/Melbourne' });

      const cancelHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Booking Cancelled</title></head><body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif;"><table width="100%" style="background:#ffffff"><tr><td align="center"><table width="520" style="margin:0 auto;color:#000"><tr><td align="center" style="padding:20px 0"><img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" width="156" alt="Logo" style="display:block;height:auto;border:0"></td></tr><tr><td align="center" style="padding:10px"><h1 style="color:#3585c3;font-size:32px;font-weight:700;margin:0;">Booking Cancelled</h1></td></tr><tr><td style="padding:20px;text-align:center;font-size:16px;color:#101112;">Your booking scheduled for ${formattedDate} at ${formattedTime} has been cancelled. If this is unexpected, please contact us.</td></tr></table></td></tr></table></body></html>`;

      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
            to: [booking.email],
            subject: 'Your Booking Has Been Cancelled',
            html: cancelHTML
          })
        })
        if (!emailResponse.ok) {
          const err = await emailResponse.json()
          console.error('Cancel email failed', err)
        }
      } catch (e) {
        console.error('Cancel email error', e)
      }

      return res.status(200).json({ success: true, message: 'Booking cancelled and customer notified' })
    }

    // Accept: Update status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'accepted' })
      .eq('booking_id', bookingId);
    
    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return res.status(500).json({ error: 'Failed to update booking status' });
    }

    // Confirmation email
    const dateObj = new Date(booking.date);
    const formattedDate = dateObj.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = new Date(booking.preferred_time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZone: 'Australia/Melbourne' });

    const customerEmailHTML = `<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><h2>Booking Confirmed!</h2><p>Date: ${formattedDate}<br/>Time: ${formattedTime}<br/>Address: ${booking.address}<br/>Service: ${booking.service}</p></body></html>`;

    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
          to: [booking.email],
          subject: `✅ Booking Confirmed - ${formattedDate}`,
          html: customerEmailHTML
        })
      });
      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Resend email error:', errorData);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    // Immediate reminder if job is within 2 business days
    try {
      const now = new Date()
      const addBusinessDays = (d, n) => {
        const date = new Date(d)
        let count = 0
        while (count < n) {
          date.setDate(date.getDate() + 1)
          const day = date.getDay()
          if (day !== 0 && day !== 6) count++
        }
        return date
      }
      const threshold = addBusinessDays(new Date(), 2)
      const jobDate = new Date(booking.date)
      if (jobDate <= threshold) {
        const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:5173'
        const url = `${baseUrl}/customer/${booking.customer_access_token}`
        const reminderHTML = `Please confirm/reschedule your job at ${booking.address}. Click here: ${url}`
        try {
          const immediateResp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({ from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>', to: [booking.email], subject: 'Action Required: Confirm/Reschedule', html: reminderHTML })
          })
          if (!immediateResp.ok) console.error('Immediate reminder email failed', await immediateResp.text())
        } catch (e) { console.error('Immediate reminder email error', e) }

        if (booking.phone) {
          const smsText = `Please confirm/reschedule your job at ${booking.address}\n\nWe’re booked at ${booking.address} on ${new Date(booking.date).toLocaleDateString('en-AU')}.\n\nPlease note a $150 (metro) or $250 (regional) fee applies if the site isn’t ready for work to begin.\n\nTap below to confirm or reschedule.\n\n${url}`
          try {
            const body = new URLSearchParams({ from: 'AdvanceWP', text: smsText, to: booking.phone, api_key: process.env.VONAGE_API_KEY || '', api_secret: process.env.VONAGE_API_SECRET || '' })
            const smsResp = await fetch('https://rest.nexmo.com/sms/json', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
            if (!smsResp.ok) console.error('Immediate SMS failed', await smsResp.text())
          } catch (e) { console.error('Immediate SMS error', e) }
        }
      }
    } catch (e) {
      console.error('Immediate reminder block error', e)
    }

    return res.status(200).json({ success: true, message: 'Booking confirmed and customer notified' });

  } catch (error) {
    console.error('Confirm booking error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

