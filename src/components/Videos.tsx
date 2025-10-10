import { Play } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export default function Videos() {
  const videos = [
    {
      title: 'Balcony Waterproofing Process',
      description: 'See how we solve challenging balcony leaks with our proven methods',
      thumbnail: '/video-thumbnail-balcony.webp',
      duration: '5:30'
    },
    {
      title: 'Basement Waterproofing Best Practices',
      description: 'Learn about our approach to basement and retaining wall waterproofing',
      thumbnail: '/video-thumbnail-caulking.webp',
      duration: '7:15'
    },
    {
      title: 'Liquid Rubber Application',
      description: 'Watch our spray-applied liquid membrane system in action',
      thumbnail: '/maintenance-professional.webp',
      duration: '4:45'
    },
    {
      title: 'Concrete Crack Injection',
      description: 'Precision crack injection techniques for lasting repairs',
      thumbnail: '/expansion-joint-work.webp',
      duration: '6:20'
    }
  ]

  return (
    <section id="videos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            See How We <span className="text-primary">Work</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch our waterproofing processes and learn about our industry-leading techniques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
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
