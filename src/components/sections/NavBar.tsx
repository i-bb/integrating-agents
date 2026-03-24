import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const bars = [
  { x: 3,  y: 24, w: 7, h: 5,  opacity: 1,    delay: 0.00 },
  { x: 10, y: 19, w: 7, h: 10, opacity: 0.85, delay: 0.05 },
  { x: 17, y: 14, w: 7, h: 15, opacity: 0.70, delay: 0.10 },
  { x: 24, y: 9,  w: 5, h: 20, opacity: 0.55, delay: 0.15 },
]

function LogoMark({ size = 28 }: { size?: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 32 32" fill="none"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <rect width="32" height="32" rx="3" fill="var(--color-navy)"/>
      {bars.map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x} width={bar.w} height={bar.h}
          fill="var(--color-gold)"
          fillOpacity={bar.opacity}
          animate={{ y: hovered ? bar.y - 3 : bar.y }}
          transition={{ delay: bar.delay, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </motion.svg>
  )
}

interface NavBarProps {
  onContactClick: () => void
}

export function NavBar({ onContactClick }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Services', href: '#services' },
    { label: 'Industries', href: '#industries' },
  ]

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'oklch(93% 0.008 80 / 0.96)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border-strong)' : '1px solid transparent',
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group" aria-label="Last Mile — home">
              <LogoMark size={30} />
              <span
                className="text-[15px] font-black tracking-[-0.02em]"
                style={{ color: 'var(--color-text)' }}
              >
                Last Mile
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link text-[14px] font-medium"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA — always visible; replaces hamburger on mobile */}
            <div className="flex items-center gap-3">
              <button
                onClick={onContactClick}
                className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold tracking-wide transition-all duration-200 card-pop card-pop-hover cursor-pointer"
                style={{
                  background: 'var(--color-navy)',
                  color: 'var(--color-text-inverse)',
                }}
              >
                Let's talk →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 md:hidden"
              style={{ background: 'oklch(0% 0 0 / 0.5)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col md:hidden"
              style={{ background: 'var(--color-bg)', borderLeft: '1px solid var(--color-border-strong)' }}
            >
              <div className="flex items-center justify-between px-6 h-16 border-b" style={{ borderColor: 'var(--color-border-strong)' }}>
                <div className="flex items-center gap-2.5">
                  <LogoMark size={26} />
                  <span className="text-[14px] font-black tracking-[-0.02em]" style={{ color: 'var(--color-text)' }}>Last Mile</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)' }}
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4 flex-1" aria-label="Mobile navigation">
                {navLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-[15px] font-medium rounded-sm transition-colors"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="p-4 border-t" style={{ borderColor: 'var(--color-border-strong)' }}>
                <button
                  onClick={() => { setMobileOpen(false); onContactClick() }}
                  className="w-full py-3.5 text-[14px] font-bold tracking-wide card-pop cursor-pointer"
                  style={{ background: 'var(--color-navy)', color: 'var(--color-text-inverse)' }}
                >
                  Let's talk
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
