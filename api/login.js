import { signJWT } from '../lib/serverAuth.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { username, password } = req.body
    if (username !== 'baqir' || password !== '234562345Baqir!') {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = signJWT({ sub: username, role: 'admin' })
    // Set httpOnly cookie for persistence
    res.setHeader('Set-Cookie', `aw_auth=${token}; Path=/; Max-Age=${60*60*24*7}; HttpOnly; SameSite=Lax`)
    return res.status(200).json({ success: true, token })
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}


