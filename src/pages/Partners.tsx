import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Partners() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [error, setError] = useState('')

  const login = async () => {
    setError('')
    const resp = await fetch('/api/partners?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
    const data = await resp.json()
    if (!resp.ok) { setError(data.error || 'Login failed'); return }
    setPartnerId(data.partnerId)
  }

  useEffect(() => {
    const load = async () => {
      if (!partnerId) return
      const resp = await fetch(`/api/partners?action=jobs&partnerId=${encodeURIComponent(partnerId)}`)
      const data = await resp.json()
      if (resp.ok) setJobs(data.jobs || [])
    }
    load()
  }, [partnerId])

  if (!partnerId) {
    return (
      <main className="pt-28">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Partner Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button onClick={login}>Login</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-28">
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">My Jobs</h1>
          <div className="grid gap-4">
            {jobs.map((j) => (
              <Card key={j.booking_id} onClick={() => (window.location.href = `/partners/${j.booking_id}`)} className="cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{j.service}</div>
                    <div className="text-sm text-muted-foreground">{j.address}</div>
                    <div className="text-sm">{new Date(j.date).toLocaleDateString('en-AU')}</div>
                  </div>
                  <div className={`px-3 py-1 rounded text-sm ${j.status === 'accepted' ? 'bg-green-100 text-green-700' : j.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{j.status}</div>
                </CardContent>
              </Card>
            ))}
            {jobs.length === 0 && <div className="text-muted-foreground">No assigned jobs.</div>}
          </div>
        </div>
      </section>
    </main>
  )
}


