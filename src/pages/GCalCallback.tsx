import { useEffect, useState } from 'react'

export default function GCalCallback() {
  const [msg, setMsg] = useState('Exchanging authorization code...')
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (!code) {
        setError('Missing code')
        return
      }
      try {
        const resp = await fetch(`/api/gcal?action=exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri: `${window.location.origin}/gcal/callback` })
        })
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.error || 'Token exchange failed')
        setMsg('Success! Copy your refresh token securely and add to Vercel env vars.')
        console.log('GCAL TOKENS', data)
      } catch (e: any) {
        setError(e.message || 'Failed')
      }
    }
    run()
  }, [])

  return (
    <main className="pt-28">
      <div className="max-w-xl mx-auto px-4">
        <div className="p-6 border rounded">
          <h1 className="text-2xl font-bold mb-2">Google Calendar OAuth</h1>
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="text-green-700">{msg}</div>
          )}
          <p className="text-sm text-muted-foreground mt-4">This page is for one-time setup only. Remove after saving credentials.</p>
        </div>
      </div>
    </main>
  )
}


