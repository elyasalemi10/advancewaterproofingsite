import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24'
  return createClient(supabaseUrl, supabaseKey)
}

function isBusinessDay(date) {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

function subtractBusinessDays(dateStr, businessDays) {
  const d = new Date(dateStr)
  let count = 0
  while (count < businessDays) {
    d.setDate(d.getDate() - 1)
    if (isBusinessDay(d)) count++
  }
  return d
}

function buildReminderEmailHTML(booking, url) {
  // User-provided Beefree template with placeholders replaced
  const template = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]>
<xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:OfficeDocumentSettings></xml>
<![endif]--><!--[if !mso]><!--><!--<![endif]-->
	<style>
		* { box-sizing: border-box; }
		body { margin: 0; padding: 0; }
		a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
		#MessageViewBody a { color: inherit; text-decoration: none; }
		p { line-height: inherit }
		.desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; }
		.image_block img+div { display: none; }
		sup, sub { font-size: 75%; line-height: 0; }
		@media (max-width:620px) {
			.desktop_hide table.icons-inner { display: inline-block !important; }
			.icons-inner { text-align: center; }
			.icons-inner td { margin: 0 auto; }
			.mobile_hide { display: none; }
			.row-content { width: 100% !important; }
			.stack .column { width: 100%; display: block; }
			.mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; }
			.desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; }
		}
	</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>

<body class="body" style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
																<div class="alignment" align="center">
																	<div style="max-width: 180px;"><img src="https://683f2eb45c.imgdist.com/pub/bfra/xmaci52l/e90/92q/kmw/logo-removebg-preview.png" style="display: block; height: auto; border: 0; width: 100%;" width="180" alt title height="auto"></div>
																</div>
														</td>
													</tr>
												</table>
												<table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
													<tr>
														<td class="pad">
															<h1 style="margin: 0; color: #3585c3; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 46px;"><span class="tinyMce-placeholder" style="word-break: break-word;">URGENT - {{job-name}}</span></h1>
														</td>
													</tr>
												</table>
												<table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
													<tr>
														<td class="pad">
															<div class="alignment" align="center">
																<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span style="word-break: break-word;">&#8202;</span></td>
																	</tr>
																</table>
															</div>
													</td>
												</tr>
											</table>
											<div class="spacer_block block-4" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
											<table class="paragraph_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
												<tr>
													<td class="pad">
														<div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:19px;">
															<p style="margin: 0; margin-bottom: 16px;">Our team is scheduled for a job at {{job-address}} on the {{job-date}}</p>
															<p style="margin: 0; margin-bottom: 16px;">This email is to confirm your job site will be ready for our visit</p>
															<p style="margin: 0; margin-bottom: 16px;">Note: we charge a $150 (metropolitan areas) or $250 (regional areas) trip fee for jobs that are not ready for our work to begin.</p>
														</div>
													</td>
												</tr>
											</table>
											<table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
												<tr>
													<td class="pad">
														<div class="alignment" align="center"><a href="{{url}}" target="_blank" style="color:#ffffff;text-decoration:none;"><!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"  href="{{url}}"  style="height:42px;width:184px;v-text-anchor:middle;" arcsize="10%" fillcolor="#3585c3">
<v:stroke dashstyle="Solid" weight="0px" color="#3585c3"/>
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#ffffff;font-family:sans-serif;font-size:16px">
<![endif]--><span class="button" style="background-color: #3585c3; mso-shading: transparent; border-bottom: 0px solid transparent; border-left: 0px solid transparent; border-radius: 4px; border-right: 0px solid transparent; border-top: 0px solid transparent; color: #ffffff; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; mso-border-alt: none; padding-bottom: 5px; padding-top: 5px; padding-left: 20px; padding-right: 20px; text-align: center; width: auto; word-break: keep-all; letter-spacing: normal;"><span style="word-break: break-word; line-height: 32px;">Confirm/Reschedule</span></span><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></a></div>
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
		<!-- End -->
</body>

</html>`

  return template
    .replace(/\{\{job-name\}\}/g, booking.service)
    .replace(/\{\{job-address\}\}/g, booking.address)
    .replace(/\{\{job-date\}\}/g, new Date(booking.date).toLocaleDateString('en-AU'))
    .replace(/\{\{url\}\}/g, url)
}

async function sendVonageSMS({ to, text }) {
  try {
    // Normalize AU mobile: accept formats like 0426 967 982, 0426967982, 61426967982
    let digits = (to || '').replace(/\D/g, '')
    if (digits.startsWith('0')) {
      digits = '61' + digits.slice(1)
    }
    if (!digits.startsWith('61')) {
      // assume AU if missing
      if (digits.length === 9 || digits.length === 10) {
        digits = '61' + digits.replace(/^0/, '')
      }
    }
    const apiKey = process.env.VONAGE_API_KEY
    const apiSecret = process.env.VONAGE_API_SECRET
    const body = new URLSearchParams({
      from: 'AdvanceWP',
      text,
      to: digits,
      api_key: apiKey || '',
      api_secret: apiSecret || ''
    })
    const resp = await fetch('https://rest.nexmo.com/sms/json', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    if (!resp.ok) {
      const err = await resp.text()
      console.error('Vonage SMS failed', err)
      return false
    }
    return true
  } catch (e) {
    console.error('Vonage SMS error', e)
    return false
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const supabase = getSupabaseClient()
    const now = new Date()

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .in('status', ['accepted'])
      .is('pre_job_reminder_sent_at', null)

    if (error) {
      console.error('Fetch bookings error', error)
      return res.status(500).json({ error: 'Failed to fetch bookings' })
    }

    let processed = 0
    const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:5173'

    for (const booking of bookings || []) {
      const reminderDate = subtractBusinessDays(booking.date, 2)
      // Trigger only when today >= reminderDate and same timezone context
      if (now >= new Date(reminderDate.toDateString())) {
        const url = `${baseUrl}/customer/${booking.customer_access_token}`
        const emailHTML = buildReminderEmailHTML(booking, url)

        const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co'
        try {
          const emailResp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({ from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>', to: [booking.email], subject: `URGENT: ${booking.service}`, html: emailHTML })
          })
          if (!emailResp.ok) {
            console.error('Resend failed', await emailResp.text())
          }
        } catch (e) {
          console.error('Email error', e)
        }

        const smsText = `Please confirm/reschedule your job at ${booking.address}\n\nWe’re booked at ${booking.address} on ${new Date(booking.date).toLocaleDateString('en-AU')}.\n\nPlease note a $150 (metro) or $250 (regional) fee applies if the site isn’t ready for work to begin.\n\nTap below to confirm or reschedule.\n\n${url}`
        if (booking.phone) {
          await sendVonageSMS({ to: booking.phone, text: smsText })
        }

        await supabase
          .from('bookings')
          .update({ pre_job_reminder_sent_at: new Date().toISOString() })
          .eq('id', booking.id)

        processed++
      }
    }

    return res.status(200).json({ success: true, processed })
  } catch (e) {
    console.error('Cron error', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


