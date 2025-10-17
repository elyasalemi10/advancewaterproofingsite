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

### Public base URL
```
PUBLIC_BASE_URL=https://advancewaterproofing.com.au
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

