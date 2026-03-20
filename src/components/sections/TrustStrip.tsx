const industries = [
  'Healthcare', 'Retail', 'Professional Services', 'Restaurants',
  'Real Estate', 'Finance', 'Construction', 'Education',
  'Hospitality', 'Legal', 'Insurance', 'Manufacturing',
]

// Double the list for seamless looping
const track = [...industries, ...industries]

export function TrustStrip() {
  return (
    <div
      className="relative overflow-hidden py-4"
      style={{ background: 'var(--color-navy)' }}
      aria-label="Industries we serve"
    >
      {/* Fade masks left/right */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, var(--color-navy), transparent)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, var(--color-navy), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-0 marquee-track whitespace-nowrap" aria-hidden="true">
        {track.map((name, i) => (
          <span key={`${name}-${i}`} className="inline-flex items-center gap-4 px-5">
            <span
              className="text-[12px] font-semibold tracking-[0.16em] uppercase"
              style={{ color: 'oklch(97% 0.005 80 / 0.65)' }}
            >
              {name}
            </span>
            <span
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: 'oklch(80% 0.14 80 / 0.5)' }}
            />
          </span>
        ))}
      </div>

      {/* Accessible text */}
      <p className="sr-only">
        We work across: {industries.join(', ')} and more.
      </p>
    </div>
  )
}
