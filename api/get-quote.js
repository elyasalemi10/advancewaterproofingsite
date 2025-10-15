import { createClient } from '@supabase/supabase-js'
import { requireAuth } from './_auth.js'

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24'
  return createClient(supabaseUrl, supabaseKey)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const auth = requireAuth(req, res)
  if (!auth) return

  try {
    const quoteId = req.query.id || req.query.quote_id
    if (!quoteId) return res.status(400).json({ error: 'Missing quote id' })
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .single()
    if (error || !data) return res.status(404).json({ error: 'Quote not found' })
    return res.status(200).json({ quote: data })
  } catch (e) {
    console.error('get-quote error', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


