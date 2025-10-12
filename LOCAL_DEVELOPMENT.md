# 🛠️ Local Development Guide

## Important: Testing Forms Locally

### The Issue
When running `npm run dev`, you'll see a **404 error** on form submissions. This is **normal** and **expected**!

### Why?
- `npm run dev` runs **Vite only** (frontend)
- Serverless functions are **not included**
- The `/api/` endpoints don't exist locally

### The Solution

#### Option 1: Use Vercel Dev (Recommended for Testing Forms)
```bash
vercel dev
```
This runs your app **with** serverless functions at `http://localhost:3000`

#### Option 2: Use Regular Vite (For UI/Design Work)
```bash
npm run dev
```
- Good for: UI changes, styling, components
- Forms will show "Development Mode" message
- No actual emails sent (that's okay!)

## 🚀 When It Works

### In Production (Vercel)
✅ Forms work perfectly  
✅ Emails sent to info@advancewaterproofing.com.au  
✅ All serverless functions active  

### Testing Locally with Vercel Dev
✅ Forms work  
✅ Emails actually sent  
✅ Full production simulation  

### Testing with npm run dev
⚠️ Forms validated but 404 on submit  
✅ Success animation shows anyway  
✅ Great for UI testing  

## 📞 Current Configuration

- **Phone**: 03 9001 7788
- **Email**: info@advancewaterproofing.com.au
- **Hours**: Mon-Fri 7am-6pm
- **Service Area**: Melbourne Metro & Victoria

## ✅ What's Validated

### Contact Form
- ✅ Name (required, min 2 chars)
- ✅ Email (required, valid format)
- ✅ Phone (optional, but validated if provided)
- ✅ Subject (required, min 3 chars)
- ✅ Message (required, min 10 chars)

### Features
- ✅ Real-time error messages
- ✅ Red borders on invalid fields
- ✅ Errors clear when user types
- ✅ Can't submit until valid
- ✅ Success animation after submit
- ✅ Prevents duplicate submissions

## 🎯 Quick Reference

```bash
# For UI/Design work (no forms needed)
npm run dev
→ http://localhost:3000

# For testing forms/emails
vercel dev
→ http://localhost:3000

# For production
vercel
→ Deploy to Vercel
```

## 🐛 Troubleshooting

### "404 on /api/send-contact-email"
✅ **This is normal with `npm run dev`**
- Forms are validated
- Success animation shows
- In production, emails work fine

To test emails locally:
```bash
vercel dev
```

### Form validation errors
- Check all required fields are filled
- Email must be valid format
- Message must be at least 10 characters
- Name must be at least 2 characters

### Vercel dev not starting
```bash
# Install Vercel CLI first
npm install -g vercel

# Then run
vercel dev
```

## 📧 Email Testing

### Local (with vercel dev)
1. Run `vercel dev`
2. Fill form at `http://localhost:3000/#contact`
3. Submit
4. Check Resend dashboard for email

### Production (on Vercel)
1. Deploy to Vercel
2. Visit your live site
3. Fill form
4. Email arrives at info@advancewaterproofing.com.au

## 🎨 Development Workflow

### Working on UI/Styles?
```bash
npm run dev
```
Fast, hot-reload, perfect for design work

### Testing Complete Features?
```bash
vercel dev
```
Slower, but includes serverless functions

### Ready to Deploy?
```bash
git push
```
Vercel auto-deploys on push!

## ✨ Pro Tips

1. **Use `npm run dev` for most work** - it's faster
2. **Use `vercel dev` only when testing forms** - it's slower
3. **Forms show helpful messages** in dev mode
4. **Everything works perfectly** in production on Vercel
5. **Phone numbers are consistent** throughout the site

## 🚀 Next Steps

1. Test locally with `npm run dev`
2. When ready, push to GitHub
3. Deploy to Vercel
4. Test forms in production
5. Everything works! 🎉


