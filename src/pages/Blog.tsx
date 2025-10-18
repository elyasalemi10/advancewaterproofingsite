import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'

interface BlogCard { slug: string; title: string; thumbnail_url?: string; created_at: string }

export default function Blog() {
  const [q, setQ] = useState('')
  const [blogs, setBlogs] = useState<BlogCard[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const load = async (query: string) => {
    setLoading(true)
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : ''
      const resp = await fetch(`/api/blog${params}`)
      const data = await resp.json()
      if (resp.ok) setBlogs(data.blogs || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load('') }, [])

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <main className="pt-28">
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-6">Blog</h1>
          <div className="max-w-2xl mx-auto">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') load(q) }}
              placeholder="Search articles..."
              className="h-12 text-lg"
            />
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <article key={b.slug} className="border rounded-lg overflow-hidden hover:shadow-md transition" onClick={() => navigate(`/blog/${b.slug}`)}>
              <div className="h-48 bg-muted overflow-hidden">
                {b.thumbnail_url ? (
                  <img src={b.thumbnail_url} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{b.title}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(b.created_at)}</p>
              </div>
            </article>
          ))}
          {!loading && blogs.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">No articles found.</div>
          )}
        </div>
      </section>
    </main>
  )
}


