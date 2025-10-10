import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'

export default function Projects() {
  const projects = [
    {
      title: 'Educational Facilities',
      category: 'Schools',
      image: '/School.webp',
      description: 'Structural repairs, building upgrades, and rectification waterproofing services'
    },
    {
      title: 'Commercial Buildings',
      category: 'CBD & Industrial',
      image: '/expansion-joint-building.webp',
      description: 'Major projects including CBD rooftops and industrial infrastructure'
    },
    {
      title: 'Healthcare and Government',
      category: 'Health & Government',
      image: '/VicSchool.webp',
      description: 'Servicing commercial, industrial, and institutional properties'
    },
    {
      title: 'Residential Properties',
      category: 'Strata & Owners Corporation',
      image: '/project-commercial.webp',
      description: 'Troubleshooting water leaks for insurance companies and body corporates'
    },
    {
      title: 'Balcony Restoration',
      category: 'Residential',
      image: '/project-residential.webp',
      description: 'Complete balcony waterproofing and structural repairs'
    },
    {
      title: 'Basement Waterproofing',
      category: 'Commercial',
      image: '/roof-deck-system.webp',
      description: 'Below-ground tanking and foundation protection systems'
    }
  ]

  return (
    <section id="projects" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            Our <span className="text-primary">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Successful remediation projects across education, commercial, government, healthcare, and strata sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-4 right-4 bg-primary text-white">
                  {project.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Trusted by hundreds of clients across Melbourne and Victoria
          </p>
        </div>
      </div>
    </section>
  )
}
