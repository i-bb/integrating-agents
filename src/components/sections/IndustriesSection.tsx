import { AnimateIn, Stagger, StaggerItem } from '../ui/AnimateIn'
import { SectionLabel } from '../ui/SectionLabel'

const industries = [
  { name: 'Healthcare & Dental', description: 'Automate scheduling, billing, patient follow-ups, and insurance paperwork.' },
  { name: 'Retail & E-commerce', description: 'Smarter inventory, faster customer support, automated reordering.' },
  { name: 'Restaurants & Hospitality', description: 'Streamline reservations, staff scheduling, supplier orders, and reviews.' },
  { name: 'Professional Services', description: 'Automate client onboarding, proposals, invoicing, and follow-ups.' },
  { name: 'Real Estate', description: 'AI-powered listings, lead follow-up, document prep, and market analysis.' },
  { name: 'Finance & Accounting', description: 'Automated reporting, reconciliation, client communication, and compliance.' },
  { name: 'Construction & Trades', description: 'Simplify quoting, scheduling, subcontractor comms, and job tracking.' },
  { name: 'Legal & Compliance', description: 'Draft documents, review contracts, manage deadlines, and client intake.' },
  { name: 'Education & Training', description: 'Personalized content, automated grading, scheduling, and enrollment.' },
  { name: 'Insurance', description: 'Claims processing, client communication, policy management, and renewals.' },
  { name: 'Manufacturing', description: 'Predictive maintenance, quality control, supply chain optimization.' },
  { name: 'Marketing & Social Media', description: 'Automated content workflows, social scheduling, campaign reporting, and audience analysis.' },
  { name: 'Any other industry', description: 'If your business runs on people and processes, we can almost certainly help.' },
]

export function IndustriesSection() {
  return (
    <section
      id="industries"
      className="section-padding"
      style={{ background: 'var(--color-surface-alt)' }}
      aria-labelledby="industries-heading"
    >
      <div className="container">
        <div className="section-divider mb-16" aria-hidden="true" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <SectionLabel number="04" title="Who we work with" />
            <AnimateIn>
              <h2
                id="industries-heading"
                className="display-lg"
                style={{ color: 'var(--color-text)' }}
              >
                If your business runs on people,{' '}
                <span style={{ color: 'var(--color-navy)' }}>AI can help.</span>
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <p
                className="mt-5 text-[16px] leading-[1.7]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                We don't specialize in one industry. We specialize in figuring out where AI creates value — and that problem looks the same whether you run a dental practice, a construction company, or a law firm.
              </p>
            </AnimateIn>
          </div>

          {/* Right — industry grid */}
          <Stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industries.map((ind) => (
                <StaggerItem key={ind.name}>
                  <div
                    className="industry-card p-5 flex flex-col gap-2"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <p
                      className="text-[14px] font-bold leading-tight"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {ind.name}
                    </p>
                    <p
                      className="text-[13px] leading-[1.55]"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {ind.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </div>
      </div>
    </section>
  )
}
