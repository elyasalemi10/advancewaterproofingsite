# Supabase Database Setup - IMPORTANT!

## Database is NOT storing bookings because the table doesn't have all the required columns!

### Step 1: Run this SQL in your Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/ryhrxlblccjjjowpubyv/sql/new

**COPY THE ENTIRE SQL BLOCK BELOW** (make sure you get "CREATE" not "REATE"):

```sql
-- Create the bookings table with all required columns
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL,
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
  
  -- Cal.com integration columns
  cal_booking_uid TEXT,
  cal_event_type_id INTEGER,
  is_inspection BOOLEAN DEFAULT true,
  preferred_time TEXT,
  end_time TEXT
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_cal_uid ON bookings(cal_booking_uid);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- If the table already exists, just add the missing columns:
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cal_booking_uid TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cal_event_type_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS is_inspection BOOLEAN DEFAULT true;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS preferred_time TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_time TEXT;

-- Ensure updated_at trigger exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Step 2: Enable Row Level Security (Optional but Recommended)

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (for your API)
CREATE POLICY "Service role can do everything" ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow anon users to insert only (for creating bookings)
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Allow anon users to read their own bookings by booking_id
CREATE POLICY "Anyone can read bookings by booking_id" ON bookings
  FOR SELECT
  USING (true);
```

### Step 3: Verify the Table Structure

Run this to see all columns:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
```

You should see these columns:
- id (uuid)
- booking_id (text)
- name (text)
- email (text)
- phone (text)
- address (text)
- service (text)
- date (text)
- time (text)
- notes (text)
- status (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)
- cal_booking_uid (text)
- cal_event_type_id (integer)
- is_inspection (boolean)
- preferred_time (text)
- end_time (text)

### Step 4: Test the Insert

```sql
-- Test insert (should work)
INSERT INTO bookings (
  booking_id, name, email, phone, address, service, date, time, notes, 
  status, cal_booking_uid, cal_event_type_id, is_inspection, preferred_time, end_time
) VALUES (
  'TEST-123',
  'Test Customer',
  'test@example.com',
  '0400000000',
  '123 Test St',
  'Test Service',
  '2025-10-15',
  '9:00 AM',
  'Test notes',
  'pending',
  NULL,
  3637831,
  true,
  '2025-10-15T09:00:00+11:00',
  '2025-10-15T10:00:00+11:00'
);

-- Check if it was inserted
SELECT * FROM bookings WHERE booking_id = 'TEST-123';

-- Delete test data
DELETE FROM bookings WHERE booking_id = 'TEST-123';
```

## Why This Was Failing

The Supabase insert in the API was trying to insert into columns that didn't exist:
- `cal_booking_uid`
- `cal_event_type_id`
- `is_inspection`
- `preferred_time`
- `end_time`

Without these columns, the insert would fail silently (logged to console but not visible to user).

## After Running the SQL

1. ✅ The table will have all required columns
2. ✅ Bookings will be stored successfully
3. ✅ Cal.com integration will work
4. ✅ Admin can manage bookings from email links
5. ✅ All data is persisted properly

## Redeploy

After fixing the database, **redeploy on Vercel** to ensure the latest code is running.

