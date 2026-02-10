import { useState, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import CircuitGrid from './components/CircuitGrid'

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
    <div className="flex flex-col h-full justify-center">
      <p className="text-[12px] font-medium text-white/40 tracking-[0.15em] uppercase mb-6">
        Integrated Agents
      </p>
      <h1 className="text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white">
        Make your<br />enterprise<br />
        <span className="text-[var(--color-secondary)]">AI-native.</span>
      </h1>
      <p className="mt-6 text-[14px] sm:text-[15px] text-white/50 leading-[1.7] max-w-md">
        The cost of intelligence is approaching zero. The companies that rewire around it now will dominate the next decade. The rest will be disrupted.
      </p>
      <p className="mt-3 text-[14px] sm:text-[15px] text-white/50 leading-[1.7] max-w-md">
        We set and execute your enterprise AI strategy at startup speed. No 200-slide decks. No 6-month timelines. Just business impact.
      </p>
      <div className="flex gap-6 mt-8">
        <div>
          <p className="text-[1.5rem] font-black text-[var(--color-secondary)] leading-none">25%</p>
          <p className="text-[10px] text-white/35 mt-1 uppercase tracking-wider">cost reduction</p>
        </div>
        <div>
          <p className="text-[1.5rem] font-black text-[var(--color-tertiary)] leading-none">3x</p>
          <p className="text-[10px] text-white/35 mt-1 uppercase tracking-wider">shipping velocity</p>
        </div>
        <div>
          <p className="text-[1.5rem] font-black text-[var(--color-accent-bright)] leading-none">&lt;90d</p>
          <p className="text-[10px] text-white/35 mt-1 uppercase tracking-wider">to measurable ROI</p>
        </div>
      </div>
    </div>
  )
}

