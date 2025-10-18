import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, supabaseKey)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const supabase = getSupabaseClient()
    const q = (req.query.q || '').toString().trim()
    let query = supabase.from('blogs').select('slug,title,thumbnail_url,created_at').order('created_at', { ascending: false })
    if (q) {
      query = query.ilike('title', `%${q}%`)
    }
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ blogs: data })
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}


