# Quick Start Guide - Advanced Waterproofing Updates

## ⚡ Immediate Steps Required

### 1. Create Environment File (5 minutes)

Create a file named `.env.local` in the root directory with this content:

```env
VITE_SUPABASE_URL=https://ryhrxlblccjjjowpubyv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzAzNDcsImV4cCI6MjA3NTkwNjM0N30.CLnaJ7Lj6tq9voFaRDpTtGjE0RXPGB87TSCKkZbppSc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24
SUPABASE_DB_PASSWORD=234562345Bookings!
```

**Location**: `/Users/elyasalemi/Desktop/Websites/Advanced Waterproofing/.env.local`

### 2. Set Up Supabase Database (10 minutes)

1. Go to your Supabase project: https://supabase.com/dashboard/project/ryhrxlblccjjjowpubyv
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query and paste the following SQL:

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert" ON bookings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public read" ON bookings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public update" ON bookings FOR UPDATE TO anon USING (true) WITH CHECK (true);
```

4. Click **Run** to execute the SQL

### 3. Add Missing Images (5 minutes)

Add these image files to the `/public` directory:
- `commercial.webp` - Commercial building photo
- `residential.webp` - Residential property photo  
- `balconyrestoration.webp` - Balcony restoration photo
- `basement.webp` - Basement waterproofing photo

If you don't have these images yet, you can:
1. Rename existing similar images temporarily
2. Or create placeholder images
3. The site will still work, images just won't display correctly

### 4. Install Dependencies & Run

```bash
# Make sure all packages are installed
npm install

# Run the development server
npm run dev
```

## ✅ What Changed

### Visual Changes (No Action Required)
- ✅ "Us" in "Why Choose Us" is now white
- ✅ "Waterproofing" in footer is now white
- ✅ Hero text: "Seal it right Protect for life"
- ✅ Navbar is shorter (more compact)
- ✅ Project images updated (once you add the files)

### Functional Changes (Requires .env.local)
- ✅ Enhanced chatbot with smarter responses
- ✅ Booking storage in Supabase
- ✅ Accept/Cancel booking pages
- ✅ New professional email templates

## 🧪 Testing Your Setup

### Test 1: Check the Visual Changes
1. Run `npm run dev`
2. Visit `http://localhost:5173`
3. Verify the text colors and hero text changed

### Test 2: Test the Enhanced Chatbot
1. Click the chat icon (bottom right)
2. Try these queries:
   - "How much does it cost?"
   - "Tell me about RapidSeal"
   - "I need emergency repairs"
   - "Do you service my area?"

### Test 3: Create a Test Booking (Requires Supabase Setup)
1. Go to `http://localhost:5173/booking`
2. Fill out the booking form
3. Submit the booking
4. Check your Supabase dashboard → Table Editor → `bookings` table
5. You should see the new booking!

### Test 4: Test Accept/Cancel Links (Requires Supabase Setup)
1. After creating a booking, get the `booking_id` from Supabase
2. Visit: `http://localhost:5173/accept-booking?id=YOUR_BOOKING_ID`
3. Should show booking details and mark as accepted
4. Visit: `http://localhost:5173/cancel-booking?id=YOUR_BOOKING_ID`
5. Should show as cancelled

## 📋 Deployment Checklist

Before deploying to production:

- [ ] `.env.local` file created with Supabase credentials
- [ ] Supabase database table created
- [ ] All 4 project images added to `/public`
- [ ] Test booking creation locally
- [ ] Test accept booking page locally
- [ ] Test cancel booking page locally
- [ ] Test chatbot with various queries

### For Netlify/Vercel Deployment:

Add these environment variables in your hosting provider dashboard:
```
VITE_SUPABASE_URL=https://ryhrxlblccjjjowpubyv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzAzNDcsImV4cCI6MjA3NTkwNjM0N30.CLnaJ7Lj6tq9voFaRDpTtGjE0RXPGB87TSCKkZbppSc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24
```

## 🆘 Troubleshooting

### "Module not found: @supabase/supabase-js"
**Solution**: Run `npm install`

### Bookings not saving to database
**Solution**: 
1. Check `.env.local` file exists and has correct values
2. Verify Supabase table was created (check SQL Editor)
3. Check browser console for errors

### Images not showing
**Solution**: Make sure image files are in `/public` directory with exact names:
- `commercial.webp`
- `residential.webp`
- `balconyrestoration.webp`
- `basement.webp`

### Accept/Cancel pages showing errors
**Solution**:
1. Make sure Supabase table is set up
2. Verify the booking exists in the database
3. Check the booking_id in the URL is correct

## 📚 Additional Documentation

- **Full Setup Guide**: See `SUPABASE_SETUP.md`
- **All Changes**: See `CHANGES_SUMMARY.md`

## 💬 Need Help?

If you run into any issues, check:
1. Browser console for JavaScript errors
2. Supabase dashboard for database errors
3. Network tab for failed API requests

Let me know if you need assistance with anything!

