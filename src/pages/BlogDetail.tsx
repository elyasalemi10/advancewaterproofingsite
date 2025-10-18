import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

export default function BlogDetail() {
  const { slug } = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [error, setError] = useState('')
  const [iframeHeight, setIframeHeight] = useState(800)

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
      if (e?.data && typeof e.data === 'object' && e.data.type === 'blog-iframe-height') {
        const h = Number(e.data.height)
        if (!Number.isNaN(h) && h > 0 && h < 20000) setIframeHeight(h)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' })

  if (error) return <div className="pt-28 text-center text-red-600">{error}</div>
  if (!blog) return <div className="pt-28 text-center">Loading...</div>

  const isHtml = typeof blog.content === 'string' && blog.content.startsWith('<!--HTML--->')
  const raw = isHtml ? blog.content.replace(/^<!--HTML--->\n?/, '') : blog.content

  const rendered = useMemo(() => {
    if (isHtml) return null
    const html = marked.parse(raw || '') as string
    return DOMPurify.sanitize(html)
  }, [isHtml, raw])

  const srcDoc = useMemo(() => {
    if (!isHtml) return ''
    return `<!doctype html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/>\n<style>body{margin:0;padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,\"Helvetica Neue\",Arial,\"Noto Sans\",\"Apple Color Emoji\",\"Segoe UI Emoji\"}</style></head><body>`
      + raw +
      `<script>\n(function(){\n  function postH(){try{var h=document.body.scrollHeight; parent.postMessage({type:'blog-iframe-height', height:h}, '*');}catch(e){}}\n  window.addEventListener('load', postH);\n  window.addEventListener('resize', postH);\n  if (window.ResizeObserver){ var ro=new ResizeObserver(postH); ro.observe(document.body);}\n  setTimeout(postH, 100);\n})();\n</script></body></html>`
  }, [isHtml, raw])

  return (
    <main className="pt-28">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {blog.thumbnail_url && (
          <img src={blog.thumbnail_url} alt={blog.title} className="w-full h-72 object-cover rounded-lg mb-6" />
        )}
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">{formatDate(blog.created_at)}</p>
        {isHtml ? (
          <iframe
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            style={{ width: '100%', border: 'none', height: iframeHeight }}
            title="Blog Content"
          />
        ) : (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: rendered || '' }} />
        )}
        <div className="mt-10 p-4 border rounded-lg text-sm text-muted-foreground">
          Looking for waterproofing services? Visit our website to learn more about how we can help. <a href="/" className="text-primary underline">Advance Waterproofing</a>
        </div>
      </article>
    </main>
  )
}


