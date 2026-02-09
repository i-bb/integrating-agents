import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const items = [
  { q: 'How is this different from a consulting firm?', a: 'Consulting firms hand you a deck and walk away. We embed with your team, build the solutions, train your people, and measure results. Strategy without execution is shelf-ware. We do both.' },
  { q: 'How does outcome-based pricing work?', a: 'For engineering engagements, we scope work into story-pointed sprints and charge based on what we deliver, not hours logged. You know the cost before the sprint starts, and you choose what gets prioritized.' },
  { q: 'What size companies do you work with?', a: 'We partner with growth-stage and enterprise companies that are serious about AI adoption. If you have the ambition to transform how your organization works, we want to talk.' },
  { q: 'How quickly can you start?', a: 'We can typically kick off a discovery engagement within one to two weeks of signing. Engineering pods ramp within the same timeframe depending on scope.' },
  { q: 'Do you replace our internal team?', a: 'Never. We augment and accelerate. Our goal is to make your existing team more effective through better tools, sharper processes, and hands-on upskilling.' },
]

function Row({ q, a, isLast }: { q: string; a: string; isLast: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={!isLast ? 'border-b border-[var(--color-border)]' : ''}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left cursor-pointer group">
        <span className="text-[13px] font-medium text-[var(--color-text)] pr-6 group-hover:text-[var(--color-tertiary)] transition-colors">{q}</span>
        <span className={`flex-shrink-0 text-[var(--color-text-muted)] text-xs transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="pb-4 text-[13px] text-[var(--color-text-secondary)] leading-[1.7] max-w-lg">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-3">FAQ</p>
          <h2 className="font-display text-2xl sm:text-3xl tracking-[-0.01em] text-[var(--color-text)]">
            Common <em>questions</em>
          </h2>
        </motion.div>
        <div className="mt-8">
          {items.map((item, i) => <Row key={i} q={item.q} a={item.a} isLast={i === items.length - 1} />)}
        </div>
      </div>
    </section>
  )
}
