# Booking Email System Documentation

## Overview
The booking system uses **Resend API** to send beautiful, professional HTML emails for booking requests with one-click acceptance functionality.

## Features

### 📧 Email Templates
1. **Booking Request Email** (to business)
   - Beautiful calendar UI showing date and time
   - Complete client information
   - Service details
   - Additional notes
   - One-click accept button
   - Professional branding with logo and colors

2. **Confirmation Email** (to client)
   - Booking confirmation with checkmark
   - Calendar display of appointment
   - What to expect section
   - Contact information
   - Professional branding

3. **Business Confirmation** (to business)
   - Simple confirmation that booking was accepted
   - Summary of client details

## Configuration

### API Key
- **Service**: Resend API
- **API Key**: `re_YF1u8Md5_LKN5LqkVRpCd8Ebw1UwZw9co`
- **Email Domain**: `bookings@advancewaterproofing.com.au`
- **Recipient**: `info@advancewaterproofing.com.au`

### Email Setup
The emails are configured in `/src/lib/resendService.ts`

## How It Works

### 1. Customer Submits Booking
```typescript
// Customer fills out form on /booking page
{
  name: "John Smith",
  email: "john@example.com",
  phone: "(03) 9876 5432",
  address: "123 Main St, Melbourne",
  service: "Balcony Waterproofing",
  date: Date object,
  time: "10:00 AM",
  notes: "Optional notes"
}
```

### 2. System Sends Email to Business
- Generates unique booking ID: `BOOK-1234567890-ABC123`
- Creates beautiful HTML email with:
  - Calendar UI showing date/time
  - Complete client information
  - Accept button linking to `/api/accept-booking?id=BOOK-...`
- Sends via Resend API to `info@advancewaterproofing.com.au`

### 3. Business Clicks "Accept Booking"
- Opens acceptance page: `/api/accept-booking?id=BOOK-...`
- Automatically sends confirmation emails to:
  - **Client**: Beautiful confirmation with appointment details
  - **Business**: Simple confirmation copy

### 4. Both Parties Receive Confirmation
- Client gets detailed confirmation email
- Business gets confirmation copy
- Booking is now confirmed

## Email Design

### Colors
- **Primary**: `#1e3a8a` (Blue 900)
- **Accent**: `#3b82f6` (Blue 500)
- **Success**: `#10b981` (Green 500)
- **Background**: Gradients from blue to light blue

### Components
- 📅 **Calendar Card**: Visual date display with month/day/time
- 👤 **Client Info Card**: Name, email, phone, address
- 🔧 **Service Card**: Selected service with icon
- 📝 **Notes Section**: Optional additional information
- ✅ **Accept Button**: Prominent CTA for confirmation
- 📌 **Next Steps**: Instructional info box

## Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Go to `/booking`
3. Fill out and submit form
4. Check console for email API response
5. Email will be sent to configured address

### Production Testing
1. Deploy to production
2. Ensure domain is verified in Resend
3. Configure proper email domain
4. Test full flow with real email addresses

## Important Notes

⚠️ **Email Domain Verification**
- The `from` email must be from a verified domain in Resend
- Currently using `bookings@advancewaterproofing.com.au`
- Verify domain in Resend dashboard before production

⚠️ **Accept Button URL**
- Dynamically uses current domain
- Local: `http://localhost:3000/api/accept-booking?id=...`
- Production: `https://advancewaterproofing.com.au/api/accept-booking?id=...`

⚠️ **Booking Storage**
- Currently uses localStorage (client-side only)
- **For production**: Replace with database storage
- Consider backend API for production use

## Production Recommendations

### 1. Backend API
Create a proper backend API endpoint:
```javascript
POST /api/bookings
GET  /api/bookings/:id
POST /api/bookings/:id/accept
```

### 2. Database Storage
Store bookings in a database instead of localStorage:
```sql
CREATE TABLE bookings (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  address TEXT,
  service VARCHAR(255),
  booking_date DATE,
  booking_time TIME,
  notes TEXT,
  status VARCHAR(50), -- 'pending', 'confirmed', 'cancelled'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 3. Security
- Add authentication for accept endpoint
- Implement rate limiting
- Add CSRF protection
- Validate booking IDs server-side

### 4. Email Enhancements
- Add calendar invites (.ics files)
- Send reminder emails
- Add cancellation links
- Track email opens/clicks

## Files Modified

1. `/src/lib/resendService.ts` - Email service and templates
2. `/src/components/BookingCalendar.tsx` - Updated to use Resend
3. `/src/pages/AcceptBooking.tsx` - New acceptance page
4. `/src/App.tsx` - Added acceptance route
5. `package.json` - Added resend dependency

## Support

For issues or questions:
- Resend Documentation: https://resend.com/docs
- API Status: https://status.resend.com
- Support: support@resend.com


