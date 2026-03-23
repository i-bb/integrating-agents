import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { LockScreenDemo } from '../ui/LockScreenDemo'

function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)')
    setIsLarge(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsLarge(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isLarge
}

interface HeroSectionProps {
  onContactClick: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

const stats = [
  { value: 'No commitment', label: 'to get started' },
  { value: 'No tech team', label: 'required — ever' },
  { value: 'Any industry', label: 'we work across all sectors' },
]

export function HeroSection({ onContactClick }: HeroSectionProps) {
  const reduced = useReducedMotion()
  const isLarge = useIsLargeScreen()

  const item = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  })

  return (
    <section
      className="relative grid-texture overflow-hidden hero-section"
      aria-labelledby="hero-heading"
    >
      <div className="hero-layout">
        {/* Content zone — left-aligned at large viewports */}
        <div className="hero-content-wrap">

          {/* Label */}
          <motion.p
            {...item(0.1)}
            className="hero-label"
          >
            AI implementation for growing businesses
          </motion.p>

          {/* Headline */}
          <h1 id="hero-heading" className="hero-hl">
            <motion.span {...item(0.2)} className="block">
              AI isn't only for
            </motion.span>
            <motion.span {...item(0.32)} className="block">
              tech companies.
            </motion.span>
            <motion.span
              {...item(0.44)}
              className="block hero-hl-accent"
            >
              It's for{' '}
              <span className="hero-underline-wrap">
                yours too.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: reduced ? 0 : 1.0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-hidden="true"
                  className="hero-underline-bar"
                />
              </span>
            </motion.span>
          </h1>

          {/* Body */}
          <motion.p {...item(0.56)} className="hero-body">
            Whether you haven't started yet or you've tried and got nowhere —
            Last Mile gets any business to real results from AI. No tech team.
            No jargon.
          </motion.p>

          {/* CTAs */}
          <motion.div {...item(0.68)} className="hero-ctas">
            <button
              onClick={onContactClick}
              className="btn-primary card-pop card-pop-hover"
            >
              Let's talk →
            </button>
            <a href="#services" className="btn-ghost">
              See how it works
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.88, ease }}
            className="hero-stats"
            aria-label="Key differentiators"
          >
            {stats.map(stat => (
              <div key={stat.value} className="hero-stat">
                <span className="hero-stat-value">{stat.value}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right zone — only mounted on large screens to avoid running animations on mobile */}
        {isLarge && (
          <div className="hero-right-zone" aria-hidden="true" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 'clamp(2rem, 4vh, 4rem)' }}>
            <LockScreenDemo />
          </div>
        )}
      </div>

      <div className="hero-rule" aria-hidden="true" />
    </section>
  )
}
