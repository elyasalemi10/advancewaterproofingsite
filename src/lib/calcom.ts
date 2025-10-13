// Cal.com API Integration

const CAL_API_KEY = import.meta.env.VITE_CAL_API_KEY || 'cal_live_30cc62be183a46889753a4e6b4683971';
const CAL_ACCOUNT = import.meta.env.VITE_CAL_ACCOUNT || 'advancewaterproofing';
const QUOTE_EVENT_TYPE = import.meta.env.VITE_CAL_QUOTE_EVENT_TYPE || '3629145';
const INSPECTION_EVENT_TYPE = import.meta.env.VITE_CAL_INSPECTION_EVENT_TYPE || '3637831';

export interface CalBooking {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  eventTypeId: number;
  timeZone?: string;
  metadata?: Record<string, any>;
}

export interface CalBookingResponse {
  id: number;
  uid: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees: Array<{
    name: string;
    email: string;
    timeZone: string;
  }>;
}

// Calculate end time (1 hour after start for inspections, 10 min for quotes)
export function calculateEndTime(startTime: string, isInspection: boolean = true): string {
  const start = new Date(startTime);
  const duration = isInspection ? 60 : 10; // minutes
  const end = new Date(start.getTime() + duration * 60000);
  return end.toISOString();
}

// Calculate start time (1 hour before end for inspections)
export function calculateStartTime(endTime: string, isInspection: boolean = true): string {
  const end = new Date(endTime);
  const duration = isInspection ? 60 : 10; // minutes
  const start = new Date(end.getTime() - duration * 60000);
  return start.toISOString();
}

// Check if time is within working hours (7am - 6pm weekdays)
export function isWithinWorkingHours(datetime: string): boolean {
  const date = new Date(datetime);
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = date.getHours();
  
  // Monday-Friday only
  if (day === 0 || day === 6) return false;
  
  // 7 AM to 6 PM
  if (hour < 7 || hour >= 18) return false;
  
  return true;
}

// Create a Cal.com booking
export async function createCalBooking(booking: CalBooking): Promise<CalBookingResponse> {
  const response = await fetch('https://api.cal.com/v1/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CAL_API_KEY}`
    },
    body: JSON.stringify({
      eventTypeId: booking.eventTypeId,
      start: booking.startTime,
      end: booking.endTime,
      responses: {
        name: booking.name,
        email: booking.email,
        phone: booking.phone || '',
        notes: booking.notes || ''
      },
      timeZone: booking.timeZone || 'Australia/Melbourne',
      language: 'en',
      metadata: booking.metadata || {}
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cal.com API error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

// Get event type (Quote or Inspection)
export function getEventTypeId(isInspection: boolean): number {
  return parseInt(isInspection ? INSPECTION_EVENT_TYPE : QUOTE_EVENT_TYPE);
}

// Reschedule a booking
export async function rescheduleCalBooking(
  bookingUid: string, 
  newStartTime: string, 
  isInspection: boolean = true
): Promise<CalBookingResponse> {
  const endTime = calculateEndTime(newStartTime, isInspection);
  
  const response = await fetch(`https://api.cal.com/v1/bookings/${bookingUid}/reschedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CAL_API_KEY}`
    },
    body: JSON.stringify({
      start: newStartTime,
      end: endTime
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cal.com reschedule error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

// Cancel a booking
export async function cancelCalBooking(bookingUid: string, reason?: string): Promise<void> {
  const response = await fetch(`https://api.cal.com/v1/bookings/${bookingUid}/cancel`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CAL_API_KEY}`
    },
    body: JSON.stringify({
      cancellationReason: reason || 'Cancelled by admin'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cal.com cancel error: ${JSON.stringify(error)}`);
  }
}

