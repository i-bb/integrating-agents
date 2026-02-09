import { motion } from 'framer-motion'

const items = [
  { title: 'No ownership', body: 'AI initiatives stall because nobody internally owns the transformation end-to-end.' },
  { title: 'Talent gap', body: 'Top AI engineering talent is scarce, expensive, and takes months to recruit.' },
  { title: 'Decks, not results', body: 'Consultancies hand you a strategy deck and disappear. Nothing gets built.' },
]

export default function ProblemStatement() {
  return (
    <section className="section">
      <div className="mx-auto max-w-5xl px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-6"
        >
          The problem
        </motion.p>

        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card p-6"
            >
              <h3 className="text-[13px] font-semibold text-[var(--color-text)] mb-2">{item.title}</h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7]">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 text-center"
        >
          <span className="font-display text-xl sm:text-2xl text-[var(--color-text)] tracking-[-0.01em]">
            We don&apos;t consult. <em className="text-[var(--color-tertiary)]">We execute.</em>
          </span>
        </motion.p>
      </div>
    </section>
  )
}
