import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'

export default function BlogDetail() {
  const { slug } = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [error, setError] = useState('')
  const [iframeHeight, setIframeHeight] = useState(800)
  const [renderedHtml, setRenderedHtml] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch(`/api/blog?slug=${encodeURIComponent(slug || '')}`)
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.error || 'Failed to load')
        setBlog(data.blog)
      } catch (e: any) {
        setError(e.message || 'Failed to load')
      }
    }
    if (slug) load()
  }, [slug])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e?.data && typeof e.data === 'object' && (e.data as any).type === 'blog-iframe-height') {
        const h = Number((e.data as any).height)
        if (!Number.isNaN(h) && h > 0 && h < 20000) setIframeHeight(h)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    const compute = async () => {
      if (!blog) return
      const content: string = blog.content || ''
      const isHtml = typeof content === 'string' && content.startsWith('<!--HTML--->')
      if (isHtml) {
        setRenderedHtml('')
        return
      }
      try {
        const raw = content
        // Dynamic import to avoid SSR/bundle surprises and ensure correct export
        const mod = await import('marked')
        const markedApi: any = (mod as any).marked || (mod as any).default || mod
        const parsed = typeof markedApi?.parse === 'function' ? markedApi.parse(raw) : (typeof markedApi === 'function' ? markedApi(raw) : String(raw))
        const html = typeof parsed === 'string' ? parsed : ''
        setRenderedHtml(DOMPurify.sanitize(html))
      } catch (e) {
        // Fallback: render as pre text
        const escaped = rawToEscaped(content)
        setRenderedHtml(`<pre>${escaped}</pre>`)
      }
    }
    compute()
  }, [blog])

  const rawToEscaped = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' })

  if (error) return <div className="pt-28 text-center text-red-600">{error}</div>
  if (!blog) return <div className="pt-28 text-center">Loading...</div>

  const isHtml = false
  const raw = blog.content

  const srcDoc = isHtml ? `<!doctype html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/>\n<style>body{margin:0;padding:16px;background:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,\"Helvetica Neue\",Arial,\"Noto Sans\",\"Apple Color Emoji\",\"Segoe UI Emoji\"}</style></head><body>`
      + raw +
      `<script>\n(function(){\n  function postH(){try{var h=document.body.scrollHeight; parent.postMessage({type:'blog-iframe-height', height:h}, '*');}catch(e){}}\n  window.addEventListener('load', postH);\n  window.addEventListener('resize', postH);\n  if (window.ResizeObserver){ var ro=new ResizeObserver(postH); ro.observe(document.body);}\n  setTimeout(postH, 120);\n})();\n</script></body></html>` : ''

  return (
    <main className="pt-28">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {blog.thumbnail_url && (
          <img src={blog.thumbnail_url} alt={blog.title} className="w-full h-72 object-cover rounded-lg mb-6" />
        )}
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">{formatDate(blog.created_at)}</p>
        {
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
        }
        <div className="mt-10 p-4 border rounded-lg text-sm text-muted-foreground">
          Looking for waterproofing services? Visit our website to learn more about how we can help. <a href="/" className="text-primary underline">Advance Waterproofing</a>
        </div>
      </article>
    </main>
  )
}


