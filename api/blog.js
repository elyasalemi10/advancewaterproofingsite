import { createClient } from '@supabase/supabase-js'
import { requireAuth } from './_auth.js'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, supabaseKey)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const supabase = getSupabaseClient()

  try {
    if (req.method === 'GET') {
      const q = (req.query.q || '').toString().trim()
      const slug = (req.query.slug || '').toString().trim()

      if (slug) {
        const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single()
        if (error || !data) return res.status(404).json({ error: 'Not found' })
        return res.status(200).json({ blog: data })
      }

      let query = supabase.from('blogs').select('slug,title,thumbnail_url,created_at').order('created_at', { ascending: false })
      if (q) query = query.ilike('title', `%${q}%`)
      const { data, error } = await query
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ blogs: data })
    }

    if (req.method === 'POST') {
      const auth = requireAuth(req, res)
      if (!auth) return
      const { title, content, thumbnailUrl } = req.body || {}
      if (!title || !content) return res.status(400).json({ error: 'Missing fields' })
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)
      const { data, error } = await supabase.from('blogs').insert([{ slug, title, content, thumbnail_url: thumbnailUrl || null }]).select('*').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ blog: data })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}


