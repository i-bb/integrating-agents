import type { TrackerEvent, TrackerElement, EventType } from './types'

const FLUSH_INTERVAL_MS = 10_000
const FLUSH_BATCH_SIZE = 20
const DEDUP_WINDOW_MS = 500
const DEDUP_MAX_SIZE = 100

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function extractElement(el: HTMLElement): TrackerElement | undefined {
  // Walk up to find first interactive ancestor
  const interactive = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'])
  let target: HTMLElement | null = el
  while (target && !interactive.has(target.tagName)) {
    target = target.parentElement
  }
  if (!target) target = el

  const tag = target.tagName.toLowerCase()
  const text = target.textContent?.trim().slice(0, 120) || undefined
  const ariaLabel = target.getAttribute('aria-label') || undefined
  const id = target.id || undefined
  const href = (target as HTMLAnchorElement).href || undefined
  const type = (target as HTMLInputElement).type || undefined
  const name = (target as HTMLInputElement).name || undefined
  const classes = target.className
    ? target.className.split(' ').filter(Boolean).slice(0, 5)
    : undefined

  // Only return if there's meaningful context
  if (!text && !ariaLabel && !id && !href && tag === 'div') return undefined

  return { tag, text, ariaLabel, id, href, type, name, classes }
}

function extractPath(el: HTMLElement): string[] {
  const path: string[] = []
  let current: HTMLElement | null = el.parentElement
  let depth = 0

  while (current && depth < 4) {
    const skip = new Set(['BODY', 'HTML', 'HEAD'])
    if (skip.has(current.tagName)) break

    const tag = current.tagName.toLowerCase()
    const id = current.id ? `#${current.id}` : ''
    const cls = current.classList[0] ? `.${current.classList[0]}` : ''
    path.unshift(`${tag}${id || cls}`)

    current = current.parentElement
    depth++
  }

  return path.slice(-4)
}

function hasTrackerIgnore(el: HTMLElement): boolean {
  let current: HTMLElement | null = el
  while (current) {
    if (current.hasAttribute('data-tracker-ignore')) return true
    current = current.parentElement
  }
  return false
}

export class Tracker {
  private apiUrl: string
  private sessionId: string
  private userId: string
  private seq: number = 0
  private buffer: TrackerEvent[] = []
  private flushTimer: ReturnType<typeof setInterval> | null = null
  private recentEventIds: Map<string, number> = new Map()

  private handleClick: (e: MouseEvent) => void
  private handleSubmit: (e: SubmitEvent) => void
  private handleBlur: (e: FocusEvent) => void
  private handleBeforeUnload: () => void

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl

    // Session ID: fresh each page load (sessionStorage)
    this.sessionId = sessionStorage.getItem('_t_sid') || generateId()
    sessionStorage.setItem('_t_sid', this.sessionId)

    // User ID: persistent across sessions (localStorage)
    this.userId = localStorage.getItem('_t_uid') || generateId()
    localStorage.setItem('_t_uid', this.userId)

    this.handleClick = this.onClickEvent.bind(this)
    this.handleSubmit = this.onSubmitEvent.bind(this)
    this.handleBlur = this.onBlurEvent.bind(this)
    this.handleBeforeUnload = this.onBeforeUnload.bind(this)

    document.addEventListener('click', this.handleClick, true)
    document.addEventListener('submit', this.handleSubmit, true)
    document.addEventListener('blur', this.handleBlur, true)
    window.addEventListener('beforeunload', this.handleBeforeUnload)

    this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS)
  }

  trackView(view: string, title: string): void {
    this.push({
      eventType: 'pageview',
      url: `${window.location.href}#${view}`,
      pageTitle: title,
    })
    this.maybeFlush()
  }

  getSessionId(): string {
    return this.sessionId
  }

  getEventCount(): number {
    return this.seq
  }

  destroy(): void {
    document.removeEventListener('click', this.handleClick, true)
    document.removeEventListener('submit', this.handleSubmit, true)
    document.removeEventListener('blur', this.handleBlur, true)
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    if (this.flushTimer) clearInterval(this.flushTimer)
    this.flush()
  }

  private push(partial: Partial<TrackerEvent> & { eventType: EventType }): void {
    const event: TrackerEvent = {
      sessionId: this.sessionId,
      userId: this.userId,
      eventId: generateId(),
      seq: ++this.seq,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      pageTitle: document.title,
      ...partial,
    }

    // Dedup within DEDUP_WINDOW_MS
    const sig = `${event.eventType}:${event.element?.tag || ''}:${event.element?.text || ''}:${event.element?.id || ''}`
    const now = Date.now()
    const last = this.recentEventIds.get(sig)
    if (last && now - last < DEDUP_WINDOW_MS) {
      this.seq-- // revert seq increment
      return
    }
    this.recentEventIds.set(sig, now)

    // Trim dedup map
    if (this.recentEventIds.size > DEDUP_MAX_SIZE) {
      const oldest = this.recentEventIds.keys().next().value
      if (oldest) this.recentEventIds.delete(oldest)
    }

    this.buffer.push(event)
  }

  private maybeFlush(): void {
    if (this.buffer.length >= FLUSH_BATCH_SIZE) {
      this.flush()
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return
    const batch = [...this.buffer]
    this.buffer = []

    try {
      await fetch(`${this.apiUrl}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch }),
      })
    } catch {
      // Silently swallow — tracking must never break the page
    }
  }

  private onBeforeUnload(): void {
    if (this.buffer.length === 0) return
    const batch = [...this.buffer]
    this.buffer = []

    try {
      navigator.sendBeacon(
        `${this.apiUrl}/track`,
        JSON.stringify({ events: batch }),
      )
    } catch {
      // ignore
    }
  }

  private onClickEvent(e: MouseEvent): void {
    const target = e.target as HTMLElement
    if (!target || hasTrackerIgnore(target)) return

    const element = extractElement(target)
    const elementPath = extractPath(target)

    this.push({ eventType: 'click', element: element ?? undefined, elementPath })
    this.maybeFlush()
  }

  private onSubmitEvent(e: SubmitEvent): void {
    const target = e.target as HTMLElement
    if (!target || hasTrackerIgnore(target)) return

    const submitter = e.submitter as HTMLElement | null
    const element = submitter ? extractElement(submitter) : undefined
    const elementPath = extractPath(target)

    this.push({ eventType: 'submit', element: element ?? undefined, elementPath })
    this.maybeFlush()
  }

  private onBlurEvent(e: FocusEvent): void {
    const target = e.target as HTMLInputElement
    if (!target || hasTrackerIgnore(target)) return
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
    if (!target.value?.trim()) return

    const element = extractElement(target)
    const elementPath = extractPath(target)

    this.push({ eventType: 'input_change', element: element ?? undefined, elementPath })
    this.maybeFlush()
  }
}
