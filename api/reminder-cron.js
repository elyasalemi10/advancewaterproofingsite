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
\t<title></title>
\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]>
<xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
<![endif]--><!--[if !mso]><!--><!--<![endif]-->
\t<style>
\t\t* {
\t\t	box-sizing: border-box;
\t\t}

\t\tbody {
\t\t	margin: 0;
\t\t	padding: 0;
\t\t}

\t\ta[x-apple-data-detectors] {
\t\t	color: inherit !important;
\t\t	text-decoration: inherit !important;
\t\t}

\t\t#MessageViewBody a {
\t\t	color: inherit;
\t\t	text-decoration: none;
\t\t}

\t\tp {
\t\t	line-height: inherit
\t\t}

\t\t.desktop_hide,
\t\t.desktop_hide table {
\t\t	mso-hide: all;
\t\t	display: none;
\t\t	max-height: 0px;
\t\t	overflow: hidden;
\t\t}

\t\t.image_block img+div {
\t\t	display: none;
\t\t}

\t\tsup,
\t\tsub {
\t\t	font-size: 75%;
\t\t	line-height: 0;
\t\t}

\t\t@media (max-width:620px) {
\t\t	.desktop_hide table.icons-inner {
\t\t		display: inline-block !important;
\t\t	}

\t\t	.icons-inner {
\t\t		text-align: center;
\t\t	}

\t\t	.icons-inner td {
\t\t		margin: 0 auto;
\t\t	}

\t\t	.mobile_hide {
\t\t		display: none;
\t\t	}

\t\t	.row-content {
\t\t		width: 100% !important;
\t\t	}

\t\t	.stack .column {
\t\t		width: 100%;
\t\t		display: block;
\t\t	}

\t\t	.mobile_hide {
\t\t		min-height: 0;
\t\t		max-height: 0;
\t\t		max-width: 0;
\t\t		overflow: hidden;
\t\t		font-size: 0px;
\t\t	}

\t\t	.desktop_hide,
\t\t	.desktop_hide table {
\t\t		display: table !important;
\t\t		max-height: none !important;
\t\t	}
\t\t}
\t</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>

<body class="body" style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
\t<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
\t\t<tbody>
\t\t\t<tr>
\t\t\t\t<td>
\t\t\t\t\t<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td>
\t\t\t\t\t\t\t\t\t<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="alignment" align="center">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div style="max-width: 180px;"><img src="https://683f2eb45c.imgdist.com/pub/bfra/xmaci52l/e90/92q/kmw/logo-removebg-preview.png" style="display: block; height: auto; border: 0; width: 100%;" width="180" alt title height="auto"></div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t<table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h1 style="margin: 0; color: #3585c3; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 46px;"><span class="tinyMce-placeholder" style="word-break: break-word;">URGENT - {{job-name}}</span></h1>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t<table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="alignment" align="center">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span style="word-break: break-word;">&#8202;</span></td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t<div class="spacer_block block-4" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
\t\t\t\t\t\t\t\t\t\t\t\t<table class="paragraph_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:center;mso-line-height-alt:19px;">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0; margin-bottom: 16px;">Our team is scheduled for a job at {{job-address}} on the {{job-date}}</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0; margin-bottom: 16px;">This email is to confirm your job site will be ready for our visit</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0; margin-bottom: 16px;">Note: we charge a $150 (metropolitan areas) or $250 (regional areas) trip fee for jobs that are not ready for our work to begin.</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p style="margin: 0;">We have also sent you a text regarding this as well, please confirm or reschedule with the button below</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t<table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td class="pad">
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="alignment" align="center"><a href="{{url}}" target="_blank" style="color:#ffffff;text-decoration:none;"><!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"  href="{{url}}"  style="height:42px;width:184px;v-text-anchor:middle;" arcsize="10%" fillcolor="#3585c3">
<v:stroke dashstyle="Solid" weight="0px" color="#3585c3"/>
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#ffffff;font-family:sans-serif;font-size:16px">
<![endif]--><span class="button" style="background-color: #3585c3; mso-shading: transparent; border-bottom: 0px solid transparent; border-left: 0px solid transparent; border-radius: 4px; border-right: 0px solid transparent; border-top: 0px solid transparent; color: #ffffff; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; mso-border-alt: none; padding-bottom: 5px; padding-top: 5px; padding-left: 20px; padding-right: 20px; text-align: center; width: auto; word-break: keep-all; letter-spacing: normal;"><span style="word-break: break-word; line-height: 32px;">Confirm/Reschedule</span></span><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></a></div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t</table>
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t</tbody>
\t\t</table>
\t\t<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
\t\t\t<tbody>
\t\t\t\t<tr>
\t\t\t\t\t<td>
\t\t\t\t\t\t<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px; margin: 0 auto;" width="600">
\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
\t\t\t\t\t\t\t\t\t<table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center; line-height: 0;">
\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t<td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t<!--[if !vml]><!-->
\t\t\t\t\t\t\t\t\t\t\t\t<table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="https://designedwithbeefree.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Beefree Logo" src="https://d1oco4z2z1fhwp.cloudfront.net/assets/Beefree-logo.png" height="auto" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: undefined; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center; line-height: normal;"><a href="https://designedwithbeefree.com/" target="_blank" style="color: #1e0e4b; text-decoration: none;">Designed with Beefree</a></td>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t</tbody>
\t\t\t\t\t</table>
\t\t\t\t</td>
\t\t\t</tr>
\t\t</tbody>
\t</table>
\t<!-- End -->
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
    const apiKey = process.env.VONAGE_API_KEY
    const apiSecret = process.env.VONAGE_API_SECRET
    const body = new URLSearchParams({
      from: 'AdvanceWP',
      text,
      to,
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
            body: JSON.stringify({ from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>', to: [booking.email], subject: 'Action Required: Confirm/Reschedule', html: emailHTML })
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


