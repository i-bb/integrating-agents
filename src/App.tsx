import { useState, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import CircuitGrid from './components/CircuitGrid'
import FlowAnimation from './components/FlowAnimation'

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
    <div className="flex flex-col lg:h-full">
      <div className="flex flex-col justify-center flex-1 lg:flex-none lg:pt-4">
        <p className="text-[13px] sm:text-[14px] font-semibold text-white/80 tracking-[0.15em] uppercase mb-4 sm:mb-5">
          Last Mile
        </p>
        <h1 className="text-[2rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[3.6rem] font-black leading-[1.05] sm:leading-[1.0] tracking-[-0.03em] sm:tracking-[-0.04em] text-white">
          AI gets you close.<br />We get you<br />
          <span className="text-[var(--color-secondary)]">the rest of the way.</span>
        </h1>
        <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-white/90 leading-[1.7] max-w-lg">
          Your AI tools are live. Your team is trained. But the results you were promised still aren't showing up. It all lives in the last mile. That's where every enterprise gets stuck. And that's our specialty.
        </p>
      </div>
      <div className="hidden lg:flex flex-1 items-end lg:items-center lg:pt-6 pb-2">
        <FlowAnimation />
      </div>
    </div>
  )
}

function ServiceContent({ view, onBack }: { view: 'strategy' | 'transformation' | 'engineering'; onBack: () => void }) {
  const content = {
    strategy: {
      title: 'AI Strategy',
      tagline: 'Find where your last mile begins.',
      intro: 'Budgets spread thin. Pilots going nowhere. We pinpoint where the real value hides.',
      bullets: [
        'Deep operational audit across every function',
        'Opportunities ranked by revenue impact and feasibility',
        'Execution-ready roadmap in two weeks',
        'No generic frameworks -- built around your gap',
      ],
      process: [
        { step: '1', label: 'Audit', detail: 'Map every workflow, tool, and bottleneck across your operations' },
        { step: '2', label: 'Prioritize', detail: 'Rank opportunities by revenue impact, cost, and speed to deploy' },
        { step: '3', label: 'Deliver', detail: 'Execution-ready plan your team can run with or hand back to us' },
      ],
      capabilities: [
        {
          title: 'Find the gap',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
          desc: 'Identify exactly where your AI setup stops delivering and opportunity starts.',
          tags: ['Workflow mapping', 'Bottleneck analysis', 'Opportunity scoring'],
          stat: '2 weeks', statLabel: 'avg. time to roadmap',
        },
        {
          title: 'Ruthless prioritization',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="12" y1="21" x2="12" y2="8"/><line x1="20" y1="21" x2="20" y2="3"/></svg>,
          desc: 'Every opportunity ranked by impact. No guesswork, no politics.',
          tags: ['Revenue impact', 'Cost reduction', 'Feasibility ranking'],
          stat: 'ROI-first', statLabel: 'ranking methodology',
        },
        {
          title: 'Execution-ready',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
          desc: 'A plan your team acts on tomorrow. Not a slide deck that collects dust.',
          tags: ['Action plan', 'Team assignments', 'Timeline + milestones'],
          stat: '100%', statLabel: 'actionable deliverables',
        },
      ],
    },
    transformation: {
      title: 'Build & Integrate',
      tagline: 'Cover the last mile right the first time.',
      intro: 'You\'ve seen what bolted-on AI looks like. We design, build, and ship tools that actually work.',
      bullets: [
        'Custom tools built inside your existing stack',
        'Co-built with the teams who use them daily',
        'Production-grade from sprint one',
        'Adoption is the point, not an afterthought',
      ],
      process: [
        { step: '1', label: 'Design', detail: 'Map your workflows and architect solutions for your stack and team' },
        { step: '2', label: 'Build', detail: 'Production-grade tooling co-developed alongside your people' },
        { step: '3', label: 'Ship', detail: 'Deploy, train, and ensure adoption from day one' },
      ],
      capabilities: [
        {
          title: 'Your stack, your data',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
          desc: 'No rip-and-replace. Built within the infrastructure you already run.',
          tags: ['AWS / Azure / GCP', 'SOC 2 compliant', 'Zero vendor lock-in'],
          stat: 'Zero', statLabel: 'vendor lock-in',
        },
        {
          title: 'Built for adoption',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
          desc: 'Co-built with your people so the tools we ship are the tools they use.',
          tags: ['Co-built with your team', 'Hands-on training', 'Change management'],
          stat: 'Day 1', statLabel: 'team onboarding',
        },
        {
          title: 'Ship fast, ship real',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
          desc: 'Working software your business runs on. Not a demo. Not a prototype.',
          tags: ['Sprint 1 production', 'CI/CD pipeline', 'Monitoring from day 1'],
          stat: 'Sprint 1', statLabel: 'production deploy',
        },
      ],
    },
    engineering: {
      title: 'Rescue & Optimize',
      tagline: 'You\'re stuck on the last mile. We close the gap.',
      intro: 'You already spent the money. The tools are live but the results aren\'t there.',
      bullets: [
        'Rapid diagnosis of what\'s working and what\'s waste',
        'Rearchitect and redeploy until it delivers',
        'Unlock untapped value in tools you already own',
        'Close the integration gaps your vendor left behind',
      ],
      process: [
        { step: '1', label: 'Diagnose', detail: 'Honest assessment of what\'s working, what\'s waste, and what\'s fixable' },
        { step: '2', label: 'Fix', detail: 'Rearchitect, retrain, and redeploy until the system delivers' },
        { step: '3', label: 'Optimize', detail: 'Unlock the capabilities your vendor didn\'t connect' },
      ],
      capabilities: [
        {
          title: 'Honest assessment',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
          desc: 'What\'s working, what\'s waste, and exactly what it takes to close the gap.',
          tags: ['Full platform audit', 'Cost-waste analysis', 'Gap identification'],
          stat: 'Full', statLabel: 'platform audit',
        },
        {
          title: 'Fix what\'s failing',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
          desc: 'We redeploy until the system delivers what you were promised when you signed.',
          tags: ['Rearchitect workflows', 'Retrain models', 'Redeploy integrations'],
          stat: 'Rapid', statLabel: 'turnaround',
        },
        {
          title: 'Unlock what you own',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>,
          desc: 'Most enterprises sit on massive untapped value. We find it and connect it.',
          tags: ['Untapped features', 'Vendor gap closure', 'ROI recovery'],
          stat: 'Hidden', statLabel: 'value recovered',
        },
      ],
    },
  }

  const c = content[view]
  const stepColors = ['var(--color-secondary)', 'var(--color-tertiary)', 'var(--color-accent-bright)']

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-white/60 hover:text-white transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <p className="text-[13px] font-semibold text-[var(--color-secondary)] tracking-[0.12em] uppercase">{c.tagline}</p>
      </div>

      <h2 className="text-[2rem] sm:text-[2.6rem] md:text-[3rem] font-black leading-[1.0] tracking-[-0.04em] text-white mb-3">
        {c.title}
      </h2>
      <p className="text-[16px] text-white/90 leading-[1.6] max-w-xl mb-3">
        {c.intro}
      </p>

      <ul className="space-y-1.5 mb-5">
        {c.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[15px] text-white/90">
            <svg className="mt-0.5 w-4 h-4 flex-shrink-0 text-[var(--color-secondary)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 8 6 12 14 4"/></svg>
            <span className="leading-[1.4]">{b}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        {c.process.map((p, i) => (
          <div key={i} className="border border-white/12 bg-white/[0.07] p-4 card-inner relative">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[22px] font-black leading-none" style={{ color: stepColors[i] }}>{p.step}</span>
              <span className="text-[15px] font-bold text-white">{p.label}</span>
            </div>
            <p className="text-[14px] text-white/85 leading-[1.5]">{p.detail}</p>
            {i < 2 && (
              <div className="hidden sm:block absolute top-1/2 -right-[9px] -translate-y-1/2 z-10">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {c.capabilities.map((cap, i) => (
          <div key={i} className="border border-white/12 bg-white/[0.07] p-4 flex flex-col card-inner">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 flex items-center justify-center border border-white/10 bg-white/[0.05] flex-shrink-0" style={{ color: stepColors[i] }}>
                {cap.icon}
              </div>
              <p className="text-[15px] font-bold text-white">{cap.title}</p>
            </div>
            <p className="text-[14px] text-white/85 leading-[1.55] mb-3">{cap.desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {cap.tags.map((tag, j) => (
                <span key={j} className="text-[12px] font-medium px-2 py-1 border border-white/10 bg-white/[0.04] text-white/80">{tag}</span>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 mt-auto">
              <p className="text-[17px] font-black leading-none" style={{ color: stepColors[i] }}>{cap.stat}</p>
              <p className="text-[12px] text-white/70 mt-1 uppercase tracking-wider">{cap.statLabel}</p>
            </div>
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
  const input = 'w-full border border-white/20 bg-white/[0.08] px-4 py-3 text-[15px] text-white placeholder:text-white/50 focus:outline-none focus:border-[var(--color-secondary)]/60 focus:bg-white/[0.1] transition-all card-inner'

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-14 h-14 border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/10 flex items-center justify-center mb-5 card-inner">
          <svg className="w-7 h-7 text-[var(--color-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-[1.5rem] font-black text-white">We'll be in touch.</h3>
        <p className="mt-2 text-[16px] text-white/85 max-w-sm">Expect a response within 24 hours. We'll come prepared with questions specific to your business.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-white/60 hover:text-white transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <p className="text-[13px] font-semibold text-[var(--color-secondary)] tracking-[0.12em] uppercase">Get Started</p>
      </div>

      <h2 className="text-[1.8rem] sm:text-[2.2rem] md:text-[2.8rem] font-black leading-[1.05] tracking-[-0.03em] text-white mb-2">
        Let's talk.
      </h2>
      <p className="text-[16px] text-white/90 mb-6 max-w-lg">
        Tell us where you're stuck. We'll respond within 24 hours with a perspective on how to move forward.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-white/80 uppercase tracking-wider mb-1.5">Name *</label>
            <input {...register('name', { required: true })} className={input} placeholder="Full name" />
            {errors.name && <p className="mt-1.5 text-[11px] text-[var(--color-tertiary)]">Required</p>}
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/80 uppercase tracking-wider mb-1.5">Work Email *</label>
            <input type="email" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} className={input} placeholder="you@company.com" />
            {errors.email && <p className="mt-1.5 text-[11px] text-[var(--color-tertiary)]">Valid work email required</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-white/80 uppercase tracking-wider mb-1.5">Company *</label>
            <input {...register('company', { required: true })} className={input} placeholder="Company name" />
            {errors.company && <p className="mt-1.5 text-[11px] text-[var(--color-tertiary)]">Required</p>}
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/80 uppercase tracking-wider mb-1.5">Role</label>
            <input {...register('role')} className={input} placeholder="Your title" />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <label className="block text-[12px] font-semibold text-white/80 uppercase tracking-wider mb-1.5">What's the challenge? *</label>
          <textarea {...register('needs', { required: true })} className={`${input} flex-1 min-h-[100px] resize-none`} placeholder="What are you trying to accomplish with AI? Where are things falling short?" />
          {errors.needs && <p className="mt-1.5 text-[11px] text-[var(--color-tertiary)]">Required</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-3.5 text-[15px] font-bold bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] transition-all disabled:opacity-60 cursor-pointer tracking-wide card-inner hover:translate-y-[-1px]">
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
        <p className="text-[13px] text-white/60 text-center">No spam. No obligation. Just a conversation.</p>
      </form>
    </div>
  )
}

const HOVER_ACTIVATE = 10

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
    }, HOVER_ACTIVATE * 1000)
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
            transition: hovering ? 'transform 0.15s ease-out' : 'transform 0.25s ease-out',
          }}
        />
      )}
      <div className="relative z-10">
        <p className={`text-[16px] sm:text-[18px] font-bold leading-tight transition-colors ${
          isActive ? 'text-white' : hovering ? 'text-white' : 'text-[var(--color-text)]'
        }`} style={{ transitionDuration: '0.15s' }}>
          {item.title}
        </p>
        <p className={`text-[15px] sm:text-[16px] leading-[1.5] mt-2 transition-colors ${
          isActive ? 'text-white/90' : hovering ? 'text-white/90' : 'text-[var(--color-text-secondary)]'
        }`} style={{ transitionDuration: '0.15s' }}>
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
    }, HOVER_ACTIVATE * 1000)
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
        onlastmile.com
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
          transition: hovering ? 'width 0.15s ease-out' : 'width 0.25s ease-out',
        } : undefined}
      />
    </button>
  )
}

