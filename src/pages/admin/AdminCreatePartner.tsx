import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdminCreatePartner() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [jobs, setJobs] = useState<any[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [msg, setMsg] = useState('')

  useEffect(() => {
    ;(async () => {
      const resp = await fetch('/api/admin', { headers: { Authorization: `Bearer ${localStorage.getItem('aw_auth') || ''}` } })
      const data = await resp.json()
      if (resp.ok) setJobs(data.bookings || [])
    })()
  }, [])

  const submit = async () => {
    setMsg('')
    const bookingIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
    const resp = await fetch('/api/partners?action=create', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('aw_auth') || ''}` }, body: JSON.stringify({ username, password, bookingIds }) })
    const data = await resp.json()
    if (!resp.ok) { setMsg(data.error || 'Failed'); return }
    setMsg('Partner created')
  }

  return (
    <main className="pt-28">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader><CardTitle>Create Partner</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div>
              <div className="font-semibold mb-2">Grant Job Access</div>
              <div className="grid gap-2 max-h-72 overflow-auto border rounded p-2">
                {jobs.map((j) => (
                  <label key={j.booking_id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!selected[j.booking_id]} onChange={(e) => setSelected({ ...selected, [j.booking_id]: e.target.checked })} />
                    <span className="font-medium">{j.service}</span>
                    <span className="text-muted-foreground">{j.address}</span>
                  </label>
                ))}
                {jobs.length === 0 && <div className="text-muted-foreground">No jobs found.</div>}
              </div>
            </div>
            <Button onClick={submit}>Create Partner</Button>
            {msg && <div className="text-sm text-muted-foreground">{msg}</div>}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


