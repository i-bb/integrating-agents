import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { AnimatedGridPattern } from './components/ui/AnimatedGridPattern'
import { NavBar } from './components/sections/NavBar'
import { HeroSection } from './components/sections/HeroSection'
import { TrustStrip } from './components/sections/TrustStrip'
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
      <AnimatedGridPattern
        width={48}
        height={48}
        numSquares={120}
        maxOpacity={0.028}
        duration={4}
        repeatDelay={1.5}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          color: 'oklch(35% 0.12 250)',
          stroke: 'oklch(0% 0 0 / 0.025)',
        }}
      />
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
