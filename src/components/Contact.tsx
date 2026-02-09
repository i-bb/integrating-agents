import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

interface FormData { name: string; email: string; company: string; role: string; service: string; needs: string }

export default function Contact() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    console.log('Form submission:', data)
    await new Promise(r => setTimeout(r, 600))
    setSent(true)
  }

  const input = 'w-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-[13px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]/40 transition-colors'

  return (
    <section id="contact" className="section !pb-12 relative">
      <div className="orb w-[400px] h-[250px] bg-[var(--color-secondary)] opacity-[0.04] top-0 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 mx-auto max-w-lg px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl tracking-[-0.01em] text-[var(--color-text)]">
            Let&apos;s build your <em className="text-[var(--color-tertiary)]">AI advantage.</em>
          </h2>
          <p className="mt-3 text-[13px] text-[var(--color-text-secondary)]">Tell us about your business. We&apos;ll respond within 24 hours.</p>
        </motion.div>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card p-10 text-center">
            <div className="mx-auto mb-3 w-10 h-10 bg-[var(--color-secondary-muted)] flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--color-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="text-base font-medium text-[var(--color-text)]">We&apos;ll be in touch.</h3>
            <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">Expect a response within 24 hours.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="card p-6 sm:p-8 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Name *</label>
                <input {...register('name', { required: true })} className={input} placeholder="Jane Smith" />
                {errors.name && <p className="mt-1 text-[11px] text-red-400">Required</p>}
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Work email *</label>
                <input type="email" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} className={input} placeholder="jane@company.com" />
                {errors.email && <p className="mt-1 text-[11px] text-red-400">Valid email required</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Company *</label>
                <input {...register('company', { required: true })} className={input} placeholder="Acme Inc." />
                {errors.company && <p className="mt-1 text-[11px] text-red-400">Required</p>}
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Role</label>
                <input {...register('role')} className={input} placeholder="VP Engineering" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Service</label>
              <select {...register('service')} className={`${input} cursor-pointer`} defaultValue="">
                <option value="" disabled>Select a service</option>
                <option value="strategy">AI Strategy</option>
                <option value="transformation">AI Transformation</option>
                <option value="engineering">AI Engineering</option>
                <option value="all">All of the above</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Your needs *</label>
              <textarea {...register('needs', { required: true })} rows={3} className={`${input} resize-none`} placeholder="What challenges are you facing?" />
              {errors.needs && <p className="mt-1 text-[11px] text-red-400">Required</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-2.5 text-[13px] font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] hover:-translate-y-px transition-all disabled:opacity-60 cursor-pointer">
              {isSubmitting ? 'Sending...' : 'Get started'}
            </button>
            <p className="text-center text-[11px] text-[var(--color-text-muted)]">No spam. No obligation. Just a conversation.</p>
          </motion.form>
        )}
      </div>
    </section>
  )
}
