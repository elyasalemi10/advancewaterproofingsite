import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ProtectedRoute from '@/components/ProtectedRoute'

function EditorToolbar({ onInsert }: { onInsert: (token: string) => void }) {
  return (
    <div className="flex gap-2 mb-2 text-sm">
      {['**bold**','*italic*','- list item','1. ordered','\n> quote'].map(t => (
        <button key={t} type="button" className="px-2 py-1 border rounded" onClick={() => onInsert(t)}>{t.replace(/[*\n>]/g,'')}</button>
      ))}
    </div>
  )
}

function BlogCreateInner() {
  const [title, setTitle] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const insertToken = (token: string) => {
    setContent((prev) => prev + (prev.endsWith('\n') ? '' : '\n') + token)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const resp = await fetch('/api/create-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` },
        body: JSON.stringify({ title, content, thumbnailUrl })
      })
      const data = await resp.json()
      if (!resp.ok) { setError(data.error || 'Failed to create'); return }
      navigate(`/blog/${data.blog.slug}`)
    } catch (e) {
      setError('Failed to create')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-28">
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Thumbnail URL (optional)</label>
              <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm mb-1">Content (Markdown supported)</label>
              <EditorToolbar onInsert={insertToken} />
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} required />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" disabled={loading}>{loading ? 'Publishing...' : 'Publish'}</Button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default function BlogCreate() {
  return (
    <ProtectedRoute>
      <BlogCreateInner />
    </ProtectedRoute>
  )
}


