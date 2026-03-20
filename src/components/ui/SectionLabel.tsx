interface SectionLabelProps {
  number: string
  title: string
  light?: boolean
}

export function SectionLabel({ number, title, light = false }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-8 md:mb-12">
      <span
        className="text-[11px] font-bold tracking-[0.18em] uppercase tabular-nums"
        style={{ color: light ? 'oklch(97% 0.005 80 / 0.5)' : 'var(--color-navy)' }}
      >
        {number}
      </span>
      <div
        className="h-px w-8 flex-shrink-0"
        style={{ background: light ? 'oklch(97% 0.005 80 / 0.25)' : 'var(--color-border-strong)' }}
      />
      <span
        className="text-[11px] font-bold tracking-[0.18em] uppercase"
        style={{ color: light ? 'oklch(97% 0.005 80 / 0.5)' : 'var(--color-text-muted)' }}
      >
        {title}
      </span>
    </div>
  )
}
