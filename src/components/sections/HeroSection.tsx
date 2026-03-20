import { motion, useReducedMotion } from 'framer-motion'

interface HeroSectionProps {
  onContactClick: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

const stats = [
  { value: 'No commitment', label: 'to get started' },
  { value: 'No tech team', label: 'required' },
  { value: 'Any industry', label: 'we work across all sectors' },
]

export function HeroSection({ onContactClick }: HeroSectionProps) {
  const reduced = useReducedMotion()

  const item = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <section
      className="relative grid-texture overflow-hidden"
      style={{ paddingTop: '64px' }}
      aria-labelledby="hero-heading"
    >
      {/* LM watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-[-0.02em] bottom-[-0.1em] font-black leading-none"
        style={{
          fontSize: 'clamp(10rem, 22vw, 22rem)',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          color: 'var(--color-navy)',
          opacity: 0.04,
        }}
      >
        LM
      </div>

      <div
        className="container relative z-10"
        style={{
          paddingTop: 'clamp(2.5rem, 8vh, 6rem)',
          paddingBottom: 'clamp(2.5rem, 8vh, 5rem)',
        }}
      >
        {/* Label */}
        <motion.p
          {...item(0.1)}
          className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5 md:mb-7"
          style={{ color: 'var(--color-navy)' }}
        >
          AI implementation for growing businesses
        </motion.p>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="display-xl mb-5 md:mb-7"
          style={{ color: 'var(--color-text)' }}
        >
          <motion.span {...item(0.2)} className="block">
            AI isn't only for
          </motion.span>
          <motion.span {...item(0.32)} className="block">
            tech companies.
          </motion.span>
          <motion.span {...item(0.44)} className="block mt-[0.12em]" style={{ color: 'var(--color-navy)' }}>
            It's for{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              yours too.
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '-0.28em',
                  width: '100%',
                  height: '0.07em',
                  background: 'var(--color-gold)',
                  borderRadius: '2px',
                  transformOrigin: 'left center',
                  display: 'block',
                }}
              />
            </span>
          </motion.span>
        </h1>

        {/* Body */}
        <motion.p
          {...item(0.56)}
          className="text-[15px] md:text-[17px] leading-[1.7] mb-8 md:mb-10"
          style={{ color: 'var(--color-text-secondary)', maxWidth: '62ch' }}
        >
          Whether you haven't started yet or you've tried and got nowhere — Last Mile gets any business to real results from AI. No tech team. No jargon.
        </motion.p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <motion.div {...item(0.68)} className="flex flex-wrap gap-4 items-center">
            <button
              onClick={onContactClick}
              className="flex items-center gap-2.5 px-6 py-3.5 text-[14px] font-bold tracking-wide card-pop card-pop-hover transition-all cursor-pointer"
              style={{ background: 'var(--color-navy)', color: 'var(--color-text-inverse)' }}
            >
              Find your last mile →
            </button>
            <a
              href="#services"
              className="text-[13px] font-semibold flex items-center gap-2 transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              See how it works
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease }}
            className="flex gap-6 md:gap-8"
            aria-label="Key results"
          >
            {stats.map(stat => (
              <div
                key={stat.value}
                className="flex flex-col pl-4"
                style={{ borderLeft: '2px solid var(--color-border-strong)' }}
              >
                <span
                  className="text-[0.9rem] md:text-[1rem] font-black leading-none tracking-[-0.02em] mb-1"
                  style={{ color: 'var(--color-navy)' }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.1em] leading-[1.4]"
                  style={{ color: 'var(--color-text-muted)', maxWidth: '14ch' }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'var(--color-border-strong)' }}
        aria-hidden="true"
      />
    </section>
  )
}
