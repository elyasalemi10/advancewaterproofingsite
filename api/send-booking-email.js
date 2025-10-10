// Vercel Serverless Function
// Use native fetch (available in Node 18+)

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, address, service, date, time, notes } = req.body;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const BUSINESS_EMAIL = 'info@advancewaterproofing.com.au';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const bookingId = generateBookingId();
    const formattedDate = formatDate(date);
    
    // Get the accept URL - use the request origin
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    const acceptUrl = `${baseUrl}/api/accept-booking?id=${bookingId}`;

    const dateObj = new Date(date);
    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <img src="https://advancewaterproofing.com.au/logo.webp" alt="Advance Waterproofing" style="height: 60px; margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">New Booking Request</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Booking ID: ${bookingId}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 2px solid #3b82f6;">
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="text-align: center;">
                      <div style="background-color: #1e3a8a; color: white; padding: 12px; border-radius: 8px 8px 0 0; font-weight: 600; font-size: 18px; margin-bottom: 2px;">
                        ${dateObj.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase()}
                      </div>
                      <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 48px; font-weight: bold; color: #1e3a8a; line-height: 1;">
                          ${dateObj.getDate()}
                        </div>
                        <div style="color: #64748b; font-size: 16px; margin-top: 8px;">
                          ${dateObj.toLocaleDateString('en-AU', { weekday: 'long' })}
                        </div>
                      </div>
                      <div style="margin-top: 16px; background-color: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; font-weight: 600; color: #3b82f6;">
                          🕐 ${time}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                  👤 Client Information
                </h2>
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Name:</strong>
                      <span style="color: #1e293b;">${name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Email:</strong>
                      <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Phone:</strong>
                      <a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Address:</strong>
                      <span style="color: #1e293b;">${address}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #ecfdf5; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #10b981;">
                <h2 style="color: #059669; margin: 0 0 12px 0; font-size: 20px;">
                  🔧 Service Requested
                </h2>
                <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 500;">
                  ${service}
                </p>
              </div>

              ${notes ? `
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #f59e0b;">
                <h2 style="color: #d97706; margin: 0 0 12px 0; font-size: 20px;">
                  📝 Additional Notes
                </h2>
                <p style="color: #1e293b; margin: 0; font-size: 14px; line-height: 1.6;">
                  ${notes}
                </p>
              </div>
              ` : ''}

              <div style="text-align: center; margin: 32px 0;">
                <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                  ✅ Accept Booking
                </a>
                <p style="color: #64748b; font-size: 12px; margin-top: 12px;">
                  Click to confirm this booking and send confirmation to both parties
                </p>
              </div>

              <div style="background-color: #eff6ff; border-radius: 8px; padding: 16px; border-left: 4px solid #3b82f6;">
                <p style="color: #1e40af; margin: 0; font-size: 13px; line-height: 1.6;">
                  <strong>📌 Next Steps:</strong><br>
                  1. Review the booking details above<br>
                  2. Click "Accept Booking" to confirm<br>
                  3. Both you and the client will receive confirmation emails<br>
                  4. The appointment will be added to your calendar
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">
                Advance Waterproofing & Caulking Solution
              </p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">
                📞 03 9001 7788 | 📧 info@advancewaterproofing.com.au
              </p>
              <p style="color: #64748b; margin: 10px 0 0 0; font-size: 12px;">
                Melbourne Metro & Victoria, Australia
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

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Advance Waterproofing <info@advancewaterproofing.com.au>',
        to: [BUSINESS_EMAIL],
        reply_to: email, // Customer's email for easy replies
        subject: `🔔 New Booking Request - ${name} - ${formattedDate}`,
        html: emailHTML
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API Error:', JSON.stringify(data, null, 2));
      console.error('Response status:', response.status);
      console.error('Response statusText:', response.statusText);
      return res.status(response.status).json({ 
        error: 'Failed to send email', 
        details: data,
        status: response.status,
        statusText: response.statusText
      });
    }

    console.log('Booking email sent successfully:', data);
    return res.status(200).json({ success: true, bookingId, data });

  } catch (error) {
    console.error('Function error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

