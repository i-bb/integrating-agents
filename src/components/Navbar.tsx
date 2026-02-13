import { useState, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Approach', href: '#approach' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-bg)]/85 backdrop-blur-xl border-b border-[var(--color-border)]'
          : ''
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <span className="inline-flex items-center justify-center w-7 h-7 border border-[var(--color-accent)] bg-[var(--color-accent)] transition-colors">
            <span className="font-display text-[14px] leading-none text-white tracking-[-0.02em]" style={{ paddingTop: '1px' }}>LM</span>
          </span>
          <span className="font-display text-[17px] tracking-[-0.02em] text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-colors">
            Last Mile
          </span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
              {l.label}
            </a>
          ))}
          <div className="w-px h-3.5 bg-[var(--color-border)]" />
          <button onClick={toggle} aria-label="Toggle theme" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <a href="#contact" className="text-[13px] font-medium px-4 py-1.5 bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] hover:-translate-y-px transition-all">
            Get in touch
          </a>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggle} aria-label="Toggle theme" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer">
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {open ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-xl px-6 py-5 space-y-4">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="block text-center text-sm font-medium px-4 py-2.5 bg-[var(--color-accent)] text-white">
            Get in touch
          </a>
        </div>
      )}
    </header>
  )
}
