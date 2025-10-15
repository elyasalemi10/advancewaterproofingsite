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
    
    const baseUrl = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || 'https://advancewaterproofing.com.au';
    const manageUrl = `${baseUrl}/admin`;
    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>New Quote Request</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body { margin:0; padding:0; -webkit-text-size-adjust:none; text-size-adjust:none; background:#ffffff; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
    #MessageViewBody a { color: inherit; text-decoration: none; }
    p { line-height: inherit; margin: 0; }
    @media (max-width:540px){
      .row-content{ width:100% !important; }
      .stack .column{ display:block; width:100% !important; }
    }
  </style>
  </head>
  <body style="background:#ffffff; margin:0; padding:0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" class="row-content" width="520" cellpadding="0" cellspacing="0" style="width:520px; max-width:520px; color:#000; margin:0 auto;">
          <tr>
            <td class="column" style="padding:5px 0; text-align:left; vertical-align:top;">

              <!-- Logo -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0;">
                    <div style="max-width:156px;">
                      <img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png"
                           width="156" alt="Logo" style="display:block; width:100%; height:auto; border:0;">
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px;">
                    <h1 style="margin:0; color:#3585c3; font-family:Arial, Helvetica, sans-serif; font-size:38px; font-weight:700; line-height:1.2; text-align:center;">
                      New Quote Request
                    </h1>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-top:1px solid #dddddd; font-size:1px; line-height:1px;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Spacer -->
              <div style="height:60px; line-height:60px; font-size:1px;">&nbsp;</div>

              <!-- Body copy -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px;">
                    <div style="color:#101112; font-family:Arial, Helvetica, sans-serif; font-size:16px; font-weight:400; line-height:1.2; text-align:center;">
                      <p style="margin-bottom:16px;">A quote has been requested. Below are the quote details for your reference:</p>
                      <p style="margin-bottom:16px;">
                        Customer Name: ${name}<br>
                        Customer Email: ${email}<br>
                        Customer Phone Number: ${phone || 'Not provided'}<br>
                        Subject: ${subject || 'General Inquiry'}<br>
                        Message: ${message}
                      </p>
                      <p>Please review the quote information carefully and manage by clicking the button below.</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:10px;">
                    <a href="${manageUrl}" target="_blank" style="text-decoration:none; color:#ffffff;">
                      <span style="display:inline-block; background-color:#2596be; color:#ffffff; font-family:Arial, Helvetica, sans-serif; font-size:16px; font-weight:400; padding:5px 20px; border-radius:4px; text-align:center;">
                        Manage Quote
                      </span>
                    </a>
                  </td>
                </tr>
              </table>

              <!-- (No Beefree footer) -->

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
        subject: `New Quote Request - ${name}`,
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

