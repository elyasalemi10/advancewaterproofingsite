import crypto from 'crypto'

const DEFAULT_SECRET = process.env.AUTH_SECRET || 'change_this_secret_in_env'

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function signJWT(payload, expiresInSec = 60 * 60 * 24 * 7, secret = DEFAULT_SECRET) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + expiresInSec }
  const headerB64 = base64url(JSON.stringify(header))
  const payloadB64 = base64url(JSON.stringify(body))
  const data = `${headerB64}.${payloadB64}`
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${data}.${signature}`
}

export function verifyJWT(token, secret = DEFAULT_SECRET) {
  try {
    const [headerB64, payloadB64, signature] = token.split('.')
    if (!headerB64 || !payloadB64 || !signature) return null
    const data = `${headerB64}.${payloadB64}`
    const expected = crypto.createHmac('sha256', secret).update(data).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    if (expected !== signature) return null
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString())
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function getTokenFromReq(req) {
  const auth = req.headers.authorization || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  const cookie = req.headers.cookie || ''
  const match = cookie.match(/aw_auth=([^;]+)/)
  return match ? match[1] : null
}

export function requireAuth(req, res) {
  const token = getTokenFromReq(req)
  const payload = token ? verifyJWT(token) : null
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  return payload
}


