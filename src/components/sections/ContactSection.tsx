import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AnimateIn } from '../ui/AnimateIn'
import { SectionLabel } from '../ui/SectionLabel'

interface FormData {
  name: string
  email: string
  company: string
  role: string
  needs: string
}

export function ContactSection() {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setServerError('')
    try {
      const res = await fetch('https://yiymekxdiebwdvwkhmcb.supabase.co/functions/v1/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          role: data.role || 'Not provided',
          message: data.needs,
        }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSent(true)
    } catch {
      setServerError('Something went wrong. Try again or email us at contact@onlastmile.com')
    }
  }

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ background: 'var(--color-bg)' }}
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className="section-divider mb-16" aria-hidden="true" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* Left — persuasive copy */}
          <div>
            <SectionLabel number="05" title="Let's talk" />
            <AnimateIn>
              <h2
                id="contact-heading"
                className="display-lg"
                style={{ color: 'var(--color-text)' }}
              >
                Let's find{' '}
                <span className="gold-underline">your last mile.</span>
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <p
                className="mt-5 text-[17px] leading-[1.7]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Tell us about your business. We'll get back to you within one business day with specific ideas about where AI can help — no pitch, no obligation, no jargon.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <div className="mt-8 flex flex-col gap-4">
                {[
                  { icon: '→', text: 'We respond within one business day' },
                  { icon: '→', text: 'No tech knowledge required to get started' },
                  { icon: '→', text: 'No pitch, no obligation, ever' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span
                      className="text-[16px] font-bold flex-shrink-0"
                      style={{ color: 'var(--color-gold)' }}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <p
                      className="text-[14px]"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>

          {/* Right — form */}
          <AnimateIn delay={0.1}>
            {sent ? (
              <div
                className="p-10 text-center card-pop"
                style={{ background: 'var(--color-surface)' }}
                role="status"
                aria-live="polite"
              >
                <div
                  className="w-14 h-14 flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: 'var(--color-navy-muted)',
                    border: '1px solid var(--color-border-strong)',
                  }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3
                  className="text-[1.4rem] font-black tracking-[-0.02em] mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  We'll be in touch.
                </h3>
                <p
                  className="text-[15px] leading-[1.6]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Expect a reply within one business day. We'll come ready with thoughts specific to your business — not a generic sales pitch.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
                aria-label="Contact form"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="form-field">
                    <label
                      htmlFor="name"
                      className="block text-[12px] font-bold uppercase tracking-[0.14em] mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Your name <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      className="form-input"
                      placeholder="First and last name"
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 text-[12px]" style={{ color: 'var(--color-terra)' }} role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="form-field">
                    <label
                      htmlFor="email"
                      className="block text-[12px] font-bold uppercase tracking-[0.14em] mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Work email <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                      })}
                      className="form-input"
                      placeholder="you@yourcompany.com"
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-[12px]" style={{ color: 'var(--color-terra)' }} role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="form-field">
                    <label
                      htmlFor="company"
                      className="block text-[12px] font-bold uppercase tracking-[0.14em] mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Business name <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="company"
                      {...register('company', { required: 'Business name is required' })}
                      className="form-input"
                      placeholder="Your company"
                      autoComplete="organization"
                      aria-required="true"
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? 'company-error' : undefined}
                    />
                    {errors.company && (
                      <p id="company-error" className="mt-1.5 text-[12px]" style={{ color: 'var(--color-terra)' }} role="alert">
                        {errors.company.message}
                      </p>
                    )}
                  </div>
                  <div className="form-field">
                    <label
                      htmlFor="role"
                      className="block text-[12px] font-bold uppercase tracking-[0.14em] mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Your role
                    </label>
                    <input
                      id="role"
                      {...register('role')}
                      className="form-input"
                      placeholder="Owner, Manager, etc."
                      autoComplete="organization-title"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label
                    htmlFor="needs"
                    className="block text-[12px] font-bold uppercase tracking-[0.14em] mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    What's your biggest challenge right now?{' '}
                    <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="needs"
                    {...register('needs', { required: 'Please tell us about your challenge' })}
                    className="form-input resize-none"
                    rows={4}
                    placeholder="No need to speak tech. Just tell us what's taking too long, costing too much, or not working the way it should."
                    aria-required="true"
                    aria-invalid={!!errors.needs}
                    aria-describedby={errors.needs ? 'needs-error' : undefined}
                  />
                  {errors.needs && (
                    <p id="needs-error" className="mt-1.5 text-[12px]" style={{ color: 'var(--color-terra)' }} role="alert">
                      {errors.needs.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-[14px] font-bold tracking-wide transition-all card-pop card-pop-hover cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--color-navy)',
                    color: 'var(--color-text-inverse)',
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Start the conversation →'}
                </button>

                {serverError && (
                  <p className="text-[13px] text-center" style={{ color: 'var(--color-terra)' }} role="alert">
                    {serverError}
                  </p>
                )}

                <p
                  className="text-[12px] text-center"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No spam. No obligation. Just a real conversation about your business.
                </p>
              </form>
            )}
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
