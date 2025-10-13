export interface BookingEmailData {
  bookingId: string
  name: string
  email: string
  phone: string
  address: string
  service: string
  date: string
  time: string
  notes?: string
  acceptUrl: string
  cancelUrl: string
}

export interface QuoteEmailData {
  quoteId: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  acceptUrl: string
  cancelUrl: string
}

export function generateBookingEmail(data: BookingEmailData): string {
  const dateObj = new Date(data.date)
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Created</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
    p { line-height: 1.6; margin: 0 0 10px; }
    @media (max-width:540px) {
      .row-content { width: 100% !important; }
      .stack .column { width: 100%; display: block; }
    }
  </style>
</head>

<body style="background-color: #f5f5f5; margin: 0; padding: 0;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #0d3b66 0%, #2596be 100%); padding: 40px 30px;">
              <img src="https://advancewaterproofing.com.au/logo.webp" width="120" alt="Advance Waterproofing" style="display: block; height: auto; border: 0; margin-bottom: 20px;">
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 10px 0; text-align: center;">New Booking Request</h1>
              <p style="color: #e0f2fe; margin: 0; font-size: 16px; text-align: center;">Booking ID: <strong>${data.bookingId}</strong></p>
            </td>
          </tr>

          <!-- Date & Time Card -->
          <tr>
            <td style="padding: 30px;">
              <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 2px solid #2596be; text-align: center;">
                <div style="background-color: #0d3b66; color: white; padding: 12px; border-radius: 8px 8px 0 0; font-weight: 600; font-size: 18px; margin-bottom: 2px; display: inline-block; width: 100%;">
                  ${dateObj.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase()}
                </div>
                <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: inline-block; width: 100%;">
                  <div style="font-size: 48px; font-weight: bold; color: #0d3b66; line-height: 1;">
                    ${dateObj.getDate()}
                  </div>
                  <div style="color: #64748b; font-size: 16px; margin-top: 8px;">
                    ${dateObj.toLocaleDateString('en-AU', { weekday: 'long' })}
                  </div>
                </div>
                <div style="margin-top: 16px; background-color: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="font-size: 24px; font-weight: 600; color: #2596be;">
                    🕐 ${data.time}
                  </div>
                </div>
              </div>

              <!-- Client Information -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #0d3b66; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #2596be; padding-bottom: 10px;">
                  👤 Client Information
                </h2>
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 120px;">Name:</strong>
                      <span style="color: #1e293b;">${data.name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 120px;">Email:</strong>
                      <a href="mailto:${data.email}" style="color: #2596be; text-decoration: none;">${data.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 120px;">Phone:</strong>
                      <a href="tel:${data.phone}" style="color: #2596be; text-decoration: none;">${data.phone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 120px;">Address:</strong>
                      <span style="color: #1e293b;">${data.address}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Service Requested -->
              <div style="background-color: #ecfdf5; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #10b981;">
                <h2 style="color: #059669; margin: 0 0 12px 0; font-size: 20px;">
                  🔧 Service Requested
                </h2>
                <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 500;">
                  ${data.service}
                </p>
              </div>

              ${data.notes ? `
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #f59e0b;">
                <h2 style="color: #d97706; margin: 0 0 12px 0; font-size: 20px;">
                  📝 Additional Notes
                </h2>
                <p style="color: #1e293b; margin: 0; font-size: 14px; line-height: 1.6;">
                  ${data.notes}
                </p>
              </div>
              ` : ''}

              <!-- Action Buttons -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); margin: 0 8px 12px 8px;">
                  ✅ Accept Booking
                </a>
                <a href="${data.cancelUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3); margin: 0 8px 12px 8px;">
                  ❌ Cancel Booking
                </a>
                <p style="color: #64748b; font-size: 12px; margin-top: 12px;">
                  Click to accept or cancel this booking
                </p>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 16px; border-left: 4px solid #2596be;">
                <p style="color: #1e40af; margin: 0; font-size: 13px; line-height: 1.6;">
                  <strong>📌 Next Steps:</strong><br>
                  1. Review the booking details above<br>
                  2. Click "Accept Booking" to confirm or "Cancel Booking" to decline<br>
                  3. The client will receive a confirmation email automatically<br>
                  4. Contact the client at <a href="mailto:${data.email}" style="color: #2596be;">${data.email}</a> or <a href="tel:${data.phone}" style="color: #2596be;">${data.phone}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d3b66; padding: 30px; text-align: center;">
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
  `.trim()
}

export function generateQuoteEmail(data: QuoteEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
    p { line-height: 1.6; margin: 0 0 10px; }
    @media (max-width:540px) {
      .row-content { width: 100% !important; }
      .stack .column { width: 100%; display: block; }
    }
  </style>
</head>

<body style="background-color: #f5f5f5; margin: 0; padding: 0;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #0d3b66 0%, #2596be 100%); padding: 40px 30px;">
              <img src="https://advancewaterproofing.com.au/logo.webp" width="120" alt="Advance Waterproofing" style="display: block; height: auto; border: 0; margin-bottom: 20px;">
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 10px 0; text-align: center;">New Quote Request</h1>
              <p style="color: #e0f2fe; margin: 0; font-size: 16px; text-align: center;">Quote ID: <strong>${data.quoteId}</strong></p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <!-- Client Information -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #0d3b66; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #2596be; padding-bottom: 10px;">
                  👤 Client Information
                </h2>
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 120px;">Name:</strong>
                      <span style="color: #1e293b;">${data.name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 120px;">Email:</strong>
                      <a href="mailto:${data.email}" style="color: #2596be; text-decoration: none;">${data.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 120px;">Phone:</strong>
                      <a href="tel:${data.phone}" style="color: #2596be; text-decoration: none;">${data.phone}</a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Service Requested -->
              <div style="background-color: #ecfdf5; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #10b981;">
                <h2 style="color: #059669; margin: 0 0 12px 0; font-size: 20px;">
                  🔧 Service Requested
                </h2>
                <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 500;">
                  ${data.service}
                </p>
              </div>

              <!-- Message -->
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #f59e0b;">
                <h2 style="color: #d97706; margin: 0 0 12px 0; font-size: 20px;">
                  💬 Message
                </h2>
                <p style="color: #1e293b; margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                  ${data.message}
                </p>
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); margin: 0 8px 12px 8px;">
                  ✅ Respond to Quote
                </a>
                <p style="color: #64748b; font-size: 12px; margin-top: 12px;">
                  Click to respond to this quote request
                </p>
              </div>

              <!-- Contact Info -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 16px; border-left: 4px solid #2596be;">
                <p style="color: #1e40af; margin: 0; font-size: 13px; line-height: 1.6;">
                  <strong>📌 Contact Client:</strong><br>
                  Email: <a href="mailto:${data.email}" style="color: #2596be;">${data.email}</a><br>
                  Phone: <a href="tel:${data.phone}" style="color: #2596be;">${data.phone}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d3b66; padding: 30px; text-align: center;">
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
  `.trim()
}

