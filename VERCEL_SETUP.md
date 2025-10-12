# 🔧 Vercel Setup - Environment Variables

## ⚠️ Critical: Set Environment Variable

Your contact and booking forms need the `RESEND_API_KEY` environment variable set in Vercel.

## 📝 How to Add Environment Variable in Vercel:

### Step 1: Go to Your Project Settings
1. Open https://vercel.com
2. Go to your `advancewaterproofingsite` project
3. Click **Settings** (top navigation)

### Step 2: Add Environment Variable
1. Click **Environment Variables** (left sidebar)
2. Add a new variable:

   **Name:**
   ```
   RESEND_API_KEY
   ```

   **Value:**
   ```
   re_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co
   ```

   **Environments:** (Select ALL three)
   - ✅ Production
   - ✅ Preview
   - ✅ Development

3. Click **Save**

### Step 3: Redeploy
After adding the environment variable:

**Option A: Trigger Redeploy**
1. Go to **Deployments** tab
2. Click the **•••** menu on the latest deployment
3. Click **Redeploy**

**Option B: Push a Change**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

## 🧪 Test After Redeployment

1. Go to your live site
2. Navigate to `/#contact`
3. Fill out the form
4. Submit
5. Should work! ✅

## 🐛 Troubleshooting

### If you still get 500 error:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard
   - Click on your deployment
   - Click **Functions** tab
   - Click on `/api/send-contact-email`
   - Check logs for errors

2. **Verify Environment Variable:**
   - Settings → Environment Variables
   - Should see: `RESEND_API_KEY` with value set
   - Make sure all three environments are checked

3. **Check Resend API Key:**
   - Go to https://resend.com/api-keys
   - Verify the key is active
   - Verify sender domain is approved

## 📧 Resend Setup

### Important: Verify Your Sender Domain

1. Go to https://resend.com/domains
2. Add your domain: `advancewaterproofing.com.au`
3. Add the DNS records Resend provides
4. Wait for verification (usually a few minutes)

### Or Use Resend's Test Domain (For Testing)

If you haven't set up your domain yet:
- Resend provides `onboarding@resend.dev` for testing
- Change the "from" email in the API functions temporarily

## ✅ Expected Behavior

### Before Setting Env Var:
- ❌ 500 error
- ❌ "Email service not configured"
- ❌ Forms don't work

### After Setting Env Var:
- ✅ Forms submit successfully
- ✅ Success animation shows
- ✅ Email arrives at info@advancewaterproofing.com.au
- ✅ Beautiful HTML email with logo

## 🔍 Debug Commands

If you want to check locally:

```bash
# Test with Vercel CLI
vercel env pull .env.local
vercel dev

# Then test the form at http://localhost:3000
```

## 📞 Current Configuration

- **Phone:** 03 9001 7788
- **Email:** info@advancewaterproofing.com.au
- **Sender:** bookings@advancewaterproofing.com.au
- **Hours:** Mon-Fri 7:00am - 6:00pm

## 🎯 Quick Fix Checklist

- [ ] Add `RESEND_API_KEY` to Vercel environment variables
- [ ] Select all 3 environments (Production, Preview, Development)
- [ ] Click Save
- [ ] Redeploy the site
- [ ] Test the contact form
- [ ] Verify email arrives
- [ ] Done! ✅

---

**Need help?** The most common issue is forgetting to redeploy after adding the environment variable!