function ServiceContent({ view, onBack }: { view: 'strategy' | 'transformation' | 'engineering'; onBack: () => void }) {
  const content = {
    strategy: {
      title: 'AI Strategy',
      tagline: 'No 200-slide decks. No 6-month timelines.',
      desc: 'We run 30, 60, or 90-day audits across every function in your business, surface the highest-ROI AI use cases, quantify the impact, and hand you an execution roadmap your team can run with tomorrow.',
      metrics: [
        { value: '30-90d', label: 'audit to roadmap', color: 'var(--color-secondary)' },
        { value: '20+', label: 'use cases ranked', color: 'var(--color-tertiary)' },
        { value: '100%', label: 'execution-ready', color: 'var(--color-accent-bright)' },
      ],
      capabilities: [
        { title: 'Holistic Audits', desc: 'Every department, every workflow, every bottleneck. We find the money.' },
        { title: 'ROI-Quantified Use Cases', desc: 'Ranked by business impact and implementation feasibility. No guesswork.' },
        { title: 'AI Adoption Report', desc: 'A crisp deliverable with technical appendix. Run it yourself or hand it back to us.' },
      ],
    },
    transformation: {
      title: 'AI Transformation',
      tagline: 'Product. Process. People.',
      desc: 'We become your Chief AI Officer. Embed with your team, deploy AI across your entire operation, track baseline metrics from day one, and make sure your people actually adopt it.',
      metrics: [
        { value: '25%', label: 'cost reduction', color: 'var(--color-secondary)' },
        { value: 'Day 1', label: 'baseline metrics', color: 'var(--color-tertiary)' },
        { value: 'E2E', label: 'strategy to execution', color: 'var(--color-accent-bright)' },
      ],
      capabilities: [
        { title: 'Process Automation', desc: 'We are bomb-sniffing dogs for inefficiency. Find bottlenecks. Fix them. Put money back in your pocket.' },
        { title: 'Custom AI Tooling', desc: 'Off-the-shelf where it works, custom-built where it matters. Deployed into your existing stack.' },
        { title: 'People Upskilling', desc: 'Bespoke curricula and hands-on workshops that get your teams thinking AI-first. Adoption is the real ROI.' },
      ],
    },
    engineering: {
      title: 'AI Engineering',
      tagline: 'Pay for output, not hours.',
      desc: 'Outcome-based engineering pods that ship production-grade software at 3x velocity. World-class engineers who use AI as a force multiplier. You pay for features delivered, not hours logged.',
      metrics: [
        { value: '3x', label: 'shipping velocity', color: 'var(--color-secondary)' },
        { value: '2wk', label: 'sprint cycles', color: 'var(--color-tertiary)' },
        { value: '$0/hr', label: 'outcome pricing', color: 'var(--color-accent-bright)' },
      ],
      capabilities: [
        { title: 'Dedicated Pods', desc: 'PM + forward-deployed engineers integrated into your stack, Slack, and sprint tracker.' },
        { title: 'Full-Stack Delivery', desc: 'Applications, model fine-tuning, data engineering, agentic solutions, code migrations.' },
        { title: 'Aligned Incentives', desc: 'We pay our team on story points completed. Everyone is aligned on output and speed.' },
      ],
    },
  }

  const c = content[view]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <p className="text-[12px] font-medium text-[var(--color-secondary)] tracking-[0.15em] uppercase">{c.tagline}</p>
      </div>

      <h2 className="text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] font-black leading-[1.0] tracking-[-0.04em] text-white mb-3">
        {c.title}
      </h2>
      <p className="text-[14px] text-white/60 leading-[1.7] max-w-lg mb-5">
        {c.desc}
      </p>

      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        {c.metrics.map((m, i) => (
          <div key={i} className="flex-1 border border-white/10 bg-white/5 p-3">
            <p className="text-[1.3rem] font-black leading-none" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {c.capabilities.map((cap, i) => (
          <div key={i} className="border border-white/10 bg-white/5 p-3 flex flex-col">
            <div className="w-5 h-0.5 mb-2.5" style={{ backgroundColor: i === 0 ? 'var(--color-secondary)' : i === 1 ? 'var(--color-tertiary)' : 'var(--color-accent-bright)' }} />
            <p className="text-[13px] font-bold text-white mb-1">{cap.title}</p>
            <p className="text-[11px] text-white/50 leading-[1.6]">{cap.desc}</p>
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
  const input = 'w-full border border-white/15 bg-white/5 px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors'

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-10 h-10 bg-white/10 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[var(--color-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-[1.3rem] font-bold text-white">We'll be in touch.</h3>
        <p className="mt-1.5 text-[13px] text-white/50">Expect a response within 24 hours.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <p className="text-[12px] font-medium text-[var(--color-secondary)] tracking-[0.15em] uppercase">Get Started</p>
      </div>

      <h2 className="text-[1.8rem] sm:text-[2.2rem] md:text-[2.6rem] font-black leading-[1.05] tracking-[-0.03em] text-white mb-2">
        Tell us about your business.
      </h2>
      <p className="text-[13px] text-white/50 mb-6">We respond within 24 hours. No spam, no obligation.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input {...register('name', { required: true })} className={input} placeholder="Name *" />
            {errors.name && <p className="mt-1 text-[10px] text-[var(--color-tertiary)]">Required</p>}
          </div>
          <div>
            <input type="email" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} className={input} placeholder="Work email *" />
            {errors.email && <p className="mt-1 text-[10px] text-[var(--color-tertiary)]">Required</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <button type="submit" disabled={isSubmitting} className="w-full py-3 text-[14px] font-bold bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] transition-colors disabled:opacity-60 cursor-pointer tracking-wide">
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

const HOVER_DURATION = 10

function NavButton({ item, isActive, onActivate }: {
  item: { id: View; title: string; desc: string }
  isActive: boolean
  onActivate: (id: View) => void
}) {
  const [hovering, setHovering] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = useCallback(() => {
    if (isActive) return
    setHovering(true)
    timerRef.current = setTimeout(() => {
      onActivate(item.id)
      setHovering(false)
    }, HOVER_DURATION * 1000)
  }, [isActive, item.id, onActivate])

  const handleLeave = useCallback(() => {
    setHovering(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return (
    <button
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => {
        handleLeave()
        onActivate(isActive ? 'home' as View : item.id)
      }}
      className={`relative text-left px-5 py-5 sm:px-6 sm:py-6 transition-all cursor-pointer flex-1 md:flex-initial overflow-hidden ${
        isActive
          ? 'bg-[var(--color-btn-active)] card-pop-active text-white'
          : 'bg-white card-pop hover:translate-y-[-1px]'
      }`}
    >
      {!isActive && (
        <div
          className="absolute inset-0 bg-[var(--color-btn-active)] origin-left"
          style={{
            transform: hovering ? 'scaleX(1)' : 'scaleX(0)',
            transition: hovering ? `transform ${HOVER_DURATION}s linear` : 'transform 0.25s ease-out',
          }}
        />
      )}
      <div className="relative z-10">
        <p className={`text-[15px] sm:text-[17px] font-bold leading-tight transition-colors ${
          isActive ? 'text-white' : hovering ? 'text-white' : 'text-[var(--color-text)]'
        }`} style={{ transitionDuration: hovering ? `${HOVER_DURATION * 0.3}s` : '0.25s' }}>
          {item.title}
        </p>
        <p className={`text-[13px] sm:text-[14px] leading-[1.5] mt-2 transition-colors ${
          isActive ? 'text-white/70' : hovering ? 'text-white/70' : 'text-[var(--color-text-secondary)]'
        }`} style={{ transitionDuration: hovering ? `${HOVER_DURATION * 0.3}s` : '0.25s' }}>
          {item.desc}
        </p>
      </div>
    </button>
  )
}

function CtaButton({ isActive, onActivate }: { isActive: boolean; onActivate: () => void }) {
  const [hovering, setHovering] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = useCallback(() => {
    if (isActive) return
    setHovering(true)
    timerRef.current = setTimeout(() => {
      onActivate()
      setHovering(false)
    }, HOVER_DURATION * 1000)
  }, [isActive, onActivate])

  const handleLeave = useCallback(() => {
    setHovering(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return (
    <button
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => { handleLeave(); onActivate() }}
      className={`text-left px-5 py-5 sm:px-6 sm:py-6 transition-all cursor-pointer flex-1 md:flex-initial ${
        isActive
          ? 'bg-[var(--color-btn-active)] card-pop-active text-white'
          : 'bg-white card-pop hover:translate-y-[-1px]'
      }`}
    >
      <p className={`text-[11px] sm:text-[12px] font-medium tracking-[0.12em] uppercase mb-2 ${
        isActive ? 'text-white/60' : 'text-[var(--color-text-secondary)]'
      }`}>
        integrateagents.ai
      </p>
      <p className={`text-[17px] sm:text-[19px] font-black leading-tight tracking-[-0.01em] ${
        isActive ? 'text-white' : 'text-[var(--color-text)]'
      }`}>
        Get Started
      </p>
      <div
        className={`mt-3 h-[1px] ${isActive ? 'bg-white/20 w-full' : 'bg-[var(--color-accent)]'}`}
        style={!isActive ? {
          width: hovering ? '100%' : '32px',
          transition: hovering ? `width ${HOVER_DURATION}s linear` : 'width 0.25s ease-out',
        } : undefined}
      />
    </button>
  )
}

export default function App() {
  const [view, setView] = useState<View>('home')

  const navItems: { id: View; title: string; desc: string }[] = [
    { id: 'strategy', title: 'Strategy', desc: 'Surface the highest-ROI AI use cases in 90 days or less' },
    { id: 'transformation', title: 'Transformation', desc: 'Rewire your product, process, and people around AI' },
    { id: 'engineering', title: 'Engineering', desc: 'Ship 3x faster with outcome-priced engineering pods' },
  ]

  return (
    <div className="grid-texture h-screen w-screen overflow-hidden">
      <CircuitGrid />

      <div className="relative z-10 h-full flex items-center justify-center px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
        {/* Two-panel layout: stacks on mobile */}
        <div className="w-full max-w-[1280px] h-full max-h-[800px] flex flex-col md:flex-row gap-2.5 sm:gap-3">

          {/* Left panel: navy main content */}
          <div className="flex-1 bg-[var(--color-accent)] card-pop p-6 sm:p-8 lg:p-10 relative overflow-hidden min-h-0">
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
          <div className="w-full md:w-[300px] lg:w-[340px] flex flex-row md:flex-col gap-2 sm:gap-2.5 flex-shrink-0 min-h-0 md:min-h-full">
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                isActive={view === item.id}
                onActivate={setView}
              />
            ))}

            {/* Spacer: only on desktop */}
            <div className="hidden md:block flex-1" />

            {/* CTA */}
            <CtaButton isActive={view === 'contact'} onActivate={() => setView(view === 'contact' ? 'home' : 'contact')} />
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
