import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ClipboardCheck, TrendingDown, Shield, CheckCircle2, Building } from 'lucide-react'
import { setSEO } from '@/lib/seo'
import CTA from '@/components/CTA'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MaintenancePlans() {
  useEffect(() => {
    setSEO({
      title: 'Preventative Maintenance Plans | Critical Asset Protection',
      description: 'Stop reacting and start protecting. Proactive waterproofing plans for strata and commercial assets that ensure compliance, preserve warranties and secure long-term value.',
    })
  }, [])

  return (
    <main className="pt-28">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-sm tracking-widest font-semibold text-primary mb-2">ADVANCE</div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight text-secondary">Critical Asset Protection</h1>
            <p className="text-2xl font-semibold mt-2">Stop Reacting, Start Protecting</p>
            <p className="text-lg text-muted-foreground mt-4">Transition from costly crisis management to predictable preventative maintenance. Protect your commercial and strata assets with customized waterproofing plans that ensure compliance, preserve warranties, and secure long-term value.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/#contact"><Button>Schedule Assessment</Button></Link>
              <Link to="/#contact"><Button variant="outline">View Plans</Button></Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border">
            <div className="grid sm:grid-cols-2 gap-4">
              {[{t:'Water damage is the #1 reported defect across Australian commercial properties'},{t:'Deferred maintenance costs can balloon by over 181%'},{t:'Average repair bills exceed $11,000 (excluding secondary damage)'},{t:'Hidden leaks can cause thousands in damage before visible signs appear'}].map((x,i)=> (
                <div key={i} className="p-4 rounded-lg border bg-muted/30 text-sm">{x.t}</div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full border bg-white">Compliance with AS 3740 & NCC Standards</span>
              <span className="px-3 py-1 rounded-full border bg-white">Warranty Preservation Guaranteed</span>
              <span className="px-3 py-1 rounded-full border bg-white">70–80% Proactive Maintenance Target</span>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Cost */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">The Critical Cost of Deferred Maintenance</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10">For Strata Managers and Asset Owners, neglecting waterproofing transforms minor vulnerabilities into catastrophic financial and structural liabilities.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-red-600 mb-2">181%</div><p className="text-sm text-muted-foreground">Cost Escalation — deferred maintenance can cause repair costs to balloon by over 181%.</p></CardContent></Card>
            <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-orange-600 mb-2">$11,000+</div><p className="text-sm text-muted-foreground">Average Repair Bill — typical water damage repairs exceed $11,000.</p></CardContent></Card>
            <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-primary mb-2">#1</div><p className="text-sm text-muted-foreground">Reported Defect — water damage routinely tops VBA defect reports.</p></CardContent></Card>
          </div>
        </div>
      </section>

      {/* Failure Points & Health */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">Common Failure Points</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold">Flat Roofs & Podium Slabs</div>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Poor perimeter detailing and inadequate drainage systems</li>
                  <li>Water ponding accelerates membrane degradation</li>
                  <li>Failure points around HVAC units and pipework penetrations</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold">Balconies & Wet Areas</div>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>VBA high‑priority research due to failure frequency</li>
                  <li>Inadequate design, poor substrate prep and drainage issues</li>
                  <li>Wall‑floor junctions must comply with AS 3740</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold">External Junctions</div>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Complex failures where different materials meet</li>
                  <li>Flashing interfaces with external claddings</li>
                  <li>Roof line transitions and parapet wall connections</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Health & Structural Threats</h3>
            <ul className="list-disc ml-5 space-y-2 text-sm">
              <li>Mould growth in concealed cavities causes respiratory issues</li>
              <li>Concrete cancer from steel reinforcement corrosion</li>
              <li>Threatens long‑term safety and structural capacity</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Expertise & Compliance */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Foundation of Expertise & Compliance</h3>
            <p className="text-sm text-muted-foreground mb-4">Advanced diagnostic technology and regulatory compliance form the backbone of our proactive maintenance methodology.</p>
            <div className="space-y-3 text-sm">
              <div><span className="font-semibold">Expert Diagnostic Protocols:</span> Assessments adhere to NCC and AS 3740 / AS 4654.1/4654.2.</div>
              <div><span className="font-semibold">Moisture Mapping & Thermal Imaging:</span> Identify hidden ingress pathways before visible leaks.</div>
              <div><span className="font-semibold">Covermeter Surveys:</span> Assess reinforcement depth to predict concrete spalling risk.</div>
              <div><span className="font-semibold">Detailed Reporting:</span> Findings, recommendations, high‑res photos and video evidence.</div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Proactive Remedial Interventions</h3>
            <ul className="list-disc ml-5 space-y-2 text-sm">
              <li><span className="font-semibold">Drainage Management:</span> Regular inspection and clearing of drainage. Ponding voids warranties.</li>
              <li><span className="font-semibold">Sealant & Joint Reapplication:</span> Maintain watertight, flexible junctions.</li>
              <li><span className="font-semibold">Targeted Crack Injection:</span> PU for non‑structural sealing; epoxy where reinforcement requires strength.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Value & Warranty */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">Investment in Property Value</h3>
            <p className="text-sm text-muted-foreground">A professionally documented maintenance plan improves buyer confidence, reduces due diligence red flags, and boosts resale value—an advantage over properties with undisclosed damp issues.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Warranty Integrity & Financial Risk Mitigation</h3>
            <ul className="list-disc ml-5 space-y-2 text-sm">
              <li><span className="font-semibold">Safeguarding Guarantees:</span> Statutory builder, manufacturer and contractor warranties may be voided by neglect. Our inspections prove due diligence.</li>
              <li><span className="font-semibold">Overburden Coverage:</span> Premium plans include coverage for removing/replacing tiles, pavers, decking to access membranes.</li>
              <li><span className="font-semibold">Budget Certainty:</span> 70–80% proactive maintenance vs. 20–30% emergency reactive repairs.</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Good Governance & Fiduciary Responsibility</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-1">Insurance Scrutiny</div>
                <p className="text-muted-foreground">Insurers increasingly exclude coverage for gradual damage from neglect. A consistent maintenance history mitigates denied claims and demonstrates sound governance.</p>
              </div>
              <div>
                <div className="font-semibold mb-1">Auditable Documentation</div>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Compliance logs for AS/NCC standards</li>
                  <li>Detailed photographic and diagnostic evidence</li>
                  <li>Maintenance logs for all remedial actions</li>
                  <li>Future budget forecasting by material lifecycle</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Customised Protection: Maintenance Service Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle>Standard</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="text-muted-foreground">Essential Protection</div>
                <div className="font-semibold mt-2">Best Suited For</div>
                <div>Smaller Commercial Assets, New Builds</div>
                <div className="font-semibold mt-2">Biennial Inspections</div>
                <div>Every 24 months</div>
                <div className="font-semibold mt-2">Visual Assessment</div>
                <div>Compliance‑focused defect identification</div>
                <div className="font-semibold mt-2">Basic Reporting</div>
                <div>Standard condition report</div>
                <div className="font-semibold mt-2">Priority Diagnosis</div>
                <div>Remedial work quoted separately</div>
                <div className="font-semibold mt-2">6‑Year Guarantee</div>
                <div>Standard workmanship warranty</div>
                <Link to="/#contact"><Button className="mt-3 w-full">Book Initial Assessment</Button></Link>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardHeader><CardTitle>Gold <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Most Popular</span></CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="text-muted-foreground">Comprehensive Management</div>
                <div className="font-semibold mt-2">Best Suited For</div>
                <div>Mid‑Sized Strata, High‑Use Commercial, Older Assets</div>
                <div className="font-semibold mt-2">Annual Inspections</div>
                <div>Every 12 months</div>
                <div className="font-semibold mt-2">Advanced Diagnostics</div>
                <div>Moisture metering & thermal imaging</div>
                <div className="font-semibold mt-2">Detailed Reporting</div>
                <div>Assessment report & compliance log</div>
                <div className="font-semibold mt-2">Minor Repairs Included</div>
                <div>Sealant reapplication & drainage clearing</div>
                <div className="font-semibold mt-2">Extended Warranty</div>
                <div>Workmanship & compliance guarantee</div>
                <div className="font-semibold mt-2">Fast‑Track Response</div>
                <div>Guaranteed priority service</div>
                <Link to="/#contact"><Button className="mt-3 w-full" variant="outline">Request Custom Quote</Button></Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Platinum</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="text-muted-foreground">Predictive Asset Management</div>
                <div className="font-semibold mt-2">Best Suited For</div>
                <div>Large‑Scale Strata, Government Assets, Critical Infrastructure</div>
                <div className="font-semibold mt-2">Bi‑Annual Inspections</div>
                <div>Every 6 months</div>
                <div className="font-semibold mt-2">Full Diagnostic Suite</div>
                <div>Moisture mapping, covermeter surveys, specialist access</div>
                <div className="font-semibold mt-2">Predictive Reporting</div>
                <div>Comprehensive reports & budget forecasts</div>
                <div className="font-semibold mt-2">Repair Credit Included</div>
                <div>Annual credit & crack injection</div>
                <div className="font-semibold mt-2">Premium Warranty</div>
                <div>Includes labour & overburden coverage</div>
                <div className="font-semibold mt-2">24/7 Rapid Response</div>
                <div>Dedicated emergency escalation</div>
                <Link to="/#contact"><Button className="mt-3 w-full">Consult Asset Team</Button></Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to select */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold mb-2">Evaluate Asset Age</h3>
            <p className="text-sm text-muted-foreground">Older properties or those with ingress history require Gold or Platinum tiers for increased inspection frequency.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Assess Failure Consequences</h3>
            <p className="text-sm text-muted-foreground">Critical assets needing rapid response and minimal disruption benefit from Platinum bi‑annual checks.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Align Budget Goals</h3>
            <p className="text-sm text-muted-foreground">Higher tiers enable 70–80% proactive maintenance, avoiding costly emergency levies.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Protect Your Building Today</h2>
          <p className="text-muted-foreground mb-6">Hidden leaks can cause thousands of dollars in damage before visible signs appear. Take immediate action to secure your asset's future.</p>
          <div className="flex justify-center gap-3">
            <Link to="/#contact"><Button>Schedule Expert Condition Assessment</Button></Link>
            <Link to="/#contact"><Button variant="outline">Request Detailed Proposal</Button></Link>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
