import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function PartnerJob() {
  const { id } = useParams()
  const [job, setJob] = useState<any | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch(`/api/customer-booking?token=${encodeURIComponent(id || '')}`)
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.error || 'Failed to load')
        setJob(data.booking)
      } catch (e: any) {
        setError(e.message || 'Failed to load')
      }
    }
    if (id) load()
  }, [id])

  if (error) return <div className="pt-28 text-center text-red-600">{error}</div>
  if (!job) return <div className="pt-28 text-center">Loading...</div>

  return (
    <main className="pt-28">
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Job Overview</h1>
          <div className="space-y-2">
            <div><strong>Service:</strong> {job.service}</div>
            <div><strong>Address:</strong> {job.address}</div>
            <div><strong>Date:</strong> {new Date(job.date).toLocaleDateString('en-AU')}</div>
            <div><strong>Time:</strong> {job.time}</div>
            <div><strong>Notes:</strong> {job.notes || '—'}</div>
          </div>
        </div>
      </section>
    </main>
  )
}


