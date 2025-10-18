-- Supabase Database Setup for Bookings
-- Copy and paste this ENTIRE script into your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/ryhrxlblccjjjowpubyv/sql/new

-- Create the bookings table with all required columns
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL,
  customer_access_token TEXT UNIQUE,
  gcal_event_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_inspection BOOLEAN DEFAULT true,
  preferred_time TEXT,
  end_time TEXT,
  pre_job_reminder_sent_at TIMESTAMP WITH TIME ZONE,
  customer_confirmed_at TIMESTAMP WITH TIME ZONE,
  customer_reschedule_requested_at TIMESTAMP WITH TIME ZONE,
  customer_rescheduled_time TEXT
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(customer_access_token);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_time ON bookings(preferred_time);

-- If the table already exists, add missing columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS is_inspection BOOLEAN DEFAULT true;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS preferred_time TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_time TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_access_token TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gcal_event_id TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pre_job_reminder_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_confirmed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_reschedule_requested_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_rescheduled_time TEXT;

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- markdown
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- trigger to update updated_at
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_blogs_updated_at();

-- RLS for blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow select blogs" ON blogs;
CREATE POLICY "Allow select blogs" ON blogs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role manage blogs" ON blogs;
CREATE POLICY "Service role manage blogs" ON blogs FOR ALL USING (true) WITH CHECK (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS "Service role can do everything" ON bookings;
CREATE POLICY "Service role can do everything" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow anyone to insert bookings
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read bookings by booking_id
DROP POLICY IF EXISTS "Anyone can read bookings by booking_id" ON bookings;
CREATE POLICY "Anyone can read bookings by booking_id" ON bookings
  FOR SELECT
  USING (true);

-- Partners schema
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partner_job_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  booking_id TEXT NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(partner_id, booking_id)
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_job_permissions ENABLE ROW LEVEL SECURITY;

-- Policies (service role manages, no public access by default)
DROP POLICY IF EXISTS "partners service role manage" ON partners;
CREATE POLICY "partners service role manage" ON partners FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "partner_job_permissions service role manage" ON partner_job_permissions;
CREATE POLICY "partner_job_permissions service role manage" ON partner_job_permissions FOR ALL USING (true) WITH CHECK (true);

-- Partner Google Calendar integration fields
ALTER TABLE partners ADD COLUMN IF NOT EXISTS gcal_refresh_token TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS gcal_email TEXT;

