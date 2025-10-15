import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { setSEO } from '@/lib/seo'

export default function NotFound() {
  useEffect(() => {
    setSEO({ title: 'Page Not Found | Advance Waterproofing', description: 'The page you are looking for does not exist.' })
  }, [])

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">Sorry, we couldn't find that page.</p>
        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
}


