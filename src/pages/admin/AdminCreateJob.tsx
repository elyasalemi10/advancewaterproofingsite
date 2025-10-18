import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdminCreateJob() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', service: '', date: '', time: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const submit = async () => {
    setLoading(true)
    setMsg('')
    try {
      // Create booking
      const resp = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, isInspection: true, startTime: '', endTime: '' })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Failed to create')
      // Immediately confirm
      const conf = await fetch('/api/confirm-booking', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('aw_auth') || ''}` }, body: JSON.stringify({ bookingId: data.bookingId }) })
      const cdata = await conf.json()
      if (!conf.ok) throw new Error(cdata.error || 'Failed to confirm')
      setMsg('Job created and confirmed. Customer notified.')
    } catch (e: any) {
      setMsg(e.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-28">
      <div className="max-w-xl mx-auto px-4">
        <Card>
          <CardHeader><CardTitle>Create Job (Admin)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(['name','email','phone','address','service','date','time'] as const).map((k) => (
              <Input key={k} placeholder={k} value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            ))}
            <Button onClick={submit} disabled={loading}>{loading ? 'Saving...' : 'Create & Confirm'}</Button>
            {msg && <div className="text-sm text-muted-foreground">{msg}</div>}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


