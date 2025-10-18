// Consolidated email API to reduce function count
import { requireAuth } from '../lib/serverAuth.js'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, supabaseKey)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type } = req.query
  if (type === 'contact') {
    try {
      const { name, email, phone, subject, message } = req.body;
      const quoteId = `QUOTE-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
      const baseUrl = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || 'https://advancewaterproofing.com.au'
      const manageUrl = `${baseUrl}/manage-quotes?id=${quoteId}`
      try {
        const supabase = getSupabaseClient()
        await supabase.from('quotes').insert([{ quote_id: quoteId, name, email, phone, subject: subject || 'General Inquiry', message, status: 'pending' }])
      } catch {}
      const emailHTML = `<!DOCTYPE html><html lang="en"><head><title>New Quote Request</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>*{box-sizing:border-box}body{margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;background:#ffffff}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit;margin:0}@media (max-width:540px){.row-content{width:100%!important}.stack .column{display:block;width:100%!important}}</style></head><body style="background:#ffffff;margin:0;padding:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;"><tr><td align="center"><table role="presentation" class="row-content" width="520" cellpadding="0" cellspacing="0" style="width:520px;max-width:520px;color:#000;margin:0 auto;"><tr><td class="column" style="padding:5px 0;text-align:left;vertical-align:top;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0;"><div style="max-width:156px;"><img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" width="156" alt="Logo" style="display:block;width:100%;height:auto;border:0;"></div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px;"><h1 style="margin:0;color:#3585c3;font-family:Arial,Helvetica,sans-serif;font-size:38px;font-weight:700;line-height:1.2;text-align:center;">New Quote Request</h1></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #dddddd;font-size:1px;line-height:1px;">&nbsp;</td></tr></table></td></tr></table><div style="height:60px;line-height:60px;font-size:1px;">&nbsp;</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px;"><div style="color:#101112;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:400;line-height:1.2;text-align:center;"><p style="margin-bottom:16px;">A quote has been requested. Below are the quote details for your reference:</p><p style="margin-bottom:16px;">Customer Name: ${name}<br>Customer Email: ${email}<br>Customer Phone Number: ${phone || 'Not provided'}<br>Subject: ${subject || 'General Inquiry'}<br>Message: ${message}</p><p>Please review the quote information carefully and manage by clicking the button below.</p></div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:10px;"><a href="${manageUrl}" target="_blank" style="text-decoration:none;color:#ffffff;"><span style="display:inline-block;background-color:#2596be;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:400;padding:5px 20px;border-radius:4px;text-align:center;">Manage Quote</span></a></td></tr></table></td></tr></table></td></tr></table></body></html>`.trim()
      const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY || ''}` }, body: JSON.stringify({ from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>', to: ['info@advancewaterproofing.com.au'], reply_to: email, subject: `New Quote Request - ${name}`, html: emailHTML }) })
      const data = await response.json()
      if (!response.ok) return res.status(response.status).json({ error: 'Failed to send email', details: data })
      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (type === 'quote') {
    try {
      const auth = requireAuth(req, res)
      if (!auth) return
      const { to, message, pdfBase64, pdfFilename, declined } = req.body
      const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
      const safeMessage = (message && String(message).trim().length > 0) ? message : 'Empty'
      const emailHTML = declined ? `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}sup,sub{font-size:75%;line-height:0}@media (max-width:540px){.desktop_hide table.icons-inner{display:inline-block!important}.icons-inner{text-align:center}.icons-inner td{margin:0 auto}.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}</style></head><body style="background-color:#ffffff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;"><table width="100%" role="presentation" style="background-color:#ffffff" cellpadding="0" cellspacing="0"><tbody><tr><td><table align="center" width="100%" role="presentation" cellpadding="0" cellspacing="0"><tbody><tr><td><table align="center" role="presentation" style="color:#000;width:520px;margin:0 auto;" cellpadding="0" cellspacing="0"><tbody><tr><td style="font-weight:400;text-align:left;padding:5px 0;vertical-align:top;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:100%;padding:0;"><div align="center"><div style="max-width:156px;"><img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" width="156" alt="Logo" style="display:block;height:auto;border:0;width:100%"></div></div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px;"><h1 style="margin:0;color:#3585c3;font-family:Arial,Helvetica,sans-serif;font-size:38px;font-weight:700;line-height:1.2;text-align:center;">Your quote has been declined</h1></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td><div align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-size:1px;line-height:1px;border-top:1px solid #dddddd;"><span>&#8202;</span></td></tr></table></div></td></tr></table><div style="height:60px;line-height:60px;font-size:1px;">&#8202;</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td><div style="color:#101112;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:400;line-height:1.2;text-align:center;"><p style="margin:0 0 16px;">We appreciate your interest. Unfortunately, we won't be proceeding with this quote at this time.</p><p style="margin:0 0 16px;">Reason: ${safeMessage}</p></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>` : `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}sup,sub{font-size:75%;line-height:0}@media (max-width:540px){.desktop_hide table.icons-inner{display:inline-block!important}.icons-inner{text-align:center}.icons-inner td{margin:0 auto}.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}</style></head><body style="background-color:#ffffff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;"><table width="100%" role="presentation" style="background-color:#ffffff" cellpadding="0" cellspacing="0"><tbody><tr><td><table align="center" width="100%" role="presentation" cellpadding="0" cellspacing="0"><tbody><tr><td><table align="center" role="presentation" style="color:#000;width:520px;margin:0 auto;" cellpadding="0" cellspacing="0"><tbody><tr><td style="font-weight:400;text-align:left;padding:5px 0;vertical-align:top;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:100%;padding:0;"><div align="center"><div style="max-width:156px;"><img src="https://1c0ffbcd95.imgdist.com/pub/bfra/mob408ok/to3/bcy/p08/logo-removebg-preview.png" width="156" alt="Logo" style="display:block;height:auto;border:0;width:100%"></div></div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:10px;"><h1 style="margin:0;color:#3585c3;font-family:Arial,Helvetica,sans-serif;font-size:38px;font-weight:700;line-height:1.2;text-align:center;">Your Quote</h1></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td><div align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-size:1px;line-height:1px;border-top:1px solid #dddddd;"><span>&#8202;</span></td></tr></table></div></td></tr></table><div style="height:60px;line-height:60px;font-size:1px;">&#8202;</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td><div style="color:#101112;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:400;line-height:1.2;text-align:center;"><p style="margin:0 0 16px;">Please find your quote attached.</p><p style="margin:0 0 16px;"></p><p style="margin:0;">Message: ${safeMessage}</p></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`
      const payload = { from: 'Advance Waterproofing <jobs@advancewaterproofing.com.au>', to: [to], subject: declined ? 'Your Quote Status' : 'Your Quote from Advance Waterproofing', html: emailHTML, attachments: !declined && pdfBase64 && pdfFilename ? [{ filename: pdfFilename, content: pdfBase64 }] : undefined }
      const emailResponse = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` }, body: JSON.stringify(payload) })
      const resultText = await emailResponse.text().catch(() => '')
      if (!emailResponse.ok) { let details; try { details = JSON.parse(resultText) } catch { details = resultText }; return res.status(emailResponse.status).json({ error: 'Failed to send quote email', details }) }
      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (type === 'get-quote') {
    try {
      const auth = requireAuth(req, res)
      if (!auth) return
      const quoteId = req.query.id || req.query.quote_id
      if (!quoteId) return res.status(400).json({ error: 'Missing quote id' })
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('quote_id', quoteId)
        .single()
      if (error || !data) return res.status(404).json({ error: 'Quote not found' })
      return res.status(200).json({ quote: data })
    } catch (e) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(400).json({ error: 'Unsupported email type' })
}


