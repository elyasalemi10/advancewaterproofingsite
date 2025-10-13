import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { getBookingByBookingId, updateBookingStatus, type Booking } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancelBooking() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [booking, setBooking] = useState<Booking | null>(null)
  const bookingId = searchParams.get('id')

  useEffect(() => {
    if (!bookingId) {
      setStatus('error')
      setMessage('Invalid booking ID')
      return
    }

    // Automatically cancel the booking
    handleCancelBooking()
  }, [bookingId])

  const handleCancelBooking = async () => {
    if (!bookingId) return

    try {
      setStatus('loading')
      
      // Get booking from Supabase
      const bookingData = await getBookingByBookingId(bookingId)
      
      if (!bookingData) {
        setStatus('error')
        setMessage('Booking not found. It may have been deleted or the ID is invalid.')
        return
      }

      setBooking(bookingData)

      // Check if already cancelled
      if (bookingData.status === 'cancelled') {
        setStatus('success')
        setMessage('This booking has already been cancelled.')
        return
      }

      // Update booking status to cancelled
      await updateBookingStatus(bookingId, 'cancelled')

      // TODO: Send cancellation email to client
      // This would require a separate serverless function

      setStatus('success')
      setMessage('Booking has been cancelled successfully. The client will be notified.')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      setStatus('error')
      setMessage('An error occurred while cancelling the booking. Please try again or contact support.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-orange-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl md:text-3xl">
            {status === 'loading' && 'Cancelling Booking...'}
            {status === 'success' && 'Booking Cancelled'}
            {status === 'error' && 'Cancellation Error'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            {message}
          </p>

          {status === 'success' && booking && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-orange-900 mb-3">📋 Cancelled Booking Details:</h3>
              <div className="space-y-2 text-orange-800 mb-4">
                <p><strong>Client:</strong> {booking.name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${booking.email}`} className="underline">{booking.email}</a></p>
                <p><strong>Phone:</strong> <a href={`tel:${booking.phone}`} className="underline">{booking.phone}</a></p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> {booking.time}</p>
              </div>
              <h3 className="font-semibold text-orange-900 mb-3">ℹ️ What happens next:</h3>
              <ul className="space-y-2 text-orange-800">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>The client will be notified of the cancellation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>You may want to contact the client directly to explain or reschedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>Contact: {booking.email} or {booking.phone}</span>
                </li>
              </ul>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-red-900 mb-3">Need help?</h3>
              <p className="text-red-800 mb-3">
                If you continue to experience issues, please:
              </p>
              <ul className="space-y-2 text-red-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Check your email for the original booking notification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Verify the booking ID is correct</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Contact the client directly</span>
                </li>
              </ul>
            </div>
          )}

          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              size="lg"
            >
              Return to Home
            </Button>
            {status === 'error' && (
              <Button
                onClick={handleCancelBooking}
                size="lg"
              >
                Try Again
              </Button>
            )}
          </div>

          <div className="text-sm text-muted-foreground pt-4 border-t">
            <p>Booking ID: <span className="font-mono font-semibold">{bookingId || 'N/A'}</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

