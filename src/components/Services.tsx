import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const services = [
  {
    tab: 'Strategy',
    tagline: 'Clarity before code',
    title: 'AI Strategy',
    body: 'Holistic audits that surface the highest-impact AI use cases, quantify ROI, and deliver an execution-ready roadmap.',
    bullets: [
      'Function-specific assessments across every department',
      'Prioritized use cases ranked by business impact',
      'Implementation roadmap your team can run with, or hand back to us',
    ],
  },
  {
    tab: 'Transformation',
    tagline: 'Product. Process. People.',
    title: 'AI Transformation',
    body: 'End-to-end implementation across product, process, and people. Baseline metrics from day one.',
    bullets: [
      'Custom AI tooling and workflow automation',
      'Change management and team upskilling',
      'Measurable ROI tracked continuously',
    ],
  },
  {
    tab: 'Engineering',
    tagline: 'Ship faster. Pay for output.',
    title: 'AI Engineering',
    body: 'Elite engineering squads that ship production-grade software using AI-accelerated workflows. Pay for output, not hours.',
    bullets: [
      'Dedicated pods with technical PM and engineers',
      'Sprint-based delivery with outcome-based pricing',
      'Seamless integration into your existing stack and tools',
    ],
  },
]

export default function Services() {
  const [active, setActive] = useState(0)

  return (
    <section id="services" className="section">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-3">Services</p>
          <h2 className="font-display text-2xl sm:text-3xl tracking-[-0.01em] text-[var(--color-text)]">
            Three pillars. <em>One mission.</em>
          </h2>
          <p className="mt-3 text-[13px] text-[var(--color-text-secondary)] max-w-md leading-[1.7]">
            Whether you need a roadmap, a full transformation, or an engineering team, we meet you where you are.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-8 inline-flex border border-[var(--color-border)] p-0.5 bg-[var(--color-surface)]">
          {services.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-4 py-1.5 text-[12px] font-medium transition-all cursor-pointer ${
                active === i
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)]'
              }`}
            >
              {s.tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="card p-6 sm:p-8"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-secondary)] mb-1.5">
                {services[active].tagline}
              </p>
              <h3 className="font-display text-xl text-[var(--color-text)] mb-3 tracking-[-0.01em]">
                {services[active].title}
              </h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] mb-5 max-w-xl">
                {services[active].body}
              </p>
              <ul className="space-y-2">
                {services[active].bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--color-text)]">
                    <svg className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 text-[var(--color-secondary)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 8 6 12 14 4"/></svg>
                    <span className="leading-[1.6]">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
                <a href="#contact" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-tertiary)] hover:text-[var(--color-tertiary-hover)] transition-colors group">
                  Get started with {services[active].title}
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
