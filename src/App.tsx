import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import CircuitGrid from './components/CircuitGrid'
import { useTheme } from './hooks/useTheme'

type View = 'home' | 'strategy' | 'transformation' | 'engineering' | 'contact'

interface FormData { name: string; email: string; company: string; role: string; needs: string }

const NAV_ITEMS: { id: View; stat: string; label: string }[] = [
  { id: 'strategy', stat: 'Strategy', label: 'Holistic audits that surface the highest-impact AI use cases and deliver an execution-ready roadmap' },
  { id: 'transformation', stat: 'Transformation', label: 'End-to-end implementation across product, process, and people. Baseline metrics from day one' },
  { id: 'engineering', stat: 'Engineering', label: 'Elite squads that ship production-grade software using AI-accelerated workflows' },
]

const CONTENT: Record<Exclude<View, 'contact' | 'home'>, { title: string; body: string; bullets: string[] }> = {
  strategy: {
    title: 'AI Strategy',
    body: 'No 6-month strategy work. No 200-slide presentations. We get right to work on holistic audits that surface the most compelling AI use cases.',
    bullets: [
      'Function-specific assessments across every department',
      'Prioritized use cases ranked by business impact',
      'Implementation roadmap your team can run with, or hand back to us',
    ],
  },
  transformation: {
    title: 'AI Transformation',
    body: 'Custom partnership that combines bespoke change management and AI tooling with baseline metrics to drive measurable ROI.',
    bullets: [
      'Custom AI tooling and workflow automation',
      'Change management and team upskilling',
      'Measurable ROI tracked continuously',
    ],
  },
  engineering: {
    title: 'AI Engineering',
    body: 'Outcome-based, subscription-style engineering squads that leverage AI acceleration to ship software faster and more affordably.',
    bullets: [
      'Dedicated pods with technical PM and engineers',
      'Sprint-based delivery with outcome-based pricing',
      'Seamless integration into your existing stack and tools',
    ],
  },
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
}

function HomeContent() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <p className="text-[12px] font-medium text-[var(--color-text-secondary)] tracking-wide mb-6">integrateagents.ai</p>
        <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-text)]">
          Make your enterprise<br />AI-native.
        </h1>
      </div>
      <div className="mt-auto pt-8 border-t border-[var(--color-border)]">
        <p className="text-[2rem] sm:text-[2.5rem] font-bold tracking-[-0.02em] text-[var(--color-text)]">3 Pillars</p>
        <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">Strategy, transformation, and engineering</p>
      </div>
    </div>
  )
}

function ServiceContent({ view }: { view: 'strategy' | 'transformation' | 'engineering' }) {
  const c = CONTENT[view]
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <p className="text-[12px] font-medium text-[var(--color-text-secondary)] tracking-wide mb-6">integrateagents.ai</p>
        <h2 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-text)]">
          {c.title}
        </h2>
        <p className="mt-5 text-[14px] text-[var(--color-text-secondary)] leading-[1.7] max-w-md">
          {c.body}
        </p>
        <ul className="mt-6 space-y-3">
          {c.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-[13px] text-[var(--color-text)]">
              <span className="mt-1 w-1.5 h-1.5 bg-[var(--color-secondary)] flex-shrink-0" />
              <span className="leading-[1.6]">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ContactContent() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const onSubmit = async (data: FormData) => {
    console.log('Form submission:', data)
    await new Promise(r => setTimeout(r, 600))
    setSent(true)
  }
  const input = 'w-full border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]/40 transition-colors'

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-10 h-10 bg-[var(--color-secondary-muted)] flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[var(--color-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text)]">We'll be in touch.</h3>
        <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">Expect a response within 24 hours.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <p className="text-[12px] font-medium text-[var(--color-text-secondary)] tracking-wide mb-4">Get started</p>
      <h2 className="text-[1.75rem] sm:text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--color-text)] mb-6">
        Tell us about<br />your business.
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input {...register('name', { required: true })} className={input} placeholder="Name *" />
            {errors.name && <p className="mt-0.5 text-[10px] text-red-400">Required</p>}
          </div>
          <div>
            <input type="email" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} className={input} placeholder="Work email *" />
            {errors.email && <p className="mt-0.5 text-[10px] text-red-400">Required</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input {...register('company', { required: true })} className={input} placeholder="Company *" />
            {errors.company && <p className="mt-0.5 text-[10px] text-red-400">Required</p>}
          </div>
          <input {...register('role')} className={input} placeholder="Role" />
        </div>
        <div className="flex-1">
          <textarea {...register('needs', { required: true })} className={`${input} h-full min-h-[80px] resize-none`} placeholder="What challenges are you facing? *" />
          {errors.needs && <p className="mt-0.5 text-[10px] text-red-400">Required</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-2.5 text-[13px] font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-60 cursor-pointer">
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const { theme, toggle } = useTheme()

  return (
    <div className="grid-texture h-screen w-screen overflow-hidden">
      <CircuitGrid />

      {/* Theme toggle - top right */}
      <button onClick={toggle} aria-label="Toggle theme" className="fixed top-5 right-5 z-50 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
        {theme === 'dark' ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>

      {/* Main two-panel layout */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-8 py-6">
        <div className="w-full max-w-[960px] h-[min(85vh,640px)] flex gap-3">

          {/* Left panel - content area */}
          <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] p-8 sm:p-10 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={view} {...fade} className="h-full">
                {view === 'home' && <HomeContent />}
                {view === 'contact' && <ContactContent />}
                {(view === 'strategy' || view === 'transformation' || view === 'engineering') && (
                  <ServiceContent view={view} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right panel - navigation boxes */}
          <div className="w-[280px] sm:w-[320px] flex flex-col gap-3 flex-shrink-0">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setView(view === item.id ? 'home' : item.id)}
                className={`flex-1 text-left p-5 border transition-all cursor-pointer group ${
                  view === item.id
                    ? 'bg-[var(--color-card-light)] border-transparent'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border-highlight)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 w-6 h-6 flex items-center justify-center flex-shrink-0 ${
                    view === item.id ? 'bg-[var(--color-card-light-text)]/10' : 'bg-[var(--color-accent-muted)]'
                  }`}>
                    <svg className={`w-3.5 h-3.5 ${view === item.id ? 'text-[var(--color-card-light-text)]' : 'text-[var(--color-accent)]'}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </span>
                  <div>
                    <p className={`text-[15px] font-bold ${
                      view === item.id ? 'text-[var(--color-card-light-text)]' : 'text-[var(--color-text)]'
                    }`}>
                      {item.stat}
                    </p>
                    <p className={`text-[11px] leading-[1.5] mt-1 ${
                      view === item.id ? 'text-[var(--color-card-light-text)]/70' : 'text-[var(--color-text-secondary)]'
                    }`}>
                      {item.label}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {/* CTA box */}
            <button
              onClick={() => setView(view === 'contact' ? 'home' : 'contact')}
              className={`text-left p-5 border transition-all cursor-pointer ${
                view === 'contact'
                  ? 'bg-[var(--color-accent)] border-transparent'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border-highlight)]'
              }`}
            >
              <p className="text-[12px] font-medium text-white/70 tracking-wide">integrateagents.ai</p>
              <p className={`text-[1.25rem] font-bold leading-[1.15] mt-2 ${
                view === 'contact' ? 'text-white' : 'text-[var(--color-text)]'
              }`}>
                Get Started
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 z-10 flex items-center justify-center py-4">
        <p className="text-[11px] text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} Integrated Agents &middot; contact@integrateagents.ai
        </p>
      </div>
    </div>
  )
}
