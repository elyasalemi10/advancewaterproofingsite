# Development Guide

## 🚀 Running the Site Locally

### Important: Use Netlify Dev (Not Vite Directly)

To test email functionality and serverless functions locally, you **must** use Netlify Dev:

```bash
npx netlify dev
```

**Access at:** `http://localhost:8888` ✅

### ❌ Don't Use This for Testing Forms:
```bash
npm run dev  # This runs Vite on port 3000 without serverless functions
```

## Why?

- **Port 3000 (Vite)**: Frontend only, no serverless functions → Forms will show 404 errors
- **Port 8888 (Netlify Dev)**: Full stack with serverless functions → Forms work properly ✅

## Email System

### Contact Form
- **Endpoint**: `/api/send-contact-email`
- **Sends to**: `info@advancewaterproofing.com.au`
- **Service**: Resend API
- **Features**:
  - Beautiful HTML email with logo and colors
  - Success animation on submission
  - Prevents duplicate submissions (requires page refresh)
  - Graceful error handling

### Booking Form
- **Endpoint**: `/api/send-booking-email`
- **Sends to**: `info@advancewaterproofing.com.au`
- **Service**: Resend API
- **Features**:
  - Calendar UI in email
  - One-click accept button
  - Confirmation emails to both parties

## Testing Locally

1. **Start Netlify Dev:**
   ```bash
   npx netlify dev
   ```

2. **Wait for the message:**
   ```
   ◈ Server now ready on http://localhost:8888
   ```

3. **Open in browser:**
   ```
   http://localhost:8888
   ```

4. **Test the contact form:**
   - Fill out the form at `/#contact`
   - Click "Send Message"
   - You should see the success animation
   - Check Resend dashboard for sent email

## Production Deployment

When deployed to Netlify:
1. Push your code to Git
2. Connect repo to Netlify
3. Netlify automatically:
   - Builds the site
   - Deploys serverless functions
   - Sets up redirects
   - Everything works! ✅

## Troubleshooting

### "404 on /api/send-contact-email"
**Problem**: Accessing site on port 3000  
**Solution**: Use `npx netlify dev` and access on port 8888

### "Form submitted but no email received"
**Check**:
1. Using Netlify Dev (port 8888)?
2. Resend API key valid?
3. Check Resend dashboard for logs
4. Verify sender email domain is verified in Resend

### "Port 3000 already in use"
**Solution**:
```bash
lsof -ti :3000 | xargs kill -9
```

## Current Configuration

- **Phone**: 03 9001 7788
- **Email**: info@advancewaterproofing.com.au
- **Business Hours**: 7:00am - 6:00pm (Mon-Fri)
- **Service Area**: Melbourne Metro & Victoria
- **Resend API Key**: `re_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co`

## Form Features ✨

### Contact Form Success Screen:
- ✅ Big green checkmark animation
- ✅ "Thank You! 🎉" message
- ✅ "What happens next?" section with timeline
- ✅ Phone number for immediate assistance
- ✅ "Submit Another Request" button (refreshes page)
- ✅ Prevents multiple submissions without refresh

### User Experience:
1. User fills form
2. Clicks "Send Message"
3. Button shows "⏳ Sending..."
4. Success animation appears
5. Form is hidden, success message shown
6. User must refresh to submit again

## Next Steps for Production

1. ✅ Favicon updated to logo.png
2. ✅ All phone numbers updated to 03 9001 7788
3. ✅ Email configured to info@advancewaterproofing.com.au
4. ✅ Success animation added
5. ✅ Duplicate submission prevention
6. ⚠️ **Important**: Test on Netlify Dev before deploying!

## Images to Add

Missing images in `/public`:
- ❌ `bathroom-after.jpeg` (currently using before image for both)
- ❌ `rooftop-before.jpeg` (currently using after image for both)

Add these to complete the before/after sliders!


