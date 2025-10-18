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
    const slug = (req.query.slug || '').toString()
    if (!slug) return res.status(400).json({ error: 'Missing slug' })
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single()
    if (error || !data) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json({ blog: data })
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}


