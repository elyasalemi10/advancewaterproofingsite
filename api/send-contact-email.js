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
    const { name, email, phone, subject, message } = req.body;
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co';
    
    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form</title>
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
              <h1 style="color: #3585c3; font-size: 32px; font-weight: 700; margin: 0;">New Contact Form - ${subject || 'General Inquiry'}</h1>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 10px;">
              <hr style="border: none; border-top: 1px solid #dddddd; width: 100%;">
            </td>
          </tr>

          <tr>
            <td style="padding: 20px; text-align: center; font-size: 16px; color: #101112;">
              <p>A new contact form submission has been received. Below are the details:</p>
              <p>
                <strong>Name:</strong> ${name}<br>
                <strong>Email:</strong> ${email}<br>
                <strong>Phone Number:</strong> ${phone || 'Not provided'}<br>
                <strong>Subject:</strong> ${subject || 'General Inquiry'}<br>
                <strong>Message:</strong><br>
                ${message}
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px;">
              <a href="mailto:${email}" target="_blank" style="background-color: #2596be; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-size: 16px;">
                Reply to Customer
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
        reply_to: email,
        subject: `📧 Contact Form: ${subject || 'General Inquiry'} - ${name}`,
        html: emailHTML
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(response.status).json({ error: 'Failed to send email', details: data });
    }

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

