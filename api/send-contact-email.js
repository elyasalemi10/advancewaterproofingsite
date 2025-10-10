// Vercel Serverless Function
// Use native fetch (available in Node 18+)
const fetch = globalThis.fetch || require('node-fetch');

module.exports = async (req, res) => {
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
    const { name, email, phone, subject, message } = req.body;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const BUSINESS_EMAIL = 'info@advancewaterproofing.com.au';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <img src="https://advancewaterproofing.com.au/logo.png" alt="Advance Waterproofing" style="height: 60px; margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">New Contact Form Inquiry</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">📧 Contact Request</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              
              <!-- Client Details -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                  👤 Contact Information
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
                  ${phone ? `
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Phone:</strong>
                      <a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a>
                    </td>
                  </tr>
                  ` : ''}
                  ${subject ? `
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Subject:</strong>
                      <span style="color: #1e293b;">${subject}</span>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Message -->
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #f59e0b;">
                <h2 style="color: #d97706; margin: 0 0 12px 0; font-size: 20px;">
                  💬 Message
                </h2>
                <p style="color: #1e293b; margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
${message}
                </p>
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); color: white; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); margin-right: 10px;">
                  📧 Reply via Email
                </a>
                ${phone ? `
                <a href="tel:${phone}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                  📞 Call Customer
                </a>
                ` : ''}
              </div>

              <!-- Info Box -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 16px; border-left: 4px solid #3b82f6;">
                <p style="color: #1e40af; margin: 0; font-size: 13px; line-height: 1.6;">
                  <strong>📌 Next Steps:</strong><br>
                  1. Review the inquiry details above<br>
                  2. Respond to the customer within 24 hours<br>
                  3. Follow up with a quote if requested<br>
                  4. Schedule a site visit if needed
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
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
        subject: `📧 New Contact Form: ${subject || 'General Inquiry'} - ${name}`,
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

    console.log('Email sent successfully:', data);
    return res.status(200).json({ success: true, data });

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

