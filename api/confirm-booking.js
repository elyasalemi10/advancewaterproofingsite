import { createClient } from '@supabase/supabase-js';

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
    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID required' });
    }

    const CAL_API_KEY = process.env.CAL_API_KEY || 'cal_live_30cc62be183a46889753a4e6b4683971';
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

    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Booking already processed' });
    }

    // Create Cal.com event for OWNER ONLY (no customer as attendee)
    let calBookingUid = null;
    
    try {
      const calResponse = await fetch('https://api.cal.com/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CAL_API_KEY}`
        },
        body: JSON.stringify({
          eventTypeId: booking.cal_event_type_id,
          start: booking.preferred_time,
          end: booking.end_time,
          // NOTE: We're NOT including customer email/phone - this is owner's calendar only
          responses: {
            name: `Job: ${booking.name}`,
            notes: `Customer: ${booking.name}\nPhone: ${booking.phone}\nEmail: ${booking.email}\nAddress: ${booking.address}\nService: ${booking.service}\nNotes: ${booking.notes || 'None'}\nBooking ID: ${booking.booking_id}`
          },
          timeZone: 'Australia/Melbourne',
          language: 'en',
          metadata: {
            bookingId: booking.booking_id,
            customerName: booking.name,
            customerEmail: booking.email,
            customerPhone: booking.phone,
            address: booking.address,
            service: booking.service
          }
        })
      });
      
      if (calResponse.ok) {
        const calData = await calResponse.json();
        calBookingUid = calData.uid;
        console.log('Cal.com booking created for owner:', calBookingUid);
      } else {
        const errorText = await calResponse.text();
        console.error('Cal.com booking failed:', errorText);
        // Continue even if Cal.com fails
      }
    } catch (calError) {
      console.error('Cal.com error:', calError);
      // Continue even if Cal.com fails
    }

    // Update booking status and Cal.com UID in Supabase
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        status: 'accepted',
        cal_booking_uid: calBookingUid
      })
      .eq('booking_id', bookingId);
    
    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return res.status(500).json({ error: 'Failed to update booking status' });
    }

    // Send confirmation email to customer via Zoho Mail
    const dateObj = new Date(booking.date);
    const formattedDate = dateObj.toLocaleDateString('en-AU', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    const formattedTime = new Date(booking.preferred_time).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Australia/Melbourne'
    });

    const customerEmailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" width="180" alt="Advance Waterproofing" style="display: block; height: auto; border: 0;">
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 40px 20px 40px; text-align: center;">
              <h1 style="color: #3585c3; font-size: 28px; font-weight: 700; margin: 0;">✅ Booking Confirmed!</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
                Hi ${booking.name},
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
                Great news! Your booking with Advance Waterproofing has been confirmed.
              </p>
              
              <table width="100%" border="0" cellpadding="15" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td>
                    <table width="100%" border="0" cellpadding="6" cellspacing="0">
                      <tr>
                        <td style="font-weight: bold; color: #3585c3; padding: 8px 0;">📅 Date:</td>
                        <td style="padding: 8px 0;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3; padding: 8px 0;">🕒 Time:</td>
                        <td style="padding: 8px 0;">${formattedTime}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3; padding: 8px 0;">📍 Address:</td>
                        <td style="padding: 8px 0;">${booking.address}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3; padding: 8px 0;">🔧 Service:</td>
                        <td style="padding: 8px 0;">${booking.service}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3; padding: 8px 0;">🆔 Booking ID:</td>
                        <td style="padding: 8px 0; font-family: monospace; color: #666;">${booking.booking_id}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">
                Our specialist will arrive at your property at the scheduled time. Please ensure the area is accessible.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">
                If you need to reschedule or have any questions, please don't hesitate to contact us:
              </p>

              <div style="background-color: #f0f8ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #333;">
                  📞 <strong>Phone:</strong> <a href="tel:+61390017788" style="color: #3585c3; text-decoration: none;">03 9001 7788</a>
                </p>
                <p style="margin: 0; color: #333;">
                  📧 <strong>Email:</strong> <a href="mailto:info@advancewaterproofing.com.au" style="color: #3585c3; text-decoration: none;">info@advancewaterproofing.com.au</a>
                </p>
              </div>

              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0 0 0;">
                Thank you for choosing Advance Waterproofing!
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 13px; color: #777; margin: 0;">
                © ${new Date().getFullYear()} Advance Waterproofing & Caulking Solution. All rights reserved.
              </p>
              <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">
                VBA Registered Building Practitioner | Certified Waterproofers | Fully Insured
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // Send confirmation email to customer via Resend
    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Advance Waterproofing <info@advancewaterproofing.com.au>',
          to: [booking.email],
          subject: `✅ Booking Confirmed - ${formattedDate}`,
          html: customerEmailHTML
        })
      });
      
      if (emailResponse.ok) {
        console.log('Confirmation email sent to customer via Resend');
      } else {
        const errorData = await emailResponse.json();
        console.error('Resend email error:', errorData);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the whole request if email fails
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Booking confirmed and customer notified',
      calBookingUid 
    });

  } catch (error) {
    console.error('Confirm booking error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

