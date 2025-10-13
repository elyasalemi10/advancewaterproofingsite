// Zoho Mail API Helper
// Sends emails via Zoho Mail using OAuth 2.0

/**
 * Get a fresh access token from Zoho using refresh token
 */
async function getZohoAccessToken(clientId, clientSecret, refreshToken) {
  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Zoho access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Send email via Zoho Mail API
 */
export async function sendZohoEmail({ to, subject, html, from }) {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const fromEmail = from || process.env.ZOHO_FROM_EMAIL || 'info@advancewaterproofing.com.au';

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho credentials not configured');
  }

  // Get fresh access token
  const accessToken = await getZohoAccessToken(clientId, clientSecret, refreshToken);

  // Prepare email data for Zoho API
  const emailData = {
    fromAddress: fromEmail,
    toAddress: to,
    subject: subject,
    content: html,
    mailFormat: 'html'
  };

  // Send email via Zoho Mail API
  const response = await fetch('https://mail.zoho.com/api/accounts/self/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Zoho Mail API error: ${error}`);
  }

  return await response.json();
}

/**
 * Send email with automatic fallback to Resend
 */
export async function sendEmail({ to, subject, html, from }) {
  const fromEmail = from || 'Advance Waterproofing <info@advancewaterproofing.com.au>';
  
  // Try Zoho first if credentials are available
  if (process.env.ZOHO_REFRESH_TOKEN) {
    try {
      console.log('Attempting to send email via Zoho Mail...');
      await sendZohoEmail({ to, subject, html, from: fromEmail });
      console.log('Email sent successfully via Zoho Mail');
      return { success: true, provider: 'zoho' };
    } catch (error) {
      console.error('Zoho Mail failed, falling back to Resend:', error.message);
    }
  }

  // Fallback to Resend
  try {
    console.log('Sending email via Resend...');
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      throw new Error('No email service available');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log('Email sent successfully via Resend');
    return { success: true, provider: 'resend' };
  } catch (error) {
    console.error('All email services failed:', error);
    throw error;
  }
}

