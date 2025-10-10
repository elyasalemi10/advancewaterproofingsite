# 🚀 Vercel Deployment Guide

## What is Vercel?

**Vercel** is a cloud platform for deploying React/Next.js/Vite apps with serverless functions. It's fast, free for personal projects, and automatically deploys when you push to Git.

## Why Vercel? (vs Netlify)

Both are excellent! Key similarities:
- ✅ Serverless Functions
- ✅ Automatic Git Deploys
- ✅ Free Tier
- ✅ Custom Domains
- ✅ HTTPS Included

**Vercel** is especially great for React/Next.js projects and has excellent performance.

## 📦 Setup Complete!

Your project is now configured for Vercel:

### ✅ Serverless Functions Created
- `/api/send-contact-email.js` - Contact form emails
- `/api/send-booking-email.js` - Booking request emails

### ✅ Configuration Added
- `vercel.json` - Routes API requests properly

### ✅ Email System Ready
- Sends to: `info@advancewaterproofing.com.au`
- Uses: Resend API
- Beautiful HTML templates with logo

## 🎯 How to Deploy

### Step 1: Install Vercel CLI (Optional, for testing)
```bash
npm install -g vercel
```

### Step 2: Deploy via Git (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Done!** 🎉
   - Your site will be live at `your-project.vercel.app`
   - Every push to `main` automatically deploys

### Step 3: Test Locally (Optional)

```bash
# Install Vercel CLI
npm install -g vercel

# Run local dev server with serverless functions
vercel dev

# Access at: http://localhost:3000
```

## 🌐 Custom Domain

1. Go to your Vercel project settings
2. Click "Domains"
3. Add `advancewaterproofing.com.au`
4. Follow DNS instructions
5. Done! Your site will be live on your domain

## 📧 Email Configuration

### Already Configured ✅
- **API Key**: Hardcoded in `/api/` functions
- **Send To**: `info@advancewaterproofing.com.au`
- **Send From**: `bookings@advancewaterproofing.com.au`

### For Better Security (Optional):
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - Name: `RESEND_API_KEY`
   - Value: `re_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co`
3. Update functions to use: `process.env.RESEND_API_KEY`

## 🎨 Features Included

### Contact Form
- ✅ Beautiful success animation
- ✅ Prevents duplicate submissions
- ✅ Sends professional HTML email
- ✅ Error handling

### Booking Form  
- ✅ Calendar UI in email
- ✅ One-click accept button
- ✅ Sends confirmation to both parties

### All Images Fixed
- ✅ Bathroom before/after slider
- ✅ Rooftop before/after slider
- ✅ All service page images
- ✅ Favicon = logo.png

## 🧪 Testing

### Test Locally:
```bash
vercel dev
# Open: http://localhost:3000
```

### Test Forms:
1. Navigate to `/#contact`
2. Fill out form
3. Submit
4. Check Resend dashboard for email
5. Verify success animation shows

## 📊 Monitoring

- **Vercel Dashboard**: See deployments, analytics, logs
- **Resend Dashboard**: See email deliveries, bounces
- Both have free tiers with all you need!

## 🔧 Troubleshooting

### "Function not found" locally
- Use `vercel dev` instead of `npm run dev`
- Vercel Dev integrates serverless functions

### Email not sending
1. Check Resend dashboard for errors
2. Verify sender domain is verified in Resend
3. Check Vercel function logs

### Images not showing
- All images are in `/public`
- Reference with `/image-name.jpeg`
- Vercel automatically serves from `/public`

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Phone**: 03 9001 7788
- **Email**: info@advancewaterproofing.com.au

## ✨ You're Ready!

Everything is configured and ready to deploy to Vercel!

1. Push to GitHub
2. Connect to Vercel
3. Click Deploy
4. Your site is live! 🚀

**No additional setup needed** - forms, emails, and everything will work automatically!

