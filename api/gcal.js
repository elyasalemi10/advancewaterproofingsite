export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { action } = req.query
  const {
    GCAL_CLIENT_ID = process.env.GCAL_CLIENT_ID || '',
    GCAL_CLIENT_SECRET = process.env.GCAL_CLIENT_SECRET || '',
  } = process.env

  try {
    if (action === 'authorize' && req.method === 'GET') {
      const { redirectUri } = req.query
      const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events')
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(GCAL_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=consent`
      return res.status(200).json({ url: authUrl })
    }

    if (action === 'exchange' && req.method === 'POST') {
      const { code, redirectUri } = req.body
      if (!code || !redirectUri) return res.status(400).json({ error: 'code and redirectUri required' })
      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GCAL_CLIENT_ID,
          client_secret: GCAL_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }).toString(),
      })
      const data = await tokenResp.json()
      if (!tokenResp.ok) return res.status(400).json({ error: data.error || 'token exchange failed', details: data })
      return res.status(200).json({ tokens: data })
    }

    return res.status(405).json({ error: 'Unsupported route' })
  } catch (e) {
    return res.status(500).json({ error: 'Server error' })
  }
}


