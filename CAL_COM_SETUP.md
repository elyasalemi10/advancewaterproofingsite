# Cal.com Integration Setup

## Environment Variables

Add these to Vercel (and already in `.env.local`):

```env
VITE_CAL_API_KEY=cal_live_30cc62be183a46889753a4e6b4683971
CAL_API_KEY=cal_live_30cc62be183a46889753a4e6b4683971
VITE_CAL_ACCOUNT=advancewaterproofing
VITE_CAL_QUOTE_EVENT_TYPE=3629145
VITE_CAL_INSPECTION_EVENT_TYPE=3637831
```

## Event Types

### 1. Free Quote (10 minutes)
- **Event Type ID**: 3629145
- **Duration**: 10 minutes
- **Use**: Quick quote discussions

### 2. Free Inspection (60 minutes)
- **Event Type ID**: 3637831
- **Duration**: 60 minutes
- **Use**: On-site inspections

## Features Implemented

### ✅ Automatic Scheduling
- User selects preferred date/time
- System creates Cal.com booking automatically
- Sends confirmation emails

### ✅ Time Management
- Start time selection with automatic end time calculation
- Or end time selection with automatic start time calculation
- Working hours validation (Mon-Fri, 7 AM - 6 PM)

### ✅ Admin Dashboard
- View all bookings
- Accept/Decline bookings
- Email or call clients directly
- Reschedule bookings
- Cancel bookings

## How It Works

### 1. Customer Books Inspection/Quote
1. Fill out form (name, email, phone, service, notes)
2. Choose preferred date and time
3. System validates working hours
4. Creates Cal.com booking
5. Stores in Supabase
6. Sends email to admin with booking link

### 2. Admin Receives Email
Email contains:
- Customer details
- Booking time
- Service requested
- Buttons: **Accept** | **Decline** | **Email Client** | **Call Client**

### 3. Admin Reviews Booking
- Click "Accept" → Confirms booking, sends confirmation to client
- Click "Decline" → Cancels booking, allows reason/reschedule
- Click "Email" → Opens mailto: link
- Click "Call" → Opens tel: link

## Working Hours

**Days**: Monday - Friday
**Hours**: 7:00 AM - 6:00 PM
**Timezone**: Australia/Melbourne

System automatically validates times are within these hours.

## Cal.com Dashboard

Access your bookings at:
https://app.cal.com/bookings/upcoming

## API Functions

### Create Booking
```typescript
import { createCalBooking } from '@/lib/calcom'

const booking = await createCalBooking({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '0400000000',
  startTime: '2025-10-14T09:00:00+11:00',
  endTime: '2025-10-14T10:00:00+11:00',
  eventTypeId: 3637831, // Inspection
  notes: 'Balcony waterproofing needed'
})
```

### Reschedule Booking
```typescript
import { rescheduleCalBooking } from '@/lib/calcom'

await rescheduleCalBooking(
  bookingUid, 
  '2025-10-15T10:00:00+11:00',
  true // isInspection
)
```

### Cancel Booking
```typescript
import { cancelCalBooking } from '@/lib/calcom'

await cancelCalBooking(bookingUid, 'Customer requested cancellation')
```

## Next Steps

1. ✅ Add environment variables to Vercel
2. ✅ Deploy to production
3. Test booking flow
4. Verify Cal.com dashboard receives bookings
5. Test accept/decline workflow

