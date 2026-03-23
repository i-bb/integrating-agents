import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const testimonials = [
  {
    quote: "I honestly didn't think Last Mile would get how our business works. Real estate deal flow is complicated and every firm does it differently. But Last Mile took the time to understand our process before building anything. Last Mile automated everything from deal sourcing to LOI prep to closing. Nothing falls through the cracks anymore.",
    name: 'Managing Director',
    company: 'Private Real Estate Development Firm',
    industry: 'Real Estate',
  },
  {
    quote: "Every week it was the same thing. Hours pulling numbers, cleaning up data, putting it into a format people could actually read. Last Mile built us an automated reporting system that handles all of it on its own. Our team wakes up and the work is already done. We trust the output and we don't think about it anymore. That's all we wanted.",
    name: 'Co-Founder',
    company: 'Stealth-Stage Tech Startup',
    industry: 'Marketing & Analytics',
  },
  {
    quote: "We always prioritise in-person guest interactions — that's the heart of what we do. Last Mile took everything else off our plate. A voice concierge, a task management tool, the whole back-end coordination — it just runs. Requests come in, get assigned, get done. Our staff is less stressed and our guests notice, even if they can't put their finger on why.",
    name: 'Director of Operations',
    company: 'Luxury Boutique Hotel, Soho NYC',
    industry: 'Hospitality — New York City',
  },
]

export function TestimonialSection() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  function prev() { setActive(i => (i - 1 + testimonials.length) % testimonials.length) }
  function next() { setActive(i => (i + 1) % testimonials.length) }

  const t = testimonials[active]

  return (
    <section
      className="section-padding"
      style={{ background: 'var(--color-navy)' }}
      aria-labelledby="testimonial-heading"
    >
      <h2 id="testimonial-heading" className="sr-only">What our clients say</h2>

      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Quotemark */}
          <div
            className="text-[6rem] font-black select-none mb-2"
            style={{ color: 'var(--color-gold)', lineHeight: '0.7', opacity: 0.4 }}
            aria-hidden="true"
          >
            "
          </div>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="text-[1.35rem] md:text-[1.6rem] font-bold leading-[1.4] tracking-[-0.02em] mb-8"
                style={{ color: 'oklch(97% 0.005 80)' }}
              >
                "{t.quote}"
              </p>

              <footer>
                <div
                  className="w-12 h-px mx-auto mb-5"
                  style={{ background: 'var(--color-gold)', opacity: 0.5 }}
                  aria-hidden="true"
                />
                <cite className="not-italic">
                  <p className="text-[14px] font-bold tracking-wide" style={{ color: 'oklch(97% 0.005 80)' }}>
                    {t.name}
                  </p>
                  <p className="text-[13px] mt-1" style={{ color: 'oklch(97% 0.005 80 / 0.5)' }}>
                    {t.company}
                  </p>
                  <p
                    className="text-[11px] mt-2 font-semibold tracking-[0.12em] uppercase"
                    style={{ color: 'var(--color-gold)', opacity: 0.7 }}
                  >
                    {t.industry}
                  </p>
                </cite>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-100"
              style={{ border: '1px solid oklch(97% 0.005 80 / 0.2)', color: 'oklch(97% 0.005 80 / 0.5)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            <div className="flex gap-2 items-center" role="tablist" aria-label="Testimonials">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  role="tab"
                  aria-selected={active === i}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setActive(i)}
                  animate={{
                    width: active === i ? 24 : 8,
                    background: active === i ? 'var(--color-gold)' : 'oklch(97% 0.005 80 / 0.25)',
                  }}
                  transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 32 }}
                  style={{ height: '8px', cursor: 'pointer', border: 'none', padding: 0 }}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-100"
              style={{ border: '1px solid oklch(97% 0.005 80 / 0.2)', color: 'oklch(97% 0.005 80 / 0.5)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
