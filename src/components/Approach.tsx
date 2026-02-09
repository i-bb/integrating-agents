import { motion } from 'framer-motion'

const steps = [
  { num: '01', title: 'Discover', body: 'Deep audit of your operations, people, and tech stack.' },
  { num: '02', title: 'Prioritize', body: 'AI use cases ranked by ROI and feasibility.' },
  { num: '03', title: 'Build', body: 'Dedicated pods deploy solutions in focused sprints.' },
  { num: '04', title: 'Measure', body: 'Baseline metrics tracked. We prove the ROI, or pivot.' },
]

export default function Approach() {
  return (
    <section id="approach" className="section relative overflow-hidden">
      <div className="absolute inset-0 dot-grid mask-radial opacity-20" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-3">Approach</p>
          <h2 className="font-display text-2xl sm:text-3xl tracking-[-0.01em] text-[var(--color-text)]">
            How we <em>work</em>
          </h2>
          <p className="mt-3 text-[13px] text-[var(--color-text-secondary)] max-w-md leading-[1.7]">
            A proven process that moves fast without cutting corners.
          </p>
        </motion.div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card p-6 overflow-hidden"
            >
              <span className="block font-display text-2xl text-[var(--color-secondary)] opacity-40 mb-3 select-none">{s.num}</span>
              <h3 className="text-[14px] font-semibold text-[var(--color-text)] mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7]">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <a href="#contact" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-tertiary)] hover:text-[var(--color-tertiary-hover)] transition-colors group">
            Start the conversation
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
