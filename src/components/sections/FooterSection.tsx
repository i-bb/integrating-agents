function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="3" fill="oklch(97% 0.005 80 / 0.15)"/>
      <rect x="3" y="24" width="7" height="5" fill="var(--color-gold)"/>
      <rect x="10" y="19" width="7" height="10" fill="var(--color-gold)" opacity="0.8"/>
      <rect x="17" y="14" width="7" height="15" fill="var(--color-gold)" opacity="0.65"/>
      <rect x="24" y="9" width="5" height="20" fill="var(--color-gold)" opacity="0.5"/>
    </svg>
  )
}

export function FooterSection() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{ background: 'var(--color-navy-deep)' }}
      aria-label="Site footer"
    >
      {/* Main footer content */}
      <div className="container section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-start">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <LogoMark size={30} />
              <span
                className="text-[15px] font-black tracking-[-0.02em]"
                style={{ color: 'oklch(97% 0.005 80)' }}
              >
                Last Mile
              </span>
            </div>
            <p
              className="text-[14px] leading-[1.65] max-w-xs"
              style={{ color: 'oklch(97% 0.005 80 / 0.5)' }}
            >
              AI implementation for growing businesses. We close the gap between having AI tools and getting real results from them.
            </p>
            <a
              href="mailto:contact@onlastmile.com"
              className="mt-4 inline-block text-[13px] font-medium transition-colors"
              style={{ color: 'oklch(80% 0.14 80 / 0.7)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'oklch(80% 0.14 80)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'oklch(80% 0.14 80 / 0.7)')}
            >
              contact@onlastmile.com
            </a>
          </div>

          {/* Nav columns */}
          <div className="flex gap-12 md:gap-16">
            <div>
              <p
                className="text-[11px] font-bold tracking-[0.16em] uppercase mb-4"
                style={{ color: 'oklch(97% 0.005 80 / 0.35)' }}
              >
                Services
              </p>
              <nav aria-label="Services navigation">
                <ul className="flex flex-col gap-2.5">
                  {[
                    { label: 'Figure out where to start', href: '#services' },
                    { label: 'Build what works', href: '#services' },
                    { label: 'Fix what failed', href: '#services' },
                    { label: 'Keep it running', href: '#services' },
                  ].map(link => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] transition-colors"
                        style={{ color: 'oklch(97% 0.005 80 / 0.55)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'oklch(97% 0.005 80 / 0.9)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'oklch(97% 0.005 80 / 0.55)')}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div>
              <p
                className="text-[11px] font-bold tracking-[0.16em] uppercase mb-4"
                style={{ color: 'oklch(97% 0.005 80 / 0.35)' }}
              >
                Company
              </p>
              <nav aria-label="Company navigation">
                <ul className="flex flex-col gap-2.5">
                  {[
                    { label: 'How it works', href: '#how-it-works' },
                    { label: 'Industries', href: '#industries' },
                    { label: 'Get in touch', href: '#contact' },
                  ].map(link => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] transition-colors"
                        style={{ color: 'oklch(97% 0.005 80 / 0.55)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'oklch(97% 0.005 80 / 0.9)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'oklch(97% 0.005 80 / 0.55)')}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: 'oklch(97% 0.005 80 / 0.08)' }}
      >
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-[12px]"
            style={{ color: 'oklch(97% 0.005 80 / 0.35)' }}
          >
            © {year} Last Mile · All rights reserved
          </p>
          <p
            className="text-[12px]"
            style={{ color: 'oklch(97% 0.005 80 / 0.25)' }}
          >
            onlastmile.com
          </p>
        </div>
      </div>
    </footer>
  )
}
