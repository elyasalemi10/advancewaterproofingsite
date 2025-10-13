const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions
function generateBookingId() {
  return `BOOK-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function generateBookingEmailHTML(data) {
  const dateObj = new Date(data.date);
  const formattedDate = dateObj.toLocaleDateString('en-AU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `
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
              <h1 style="color: #3585c3; font-size: 32px; font-weight: 700; margin: 0;">New Booking - ${data.service}</h1>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 10px;">
              <hr style="border: none; border-top: 1px solid #dddddd; width: 100%;">
            </td>
          </tr>

          <tr>
            <td style="padding: 20px; text-align: center; font-size: 16px; color: #101112;">
              <p>A new job has been created and assigned to you. Below are the job details for your reference:</p>
              <p style="text-align: left; padding: 10px 0;">
                <strong>Name:</strong> ${data.name}<br>
                <strong>Email:</strong> <a href="mailto:${data.email}" style="color: #2596be; text-decoration: none;">${data.email}</a><br>
                <strong>Phone Number:</strong> <a href="tel:${data.phone}" style="color: #2596be; text-decoration: none;">${data.phone}</a><br>
                <strong>Address:</strong> ${data.address}<br>
                <strong>Service:</strong> ${data.service}<br>
                <strong>Date:</strong> ${formattedDate}<br>
                <strong>Time:</strong> ${data.time}<br>
                ${data.notes ? `<strong>Additional Notes:</strong><br>${data.notes.replace(/\n/g, '<br>')}` : ''}
              </p>
              <p>Please review the job information carefully and confirm your acceptance or denial by clicking the buttons below.</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px;">
              <a href="${data.acceptUrl}" target="_blank" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-size: 16px; margin: 0 5px;">
                ✅ Accept Booking
              </a>
              <a href="${data.cancelUrl}" target="_blank" style="background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-size: 16px; margin: 0 5px;">
                ❌ Deny Booking
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" style="font-size: 13px; color: #777777; padding: 20px 0;">
              <p>If you have any questions, please contact us at <a href="mailto:info@advancewaterproofing.com.au" style="color: #2596be;">info@advancewaterproofing.com.au</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, phone, address, service, date, time, notes } = JSON.parse(event.body);

    const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co';
    const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'info@advancewaterproofing.com.au';
    const bookingId = generateBookingId();
    const formattedDate = formatDate(date);
    
    // Store booking in Supabase
    try {
      const { error: dbError } = await supabase
        .from('bookings')
        .insert([{
          booking_id: bookingId,
          name,
          email,
          phone,
          address,
          service,
          date,
          time,
          notes,
          status: 'pending'
        }]);

      if (dbError) {
        console.error('Supabase error:', dbError);
        // Continue even if DB insert fails
      }
    } catch (dbErr) {
      console.error('Database error:', dbErr);
      // Continue even if DB insert fails
    }
    
    // Get the accept URL - use the request origin
    const baseUrl = event.headers.origin || event.headers.referer?.split('/').slice(0, 3).join('/') || 'https://advancewaterproofing.com.au';
    const acceptUrl = `${baseUrl}/accept-booking?id=${bookingId}`;
    const cancelUrl = `${baseUrl}/cancel-booking?id=${bookingId}`;

    const emailHTML = generateBookingEmailHTML({
      bookingId,
      name,
      email,
      phone,
      address,
      service,
      date,
      time,
      notes,
      acceptUrl,
      cancelUrl
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Advance Waterproofing <onboarding@resend.dev>',
        reply_to: BUSINESS_EMAIL,
        to: [BUSINESS_EMAIL],
        subject: `🔔 New Booking Request - ${name} - ${formattedDate}`,
        html: emailHTML
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API Error:', data);
      console.error('Response status:', response.status);
      console.error('API Key present:', !!RESEND_API_KEY);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to send email', details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, bookingId, data })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};

