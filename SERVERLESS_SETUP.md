# Serverless Functions Setup

## Overview
The email system uses **Netlify Serverless Functions** to securely send emails via Resend API without exposing the API key in the frontend.

## Architecture

```
Frontend (React) → Netlify Function → Resend API → Email
```

## Files

### Serverless Functions
- `/netlify/functions/send-contact-email.js` - Handles contact form submissions
- `/netlify/functions/send-booking-email.js` - Handles booking requests

### Configuration
- `/netlify.toml` - Netlify configuration with redirects
- Frontend calls `/api/*` which redirects to `/.netlify/functions/*`

## Local Development

### Option 1: Install Netlify CLI (Recommended)
```bash
npm install -g netlify-cli

# Run dev server with serverless functions
netlify dev
```

This will:
- Start Vite on port 8888 (or another available port)
- Enable serverless functions locally at `/api/*`
- Hot reload everything

### Option 2: Use production URL for testing
Deploy to Netlify and test with the production URL

## Deployment

### Netlify Deployment
1. Connect your repo to Netlify
2. Build settings are in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. Netlify automatically:
   - Builds your Vite app
   - Deploys serverless functions
   - Sets up redirects from `/api/*` to functions

### Environment Variables
The API key is currently hardcoded in the serverless functions. For better security:

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add: `RESEND_API_KEY` = `re_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co`
3. Update functions to use: `process.env.RESEND_API_KEY`

## API Endpoints

### POST /api/send-contact-email
Sends contact form inquiry email to business.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "(03) 9876 5432",
  "subject": "Balcony Waterproofing",
  "message": "I need help with..."
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### POST /api/send-booking-email
Sends booking request with accept button.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "(03) 9876 5432",
  "address": "123 Main St, Melbourne",
  "service": "Balcony Waterproofing",
  "date": "2025-10-15T00:00:00.000Z",
  "time": "10:00 AM",
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "BOOK-1234567890-ABC123",
  "data": { ... }
}
```

## Benefits of Serverless Functions

### Security
✅ API key never exposed to browser
✅ No CORS issues
✅ Server-side validation possible

### Scalability
✅ Auto-scales with traffic
✅ Pay per use (free for low volume)
✅ No server management

### Performance
✅ Edge deployment (fast globally)
✅ Cached builds
✅ Minimal cold start time

## Troubleshooting

### "Function not found" error
- Make sure you're running `netlify dev` for local testing
- Check that `/netlify/functions/` directory exists
- Verify function files have `.js` extension

### "CORS error" 
- If using Vite dev server (`npm run dev`), functions won't work
- Use `netlify dev` instead
- Or test on deployed Netlify site

### Email not sending
- Check Resend dashboard for API errors
- Verify `from` email domain is verified in Resend
- Check function logs in Netlify dashboard

## Production Checklist

- [ ] Deploy to Netlify
- [ ] Verify `bookings@advancewaterproofing.com.au` domain in Resend
- [ ] Test contact form
- [ ] Test booking form
- [ ] Check that accept booking link works
- [ ] Verify emails arrive at `info@advancewaterproofing.com.au`
- [ ] (Optional) Move API key to environment variable
- [ ] (Optional) Add rate limiting
- [ ] (Optional) Add backend database for bookings

## Cost Estimate

### Resend API
- Free tier: 100 emails/day, 3,000/month
- $10/month: 50,000 emails/month

### Netlify Functions
- Free tier: 125k requests/month, 100 hours runtime
- Should be more than enough for this use case

### Total Monthly Cost
- **$0** if within free tiers
- **$10** for Resend if exceeding 100 emails/day


