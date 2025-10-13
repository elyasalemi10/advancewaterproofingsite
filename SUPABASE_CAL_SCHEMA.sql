-- Update bookings table for Cal.com integration

-- Add Cal.com specific columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cal_booking_uid TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cal_event_type_id INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS is_inspection BOOLEAN DEFAULT true;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS preferred_time TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_time TEXT;

-- Add index on Cal booking UID
CREATE INDEX IF NOT EXISTS idx_bookings_cal_uid ON bookings(cal_booking_uid);

-- Update the existing table (if needed)
COMMENT ON COLUMN bookings.cal_booking_uid IS 'Cal.com booking unique identifier';
COMMENT ON COLUMN bookings.cal_event_type_id IS 'Cal.com event type ID (3629145 for quotes, 3637831 for inspections)';
COMMENT ON COLUMN bookings.is_inspection IS 'true for 60min inspection, false for 10min quote';
COMMENT ON COLUMN bookings.preferred_time IS 'Customer preferred start time';
COMMENT ON COLUMN bookings.end_time IS 'Calculated end time based on duration';

