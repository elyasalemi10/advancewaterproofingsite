import { requireAuth } from '../lib/serverAuth.js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(url, key)
}

function getS3() {
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT || `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`
  return new S3Client({
    region: process.env.CLOUDFLARE_R2_REGION || 'auto',
    endpoint,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || ''
    },
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const busboy = new (require('busboy'))({ headers: req.headers })
    const files = []
    const fields = {}
    busboy.on('file', (name, file, info) => {
      const chunks = []
      file.on('data', (d) => chunks.push(d))
      file.on('end', () => {
        files.push({ fieldname: name, filename: info.filename, mime: info.mimeType, buffer: Buffer.concat(chunks) })
      })
    })
    busboy.on('field', (name, val) => { fields[name] = val })
    busboy.on('error', reject)
    busboy.on('finish', () => resolve({ files, fields }))
    req.pipe(busboy)
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  const auth = requireAuth(req, res)
  if (!auth) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { files, fields } = await parseMultipart(req)
    if (!files.length) return res.status(400).json({ error: 'No files provided' })
    const { bookingId, quoteId } = fields
    if (!bookingId && !quoteId) return res.status(400).json({ error: 'bookingId or quoteId required' })

    const s3 = getS3()
    const bucket = process.env.CLOUDFLARE_R2_BUCKET || ''
    const baseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL || ''
    const uploaded = []
    for (const f of files) {
      const key = `${bookingId || quoteId}/${Date.now()}-${encodeURIComponent(f.filename)}`
      await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: f.buffer, ContentType: f.mime }))
      const url = `${baseUrl.replace(/\/$/, '')}/${key}`
      uploaded.push({ key, url, filename: f.filename, contentType: f.mime })
    }

    // Store URLs in Supabase
    const supabase = getSupabase()
    if (bookingId) {
      await supabase.from('job_files').insert(uploaded.map(u => ({ booking_id: bookingId, url: u.url, filename: u.filename, content_type: u.contentType })))
    }
    if (quoteId) {
      await supabase.from('quote_files').insert(uploaded.map(u => ({ quote_id: quoteId, url: u.url, filename: u.filename, content_type: u.contentType })))
    }

    return res.status(200).json({ uploaded })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Upload failed' })
  }
}


