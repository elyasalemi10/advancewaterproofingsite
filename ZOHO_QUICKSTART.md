# Zoho Mail - Quick Setup (5 Minutes)

## Super Simple Method

### 1️⃣ Click This Link

**[Click here to authorize Zoho](https://accounts.zoho.com/oauth/v2/auth?scope=ZohoMail.messages.CREATE&client_id=1000.GBBKC2MN97MDWONHDY5TTIDCDXULHO&response_type=code&access_type=offline&redirect_uri=http://localhost)**

- Login to your Zoho Mail account
- Click "Accept" to authorize

### 2️⃣ Copy the Code

After clicking accept, you'll see a page that says **"This site can't be reached"** - that's normal!

Look at the URL in your browser. It will look like:
```
http://localhost/?code=1000.abc123def456...
```

**Copy the code** (the part after `code=`)

### 3️⃣ Get Your Refresh Token

Open Terminal and run this command (replace `YOUR_CODE` with what you copied):

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "code=YOUR_CODE" \
  -d "client_id=1000.GBBKC2MN97MDWONHDY5TTIDCDXULHO" \
  -d "client_secret=fbe8b3672675e5f1be76d845726dc35fdda83406f7" \
  -d "redirect_uri=http://localhost" \
  -d "grant_type=authorization_code"
```

### 4️⃣ Save the Refresh Token

You'll get a response like this:
```json
{
  "access_token": "1000.xxxxx.xxxxx",
  "refresh_token": "1000.yyyyy.yyyyy",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Copy the `refresh_token`** value!

### 5️⃣ Add to Environment Variables

**Local (.env.local):**
```env
ZOHO_CLIENT_ID=1000.GBBKC2MN97MDWONHDY5TTIDCDXULHO
ZOHO_CLIENT_SECRET=fbe8b3672675e5f1be76d845726dc35fdda83406f7
ZOHO_REFRESH_TOKEN=1000.yyyyy.yyyyy
ZOHO_FROM_EMAIL=info@advancewaterproofing.com.au
```

**Vercel:**
Go to: https://vercel.com/elyasalemi10s-projects/advancewaterproofingsite/settings/environment-variables

Add the same 4 variables above.

## ✅ Done!

Your emails will now send from `info@advancewaterproofing.com.au` via Zoho Mail!

## 🔍 Troubleshooting

**"Invalid redirect URI"**
- Make sure you clicked the link in Step 1 exactly as provided
- The redirect_uri must be `http://localhost` (not https)

**"Invalid authorization code"**
- The code expires quickly - do Step 3 within a few minutes of Step 2
- Make sure you copied the entire code (no spaces or line breaks)

**"Invalid client"**
- Double-check your client_id and client_secret in the curl command

**Still not working?**
- System will automatically fall back to Resend
- Emails will still send, just might show "via resend.dev"

