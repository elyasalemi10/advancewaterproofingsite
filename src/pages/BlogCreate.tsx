import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ProtectedRoute from '@/components/ProtectedRoute'
import { supabase } from '@/lib/supabase'

function EditorToolbar({ onInsert }: { onInsert: (token: string) => void }) {
  return (
    <div className="flex gap-2 mb-2 text-sm">
      {['**bold**','*italic*','- list item','1. ordered','\n> quote'].map(t => (
        <button key={t} type="button" className="px-2 py-1 border rounded" onClick={() => onInsert(t)}>{t.replace(/[ *\n>]/g,'')}</button>
      ))}
    </div>
  )
}

function BlogCreateInner() {
  const [title, setTitle] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [content, setContent] = useState('')
  // HTML mode removed; Markdown only
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const insertToken = (token: string) => {
    setContent((prev) => prev + (prev.endsWith('\n') ? '' : '\n') + token)
  }

  const handleThumbnailUpload = async (file: File) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      // Try simple upload to 'blog-thumbnails' bucket
      const { data, error: upErr } = await supabase.storage.from('blog-thumbnails').upload(fileName, file, { cacheControl: '3600', upsert: true, contentType: file.type })
      if (upErr) throw upErr
      // If bucket is public, use public URL; otherwise, create a signed URL
      const { data: pub } = supabase.storage.from('blog-thumbnails').getPublicUrl(data.path)
      if (pub?.publicUrl) {
        setThumbnailUrl(pub.publicUrl)
      } else {
        const { data: signed, error: sErr } = await supabase.storage.from('blog-thumbnails').createSignedUrl(data.path, 60 * 60 * 24 * 365)
        if (sErr || !signed?.signedUrl) throw sErr || new Error('Failed to create signed URL')
        setThumbnailUrl(signed.signedUrl)
      }
    } catch (e: any) {
      setError('Failed to upload thumbnail. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const payloadContent = content
      const resp = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` },
        body: JSON.stringify({ title, content: payloadContent, thumbnailUrl })
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
              <label className="block text-sm mb-1">Thumbnail (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void handleThumbnailUpload(f)
                }}
              />
              {uploading && <div className="text-xs text-muted-foreground mt-1">Uploading...</div>}
              {thumbnailUrl && (
                <div className="mt-2">
                  <img src={thumbnailUrl} alt="thumbnail preview" className="h-24 rounded border" />
                </div>
              )}
            </div>
            {/* Markdown only */}
            <div>
              <label className="block text-sm mb-1">Content (Markdown supported)</label>
              <EditorToolbar onInsert={insertToken} />
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} required />
              {content && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                  <div className="text-sm font-semibold mb-2">Preview</div>
                  <div className="prose max-w-none whitespace-pre-wrap">{content}</div>
                </div>
              )}
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" disabled={loading || uploading}>{loading ? 'Publishing...' : 'Publish'}</Button>
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


