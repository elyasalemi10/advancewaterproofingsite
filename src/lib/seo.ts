export function setSEO({ title, description, jsonLd }: { title: string; description: string; jsonLd?: object | object[] }) {
  if (typeof document === 'undefined') return
  document.title = title
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'description'
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', description)
  // Remove prior injected JSON-LD
  document.querySelectorAll('script[data-seo-json-ld="true"]').forEach((el) => el.remove())
  if (jsonLd) {
    const payload = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
    payload.forEach((obj) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo-json-ld', 'true')
      script.text = JSON.stringify(obj)
      document.head.appendChild(script)
    })
  }
}
