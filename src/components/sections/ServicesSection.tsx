import { useState, useRef } from 'react'
import { AnimateIn, Stagger, StaggerItem } from '../ui/AnimateIn'
import { SectionLabel } from '../ui/SectionLabel'
import { motion, useScroll, useTransform } from 'framer-motion'

const services = [
  {
    number: '01',
    name: 'Figure out where to start',
    tagline: 'AI Readiness',
    description: 'Not sure which parts of your business AI can actually help? We spend time with your team, map how work gets done, and find exactly where time and money are leaking out. Then we tell you where to start — with a plan you can act on.',
    outcomes: [
      'A clear map of your biggest time and cost drains',
      'Ranked list of AI opportunities by impact',
      'An actionable plan — built around your business, not a template',
      'No generic frameworks, no guesswork',
    ],
    stat: null,
    statLabel: null,
  },
  {
    number: '02',
    name: 'Build what actually works',
    tagline: 'AI Build & Integration',
    description: 'You already have systems your business runs on. We build AI tools that connect directly to them — designed with your team, not just delivered to them. The result: tools people actually use, not tools that gather dust.',
    outcomes: [
      'Custom AI tools built inside your existing setup',
      'Co-built with the people who will use them',
      'Connected to your data, your workflow, your way',
      'Adopted by your team — not sitting unused',
    ],
    stat: null,
    statLabel: null,
  },
  {
    number: '03',
    name: 'Fix what already failed',
    tagline: 'AI Rescue & Optimization',
    description: "Already spent money on AI and it didn't deliver? You're not alone. We do an honest assessment of what went wrong, fix the things that are fixable, and recover the value you were promised.",
    outcomes: [
      "A straight-talk diagnosis of what's actually broken",
      'Fast fixes to what\'s dragging you down',
      'Full value from the tools you already own',
      'No blame — just a clear path forward',
    ],
    stat: null,
    statLabel: null,
  },
  {
    number: '04',
    name: 'Keep it running and improving',
    tagline: 'Ongoing AI Management',
    description: "Building AI is step one. But agents break, drift, and need tuning as your business changes. We manage, monitor, and iterate on everything we — or anyone else — has built, so you're never left holding a broken system.",
    outcomes: [
      'Ongoing monitoring so issues get caught before they cause problems',
      'Regular improvements as your needs evolve',
      'One point of contact — no vendor runaround',
      "Your AI keeps working even when you're not thinking about it",
    ],
    stat: null,
    statLabel: null,
  },
]

export function ServicesSection() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const numY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-padding"
      style={{ background: 'var(--color-surface-alt)' }}
      aria-labelledby="services-heading"
    >
      <div className="container">
        <div className="section-divider mb-16" aria-hidden="true" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-16 items-start mb-12">
          <div>
            <SectionLabel number="01" title="What we do" />
            <AnimateIn>
              <h2
                id="services-heading"
                className="display-lg"
                style={{ color: 'var(--color-text)' }}
              >
                Four ways we help.
                <br />
                <span style={{ color: 'var(--color-navy)' }}>One goal: results you can see.</span>
              </h2>
            </AnimateIn>
          </div>
          <AnimateIn delay={0.1}>
            <p
              className="text-[16px] leading-[1.7] max-w-xs lg:pt-16"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Most businesses need one or two of these. We'll tell you exactly which in our first conversation.
            </p>
          </AnimateIn>
        </div>

        {/* Service list — desktop: interactive rows */}
        <Stagger>
          <div className="flex flex-col gap-0">
            {services.map((s, i) => (
              <StaggerItem key={s.number}>
                <button
                  onClick={() => setActive(active === i ? -1 : i)}
                  className="w-full text-left transition-all duration-200 cursor-pointer group"
                  aria-expanded={active === i}
                  aria-controls={`service-${i}-detail`}
                  id={`service-${i}-btn`}
                >
                  {/* Row header */}
                  <div
                    className="relative flex items-start gap-6 md:gap-10 py-6 md:py-8 border-t overflow-hidden"
                    style={{
                      borderColor: 'var(--color-border-strong)',
                      background: active === i ? 'var(--color-surface)' : 'transparent',
                      transition: 'background 0.2s ease',
                      minHeight: 'clamp(6rem, 14vw, 12rem)',
                    }}
                  >
                    {/* Background number — parallax drift */}
                    <motion.span className="section-num-bg" style={{ y: numY }} aria-hidden="true">{s.number}</motion.span>

                    {/* Number + tagline */}
                    <div className="flex-shrink-0 w-28 md:w-36 pt-1">
                      <span
                        className="text-[11px] font-bold tracking-[0.18em] uppercase"
                        style={{ color: active === i ? 'var(--color-navy)' : 'var(--color-text-muted)' }}
                      >
                        {s.number}
                      </span>
                      <p
                        className="text-[11px] mt-1 tracking-[0.10em] uppercase font-semibold"
                        style={{ color: active === i ? 'var(--color-gold)' : 'var(--color-text-muted)', opacity: active === i ? 1 : 0.7 }}
                      >
                        {s.tagline}
                      </p>
                    </div>

                    {/* Service name */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="display-md pr-8"
                        style={{ color: active === i ? 'var(--color-navy)' : 'var(--color-text)' }}
                      >
                        {s.name}
                      </h3>
                    </div>

                    {/* Chevron */}
                    <div
                      className="flex-shrink-0 mt-2 transition-transform duration-300"
                      style={{
                        transform: active === i ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: active === i ? 'var(--color-navy)' : 'var(--color-text-muted)',
                      }}
                      aria-hidden="true"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <div
                    id={`service-${i}-detail`}
                    role="region"
                    aria-labelledby={`service-${i}-btn`}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: active === i ? '600px' : '0',
                      opacity: active === i ? 1 : 0,
                    }}
                  >
                    <div
                      className="px-0 pb-8 pt-2"
                      style={{ background: 'var(--color-surface)' }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-16 pl-28 md:pl-36 pr-4">
                        <div>
                          <p
                            className="text-[16px] leading-[1.7] mb-6"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {s.description}
                          </p>
                          {s.stat && (
                            <div
                              className="inline-flex flex-col items-start pt-4 border-t"
                              style={{ borderColor: 'var(--color-border)' }}
                            >
                              <span
                                className="text-[2rem] font-black leading-none tracking-[-0.03em]"
                                style={{ color: 'var(--color-navy)' }}
                              >
                                {s.stat}
                              </span>
                              <span
                                className="text-[11px] uppercase tracking-[0.12em] mt-1"
                                style={{ color: 'var(--color-text-muted)' }}
                              >
                                {s.statLabel}
                              </span>
                            </div>
                          )}
                        </div>
                        <ul className="flex flex-col gap-3" aria-label={`What's included in ${s.name}`}>
                          {s.outcomes.map((outcome) => (
                            <li key={outcome} className="flex items-start gap-3">
                              <svg
                                className="mt-0.5 flex-shrink-0"
                                width="16" height="16" viewBox="0 0 16 16" fill="none"
                                stroke="var(--color-gold)" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <polyline points="2 8 6 12 14 4"/>
                              </svg>
                              <span
                                className="text-[14px] leading-[1.55]"
                                style={{ color: 'var(--color-text)' }}
                              >
                                {outcome}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </button>
              </StaggerItem>
            ))}
            {/* Bottom border */}
            <div className="border-t" style={{ borderColor: 'var(--color-border-strong)' }} aria-hidden="true" />
          </div>
        </Stagger>
      </div>
    </section>
  )
}
