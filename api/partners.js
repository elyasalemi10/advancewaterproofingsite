import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { requireAuth } from './_auth.js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(url, key)
}

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex')
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const supabase = getSupabase()
  const { action } = req.query

  try {
    if (action === 'create' && req.method === 'POST') {
      const auth = requireAuth(req, res)
      if (!auth) return
      const { username, password, bookingIds } = req.body
      if (!username || !password) return res.status(400).json({ error: 'username and password required' })
      const { data: partner, error } = await supabase
        .from('partners').insert([{ username, password_hash: hashPassword(password) }]).select().single()
      if (error) return res.status(400).json({ error: error.message })
      if (Array.isArray(bookingIds) && bookingIds.length) {
        const rows = bookingIds.map((b) => ({ partner_id: partner.id, booking_id: b }))
        const { error: perr } = await supabase.from('partner_job_permissions').insert(rows)
        if (perr) return res.status(400).json({ error: perr.message })
      }
      return res.status(200).json({ success: true })
    }

    if (action === 'login' && req.method === 'POST') {
      const { username, password } = req.body
      const { data: partner, error } = await supabase
        .from('partners').select('*').eq('username', username).single()
      if (error || !partner) return res.status(401).json({ error: 'Invalid credentials' })
      if (partner.password_hash !== hashPassword(password)) return res.status(401).json({ error: 'Invalid credentials' })
      return res.status(200).json({ success: true, partnerId: partner.id })
    }

    if (action === 'jobs' && req.method === 'GET') {
      const { partnerId } = req.query
      if (!partnerId) return res.status(400).json({ error: 'partnerId required' })
      const { data, error } = await supabase
        .from('partner_job_permissions')
        .select('booking_id, bookings:booking_id(*)')
        .eq('partner_id', partnerId)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(200).json({ jobs: (data || []).map((r) => r.bookings) })
    }

    if (action === 'list' && req.method === 'GET') {
      const auth = requireAuth(req, res)
      if (!auth) return
      const { data: partners, error } = await supabase.from('partners').select('*').order('created_at', { ascending: false })
      if (error) return res.status(400).json({ error: error.message })
      const { data: perms } = await supabase.from('partner_job_permissions').select('partner_id, booking_id')
      const partnerIdToBookings = new Map()
      for (const r of perms || []) {
        if (!partnerIdToBookings.has(r.partner_id)) partnerIdToBookings.set(r.partner_id, [])
        partnerIdToBookings.get(r.partner_id).push(r.booking_id)
      }
      const enriched = (partners || []).map(p => ({ ...p, assigned: partnerIdToBookings.get(p.id) || [] }))
      return res.status(200).json({ partners: enriched })
    }

    if (action === 'job' && (req.method === 'GET' || req.method === 'POST')) {
      const partnerId = req.method === 'GET' ? req.query.partnerId : req.body.partnerId
      const bookingId = req.method === 'GET' ? req.query.bookingId : req.body.bookingId
      if (!partnerId || !bookingId) return res.status(400).json({ error: 'partnerId and bookingId required' })
      const { data, error } = await supabase
        .from('partner_job_permissions')
        .select('booking_id, bookings:booking_id(*)')
        .eq('partner_id', partnerId)
        .eq('booking_id', bookingId)
        .single()
      if (error || !data) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json({ booking: data.bookings })
    }

    if (action === 'delete' && req.method === 'POST') {
      const auth = requireAuth(req, res)
      if (!auth) return
      const { partnerId } = req.body
      if (!partnerId) return res.status(400).json({ error: 'partnerId required' })
      const { error } = await supabase.from('partners').delete().eq('id', partnerId)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(200).json({ success: true })
    }

    if (action === 'update-access' && req.method === 'POST') {
      const auth = requireAuth(req, res)
      if (!auth) return
      const { partnerId, bookingIds } = req.body
      if (!partnerId || !Array.isArray(bookingIds)) return res.status(400).json({ error: 'partnerId and bookingIds required' })
      await supabase.from('partner_job_permissions').delete().eq('partner_id', partnerId)
      if (bookingIds.length) {
        const rows = bookingIds.map((b) => ({ partner_id: partnerId, booking_id: b }))
        const { error } = await supabase.from('partner_job_permissions').insert(rows)
        if (error) return res.status(400).json({ error: error.message })
      }
      return res.status(200).json({ success: true })
    }

    if (action === 'change-password' && req.method === 'POST') {
      const auth = requireAuth(req, res)
      if (!auth) return
      const { partnerId, newPassword } = req.body
      if (!partnerId || !newPassword) return res.status(400).json({ error: 'partnerId and newPassword required' })
      const { error } = await supabase.from('partners').update({ password_hash: hashPassword(newPassword) }).eq('id', partnerId)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Unsupported route' })
  } catch (e) {
    return res.status(500).json({ error: 'Server error' })
  }
}


