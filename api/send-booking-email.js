import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto'

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
    const bookingId = generateBookingId();
  const customerAccessToken = crypto.randomBytes(24).toString('hex');
    
    // Store in Supabase
    const supabase = getSupabaseClient();
    let dbSuccess = false;
    let dbErrorMessage = null;
    
    try {
      const { data, error } = await supabase.from('bookings').insert([{
        booking_id: bookingId,
        customer_access_token: customerAccessToken,
        name, 
        email, 
        phone, 
        address, 
        service, 
        date, 
        time, 
        notes,
        status: 'pending',
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
      // Do NOT fail the whole request; continue to send email via Resend
      dbSuccess = false;
      dbErrorMessage = dbError?.message || String(dbError);
    }
    
    // If DB insert failed, fail the API call and do not send email
    if (!dbSuccess) {
      return res.status(500).json({ error: 'Failed to save booking', dbErrorMessage });
    }

    // Build message body (only after successful DB insert)
    // date is YYYY-MM-DD from client (local). Construct local date safely.
    const [yy, mm, dd] = String(date).split('-').map(Number)
    const dateObj = (yy && mm && dd) ? new Date(yy, (mm - 1), dd) : new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-AU', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    const formattedTime = startTime ? new Date(startTime).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Australia/Melbourne'
    }) : time;

    // Team notification email (no UUID/bookingId, no duration/end time)
    const emailHTML = `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit;
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		sup,
		sub {
			font-size: 75%;
			line-height: 0;
		}

		@media (max-width:540px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
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
															<h1 style="margin: 0; color: #3585c3; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; line-height: 1.2; text-align: center;">
																New Booking
															</h1>
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
																<p style="margin: 0; margin-bottom: 16px;">
																	A new job has been requested. Below are the job details for your reference:
																</p>
																<p style="margin: 0;">
																	Customer Name: ${name}<br>
																	Customer Email: ${email}<br>
																	Customer Phone Number: ${phone}<br>
																	Address: ${address}<br>
																	Service: ${service}<br>
																	Date: ${formattedDate}<br>
																	Time: ${formattedTime}<br>
																	Notes: ${notes || 'Empty'}<br><br>
																	Please review the job information carefully and confirm your acceptance or denial by clicking the button below.
																</p>
															</div>
														</td>
													</tr>
												</table>

												<table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td class="pad">
															<div class="alignment" align="center">
																<a href="${(req.headers.origin || '').replace(/\/$/, '')}/manage-booking?id=${bookingId}" target="_blank" style="color:#ffffff;text-decoration:none;">
																	<span class="button" style="background-color: #2596be; border-radius: 4px; color: #ffffff; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; padding: 5px 20px; text-align: center;">
																		Accept/Deny Booking
																	</span>
																</a>
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
				<!-- Beefree footer removed -->
			</td>
		</tr>
	</tbody>
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
        from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
        to: ['info@advancewaterproofing.com.au'],
        subject: `🔔 New ${isInspection ? 'Job' : 'Quote'} - ${name} - ${formattedDate}`,
        html: emailHTML
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      // If email failed, this is a hard failure
      return res.status(response.status || 500).json({ error: 'Failed to send email', details: data, dbSuccess, dbErrorMessage });
    }

    return res.status(200).json({ success: true, bookingId, customerAccessToken, dbSuccess, dbErrorMessage, data });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

