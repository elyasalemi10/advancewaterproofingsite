import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ryhrxlblccjjjowpubyv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzAzNDcsImV4cCI6MjA3NTkwNjM0N30.CLnaJ7Lj6tq9voFaRDpTtGjE0RXPGB87TSCKkZbppSc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Booking {
  id: string
  booking_id: string
  name: string
  email: string
  phone: string
  address: string
  service: string
  date: string
  time: string
  notes?: string
  status: 'pending' | 'accepted' | 'cancelled'
  created_at: string
  updated_at?: string
  cal_booking_uid?: string
  cal_event_type_id?: number
  is_inspection?: boolean
  preferred_time?: string
  end_time?: string
}

export interface Quote {
  id: string
  quote_id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'pending' | 'sent' | 'declined'
  created_at: string
  updated_at?: string
}

export async function getQuoteById(quoteId: string) {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('quote_id', quoteId)
    .single()

  if (error) {
    console.error('Error fetching quote:', error)
    return null
  }

  return data as Quote
}

// Create a new booking
export async function createBooking(data: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'status'>) {
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([{
      ...data,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating booking:', error)
    throw error
  }

  return booking
}

// Get a booking by booking_id
export async function getBookingByBookingId(bookingId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', bookingId)
    .single()

  if (error) {
    console.error('Error fetching booking:', error)
    return null
  }

  return data as Booking
}

// Update booking status
export async function updateBookingStatus(bookingId: string, status: 'accepted' | 'cancelled') {
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('booking_id', bookingId)
    .select()
    .single()

  if (error) {
    console.error('Error updating booking:', error)
    throw error
  }

  return data as Booking
}

// Get all bookings (for admin)
export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }

  return data as Booking[]
}

// Delete a booking
export async function deleteBooking(bookingId: string) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('booking_id', bookingId)

  if (error) {
    console.error('Error deleting booking:', error)
    throw error
  }

  return true
}

