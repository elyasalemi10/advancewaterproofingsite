# Vercel Environment Variables Setup

## Required Environment Variables

Go to: https://vercel.com/elyasalemi10s-projects/advancewaterproofingsite/settings/environment-variables

Add these environment variables:

### Email (Resend)
```
RESEND_API_KEY=re_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co
BUSINESS_EMAIL=info@advancewaterproofing.com.au
```

### Supabase
```
SUPABASE_URL=https://ryhrxlblccjjjowpubyv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMzMDM0NywiZXhwIjoyMDc1OTA2MzQ3fQ.nYRFSVsREhvkU3p-uonTseeLnEiK0Z9ugEalhspqJ24

# For client-side (VITE_ prefix)
VITE_SUPABASE_URL=https://ryhrxlblccjjjowpubyv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aHJ4bGJsY2Nqampvd3B1Ynl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMzAzNDcsImV4cCI6MjA3NTkwNjM0N30.CLnaJ7Lj6tq9voFaRDpTtGjE0RXPGB87TSCKkZbppSc
```

### Cal.com
```
CAL_API_KEY=cal_live_30cc62be183a46889753a4e6b4683971
VITE_CAL_API_KEY=cal_live_30cc62be183a46889753a4e6b4683971
VITE_CAL_ACCOUNT=advancewaterproofing
VITE_CAL_QUOTE_EVENT_TYPE=3629145
VITE_CAL_INSPECTION_EVENT_TYPE=3637831
```

### Zoho Mail (Optional - for production)
```
ZOHO_API_KEY=your_zoho_api_key_here
ZOHO_FROM_EMAIL=info@advancewaterproofing.com.au
```

## Important Notes

1. **SUPABASE_URL vs VITE_SUPABASE_URL**:
   - `SUPABASE_URL` is used in API routes (server-side)
   - `VITE_SUPABASE_URL` is used in frontend (client-side)
   - Both should have the same value!

2. **Service Role Key vs Anon Key**:
   - `SUPABASE_SERVICE_ROLE_KEY` has full admin access (use in API routes only)
   - `VITE_SUPABASE_ANON_KEY` has limited access (safe for frontend)

3. **After Adding Variables**:
   - Click "Save" for each variable
   - **Redeploy** your site to apply changes

## Zoho Mail Setup (Optional)

Currently using Resend as fallback. To switch to Zoho:

1. Get Zoho API key from: https://www.zoho.com/mail/help/api/
2. Add `ZOHO_API_KEY` to Vercel env vars
3. Confirm `ZOHO_FROM_EMAIL` is set to your Zoho email

The system will automatically use Zoho if the API key is present, otherwise falls back to Resend.

## Testing

After setting env vars and redeploying:

1. Test booking creation (should save to database)
2. Test booking confirmation (should create Cal.com event for owner)
3. Test email sending (should send to customer)
4. Check Cal.com dashboard for owner-only events
5. Verify customer receives confirmation email

## Troubleshooting

**Database not saving?**
- Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly
- Verify you ran the SQL setup in Supabase (see `SUPABASE_SIMPLE_SETUP.sql`)

**Cal.com not working?**
- Verify `CAL_API_KEY` is correct
- Check event type IDs (3629145 for quotes, 3637831 for jobs)

**Email not sending?**
- Confirm `RESEND_API_KEY` is valid
- Check sender domain is verified in Resend dashboard

