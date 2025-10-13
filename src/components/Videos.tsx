import { Play } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export default function Videos() {
  const videos = [
    {
      title: 'Selecting the right applicator',
      description: 'Precision techniques for lasting repairs and quality workmanship',
      thumbnail: '/trailer.webm',
      duration: '6:20',
      videoUrl: null
    },
    {
      title: 'Choosing the right waterproofer',
      description: 'Learn about our approach to selecting quality waterproofing solutions',
      thumbnail: '/leaking.webp',
      duration: '7:15',
      videoUrl: null
    },
    {
      title: 'Shower waterproofing',
      description: 'Watch our spray-applied liquid membrane system in action',
      thumbnail: '/maintenance-professional.webp',
      duration: '4:45',
      videoUrl: 'https://www.youtube.com/shorts/lLbgdzjiK0M'
    },
    {
      title: 'Bathroom Waterproofing systems',
      description: 'See how we solve challenging bathroom leaks with our proven methods',
      thumbnail: '/video-thumbnail-balcony.webp',
      duration: '5:30',
      videoUrl: 'https://www.youtube.com/shorts/DVqfjpyFfkQ'
    }
  ]

  return (
    <section id="videos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            Did you <span className="text-primary">know?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch our waterproofing processes and learn about our industry-leading techniques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <Card 
              key={index} 
              className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => video.videoUrl && window.open(video.videoUrl, '_blank')}
            >
              <div className="relative h-64 overflow-hidden">
                {video.thumbnail.endsWith('.webm') ? (
                  <video
                    src={video.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-muted-foreground">{video.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
