import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (will be created fresh in each request)
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24';
  return createClient(supabaseUrl, supabaseKey);
}

function generateBookingId() {
  return `BOOK-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

export default async function handler(req, res) {
  // CORS headers - must be set for all responses
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, address, service, date, time, notes, isInspection, startTime, endTime } = req.body;
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co';
    const CAL_API_KEY = process.env.CAL_API_KEY || 'cal_live_30cc62be183a46889753a4e6b4683971';
    const bookingId = generateBookingId();
    
    // Determine event type (Job = 1 hour, Quote = 10 min)
    const eventTypeId = isInspection ? 3637831 : 3629145;
    
    // Store in Supabase - Cal.com booking will be created AFTER owner confirms
    const supabase = getSupabaseClient();
    let dbSuccess = false;
    
    try {
      const { data, error } = await supabase.from('bookings').insert([{
        booking_id: bookingId,
        name, 
        email, 
        phone, 
        address, 
        service, 
        date, 
        time, 
        notes,
        status: 'pending',
        cal_booking_uid: null, // Will be set when owner confirms
        cal_event_type_id: eventTypeId,
        is_inspection: isInspection,
        preferred_time: startTime,
        end_time: endTime
      }]).select();
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Booking saved successfully:', data);
      dbSuccess = true;
    } catch (dbError) {
      console.error('Supabase error details:', dbError);
      // Return error to frontend so user knows it failed
      return res.status(500).json({ 
        error: 'Failed to save booking', 
        details: dbError.message || dbError 
      });
    }
    
    // Build message body
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-AU', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    const formattedTime = startTime ? new Date(startTime).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Australia/Melbourne'
    }) : time;
    
    const formattedEndTime = endTime ? new Date(endTime).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Australia/Melbourne'
    }) : '';
    
    const bookingType = isInspection ? 'On-Site Job' : 'Phone Quote';
    const duration = isInspection ? '1 hour' : '10 minutes';
    
    // Get manage booking URL
    const baseUrl = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || 'https://advancewaterproofing.com.au';
    const manageUrl = `${baseUrl}/manage-booking?id=${bookingId}`;
    
    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Job Created</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, Helvetica, sans-serif; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
    p { line-height: 1.5; margin: 0 0 10px; }
    @media (max-width:540px) {
      .row-content { width: 100% !important; }
      .stack .column { width: 100%; display: block; }
    }
  </style>
</head>

<body style="background-color: #ffffff; margin: 0; padding: 0;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff;">
    <tr>
      <td align="center">
        <table width="520" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; color: #000000;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" width="156" alt="Logo" style="display: block; height: auto; border: 0;">
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 10px;">
              <h1 style="color: #3585c3; font-size: 32px; font-weight: 700; margin: 0;">New ${bookingType}</h1>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 10px;">
              <hr style="border: none; border-top: 1px solid #dddddd; width: 100%;">
            </td>
          </tr>

          <tr>
            <td style="padding: 20px; font-size: 16px; color: #101112;">
              <p style="margin-bottom: 20px; text-align: center;">You have received a new booking request. Details below:</p>
              
              <table width="100%" border="0" cellpadding="8" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 15px;">
                    <table width="100%" border="0" cellpadding="6" cellspacing="0">
                      <tr>
                        <td style="font-weight: bold; color: #3585c3; width: 140px;">📋 Booking Type:</td>
                        <td>${bookingType}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3;">⏱️ Duration:</td>
                        <td>${duration}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 10px 0;"><hr style="border: none; border-top: 1px solid #dddddd;"></td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3;">👤 Customer:</td>
                        <td>${name}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3;">📧 Email:</td>
                        <td>${email}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3;">📞 Phone:</td>
                        <td>${phone}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3;">📍 Address:</td>
                        <td>${address}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 10px 0;"><hr style="border: none; border-top: 1px solid #dddddd;"></td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3;">🔧 Service:</td>
                        <td>${service}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3;">📅 Date:</td>
                        <td>${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3;">🕒 Time:</td>
                        <td>${formattedTime}${formattedEndTime ? ' - ' + formattedEndTime : ''}</td>
                      </tr>
                      ${notes ? `<tr>
                        <td style="font-weight: bold; color: #3585c3; vertical-align: top;">📝 Notes:</td>
                        <td style="background-color: #ffffff; padding: 10px; border-radius: 4px;">${notes}</td>
                      </tr>` : ''}
                      <tr>
                        <td colspan="2" style="padding: 10px 0;"><hr style="border: none; border-top: 1px solid #dddddd;"></td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #3585c3;">🆔 Booking ID:</td>
                        <td style="font-family: monospace; color: #666;">${bookingId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin-top: 20px; text-align: center; color: #666;">Click below to manage this booking:</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px;">
              <a href="${manageUrl}" target="_blank" style="background-color: #2596be; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-size: 16px;">
                Manage Booking
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" style="font-size: 13px; color: #777777; padding: 20px 0;">
              <p>If you have any questions, please contact us at <a href="mailto:support@advancewaterproofing.com.au" style="color: #2596be;">support@advancewaterproofing.com.au</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Advance Waterproofing <info@advancewaterproofing.com.au>',
        to: ['info@advancewaterproofing.com.au'],
        subject: `🔔 New Booking - ${name} - ${formattedDate}`,
        html: emailHTML
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(response.status).json({ error: 'Failed to send email', details: data });
    }

    return res.status(200).json({ success: true, bookingId, data });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

