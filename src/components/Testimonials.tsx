import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'C. Ocley',
      location: 'East Melbourne VIC',
      service: 'Balcony Repairs & Refurbishments',
      rating: 5,
      text: 'Very helpful friendly team. Worked diligently and left the place nice and clean. Very willing to work with me to get the best solution.'
    },
    {
      name: 'R. Virgona',
      location: 'Hawthorn VIC',
      role: 'Manager/Director, Virgona Constructions',
      service: 'Liquid Rubber Application',
      rating: 5,
      text: 'Very professional in approach towards giving the right advice regarding different products and the best product to use for the given task. I would highly recommend Advance Waterproofing to anyone seeking quality work performed by a professional team.'
    },
    {
      name: 'J. Boer',
      location: 'Hastings VIC',
      role: 'Builder',
      service: 'Commercial Waterproofing',
      rating: 5,
      text: 'We are happy with the service provided and the team knew what they were doing. We won\'t hesitate to call you back on the next project for waterproofing.'
    },
    {
      name: 'D. Richard',
      location: 'Malvern VIC',
      service: 'Balcony Restoration',
      rating: 5,
      text: 'Can\'t recommend this company any more than just the best. Their attention to detail in getting the job done was second to none. So happy with my job.'
    },
    {
      name: 'J. Caruthers',
      location: 'Brighton VIC',
      service: 'Concrete Repairs & Crack Injection',
      rating: 5,
      text: 'Above all, we really valued your professionalism in explaining the solution choices to us, and the professionalism of your staff on-site. Very impressive. We\'d have no hesitation whatsoever in recommending you for work.'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real testimonials from real clients and our own waterproofing projects
          </p>
        </div>

        <div className="relative">
          <Card className="bg-white shadow-xl">
            <CardContent className="p-8 sm:p-12">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-primary fill-primary" />
                ))}
              </div>
              
              <p className="text-xl text-foreground mb-8 text-center italic leading-relaxed">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="text-center">
                <p className="font-bold text-lg text-secondary">
                  {testimonials[currentIndex].name}
                </p>
                {testimonials[currentIndex].role && (
                  <p className="text-muted-foreground text-sm mb-1">
                    {testimonials[currentIndex].role}
                  </p>
                )}
                <p className="text-muted-foreground text-sm">
                  {testimonials[currentIndex].location}
                </p>
                <p className="text-primary text-sm mt-2">
                  {testimonials[currentIndex].service}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            These testimonials and images are from real clients and our own waterproofing projects
          </p>
        </div>
      </div>
    </section>
  )
}
