import { AnimateIn, Stagger, StaggerItem } from '../ui/AnimateIn'
import { SectionLabel } from '../ui/SectionLabel'

const steps = [
  {
    number: '01',
    name: 'We listen first',
    description: 'No templates, no assumptions. We spend time understanding how your business actually works — where time gets lost, where money leaks out, where your team is most frustrated.',
    badge: 'The turning point',
    badgeLabel: 'one conversation away',
  },
  {
    number: '02',
    name: 'We show you the path',
    description: "We map your opportunities, rank them by real business impact, and lay out a specific, actionable plan. You'll know exactly what to do and what to expect before we build anything.",
    badge: 'Bespoke',
    badgeLabel: 'built around your business',
  },
  {
    number: '03',
    name: 'We build it with you',
    description: "We build alongside your team — not for them. That means the tools actually get used, your people understand them, and the results stick long after we're done.",
    badge: 'Ongoing',
    badgeLabel: 'we stay until it works',
  },
]

export function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="section-padding"
      style={{ background: 'var(--color-bg)' }}
      aria-labelledby="process-heading"
    >
      <div className="container">
        <div className="section-divider mb-16" aria-hidden="true" />

        <div className="mb-12 md:mb-16">
          <SectionLabel number="03" title="How it works" />
          <AnimateIn>
            <h2
              id="process-heading"
              className="display-lg max-w-xl"
              style={{ color: 'var(--color-text)' }}
            >
              Simple process.
              <br />
              <span style={{ color: 'var(--color-navy)' }}>No surprises.</span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p
              className="mt-5 text-[16px] leading-[1.7] max-w-md"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              We've done this enough to know that simplicity wins. Three steps, no surprises, built around your pace.
            </p>
          </AnimateIn>
        </div>

        <Stagger>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 relative">
            {/* Connecting line on desktop */}
            <div
              className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px pointer-events-none"
              style={{ background: 'var(--color-border-strong)' }}
              aria-hidden="true"
            />

            {steps.map((step, i) => (
              <StaggerItem key={step.number}>
                <div
                  className="relative p-6 md:p-8 border-b md:border-b-0 md:border-r last:border-r-0"
                  style={{ borderColor: 'var(--color-border-strong)' }}
                >
                  {/* Step number circle */}
                  <div
                    className="relative z-10 w-16 h-16 flex items-center justify-center mb-6 font-black text-[1.1rem] tracking-[-0.02em]"
                    style={{
                      background: 'var(--color-surface)',
                      border: '2px solid var(--color-border-strong)',
                      color: 'var(--color-navy)',
                    }}
                  >
                    {step.number}
                  </div>

                  <h3
                    className="text-[1.2rem] font-black tracking-[-0.025em] mb-3 leading-tight"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {step.name}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.65] mb-6"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {step.description}
                  </p>

                  {/* Badge */}
                  <div
                    className="inline-flex flex-col"
                    style={{
                      borderTop: `2px solid ${i === 0 ? 'var(--color-gold)' : i === 1 ? 'var(--color-navy)' : 'var(--color-terra)'}`,
                      paddingTop: '10px',
                    }}
                  >
                    <span
                      className="text-[1.1rem] font-black leading-none tracking-[-0.02em]"
                      style={{ color: i === 0 ? 'var(--color-gold)' : i === 1 ? 'var(--color-navy)' : 'var(--color-terra)' }}
                    >
                      {step.badge}
                    </span>
                    <span
                      className="text-[11px] uppercase tracking-[0.12em] mt-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {step.badgeLabel}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  )
}
