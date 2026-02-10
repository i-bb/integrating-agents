import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import CircuitGrid from './components/CircuitGrid'
import AsciiGlobe from './components/AsciiGlobe'

type View = 'home' | 'strategy' | 'transformation' | 'engineering' | 'contact'

interface FormData { name: string; email: string; company: string; role: string; needs: string }

const ease4 = [0.22, 1, 0.36, 1] as [number, number, number, number]
const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: ease4 },
}

function HomeContent() {
  return (
    <div className="flex flex-col h-full">
      <p className="text-[12px] font-medium text-[var(--color-text-muted)] tracking-[0.15em] uppercase mb-6">
        Integrated Agents
      </p>
      <h1 className="text-[2.8rem] sm:text-[3.4rem] md:text-[4.2rem] font-black leading-[1.0] tracking-[-0.04em] text-[var(--color-text)]">
        Make your<br />enterprise<br />
        <span className="text-[var(--color-accent)]">AI-native.</span>
      </h1>
      <div className="mt-4 overflow-hidden flex-1">
        <AsciiGlobe />
      </div>
    </div>
  )
}

function ServiceContent({ view, onBack }: { view: 'strategy' | 'transformation' | 'engineering'; onBack: () => void }) {
  const content = {
    strategy: {
      title: 'AI Strategy',
      tagline: 'Clarity before code.',
      desc: 'We audit every function, surface the highest-ROI AI use cases, and hand you a roadmap your team can execute tomorrow.',
      metrics: [
        { value: '4-6w', label: 'audit timeline', color: 'var(--color-secondary)' },
        { value: '20+', label: 'use cases surfaced', color: 'var(--color-tertiary)' },
        { value: '100%', label: 'execution-ready', color: 'var(--color-accent-bright)' },
      ],
      capabilities: [
        { title: 'Function-Specific Audits', desc: 'Every department. Every workflow. Every opportunity.' },
        { title: 'ROI-Ranked Use Cases', desc: 'Prioritized by business impact and feasibility score.' },
        { title: 'Execution Roadmap', desc: 'Run it yourself or hand it back to us.' },
      ],
    },
    transformation: {
      title: 'AI Transformation',
      tagline: 'Product. Process. People.',
      desc: 'We embed with your team to deploy AI across your entire operation, with baseline metrics tracking ROI from day one.',
      metrics: [
        { value: '25%', label: 'efficiency gain', color: 'var(--color-secondary)' },
        { value: 'D1', label: 'baseline metrics', color: 'var(--color-tertiary)' },
        { value: 'E2E', label: 'implementation', color: 'var(--color-accent-bright)' },
      ],
      capabilities: [
        { title: 'Custom AI Tooling', desc: 'Bespoke solutions built for your specific workflows.' },
        { title: 'Change Management', desc: 'Upskill your people. Transform the culture.' },
        { title: 'Continuous ROI Tracking', desc: 'Measurable outcomes, not theoretical projections.' },
      ],
    },
    engineering: {
      title: 'AI Engineering',
      tagline: 'Ship faster. Pay for output.',
      desc: 'Elite engineering squads leveraging AI-accelerated workflows. Subscription-style pods that deliver production-grade software.',
      metrics: [
        { value: '3x', label: 'shipping velocity', color: 'var(--color-secondary)' },
        { value: 'Pod', label: 'dedicated team', color: 'var(--color-tertiary)' },
        { value: '$0/hr', label: 'outcome pricing', color: 'var(--color-accent-bright)' },
      ],
      capabilities: [
        { title: 'Dedicated Engineering Pods', desc: 'PM + engineers integrated into your stack.' },
        { title: 'Sprint-Based Delivery', desc: 'You choose priorities. We ship features.' },
        { title: 'AI-Accelerated Workflows', desc: '10x engineers powered by cutting-edge AI tooling.' },
      ],
    },
  }

  const c = content[view]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <p className="text-[12px] font-medium text-[var(--color-secondary)] tracking-[0.15em] uppercase">{c.tagline}</p>
      </div>

      <h2 className="text-[2.4rem] sm:text-[2.8rem] md:text-[3.4rem] font-black leading-[1.0] tracking-[-0.04em] text-[var(--color-text)] mb-3">
        {c.title}
      </h2>
      <p className="text-[14px] text-[var(--color-text-secondary)] leading-[1.7] max-w-lg mb-5">
        {c.desc}
      </p>

      <div className="flex gap-2.5 mb-6">
        {c.metrics.map((m, i) => (
          <div key={i} className="flex-1 border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
            <p className="text-[1.3rem] font-black leading-none" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1 uppercase tracking-wider">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-3 gap-2.5">
        {c.capabilities.map((cap, i) => (
          <div key={i} className="border border-[var(--color-border)] p-3 flex flex-col group hover:border-[var(--color-border-highlight)] transition-colors">
            <div className="w-5 h-0.5 mb-2.5" style={{ backgroundColor: i === 0 ? 'var(--color-secondary)' : i === 1 ? 'var(--color-tertiary)' : 'var(--color-accent-bright)' }} />
            <p className="text-[13px] font-bold text-[var(--color-text)] mb-1">{cap.title}</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-[1.6]">{cap.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactContent({ onBack }: { onBack: () => void }) {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const onSubmit = async (data: FormData) => {
    console.log('Form submission:', data)
    await new Promise(r => setTimeout(r, 600))
    setSent(true)
  }
  const input = 'w-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]/30 transition-colors'

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-10 h-10 bg-[var(--color-accent-muted)] flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-[1.3rem] font-bold text-[var(--color-text)]">We'll be in touch.</h3>
        <p className="mt-1.5 text-[13px] text-[var(--color-text-secondary)]">Expect a response within 24 hours.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <p className="text-[12px] font-medium text-[var(--color-secondary)] tracking-[0.15em] uppercase">Get Started</p>
      </div>

      <h2 className="text-[2rem] sm:text-[2.4rem] font-black leading-[1.05] tracking-[-0.03em] text-[var(--color-text)] mb-2">
        Tell us about your business.
      </h2>
      <p className="text-[13px] text-[var(--color-text-secondary)] mb-6">We respond within 24 hours. No spam, no obligation.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input {...register('name', { required: true })} className={input} placeholder="Name *" />
            {errors.name && <p className="mt-1 text-[10px] text-[var(--color-tertiary)]">Required</p>}
          </div>
          <div>
            <input type="email" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} className={input} placeholder="Work email *" />
            {errors.email && <p className="mt-1 text-[10px] text-[var(--color-tertiary)]">Required</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input {...register('company', { required: true })} className={input} placeholder="Company *" />
            {errors.company && <p className="mt-1 text-[10px] text-[var(--color-tertiary)]">Required</p>}
          </div>
          <input {...register('role')} className={input} placeholder="Role" />
        </div>
        <div className="flex-1">
          <textarea {...register('needs', { required: true })} className={`${input} h-full min-h-[80px] resize-none`} placeholder="What challenges are you facing? *" />
          {errors.needs && <p className="mt-1 text-[10px] text-[var(--color-tertiary)]">Required</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-3 text-[14px] font-bold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-60 cursor-pointer tracking-wide">
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('home')

  const navItems: { id: View; title: string; desc: string; accentColor: string }[] = [
    { id: 'strategy', title: 'Strategy', desc: 'AI audits and execution-ready roadmaps', accentColor: 'var(--color-secondary)' },
    { id: 'transformation', title: 'Transformation', desc: 'End-to-end AI deployment with ROI', accentColor: 'var(--color-tertiary)' },
    { id: 'engineering', title: 'Engineering', desc: 'Elite pods shipping production software', accentColor: 'var(--color-accent-bright)' },
  ]

  return (
    <div className="grid-texture h-screen w-screen overflow-hidden">
      <CircuitGrid />

      <div className="relative z-10 h-full flex items-center justify-center px-5 sm:px-8 py-5">
        <div className="w-full max-w-[1100px] h-[min(88vh,720px)] flex gap-3">

          {/* Left panel: large content area */}
          <div className="flex-1 card-elevated border border-[var(--color-border)] p-8 sm:p-10 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={view} {...fade} className="h-full">
                {view === 'home' && <HomeContent />}
                {view === 'contact' && <ContactContent onBack={() => setView('home')} />}
                {(view === 'strategy' || view === 'transformation' || view === 'engineering') && (
                  <ServiceContent view={view} onBack={() => setView('home')} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right panel: nav column */}
          <div className="w-[240px] sm:w-[270px] flex flex-col gap-2.5 flex-shrink-0">
            {navItems.map((item) => {
              const isActive = view === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setView(isActive ? 'home' : item.id)}
                  className={`text-left px-5 py-4 border transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'card-elevated-active bg-[var(--color-accent)] border-[var(--color-accent)]'
                      : 'card-elevated border-[var(--color-border)] hover:border-[var(--color-border-highlight)]'
                  }`}
                >
                  {!isActive && (
                    <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: item.accentColor }} />
                  )}
                  <p className={`text-[14px] font-bold leading-tight ${
                    isActive ? 'text-white' : 'text-[var(--color-text)]'
                  }`}>
                    {item.title}
                  </p>
                  <p className={`text-[11px] leading-[1.4] mt-1.5 ${
                    isActive ? 'text-white/60' : 'text-[var(--color-text-muted)]'
                  }`}>
                    {item.desc}
                  </p>
                </button>
              )
            })}

            {/* Spacer pushes CTA to bottom */}
            <div className="flex-1" />

            {/* CTA */}
            <button
              onClick={() => setView(view === 'contact' ? 'home' : 'contact')}
              className={`group text-left px-5 py-5 border transition-all cursor-pointer relative overflow-hidden ${
                view === 'contact'
                  ? 'card-elevated-active bg-[var(--color-accent)] border-[var(--color-accent)]'
                  : 'card-elevated border-[var(--color-border)] hover:border-[var(--color-accent)]/30'
              }`}
            >
              <p className={`text-[10px] font-medium tracking-[0.12em] uppercase mb-2 ${
                view === 'contact' ? 'text-white/50' : 'text-[var(--color-text-muted)]'
              }`}>
                integrateagents.ai
              </p>
              <p className={`text-[16px] font-black leading-tight tracking-[-0.01em] ${
                view === 'contact' ? 'text-white' : 'text-[var(--color-text)]'
              }`}>
                Get Started
              </p>
              <div className={`mt-2.5 h-[1px] transition-all duration-300 ${
                view === 'contact'
                  ? 'bg-white/20 w-full'
                  : 'bg-[var(--color-accent)] w-8 group-hover:w-full'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 z-10 flex items-center justify-center h-8">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} Integrated Agents &middot; contact@integrateagents.ai
        </p>
      </div>
    </div>
  )
}
