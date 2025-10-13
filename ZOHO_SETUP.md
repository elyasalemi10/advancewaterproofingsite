# Zoho Mail Integration Setup

## What You Have

```
Client ID: 1000.GBBKC2MN97MDWONHDY5TTIDCDXULHO
Client Secret: fbe8b3672675e5f1be76d845726dc35fdda83406f7
```

## What You Need to Get: Refresh Token

Zoho uses OAuth 2.0, which requires a **refresh token** to send emails on your behalf.

### Step 1: Get Authorization Code

**Option A: Use localhost (Easier)**

1. Visit this URL in your browser:

```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoMail.messages.CREATE&client_id=1000.GBBKC2MN97MDWONHDY5TTIDCDXULHO&response_type=code&access_type=offline&redirect_uri=http://localhost
```

2. Login to your Zoho account and authorize
3. You'll be redirected to something like:
   ```
   http://localhost/?code=1000.abc123def456...
   ```
4. The page will show "This site can't be reached" - **that's OK!**
5. Copy the entire URL from your browser address bar
6. Extract the `code` value (everything after `code=` and before `&` if there is one)

**Option B: Use your domain**

If localhost doesn't work, first you need to add your domain as an authorized redirect URI in Zoho:

1. Go to: https://api-console.zoho.com/
2. Find your app
3. Add redirect URI: `https://www.advancewaterproofing.com.au`
4. Then use this URL:

```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoMail.messages.CREATE&client_id=1000.GBBKC2MN97MDWONHDY5TTIDCDXULHO&response_type=code&access_type=offline&redirect_uri=https://www.advancewaterproofing.com.au
```

### Step 2: Exchange Code for Refresh Token

**If you used localhost in Step 1:**

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "code=YOUR_CODE_FROM_STEP_1" \
  -d "client_id=1000.GBBKC2MN97MDWONHDY5TTIDCDXULHO" \
  -d "client_secret=fbe8b3672675e5f1be76d845726dc35fdda83406f7" \
  -d "redirect_uri=http://localhost" \
  -d "grant_type=authorization_code"
```

**If you used your domain in Step 1:**

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "code=YOUR_CODE_FROM_STEP_1" \
  -d "client_id=1000.GBBKC2MN97MDWONHDY5TTIDCDXULHO" \
  -d "client_secret=fbe8b3672675e5f1be76d845726dc35fdda83406f7" \
  -d "redirect_uri=https://www.advancewaterproofing.com.au" \
  -d "grant_type=authorization_code"
```

**IMPORTANT:** The `redirect_uri` in Step 2 MUST match exactly what you used in Step 1!

You'll get a response like:
```json
{
  "access_token": "1000.xxxxx.xxxxx",
  "refresh_token": "1000.xxxxx.xxxxx",
  "expires_in": 3600
}
```

**Save the `refresh_token`** - you'll need this!

### Step 3: Add to Environment Variables

Add these to your `.env.local`:

```env
ZOHO_CLIENT_ID=1000.GBBKC2MN97MDWONHDY5TTIDCDXULHO
ZOHO_CLIENT_SECRET=fbe8b3672675e5f1be76d845726dc35fdda83406f7
ZOHO_REFRESH_TOKEN=1000.xxxxx.xxxxx
ZOHO_FROM_EMAIL=info@advancewaterproofing.com.au
```

Also add to **Vercel** environment variables!

### Step 4: Update Zoho Helper (Already Created)

I'll create a Zoho email helper that:
1. Gets a fresh access token using your refresh token
2. Sends emails via Zoho Mail API
3. Falls back to Resend if Zoho fails

## How It Works

When the system sends confirmation emails:

1. **Checks for Zoho credentials**
   - If `ZOHO_REFRESH_TOKEN` exists → Use Zoho
   - If not → Fall back to Resend

2. **Gets fresh access token**
   - Uses refresh token to get a new access token (valid for 1 hour)
   - Zoho access tokens expire, so we refresh them automatically

3. **Sends email**
   - Uses Zoho Mail API to send from `info@advancewaterproofing.com.au`
   - Professional, authenticated sending

## Benefits of Zoho vs Resend

**Zoho**:
- ✅ Send from your actual domain email
- ✅ Better deliverability (from your real mailbox)
- ✅ No "via resend.dev" warnings
- ✅ Professional appearance

**Resend**:
- ✅ Easier setup
- ✅ Good fallback option
- ❌ May show "via resend.dev" in some email clients

## Testing

After setup, test the confirmation email:
1. Create a booking on your site
2. Confirm it from the manage booking page
3. Check customer receives email from `info@advancewaterproofing.com.au`
4. Verify it doesn't show "via resend.dev"

## Troubleshooting

**Error: Invalid refresh token**
- Refresh tokens can expire
- Generate a new one using Steps 1-2 above

**Error: Scope insufficient**
- Make sure you authorized `ZohoMail.messages.CREATE` scope
- Re-do the OAuth flow with correct scope

**Emails not sending**
- Check Vercel logs for errors
- Verify all env vars are set correctly
- System will fall back to Resend if Zoho fails

