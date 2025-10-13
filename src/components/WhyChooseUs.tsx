import { Shield, Users, Award, CheckCircle } from 'lucide-react'

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Shield,
      title: 'Decades of Expertise',
      description: '30+ years of experience in the building industry with proven waterproofing solutions'
    },
    {
      icon: Users,
      title: 'Personalised Service',
      description: 'Family-run business approach ensuring dedicated attention to every project'
    },
    {
      icon: Award,
      title: 'Certified Excellence',
      description: 'VBA-Registered Building Practitioner with all relevant certifications and insurance'
    },
    {
      icon: CheckCircle,
      title: 'Reliable Solutions',
      description: 'We stand by our work with guaranteed permanent solutions to water ingress problems'
    }
  ]

  return (
    <section className="py-20 bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
            Why Choose <span className="text-white">Us</span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            A waterproofing company that thinks construction. Solving challenging water leaks permanently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
                <p className="text-white/70">{reason.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <p className="text-2xl font-serif mb-4">
              "We specialise in predominantly commercial waterproofing rectification providing permanent solutions tailored to meet the specific challenges of water ingress."
            </p>
            <p className="text-white/70">Advance Waterproofing and Caulking Solution</p>
          </div>
        </div>
      </div>
    </section>
  )
}
