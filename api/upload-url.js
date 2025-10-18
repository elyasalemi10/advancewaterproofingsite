import { requireAuth } from '../lib/serverAuth.js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  const auth = requireAuth(req, res)
  if (!auth) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { bookingId, quoteId, filename, contentType } = req.body || {}
    if (!filename || !contentType) return res.status(400).json({ error: 'filename and contentType required' })
    const owner = bookingId || quoteId
    if (!owner) return res.status(400).json({ error: 'bookingId or quoteId required' })
    const key = `${owner}/${Date.now()}-${encodeURIComponent(filename)}`
    const bucket = process.env.CLOUDFLARE_R2_BUCKET || ''
    const s3 = getS3()
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType })
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 })
    return res.status(200).json({ url, key })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Failed to create upload URL' })
  }
}


