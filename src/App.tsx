import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { NavBar } from './components/sections/NavBar'
import { HeroSection } from './components/sections/HeroSection'
import { TrustStrip } from './components/sections/TrustStrip'
import { ProblemSection } from './components/sections/ProblemSection'
import { ServicesSection } from './components/sections/ServicesSection'
import { ProcessSection } from './components/sections/ProcessSection'
import { IndustriesSection } from './components/sections/IndustriesSection'
import { TestimonialSection } from './components/sections/TestimonialSection'
import { ContactSection } from './components/sections/ContactSection'
import { FooterSection } from './components/sections/FooterSection'

export default function App() {
  const contactRef = useRef<HTMLDivElement>(null)

  // Smooth scroll with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })

    let raf: number
    function animate(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  function scrollToContact() {
    const el = document.getElementById('contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Focus the first input after scroll
      setTimeout(() => {
        const first = el.querySelector('input, textarea') as HTMLElement | null
        first?.focus()
      }, 600)
    }
  }

  return (
    <div className="grid-texture">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
        style={{ background: 'var(--color-navy)', color: 'var(--color-text-inverse)' }}
      >
        Skip to main content
      </a>

      <NavBar onContactClick={scrollToContact} />

      <main id="main-content">
        <HeroSection onContactClick={scrollToContact} />
        <TrustStrip />
        <ProblemSection />
        <ServicesSection />
        <ProcessSection />
        <IndustriesSection />
        <TestimonialSection />
        <div ref={contactRef}>
          <ContactSection />
        </div>
      </main>

      <FooterSection />
    </div>
  )
}
