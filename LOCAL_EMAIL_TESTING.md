# Local Email Testing Guide

## Problem
Netlify Functions don't run automatically with `npm run dev` - they only work in production or with Netlify CLI locally.

## Solution: Run with Netlify Dev

### Step 1: Update Your `.env.local` File

Add the Resend API key to your `.env.local` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ryhrxlblccjjjowpubyv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzAzNDcsImV4cCI6MjA3NTkwNjM0N30.CLnaJ7Lj6tq9voFaRDpTtGjE0RXPGB87TSCKkZbppSc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24
SUPABASE_DB_PASSWORD=234562345Bookings!

# Email Configuration
RESEND_API_KEY=re_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co
BUSINESS_EMAIL=info@advancewaterproofing.com.au
```

### Step 2: Run with Netlify Dev

Instead of `npm run dev`, use:

```bash
npm run dev:netlify
```

This will:
- ✅ Start Vite dev server
- ✅ Start Netlify Functions locally
- ✅ Load environment variables from `.env.local`
- ✅ Make email sending work locally at `http://localhost:8888`

### Step 3: Test Booking Email

1. Open http://localhost:8888 (Netlify will proxy to Vite)
2. Go to the booking page
3. Fill out and submit a booking
4. Email should be sent successfully!

## Two Development Options

### Option 1: With Email Testing (Recommended)
```bash
npm run dev:netlify
```
- **URL**: http://localhost:8888
- **Functions work**: ✅ Yes
- **Emails work**: ✅ Yes
- **Supabase works**: ✅ Yes

### Option 2: Regular Dev (No Emails)
```bash
npm run dev
```
- **URL**: http://localhost:5173
- **Functions work**: ❌ No (functions disabled)
- **Emails work**: ❌ No
- **Supabase works**: ✅ Yes (direct client-side calls)

## Troubleshooting

### "Module not found: netlify-cli"
**Solution**: It's already installed! Just run `npm run dev:netlify`

### Emails still not sending
**Check these:**
1. ✅ Using `npm run dev:netlify` (not `npm run dev`)
2. ✅ `.env.local` file exists with `RESEND_API_KEY`
3. ✅ Opening http://localhost:8888 (not 5173)
4. ✅ Check terminal for function errors

### Port 8888 already in use
**Solution**: Kill the process using that port
```bash
# On Mac/Linux
lsof -ti:8888 | xargs kill

# Or specify different port
netlify dev -p 9999
```

### Environment variables not loading
**Make sure**:
- File is named `.env.local` (not `.env`)
- File is in the project root
- Restart `npm run dev:netlify` after adding variables

## Production Deployment

When deploying to Netlify, add these environment variables in the Netlify dashboard:

**Settings → Environment Variables → Add Variable**

```
VITE_SUPABASE_URL = https://ryhrxlblccjjjowpubyv.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzAzNDcsImV4cCI6MjA3NTkwNjM0N30.CLnaJ7Lj6tq9voFaRDpTtGjE0RXPGB87TSCKkZbppSc
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24
RESEND_API_KEY = re_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co
BUSINESS_EMAIL = info@advancewaterproofing.com.au
```

Then deploy normally - emails will work in production! 🎉

## Quick Reference

```bash
# Local development WITH email testing
npm run dev:netlify          # → http://localhost:8888

# Local development WITHOUT email testing (faster)
npm run dev                  # → http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

## Why This Happens

- Netlify Functions are **serverless functions** that run on Netlify's servers
- They don't run with regular Vite dev server
- `netlify dev` creates a local proxy that simulates the production environment
- This lets you test functions locally before deploying

**Bottom line**: Use `npm run dev:netlify` when you need to test bookings/emails locally! 📧

