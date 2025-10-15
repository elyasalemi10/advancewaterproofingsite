import { createClient } from '@supabase/supabase-js';
import { requireAuth } from './_auth.js'

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
    const auth = requireAuth(req, res)
    if (!auth) return
    const { bookingId, cancel } = req.body;
    
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

    if (!cancel) {
      if (booking.status !== 'pending') {
        return res.status(400).json({ error: 'Booking already processed' });
      }
    }

    // If cancelling, skip Cal.com creation and set status cancelled
    if (cancel) {
      const { error: cancelErr } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('booking_id', bookingId)
      if (cancelErr) {
        return res.status(500).json({ error: 'Failed to cancel booking' })
      }

      const dateObj = new Date(booking.date);
      const formattedDate = dateObj.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = new Date(booking.preferred_time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZone: 'Australia/Melbourne' });

      const cancelHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Booking Cancelled</title></head><body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif;"><table width="100%" style="background:#ffffff"><tr><td align="center"><table width="520" style="margin:0 auto;color:#000"><tr><td align="center" style="padding:20px 0"><img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" width="156" alt="Logo" style="display:block;height:auto;border:0"></td></tr><tr><td align="center" style="padding:10px"><h1 style="color:#3585c3;font-size:32px;font-weight:700;margin:0;">Booking Cancelled</h1></td></tr><tr><td style="padding:20px;text-align:center;font-size:16px;color:#101112;">Your booking scheduled for ${formattedDate} at ${formattedTime} has been cancelled. If this is unexpected, please contact us.</td></tr></table></td></tr></table></body></html>`;

      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
            to: [booking.email],
            subject: 'Your Booking Has Been Cancelled',
            html: cancelHTML
          })
        })
        if (!emailResponse.ok) {
          const err = await emailResponse.json()
          console.error('Cancel email failed', err)
        }
      } catch (e) {
        console.error('Cancel email error', e)
      }

      return res.status(200).json({ success: true, message: 'Booking cancelled and customer notified' })
    }
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
            name: `${booking.is_inspection ? 'Job' : 'Quote'}: ${booking.name}`,
            notes: `Customer: ${booking.name}\nPhone: ${booking.phone}\nEmail: ${booking.email}\nAddress: ${booking.address}\nService: ${booking.service}\nNotes: ${booking.notes || 'None'}`
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

    // Send confirmation email to customer using provided template (no IDs, no end time)
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
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		* { box-sizing: border-box; }
		body { margin: 0; padding: 0; }
		a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
		#MessageViewBody a { color: inherit; text-decoration: none; }
		p { line-height: inherit }
		.desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; }
		.image_block img+div { display: none; }
		sup, sub { font-size: 75%; line-height: 0; }
		@media (max-width:540px) {
			.desktop_hide table.icons-inner { display: inline-block !important; }
			.icons-inner { text-align: center; }
			.icons-inner td { margin: 0 auto; }
			.mobile_hide { display: none; }
			.row-content { width: 100% !important; }
			.stack .column { width: 100%; display: block; }
			.mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; }
			.desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; }
		}
	</style>
</head>

<body class="body" style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color: #000000; width: 520px; margin: 0 auto;" width="520">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
														<tr>
															<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
																<div class="alignment" align="center">
																	<div style="max-width: 156px;">
																		<img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" style="display: block; height: auto; border: 0; width: 100%;" width="156" alt title height="auto">
																	</div>
																</div>
														</td>
													</tr>
												</table>
												<table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td class="pad">
															<h1 style="margin: 0; color: #3585c3; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; line-height: 1.2; text-align: center;">Booking Confirmed!</h1>
														</td>
													</tr>
												</table>
												<table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td class="pad">
															<div class="alignment" align="center">
																<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
																	<tr>
																		<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span>&#8202;</span></td>
																	</tr>
																</table>
															</div>
														</td>
													</tr>
												</table>
												<div class="spacer_block block-4" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
                            <table class="paragraph_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td class="pad">
															<div style="color:#101112;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;line-height:1.2;text-align:center;">
                                    <p style="margin: 0; margin-bottom: 16px;">The job "${booking.service}" has been confirmed, see the details below</p>
																<p style="margin: 0; margin-bottom: 16px;"><br>Date: ${formattedDate}<br>Time: ${formattedTime}<br>Address: ${booking.address}<br>Service: ${booking.service}</p>
																<p style="margin: 0;">If you were not the one who did this action please contact us at support@advancewaterproofing.com.au<br><br></p>
															</div>
														</td>
													</tr>
												</table>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
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
          from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
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

