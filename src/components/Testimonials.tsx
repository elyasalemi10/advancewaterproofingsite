export default function Testimonials() {
  const clients = [
    { name: 'Ashburton Swimming', logo: '/clients/Ashburton Swimming.webp' },
    { name: 'KK Horizontal', logo: '/clients/KKHorizontal.webp' },
    { name: 'Kambrya', logo: '/clients/Kambrya.webp' },
    { name: 'Marina Radiology', logo: '/clients/MarinaRadiology.webp' },
    { name: 'NWSCP', logo: '/clients/NWSCP-12.webp' },
    { name: 'OCX', logo: '/clients/OCX.webp' },
    { name: 'Orora', logo: '/clients/Orora.webp' },
    { name: 'Preston High School', logo: '/clients/PrestonHS.webp' },
    { name: 'SOCM', logo: '/clients/SOCM.webp' },
    { name: 'Storage King', logo: '/clients/StorageKing.webp' },
    { name: 'Kids Academy', logo: '/clients/kidsacademy.webp' }
  ]

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            Past <span className="text-primary">Clients</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by leading organisations across Melbourne and Victoria
          </p>
        </div>

        {/* Infinite Scrolling Carousel */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling Container */}
          <div className="flex overflow-hidden">
            <div className="flex animate-scroll gap-16 py-8">
              {/* First set of logos */}
              {clients.map((client, idx) => (
                <div
                  key={`client-1-${idx}`}
                  className="flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110"
                  style={{ width: '180px', height: '90px' }}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-md"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {clients.map((client, idx) => (
                <div
                  key={`client-2-${idx}`}
                  className="flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110"
                  style={{ width: '180px', height: '90px' }}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-md"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
