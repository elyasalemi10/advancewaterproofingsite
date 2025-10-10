// Resend API service for booking emails
interface BookingData {
  name: string
  email: string
  phone: string
  address: string
  service: string
  date: Date
  time: string
  notes?: string
}

const RESEND_API_KEY = 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co'
const BUSINESS_EMAIL = 'info@advancewaterproofing.com.au'

// Generate a unique booking ID
function generateBookingId(): string {
  return `BOOK-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
}

// Format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Create beautiful HTML email template
function createBookingEmailHTML(data: BookingData, bookingId: string): string {
  const formattedDate = formatDate(data.date)
  // Use current origin or fallback to production URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const acceptUrl = `${baseUrl}/api/accept-booking?id=${bookingId}`
  
  return `
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
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <img src="https://advancewaterproofing.com.au/logo.png" alt="Advance Waterproofing" style="height: 60px; margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">New Booking Request</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Booking ID: ${bookingId}</p>
            </td>
          </tr>

          <!-- Calendar Card -->
          <tr>
            <td style="padding: 30px;">
              <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 2px solid #3b82f6;">
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="text-align: center;">
                      <div style="background-color: #1e3a8a; color: white; padding: 12px; border-radius: 8px 8px 0 0; font-weight: 600; font-size: 18px; margin-bottom: 2px;">
                        ${data.date.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase()}
                      </div>
                      <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 48px; font-weight: bold; color: #1e3a8a; line-height: 1;">
                          ${data.date.getDate()}
                        </div>
                        <div style="color: #64748b; font-size: 16px; margin-top: 8px;">
                          ${data.date.toLocaleDateString('en-AU', { weekday: 'long' })}
                        </div>
                      </div>
                      <div style="margin-top: 16px; background-color: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; font-weight: 600; color: #3b82f6;">
                          🕐 ${data.time}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Client Details -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                  👤 Client Information
                </h2>
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Name:</strong>
                      <span style="color: #1e293b;">${data.name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Email:</strong>
                      <a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">${data.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Phone:</strong>
                      <a href="tel:${data.phone}" style="color: #3b82f6; text-decoration: none;">${data.phone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #475569; display: inline-block; width: 100px;">Address:</strong>
                      <span style="color: #1e293b;">${data.address}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Service Details -->
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

              <!-- Accept Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 48px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); transition: transform 0.2s;">
                  ✅ Accept Booking
                </a>
                <p style="color: #64748b; font-size: 12px; margin-top: 12px;">
                  Click to confirm this booking and send confirmation to both parties
                </p>
              </div>

              <!-- Info Box -->
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
  `.trim()
}

// Create confirmation email for client
function createClientConfirmationHTML(data: BookingData, bookingId: string): string {
  const formattedDate = formatDate(data.date)
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <img src="https://advancewaterproofing.com.au/logo.png" alt="Advance Waterproofing" style="height: 60px; margin-bottom: 20px;">
              <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Booking Confirmed!</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Booking ID: ${bookingId}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Dear ${data.name},
              </p>
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Great news! Your waterproofing inspection has been confirmed. We're looking forward to helping you with your <strong>${data.service}</strong>.
              </p>

              <!-- Calendar Card -->
              <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 2px solid #3b82f6; text-align: center;">
                <div style="background-color: #1e3a8a; color: white; display: inline-block; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 18px; margin-bottom: 16px;">
                  📅 ${formattedDate}
                </div>
                <div style="font-size: 32px; font-weight: bold; color: #1e3a8a; margin: 16px 0;">
                  🕐 ${data.time}
                </div>
                <div style="color: #475569; font-size: 16px; margin-top: 12px;">
                  📍 ${data.address}
                </div>
              </div>

              <!-- What to Expect -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #1e3a8a; margin: 0 0 16px 0; font-size: 20px;">
                  What to Expect
                </h2>
                <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Our specialist will arrive at your property at the scheduled time</li>
                  <li>Comprehensive inspection of your waterproofing needs</li>
                  <li>Professional assessment and recommendations</li>
                  <li>Free, no-obligation quote for required works</li>
                  <li>Answer all your questions about the process</li>
                </ul>
              </div>

              <!-- Contact Info -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
                <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
                  <strong>Need to reschedule or have questions?</strong><br>
                  📞 Call us: 03 9001 7788<br>
                  📧 Email: info@advancewaterproofing.com.au<br>
                  🕐 Mon-Fri: 7:00am - 6:00pm
                </p>
              </div>

              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
                We look forward to seeing you!<br>
                <strong style="color: #1e293b;">The Advance Waterproofing Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">
                Advance Waterproofing & Caulking Solution
              </p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">
                VBA Registered Building Practitioner | Certified Waterproofers | Fully Insured
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

export async function sendBookingEmail(data: BookingData): Promise<boolean> {
  try {
    const bookingId = generateBookingId()
    const emailHTML = createBookingEmailHTML(data, bookingId)

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Advance Waterproofing <bookings@advancewaterproofing.com.au>',
        to: [BUSINESS_EMAIL],
        subject: `🔔 New Booking Request - ${data.name} - ${formatDate(data.date)}`,
        html: emailHTML
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API Error:', errorData)
      return false
    }

    const result = await response.json()
    console.log('Booking email sent successfully:', result)

    // Store booking ID for potential acceptance later
    localStorage.setItem(`booking-${bookingId}`, JSON.stringify({ ...data, bookingId }))

    return true
  } catch (error) {
    console.error('Error sending booking email:', error)
    return false
  }
}

export async function sendAcceptanceEmails(bookingId: string): Promise<boolean> {
  try {
    // Retrieve booking data (in a real app, this would come from a database)
    const bookingDataStr = localStorage.getItem(`booking-${bookingId}`)
    if (!bookingDataStr) {
      console.error('Booking not found')
      return false
    }

    const data: BookingData = JSON.parse(bookingDataStr)

    // Send confirmation to client
    const clientHTML = createClientConfirmationHTML(data, bookingId)
    
    const clientResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Advance Waterproofing <bookings@advancewaterproofing.com.au>',
        to: [data.email],
        subject: `✅ Booking Confirmed - ${formatDate(data.date)} at ${data.time}`,
        html: clientHTML
      })
    })

    // Send confirmation to business
    const businessHTML = `
      <h2>✅ Booking Accepted and Confirmed</h2>
      <p>You have successfully confirmed the booking for:</p>
      <ul>
        <li><strong>Client:</strong> ${data.name}</li>
        <li><strong>Date:</strong> ${formatDate(data.date)}</li>
        <li><strong>Time:</strong> ${data.time}</li>
        <li><strong>Service:</strong> ${data.service}</li>
      </ul>
      <p>The client has been notified via email.</p>
    `

    const businessResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Advance Waterproofing <bookings@advancewaterproofing.com.au>',
        to: [BUSINESS_EMAIL],
        subject: `✅ Booking Confirmed - ${data.name}`,
        html: businessHTML
      })
    })

    return clientResponse.ok && businessResponse.ok
  } catch (error) {
    console.error('Error sending acceptance emails:', error)
    return false
  }
}