function MobileNav({ navItems, view, setView, isOpen, onClose }: {
  navItems: { id: View; title: string; desc: string }[]
  view: View
  setView: (v: View) => void
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: ease4 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-[var(--color-bg)] z-50 lg:hidden flex flex-col p-4 gap-2.5 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-semibold text-[var(--color-text-secondary)] tracking-[0.12em] uppercase">Menu</p>
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setView(view === item.id ? 'home' : item.id); onClose() }}
                className={`text-left px-4 py-4 transition-all cursor-pointer ${
                  view === item.id
                    ? 'bg-[var(--color-btn-active)] text-white card-pop-active'
                    : 'bg-white card-pop'
                }`}
              >
                <p className={`text-[16px] font-bold leading-tight ${view === item.id ? 'text-white' : 'text-[var(--color-text)]'}`}>{item.title}</p>
                <p className={`text-[13px] leading-[1.5] mt-1.5 ${view === item.id ? 'text-white/80' : 'text-[var(--color-text-secondary)]'}`}>{item.desc}</p>
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={() => { setView(view === 'contact' ? 'home' : 'contact'); onClose() }}
              className={`text-left px-4 py-4 transition-all cursor-pointer ${
                view === 'contact'
                  ? 'bg-[var(--color-btn-active)] text-white card-pop-active'
                  : 'bg-white card-pop'
              }`}
            >
              <p className={`text-[11px] font-medium tracking-[0.12em] uppercase mb-1.5 ${view === 'contact' ? 'text-white/60' : 'text-[var(--color-text-secondary)]'}`}>onlastmile.com</p>
              <p className={`text-[17px] font-black leading-tight tracking-[-0.01em] ${view === 'contact' ? 'text-white' : 'text-[var(--color-text)]'}`}>Get Started</p>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems: { id: View; title: string; desc: string }[] = [
    { id: 'strategy', title: 'Strategy', desc: 'Find where the real value is hiding' },
    { id: 'transformation', title: 'Build & Integrate', desc: 'Design, build, and ship AI that actually works' },
    { id: 'engineering', title: 'Rescue & Optimize', desc: 'Fix what\'s broken, unlock what you already own' },
  ]

  return (
    <div className="grid-texture min-h-screen lg:h-screen w-screen lg:overflow-hidden">
      <CircuitGrid />

      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--color-accent)]/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[var(--color-secondary)] flex items-center justify-center">
            <span className="text-[11px] font-black text-white tracking-tight">LM</span>
          </div>
          <span className="text-[14px] font-bold text-white">Last Mile</span>
        </div>
        <button onClick={() => setMenuOpen(true)} className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      <MobileNav navItems={navItems} view={view} setView={setView} isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="relative z-10 min-h-screen lg:h-full flex items-start lg:items-center justify-center px-3 sm:px-6 lg:px-8 pt-16 pb-10 lg:pt-3 lg:pb-5">
        <div className="w-full max-w-[1440px] lg:h-full lg:max-h-[800px] flex flex-col lg:flex-row gap-2.5 sm:gap-3">

          {/* Left panel: navy main content */}
          <div className="flex-1 bg-[var(--color-accent)] card-pop p-5 sm:p-8 lg:p-10 relative overflow-hidden lg:overflow-y-auto min-h-0">
            <AnimatePresence mode="wait">
              <motion.div key={view} {...fade} className="lg:h-full">
                {view === 'home' && <HomeContent />}
                {view === 'contact' && <ContactContent onBack={() => setView('home')} />}
                {(view === 'strategy' || view === 'transformation' || view === 'engineering') && (
                  <ServiceContent view={view} onBack={() => setView('home')} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right panel: nav column -- hidden on mobile, shown on md+ */}
          <div className="hidden lg:flex w-[300px] xl:w-[340px] flex-col gap-2 sm:gap-2.5 flex-shrink-0 min-h-0 lg:min-h-full">
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                isActive={view === item.id}
                onActivate={setView}
              />
            ))}
            <div className="flex-1" />
            <CtaButton isActive={view === 'contact'} onActivate={() => setView(view === 'contact' ? 'home' : 'contact')} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="lg:fixed lg:bottom-0 inset-x-0 z-10 flex items-center justify-center h-8">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} Last Mile &middot; contact@onlastmile.com
        </p>
      </div>
    </div>
  )
}
