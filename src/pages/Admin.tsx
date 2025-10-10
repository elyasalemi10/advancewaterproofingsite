import { useEffect } from 'react'
import { MediaLibrary } from '@/components/MediaLibrary'
import { setSEO } from '@/lib/seo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield } from 'lucide-react'

export default function Admin() {
  useEffect(() => {
    setSEO({
      title: 'Admin Dashboard | Advance Waterproofing',
      description: 'Manage media uploads, bookings, and website content.',
    })
  }, [])

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your website content and media
            </p>
          </div>
        </div>

        <Tabs defaultValue="media" className="space-y-6">
          <TabsList>
            <TabsTrigger value="media">Media Library</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="media">
            <MediaLibrary />
          </TabsContent>

          <TabsContent value="bookings">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Booking management coming soon
              </p>
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Lead management coming soon
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Admin Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">📷 Media Library</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Drag and drop images/videos or click "Choose Files"</li>
                <li>Click any media item to edit title, alt text, caption, and tags</li>
                <li>Use alt text for SEO - describe the image clearly</li>
                <li>Add tags to organise media (e.g., "balcony", "rapidseal", "before-after")</li>
                <li>Copy URL to embed media on service pages</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📅 Booking Management</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Review tentative bookings submitted by clients</li>
                <li>Confirm or reschedule appointments as needed</li>
                <li>System will automatically send email confirmations</li>
                <li>Sync with Google Calendar for team coordination</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">💬 Chatbot Logs</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Review customer conversations and frequently asked questions</li>
                <li>Identify common inquiries to improve chatbot responses</li>
                <li>Follow up on leads who requested human contact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
