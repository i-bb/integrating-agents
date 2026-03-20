import { AnimateIn, Stagger, StaggerItem } from '../ui/AnimateIn'
import { SectionLabel } from '../ui/SectionLabel'

const pains = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    heading: "Your team is still doing it manually.",
    body: "ChatGPT, Claude, OpenClaw — some automation. All of it running. None of it actually changing how much time your team has.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
    heading: "Everyone said it would be different.",
    body: "Vendors promised transformation. Consultants promised strategy. You got demos and decks — and went back to doing things the old way.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6M9 16h6M9 8h6M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"/>
      </svg>
    ),
    heading: "You haven't started — and that's okay.",
    body: "AI can feel overwhelming if you don't know where to begin. You don't need to understand the technology. You just need the right guide. That's us.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <path d="M5 12h7"/>
        <path d="M12 12h7"/>
      </svg>
    ),
    heading: "You're not doing it wrong.",
    body: "Most businesses are stuck in the same place. The last mile — between having AI and actually using it well — is where everything breaks down.",
  },
]

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="section-padding"
      aria-labelledby="problem-heading"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="container">
        <div className="section-divider mb-16" aria-hidden="true" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
          {/* Left — big statement */}
          <div>
            <SectionLabel number="01" title="The problem" />

            <AnimateIn>
              <h2
                id="problem-heading"
                className="display-lg"
                style={{ color: 'var(--color-text)' }}
              >
                AI is for every business.
                <br />
                <span style={{ color: 'var(--color-navy)' }}>Not just the ones with IT teams.</span>
              </h2>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <p
                className="mt-6 text-[17px] leading-[1.7] max-w-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Some businesses have tried AI tools and gotten nowhere. Others haven't started because they don't know where to. Both groups end up in the same place: watching AI pass them by.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <p
                className="mt-4 text-[17px] leading-[1.7] max-w-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                The gap between where you are and where AI can take you is called the last mile. It's real. It's solvable. You don't need a technical background to cross it.
              </p>
            </AnimateIn>
          </div>

          {/* Right — pain points */}
          <Stagger delay={0.15}>
            <div className="flex flex-col gap-6">
              {pains.map((pain) => (
                <StaggerItem key={pain.heading}>
                  <div
                    className="pain-card flex gap-4 p-6"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      className="mt-0.5 w-9 h-9 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'var(--color-navy-muted)',
                        color: 'var(--color-navy)',
                      }}
                    >
                      {pain.icon}
                    </div>
                    <div>
                      <p
                        className="text-[15px] font-bold mb-1.5 leading-snug"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {pain.heading}
                      </p>
                      <p
                        className="text-[14px] leading-[1.6]"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {pain.body}
                      </p>
                    </div>
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
