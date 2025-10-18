import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function BlogDetail() {
  const { slug } = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch(`/api/get-blog?slug=${encodeURIComponent(slug || '')}`)
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.error || 'Failed to load')
        setBlog(data.blog)
      } catch (e: any) {
        setError(e.message || 'Failed to load')
      }
    }
    if (slug) load()
  }, [slug])

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' })

  if (error) return <div className="pt-28 text-center text-red-600">{error}</div>
  if (!blog) return <div className="pt-28 text-center">Loading...</div>

  return (
    <main className="pt-28">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {blog.thumbnail_url && (
          <img src={blog.thumbnail_url} alt={blog.title} className="w-full h-72 object-cover rounded-lg mb-6" />
        )}
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">{formatDate(blog.created_at)}</p>
        <div className="prose max-w-none whitespace-pre-wrap">{blog.content}</div>
        <div className="mt-10 p-4 border rounded-lg text-sm text-muted-foreground">
          Looking for waterproofing services? Visit our website to learn more about how we can help. <a href="/" className="text-primary underline">Advance Waterproofing</a>
        </div>
      </article>
    </main>
  )
}


