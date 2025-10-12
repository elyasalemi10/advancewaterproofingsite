import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { sendAcceptanceEmails } from '@/lib/resendService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AcceptBooking() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const bookingId = searchParams.get('id')

  useEffect(() => {
    if (!bookingId) {
      setStatus('error')
      setMessage('Invalid booking ID')
      return
    }

    // Automatically accept the booking
    handleAcceptBooking()
  }, [bookingId])

  const handleAcceptBooking = async () => {
    if (!bookingId) return

    try {
      setStatus('loading')
      const success = await sendAcceptanceEmails(bookingId)

      if (success) {
        setStatus('success')
        setMessage('Booking has been confirmed! Confirmation emails have been sent to both you and the client.')
      } else {
        setStatus('error')
        setMessage('Unable to process this booking. It may have already been confirmed or the booking ID is invalid.')
      }
    } catch (error) {
      console.error('Error accepting booking:', error)
      setStatus('error')
      setMessage('An error occurred while processing the booking. Please try again or contact support.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl md:text-3xl">
            {status === 'loading' && 'Processing Booking...'}
            {status === 'success' && 'Booking Confirmed!'}
            {status === 'error' && 'Booking Error'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            {message}
          </p>

          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-green-900 mb-3">✅ What happens next:</h3>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>The client has received a confirmation email with all booking details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>You've received a confirmation copy for your records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Add the appointment to your calendar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Prepare any necessary equipment for the inspection</span>
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
                  <span>Contact the client directly to confirm</span>
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
                onClick={handleAcceptBooking}
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



