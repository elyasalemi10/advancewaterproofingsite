import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Quote } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Loader2, FileUp, CheckCircle, XCircle } from 'lucide-react'

export default function ManageQuote() {
  const [searchParams] = useSearchParams()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [quoteFile, setQuoteFile] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [quote, setQuote] = useState<Quote | null>(null)
  const quoteId = searchParams.get('id') || ''

  useEffect(() => {
    const load = async () => {
      if (!quoteId) return
      try {
        const resp = await fetch(`/api/get-quote?id=${encodeURIComponent(quoteId)}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` }
        })
        if (resp.ok) {
          const data = await resp.json()
          setQuote(data.quote)
        } else {
          setError('Quote not found')
        }
      } catch (e) {
        setError('Failed to load quote')
      }
    }
    load()
  }, [quoteId])

  const sendQuote = async () => {
    if (!quoteFile) {
      setError('Please upload a PDF to send')
      return
    }
    try {
      setProcessing(true)
      setError('')

      const fileArrayBuffer = await quoteFile.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(fileArrayBuffer)))

      const response = await fetch('/api/send-quote-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` },
        body: JSON.stringify({
          to: quote?.email,
          date: '', time: '', address: '', service: quote?.subject || 'Quote', job: 'Quote',
          message: note,
          pdfBase64: base64,
          pdfFilename: quoteFile.name
        })
      })

      if (response.ok) {
        setSuccess('Quote sent to customer ✅')
        setQuoteFile(null)
        setNote('')
      } else {
        const err = await response.json()
        setError(err.error || 'Failed to send quote')
      }
    } catch (e) {
      setError('Failed to send quote')
    } finally {
      setProcessing(false)
    }
  }

  const declineQuote = async () => {
    if (!note.trim()) {
      setError('Decline note is required')
      return
    }
    try {
      setProcessing(true)
      setError('')

      const response = await fetch('/api/send-quote-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` },
        body: JSON.stringify({
          to: quote?.email,
          date: '', time: '', address: '', service: quote?.subject || 'Quote', job: 'Quote',
          message: note,
          declined: true
        })
      })

      if (response.ok) {
        setSuccess('Decline email sent to customer ✅')
        setNote('')
      } else {
        const err = await response.json()
        setError(err.error || 'Failed to send decline email')
      }
    } catch (e) {
      setError('Failed to send decline email')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Send Quote</h1>
          <p className="text-slate-600">Review the request and send a PDF quote or decline with a reason</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
            <CardDescription>Customer information and request context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Customer Email</Label>
                <Input value={quote?.email || ''} readOnly />
              </div>
              <div>
                <Label>Service</Label>
                <Input value={quote?.subject || 'Quote'} readOnly />
              </div>
              <div>
                <Label>Name</Label>
                <Input value={quote?.name || ''} readOnly />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={quote?.phone || ''} readOnly />
              </div>
              <div className="md:col-span-2">
                <Label>Message</Label>
                <Textarea value={quote?.message || ''} readOnly rows={4} className="mt-2" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="quoteFile">Upload Quote (PDF)</Label>
                <input id="quoteFile" type="file" accept="application/pdf" onChange={(e) => setQuoteFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm" />
              </div>
              <div>
                <Label htmlFor="note">Message / Decline Reason</Label>
                <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mt-2" placeholder="Optional for send, required for decline" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={sendQuote} disabled={processing || !quoteFile} className="flex items-center">
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileUp className="w-4 h-4 mr-2" />}
                Send Quote
              </Button>
              <Button variant="destructive" onClick={declineQuote} disabled={processing || !note.trim()} className="flex items-center">
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                Decline Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


