import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary text-white rounded-xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold">Protect Your Property Today</h3>
            <p className="text-white/90 mt-2 text-sm sm:text-base">Free inspections • Tailored proposals • up to 15 years: subject to terms and conditions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
            <a href="tel:+61390017788" className="w-full sm:w-auto">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto text-sm sm:text-base whitespace-nowrap">Call 03 9001 7788</Button>
            </a>
            <a href="/#contact" className="w-full sm:w-auto">
              <Button className="bg-secondary hover:bg-secondary/90 text-white w-full sm:w-auto text-sm sm:text-base">Get My Free Quote</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
