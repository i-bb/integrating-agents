import { useEffect } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import CircuitGrid from './components/CircuitGrid'
import Hero from './components/Hero'
import ProblemStatement from './components/ProblemStatement'
import Services from './components/Services'
import Approach from './components/Approach'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.8,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div className="grid-texture min-h-screen">
      <CircuitGrid />
      <Navbar />
      <main>
        <Hero />
        <div className="sep" />
        <ProblemStatement />
        <div className="sep" />
        <Services />
        <div className="sep" />
        <Approach />
        <div className="sep" />
        <FAQ />
        <div className="sep" />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
