export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 h-24 flex items-center justify-center gap-4 text-[11px] text-[var(--color-text-muted)]">
        <span className="font-display text-[13px] text-[var(--color-text-secondary)]">&copy; {new Date().getFullYear()} Integrating Agents</span>
        <span>&middot;</span>
        <a href="mailto:contact@integratingagents.ai" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
          contact@integratingagents.ai
        </a>
      </div>
    </footer>
  )
}
