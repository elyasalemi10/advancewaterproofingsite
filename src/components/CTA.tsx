import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary text-white rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold">Protect Your Property Today</h3>
            <p className="text-white/90 mt-2">Free inspections • Tailored proposals • up to 15 years: subject to terms and conditions</p>
          </div>
          <div className="flex gap-3">
            <a href="tel:+61390017788">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">Call 03 9001 7788</Button>
            </a>
            <a href="/#contact">
              <Button className="bg-secondary hover:bg-secondary/90 text-white">Get My Free Quote</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
