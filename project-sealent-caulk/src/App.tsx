import { useEffect, useRef } from 'react'
import { Card } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { AlertCircle, Zap, Sun, FlaskConical, Ruler, Wrench, CheckCircle } from 'lucide-react'

function App() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    const cards = cardsRef.current?.querySelectorAll('.failure-card')
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Hero Section */}
        <section className="mb-20 space-y-6">
          <Badge variant="secondary" className="uppercase tracking-wider text-xs font-semibold">
            Joint sealing · Field guide
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl">
            What could go wrong when you apply the <span className="text-primary">wrong</span> sealant?
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            A quick, one-page explainer of the most common failures—how they happen, what they look like, 
            and how to prevent them with correct product selection, joint design, and prep.
          </p>
        </section>

        {/* Failure Cards Grid */}
        <section id="risks" className="mb-20" ref={cardsRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Loss of Adhesion */}
            <Card className="failure-card p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:border-destructive/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold flex-1">Loss of adhesion → water & air ingress</h3>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Using a sealant incompatible with the substrate leads to poor bonding and gaps that let water, 
                air, or chemicals penetrate. Expect leaks, corrosion, mold, and accelerated deterioration.
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span><strong className="text-foreground">Typical cause:</strong> silicone on porous concrete, or poor surface prep.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span><strong className="text-foreground">Mitigate:</strong> substrate-appropriate primer/activator and clean, sound flanks.</span>
                </li>
              </ul>
            </Card>

            {/* Cracking & Cohesive Failure */}
            <Card className="failure-card p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:border-destructive/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold flex-1">Cracking & cohesive failure under movement</h3>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Wrong modulus or low movement class can't accommodate thermal, structural, or vibration-induced 
                movement. The bead tears within itself or splits away at the edges.
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Match movement class (±12.5/25/50/100) to expected joint movement.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Avoid three-sided adhesion—use a backer rod.</span>
                </li>
              </ul>
            </Card>

            {/* UV, Heat & Chemical */}
            <Card className="failure-card p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                  <Sun className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold flex-1">UV, heat, & chemical incompatibility</h3>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Sealants not rated for UV, heat, or chemical exposure may discolor, chalk, harden, or lose 
                elasticity—especially on façades, pools, fuel bunds, or treatment plants.
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Specify by exposure: UV stability, temperature range, chemical resistance.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>For immersion, primer and correct technology are mandatory.</span>
                </li>
              </ul>
            </Card>

            {/* Material Incompatibility */}
            <Card className="failure-card p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold flex-1">Incompatibility with adjacent materials</h3>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Mixing chemistries (e.g., silicone with PU or acrylic) can soften the interface, bleed oils, 
                or lose adhesion. Gaskets, coatings, and membranes can also react.
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Maintain technology continuity on renewals (PU→PU, silicone→silicone).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Check compatibility with stones, glazing, coatings, gaskets.</span>
                </li>
              </ul>
            </Card>

            {/* Wrong Joint Design */}
            <Card className="failure-card p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Ruler className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold flex-1">Wrong joint design or dimensions</h3>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Incorrect width-to-depth ratios and missing backer rods concentrate stress and cut movement 
                capacity, causing early cracking and edge failure.
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Target ratios: façades ≈ 2:1 (W:D), floors ≈ 1:0.8.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Recess traffic joints; keep pedestrian joints flush.</span>
                </li>
              </ul>
            </Card>

            {/* Workmanship */}
            <Card className="failure-card p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold flex-1">Workmanship & application errors</h3>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Dirty, weak, or damp substrates; damaged closed-cell rod; or application in poor conditions 
                causes bubbles, voids, or poor cure—shortening service life.
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Prep: grind/clean, dust-free flanks; correct rod size (20–30% oversize).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Apply, tool, and remove tape before skin forms for clean lines.</span>
                </li>
              </ul>
            </Card>

          </div>
        </section>

        {/* Best Practice Tips */}
        <section id="tips" className="mb-16">
          <Card className="p-8 backdrop-blur-sm bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Best-practice shortcuts</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/80 hover:bg-card transition-colors">
                Match sealant chemistry to substrate & exposure
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/80 hover:bg-card transition-colors">
                Pick movement class to actual joint movement
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/80 hover:bg-card transition-colors">
                Use primer/activator as per substrate—not just brand
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/80 hover:bg-card transition-colors">
                Always install a backer rod to prevent 3-sided adhesion
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/80 hover:bg-card transition-colors">
                Design traffic joints recessed; keep pedestrian joints flush
              </Badge>
            </div>
          </Card>
        </section>

      </div>
    </div>
  )
}

export default App