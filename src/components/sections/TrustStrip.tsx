import { saasIcons } from '../ui/saasIcons'

const tileStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '64px',
  height: '64px',
  minWidth: '64px',
  minHeight: '64px',
  marginLeft: '14px',
  marginRight: '14px',
  background: 'var(--color-bg)',
  border: '1px solid oklch(0% 0 0 / 0.07)',
  boxShadow: '4px 4px 0 0 oklch(18% 0.10 250), 0 2px 12px oklch(18% 0.10 250 / 0.6), inset 0 1px 0 oklch(97% 0.005 80 / 0.6)',
}

function IconList({ prefix }: { prefix: string }) {
  return (
    <>
      {saasIcons.map((icon) => (
        <span key={`${prefix}-${icon.slug}`} title={icon.title} style={tileStyle}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"
            style={{ color: 'var(--color-navy)', flexShrink: 0 }} aria-hidden="true">
            <path d={icon.path} />
          </svg>
        </span>
      ))}
    </>
  )
}

export function TrustStrip() {
  return (
    <div style={{ background: 'var(--color-navy)' }} aria-label="Tool integrations">
      <p
        className="text-center text-[13px] font-semibold tracking-[0.14em] uppercase pt-6 pb-5"
        style={{ color: 'oklch(97% 0.005 80 / 0.5)' }}
      >
        We integrate with any tool your business already runs on
      </p>

      <div className="relative overflow-hidden pb-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--color-navy), transparent)' }}
          aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--color-navy), transparent)' }}
          aria-hidden="true" />

        {/* Two identical lists side by side — first scrolls off left as second takes over */}
        <div className="flex items-center marquee-track" style={{ width: 'max-content' }} aria-hidden="true">
          <IconList prefix="a" />
          <IconList prefix="b" />
        </div>
      </div>

      <p className="sr-only">Integrates with: {saasIcons.map(i => i.title).join(', ')}</p>
    </div>
  )
}
