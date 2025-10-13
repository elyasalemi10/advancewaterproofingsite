import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, X } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export default function Videos() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null)
  const navigate = useNavigate()

  const videos = [
    {
      title: 'The hidden cost of shortcuts',
      description: 'Why your choice of waterproofing applicator is a multi-million dollar decision',
      thumbnail: '/thumbnailtrailer.png',
      videoFile: null,
      videoUrl: null,
      internalLink: '/shortcuts'
    },
    {
      title: 'Choosing the right waterproofer',
      description: 'Learn about our approach to selecting quality waterproofing solutions',
      thumbnail: '/thumbnailleak.png',
      videoFile: '/leaking.webm',
      videoUrl: null
    },
    {
      title: 'Shower waterproofing',
      description: 'Watch our spray-applied liquid membrane system in action',
      thumbnail: '/thumbnailshower.png',
      videoFile: null,
      videoUrl: 'https://www.youtube.com/shorts/lLbgdzjiK0M'
    },
    {
      title: 'Bathroom Waterproofing systems',
      description: 'See how we solve challenging bathroom leaks with our proven methods',
      thumbnail: '/thumbnailbathroom.png',
      videoFile: null,
      videoUrl: 'https://www.youtube.com/shorts/DVqfjpyFfkQ'
    }
  ]

  const handleVideoClick = (index: number) => {
    const video = videos[index]
    if (video.internalLink) {
      navigate(video.internalLink)
    } else if (video.videoUrl) {
      window.open(video.videoUrl, '_blank')
    } else if (video.videoFile) {
      setPlayingVideo(playingVideo === index ? null : index)
    }
  }

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
              onClick={() => handleVideoClick(index)}
            >
              <div className="relative h-64 overflow-hidden">
                {playingVideo === index && video.videoFile ? (
                  <div className="relative w-full h-full bg-black">
                    <video
                      src={video.videoFile}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      playsInline
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setPlayingVideo(null)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors z-10"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
