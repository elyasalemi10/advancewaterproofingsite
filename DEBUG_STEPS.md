# 🔧 Debug Steps - Follow These NOW

## Step 1: Check Netlify Deployment Status

1. Go to: https://app.netlify.com/
2. Find your "Advanced Waterproofing" site
3. Click on "Deploys"
4. Look at the **top deploy**:
   - ✅ Green checkmark = Deployed successfully
   - 🟡 Yellow building icon = Still deploying (WAIT)
   - ❌ Red X = Build failed (READ THE LOGS)

**If still deploying**: Wait 2-3 minutes, then refresh the page

**If failed**: Click on it and read the error logs - send me the error

## Step 2: Hard Refresh Your Browser

After Netlify shows ✅ (green checkmark):

### On Mac:
- **Chrome/Edge**: Press `Cmd + Shift + R`
- **Safari**: Press `Cmd + Option + R`

### On Windows:
- **Chrome/Edge**: Press `Ctrl + Shift + R`
- **Firefox**: Press `Ctrl + F5`

### Or Clear Cache:
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Click "Empty Cache and Hard Reload"

## Step 3: Check Functions Are Deployed

After hard refresh, open Developer Tools Console (F12) and type:

```javascript
fetch('/.netlify/functions/send-contact-email', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    name: 'Test',
    email: 'test@test.com',
    phone: '123',
    subject: 'Test',
    message: 'Test'
  })
}).then(r => r.json()).then(console.log)
```

**Expected Results:**
- ✅ `{success: true, data: {...}}` = WORKING!
- ❌ `404` = Functions not deployed
- ❌ `403` = CORS issue
- ❌ `500` = Server error (check Netlify logs)

## Step 4: Verify Environment Variables

Go to Netlify Dashboard:
1. Click your site
2. Go to **Site settings** → **Environment variables**
3. Verify these exist:
   - `RESEND_API_KEY`
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_ANON_KEY`

If missing, add them and **trigger a new deploy**.

## Step 5: Check Netlify Function Logs

1. Netlify Dashboard → Your Site
2. Click **Functions** in the left menu
3. You should see:
   - `send-contact-email`
   - `send-booking-email`

If you DON'T see them = BUILD FAILED

Click on the function name to see logs of any invocations.

---

## 🚨 If STILL Not Working After All Steps:

Send me:
1. Screenshot of Netlify deployment status
2. Screenshot of Functions tab in Netlify
3. The browser console error (full message)
4. Any Netlify build logs if build failed

---

## 🎯 Most Likely Issue:

**Browser cache** - You need to do a HARD REFRESH (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

The old JavaScript bundle is cached in your browser and it's still trying to use the old paths.

