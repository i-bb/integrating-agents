import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-grid mask-radial opacity-30" />
      <div className="orb w-[500px] h-[500px] bg-[var(--color-accent)] opacity-[0.06] top-[20%] left-[55%]" style={{ animationDelay: '0s' }} />
      <div className="orb w-[400px] h-[400px] bg-[var(--color-secondary)] opacity-[0.04] top-[60%] left-[25%]" style={{ animationDelay: '-7s' }} />
      <div className="orb w-[350px] h-[350px] bg-[var(--color-tertiary)] opacity-[0.035] top-[30%] left-[15%]" style={{ animationDelay: '-13s' }} />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-20 pb-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[3rem] sm:text-[4rem] md:text-[5rem] leading-[1.02] tracking-[-0.025em] text-[var(--color-text)]"
        >
          Your enterprise runs on people.{' '}
          <em className="text-[var(--color-tertiary)]">We make them superhuman.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-[15px] sm:text-base text-[var(--color-text-secondary)] max-w-md mx-auto leading-[1.7]"
        >
          AI strategy, transformation, and engineering, deployed at startup speed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a href="#contact" className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] hover:-translate-y-px transition-all">
            Get in touch
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </a>
          <a href="#services" className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-border-highlight)] hover:bg-[var(--color-surface-elevated)] hover:-translate-y-px transition-all">
            How we work
          </a>
        </motion.div>
      </div>
    </section>
  )
}
