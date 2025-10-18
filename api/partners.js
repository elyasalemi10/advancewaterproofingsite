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
    // Partner Google OAuth - generate authorize URL
    if (action === 'oauth-authorize' && req.method === 'GET') {
      const { partnerId, redirectUri } = req.query
      if (!partnerId || !redirectUri) return res.status(400).json({ error: 'partnerId and redirectUri required' })
      const clientId = process.env.GCAL_CLIENT_ID || ''
      if (!clientId) return res.status(500).json({ error: 'Missing GCAL_CLIENT_ID' })
      const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events')
      const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=consent&state=${encodeURIComponent(partnerId)}`
      return res.status(200).json({ url })
    }

    // Partner Google OAuth - exchange code for refresh token and store
    if (action === 'oauth-exchange' && req.method === 'POST') {
      const { partnerId, code, redirectUri } = req.body
      if (!partnerId || !code || !redirectUri) return res.status(400).json({ error: 'partnerId, code and redirectUri required' })
      const clientId = process.env.GCAL_CLIENT_ID || ''
      const clientSecret = process.env.GCAL_CLIENT_SECRET || ''
      if (!clientId || !clientSecret) return res.status(500).json({ error: 'Missing Google credentials' })
      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }).toString(),
      })
      const tokens = await tokenResp.json()
      if (!tokenResp.ok) return res.status(400).json({ error: tokens.error || 'Token exchange failed', details: tokens })
      const refresh = tokens.refresh_token || ''
      if (!refresh) return res.status(400).json({ error: 'No refresh token received. Ensure prompt=consent & access_type=offline.' })
      const supabase = getSupabase()
      const { error } = await supabase.from('partners').update({ gcal_refresh_token: refresh }).eq('id', partnerId)
      if (error) return res.status(400).json({ error: error.message })
      return res.status(200).json({ success: true })
    }

    // Partner - add event to their calendar using stored refresh token
    if (action === 'add-calendar-event' && req.method === 'POST') {
      const { partnerId, bookingId } = req.body
      if (!partnerId || !bookingId) return res.status(400).json({ error: 'partnerId and bookingId required' })
      const supabase = getSupabase()
      const { data: partner, error: perr } = await supabase.from('partners').select('*').eq('id', partnerId).single()
      if (perr || !partner) return res.status(404).json({ error: 'Partner not found' })
      if (!partner.gcal_refresh_token) return res.status(401).json({ error: 'Partner not connected to Google Calendar' })
      const { data: booking, error: berr } = await supabase.from('bookings').select('*').eq('booking_id', bookingId).single()
      if (berr || !booking) return res.status(404).json({ error: 'Booking not found' })
      if (!booking.preferred_time) return res.status(400).json({ error: 'No scheduled time for booking' })

      // Get access token via refresh
      const clientId = process.env.GCAL_CLIENT_ID || ''
      const clientSecret = process.env.GCAL_CLIENT_SECRET || ''
      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: partner.gcal_refresh_token,
          grant_type: 'refresh_token',
        }).toString(),
      })
      const tdata = await tokenResp.json()
      if (!tokenResp.ok || !tdata.access_token) return res.status(400).json({ error: 'Failed to get access token' })

      const start = new Date(booking.preferred_time)
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      const body = {
        summary: booking.service,
        description: `- ${booking.service}\n- ${booking.address}\n- ${booking.name}\n- ${booking.email}\n- ${booking.phone}`,
        location: booking.address || '',
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      }
      const evResp = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tdata.access_token}` },
        body: JSON.stringify(body),
      })
      const ev = await evResp.json()
      if (!evResp.ok) return res.status(evResp.status).json({ error: 'Failed to create partner event', details: ev })
      return res.status(200).json({ success: true, eventId: ev.id })
    }
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


