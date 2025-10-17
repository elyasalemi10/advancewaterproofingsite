import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export default function Videos() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const slideshowMedia = [
    { type: 'image', src: '/slideshow/defect.jpeg' },
    { type: 'image', src: '/slideshow/defect2.jpeg' },
    { type: 'image', src: '/slideshow/defect3.jpeg' },
    { type: 'image', src: '/slideshow/defect4.jpeg' },
    { type: 'image', src: '/slideshow/defect5.jpeg' },
    { type: 'image', src: '/slideshow/defect6.jpeg' },
    { type: 'video', src: '/slideshow/leaking.webm' }
  ]

  // Faster slideshow advance
  useEffect(() => {
    const id = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slideshowMedia.length), 2500)
    return () => clearInterval(id)
  }, [slideshowMedia.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshowMedia.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshowMedia.length) % slideshowMedia.length)
  }

  const videos = [
    {
      title: 'The hidden cost of shortcuts',
      description: 'Why your choice of waterproofing applicator is a multi-million dollar decision',
      thumbnail: '/videothumbnail.png',
      videoFile: null,
      videoUrl: null,
      internalLink: '/shortcuts'
    },
    {
      title: 'What happens when you choose a cheap applicator',
      description: 'See the real consequences of cutting corners on waterproofing expertise',
      thumbnail: '/thumbnailleak.png',
      videoFile: null,
      videoUrl: null,
      internalLink: null,
      isSlideshow: true
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
    if (video.isSlideshow) {
      // Slideshow is always visible, do nothing on click
      return
    }
    if (video.internalLink) {
      navigate(video.internalLink)
    } else if (video.videoUrl) {
      window.open(video.videoUrl, '_blank')
    } else if (video.videoFile) {
      setPlayingVideo(playingVideo === index ? null : index)
    }
  }

  return (
    <section id="videos" className="py-20 bg-background scroll-mt-48">
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
              className={`overflow-hidden group transition-all duration-300 ${video.isSlideshow ? '' : 'cursor-pointer hover:shadow-xl'}`}
              onClick={() => handleVideoClick(index)}
            >
              <div className={`relative ${index === 0 ? 'h-80' : 'h-64'} overflow-hidden`} style={{ backgroundColor: '#005082' }}>
                {video.isSlideshow ? (
                  <div className="relative w-full h-full" style={{ backgroundColor: '#005082' }}>
                    {slideshowMedia[currentSlide].type === 'video' ? (
                      <video
                        key={currentSlide}
                        src={slideshowMedia[currentSlide].src}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={slideshowMedia[currentSlide].src}
                        alt={`Waterproofing defect ${currentSlide + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevSlide()
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors z-10"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextSlide()
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors z-10"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {slideshowMedia.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentSlide(idx)
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentSlide ? 'bg-primary w-8' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : playingVideo === index && video.videoFile ? (
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
                        className={`w-full h-full ${index === 0 ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className={`w-full h-full ${index === 0 ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
                      />
                    )}
                    
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
