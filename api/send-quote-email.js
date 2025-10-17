import { requireAuth } from './_auth.js'

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
    const { to, date, time, address, service, job, message, pdfBase64, pdfFilename, declined } = req.body;
    const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co';

    const safeMessage = (message && String(message).trim().length > 0) ? message : 'Empty';

    if (!declined && (!pdfBase64 || !pdfFilename)) {
      return res.status(400).json({ error: 'PDF attachment is required' })
    }

    const emailHTML = declined ? `
<!DOCTYPE html>
<html lang="en">
<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		* { box-sizing: border-box; }
		body { margin: 0; padding: 0; }
		a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
		#MessageViewBody a { color: inherit; text-decoration: none; }
		p { line-height: inherit; }
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

<body style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff;">
		<tbody>
			<tr>
				<td>
					<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color: #000000; width: 520px; margin: 0 auto;">
										<tbody>
											<tr>
												<td width="100%" style="font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
													<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
														<tr>
															<td style="width:100%;padding:0;">
																<div align="center">
																	<div style="max-width: 156px;">
																		<img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" style="display: block; height: auto; border: 0; width: 100%;" width="156" alt="Logo" title="">
																	</div>
																</div>
														</td>
													</tr>
												</table>

												<table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td>
															<h1 style="margin: 0; color: #3585c3; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; line-height: 1.2; text-align: center;">Your quote has been declined</h1>
														</td>
													</tr>
												</table>

												<table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td>
															<div align="center">
																<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
																	<tr>
																		<td style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span>&#8202;</span></td>
																	</tr>
																</table>
															</div>
														</td>
													</tr>
												</table>

												<div style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>

												<table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td>
															<div style="color:#101112;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;line-height:1.2;text-align:center;">
																<p style="margin: 0; margin-bottom: 16px;">We appreciate your interest. Unfortunately, we won't be proceeding with this quote at this time.</p>
																<p style="margin: 0; margin-bottom: 16px;">Reason: ${safeMessage}</p>
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
    ` : `
<!DOCTYPE html>
<html lang="en">
<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		* { box-sizing: border-box; }
		body { margin: 0; padding: 0; }
		a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
		#MessageViewBody a { color: inherit; text-decoration: none; }
		p { line-height: inherit; }
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

<body style="background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff;">
		<tbody>
			<tr>
				<td>
					<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color: #000000; width: 520px; margin: 0 auto;">
										<tbody>
											<tr>
												<td width="100%" style="font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
													<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
														<tr>
															<td style="width:100%;padding:0;">
																<div align="center">
																	<div style="max-width: 156px;">
																		<img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" style="display: block; height: auto; border: 0; width: 100%;" width="156" alt="Logo" title="">
																	</div>
																</div>
														</td>
													</tr>
												</table>

												<table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td>
															<h1 style="margin: 0; color: #3585c3; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; line-height: 1.2; text-align: center;">Your Quote</h1>
														</td>
													</tr>
												</table>

												<table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td>
															<div align="center">
																<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
																	<tr>
																		<td style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span>&#8202;</span></td>
																	</tr>
																</table>
															</div>
														</td>
													</tr>
												</table>

												<div style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>

												<table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
													<tr>
														<td>
															<div style="color:#101112;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;line-height:1.2;text-align:center;">
                                            <p style="margin: 0; margin-bottom: 16px;">Please find your quote attached.</p>
                                            <p style="margin: 0; margin-bottom: 16px;"></p>
																<p style="margin: 0;">Message: ${safeMessage}</p>
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

    const payload = {
      from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>',
      to: [to],
      subject: declined ? 'Your Quote Status' : 'Your Quote from Advance Waterproofing',
      html: emailHTML,
      attachments: !declined && pdfBase64 && pdfFilename ? [{ filename: pdfFilename, content: pdfBase64 }] : undefined
    };

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    let resultText = ''
    try { resultText = await emailResponse.text() } catch {}
    if (!emailResponse.ok) {
      let details
      try { details = JSON.parse(resultText) } catch { details = resultText }
      return res.status(emailResponse.status).json({ error: 'Failed to send quote email', details });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('send-quote-email error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}


