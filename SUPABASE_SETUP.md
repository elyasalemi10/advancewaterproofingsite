# Supabase Setup Instructions

This guide will help you set up Supabase for the Advanced Waterproofing booking system.

## Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ryhrxlblccjjjowpubyv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzAzNDcsImV4cCI6MjA3NTkwNjM0N30.CLnaJ7Lj6tq9voFaRDpTtGjE0RXPGB87TSCKkZbppSc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24
SUPABASE_DB_PASSWORD=234562345Bookings!
```

## Database Schema

Run the following SQL in your Supabase SQL editor to create the bookings table:

```sql
-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index on booking_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for new bookings)
CREATE POLICY "Allow public insert" ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow public read
CREATE POLICY "Allow public read" ON bookings
  FOR SELECT
  TO anon
  USING (true);

-- Create policy to allow public update (for accept/cancel)
CREATE POLICY "Allow public update" ON bookings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
```

## Features Implemented

### 1. Booking Storage
- All bookings are now stored in Supabase database
- Booking IDs are unique and trackable
- Status can be: pending, accepted, or cancelled

### 2. Accept/Cancel Booking Pages
- **Accept Booking**: `/accept-booking?id=BOOKING_ID`
  - Displays booking details
  - Updates status to "accepted"
  - Shows confirmation message
  
- **Cancel Booking**: `/cancel-booking?id=BOOKING_ID`
  - Displays booking details
  - Updates status to "cancelled"
  - Shows cancellation message

### 3. Email Templates
- New professional email template with Advance Waterproofing branding
- Includes both Accept and Cancel buttons
- Color scheme matches company colors (#0d3b66, #2596be)
- Fully responsive design

### 4. Enhanced Chatbot
- Sophisticated pattern matching with priority scoring
- Regex support for better accuracy
- Expanded knowledge base covering all services
- Better handling of edge cases and variations
- Emergency request detection

### 5. UI Updates
- "Us" in "Why Choose Us" is now white
- "Waterproofing" in Footer is now white
- Hero text changed to "Seal it right Protect for life"
- Navbar height reduced (h-24 → h-16, logo h-20/h-24 → h-12/h-14)
- Project images updated to use specified files

## Testing the Integration

1. **Create a test booking**:
   - Go to `/booking`
   - Fill out the form and submit
   - Check Supabase to see the booking

2. **Test accepting a booking**:
   - Click the "Accept Booking" button in the email
   - Or manually visit `/accept-booking?id=YOUR_BOOKING_ID`
   - Verify the status changes to "accepted" in Supabase

3. **Test cancelling a booking**:
   - Click the "Cancel Booking" button in the email
   - Or manually visit `/cancel-booking?id=YOUR_BOOKING_ID`
   - Verify the status changes to "cancelled" in Supabase

## Next Steps (Future Enhancements)

1. **Email Confirmation**:
   - Add serverless function to send confirmation emails to clients
   - Add serverless function to send cancellation emails to clients

2. **Admin Dashboard**:
   - Build admin panel to view all bookings
   - Filter by status (pending/accepted/cancelled)
   - Manual booking management

3. **Calendar Integration**:
   - Auto-add accepted bookings to Google Calendar
   - Send calendar invites to clients

4. **SMS Notifications**:
   - Send SMS confirmations using Twilio
   - Send reminders before appointments

## Troubleshooting

### Database Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure RLS policies are configured

### Booking Not Found
- Verify booking_id is correct
- Check if booking exists in Supabase
- Ensure proper table name and column names

### CORS Errors
- Supabase should allow all origins by default
- Check if anon key is valid
- Verify API endpoint in `.env.local`

## Security Notes

- The anon key is safe to expose on the client side
- Row Level Security (RLS) policies control data access
- Service role key should ONLY be used in serverless functions
- Never expose service role key in client-side code

