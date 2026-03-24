import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AnimatedListItem } from './AnimatedList'
import { AnimatedGridPattern } from './AnimatedGridPattern'
import { IphoneMockup } from './IphoneMockup'

const IphoneMockupLight = (props: React.ComponentProps<typeof IphoneMockup>) => (
  <IphoneMockup {...props} />
)

const FaviconIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect width="32" height="32" rx="6" fill="#003B75" />
    <rect x="3"  y="24" width="7" height="5"  fill="#EDB345" fillOpacity="1" />
    <rect x="10" y="19" width="7" height="10" fill="#EDB345" fillOpacity="0.85" />
    <rect x="17" y="14" width="7" height="15" fill="#EDB345" fillOpacity="0.70" />
    <rect x="24" y="9"  width="5" height="20" fill="#EDB345" fillOpacity="0.55" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect width="32" height="32" rx="6" fill="#2563eb" />
    <path d="M7 10h18l-9 8-9-8z" fill="white" />
    <path d="M7 10v12h18V10" stroke="white" strokeWidth="1.5" fill="none" />
  </svg>
)

type Notification = {
  key: string
  app: string
  icon: 'lastmile' | 'mail'
  time: string
  title: string
  body: string
}

// Array ordered oldest→newest. AnimatedList reveals in order and reverses display,
// so n11 (now) always appears at the top as the latest item.
const notifications: Notification[] = [
  {
    key: 'n1',
    app: 'Last Mile',
    icon: 'lastmile',
    time: '10m ago',
    title: 'Campaign brief received',
    body: 'Q2 product launch — analysing audience segments across 6 channels.',
  },
  {
    key: 'n2',
    app: 'Last Mile',
    icon: 'lastmile',
    time: '9m ago',
    title: 'Top segments identified',
    body: '3 high-intent cohorts found. 28–40 SaaS buyers converting 3.2× above average.',
  },
  {
    key: 'n3',
    app: 'Last Mile',
    icon: 'lastmile',
    time: '8m ago',
    title: 'Competitor ads pulled',
    body: 'Scraped 47 active ads from 4 competitors. Identifying messaging gaps.',
  },
  {
    key: 'n4',
    app: 'Last Mile',
    icon: 'lastmile',
    time: '7m ago',
    title: 'Copy angles drafted',
    body: '5 ad variants written per channel. Pain-led hooks outperform feature-led by 2.1×.',
  },
  {
    key: 'n5',
    app: 'Last Mile',
    icon: 'lastmile',
    time: '6m ago',
    title: 'Landing page analysed',
    body: 'CTA placement, headline clarity and load speed reviewed. 3 quick wins flagged.',
  },
  {
    key: 'n6',
    app: 'Last Mile',
    icon: 'lastmile',
    time: '5m ago',
    title: 'Email sequence built',
    body: '6-step nurture sequence drafted for trial sign-ups. First send scheduled.',
  },
  {
    key: 'n7',
    app: 'Last Mile',
    icon: 'lastmile',
    time: '4m ago',
    title: 'Campaign package ready',
    body: 'Ads, landing copy, email flow and budget split — ready for your review.',
  },
  {
    key: 'n8',
    app: 'Last Mile',
    icon: 'lastmile',
    time: '3m ago',
    title: 'Email drafted and sent',
    body: 'Campaign summary sent to C. Walsh (Marketing Director) and R. Osei (Growth Lead) with full brief attached.',
  },
  {
    key: 'n9',
    app: 'Mail',
    icon: 'mail',
    time: '2m ago',
    title: 'R. Osei — Growth Lead',
    body: 'Just reviewed the brief you sent. These hooks are sharper than anything we\'ve written internally. Launching tomorrow.',
  },
  {
    key: 'n10',
    app: 'Last Mile',
    icon: 'lastmile',
    time: '1m ago',
    title: 'Launch day performance',
    body: 'CTR up 41% vs last quarter. Cost-per-lead down $18. Best opening day this year.',
  },
  {
    key: 'n11',
    app: 'Mail',
    icon: 'mail',
    time: 'now',
    title: 'C. Walsh — Marketing Director',
    body: 'We\'ve been trying to crack this segment for 6 months. It did it overnight. What else can we give it?',
  },
]

function NotificationTile({ n }: { n: Notification }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: '0 0 0 0.5px rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
        borderRadius: '14px',
        padding: '9px 11px',
        display: 'flex',
        gap: '9px',
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      }}
      onClick={() => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
    >
      <div style={{ width: '30px', height: '30px', flexShrink: 0, borderRadius: '7px', overflow: 'hidden' }}>
        {n.icon === 'lastmile' ? <FaviconIcon /> : <MailIcon />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'oklch(35% 0.12 250)', letterSpacing: '0.01em', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
            {n.app}
          </span>
          <span style={{ fontSize: '9px', color: 'oklch(55% 0.008 250)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', flexShrink: 0, marginLeft: '6px' }}>
            {n.time}
          </span>
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'oklch(12% 0.012 250)', lineHeight: 1.3, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', marginBottom: '2px' }}>
          {n.title}
        </div>
        <div style={{ fontSize: '10px', color: 'oklch(38% 0.010 250)', lineHeight: 1.4, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {n.body}
        </div>
      </div>
    </div>
  )
}

function SystemClock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const h = time.getHours()
  const m = time.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = (h % 12 || 12).toString()
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = time.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  return (
    <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '12px' }}>
      <div style={{ fontSize: '56px', fontWeight: 200, color: 'oklch(14% 0.012 250)', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        {h12}:{m}
        <span style={{ fontSize: '22px', fontWeight: 300, marginLeft: '6px', opacity: 0.45 }}>{ampm}</span>
      </div>
      <div style={{ fontSize: '13px', color: 'oklch(44% 0.010 250)', marginTop: '6px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        {dayName}, {monthDay}
      </div>
    </div>
  )
}

function LockScreen() {
  const DELAY = 1400
  const [revealedIndex, setRevealedIndex] = useState(0)

  useEffect(() => {
    if (revealedIndex >= notifications.length - 1) return
    const t = setTimeout(() => setRevealedIndex((i) => i + 1), DELAY)
    return () => clearTimeout(t)
  }, [revealedIndex])

  const itemsToShow = useMemo(
    () => notifications.slice(0, revealedIndex + 1).reverse(),
    [revealedIndex]
  )

  return (
    <div style={{ width: '100%', height: '100%', background: 'oklch(93% 0.008 80)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <AnimatedGridPattern
        width={48}
        height={48}
        numSquares={30}
        maxOpacity={0.028}
        duration={4}
        repeatDelay={1.5}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', color: 'oklch(35% 0.12 250)' }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <SystemClock />
        <div style={{ flex: 1, overflowY: 'hidden', padding: '0 8px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex flex-col items-center gap-2">
            <AnimatePresence>
              {itemsToShow.map((n, displayIdx) => {
                // displayIdx 0 = top (newest). Each step down = ~30s older.
                let time: string
                if (displayIdx === 0) time = 'now'
                else if (displayIdx === 1) time = '30s ago'
                else if (displayIdx === 2) time = '1m ago'
                else if (displayIdx === 3) time = '2m ago'
                else if (displayIdx === 4) time = '3m ago'
                else if (displayIdx === 5) time = '4m ago'
                else if (displayIdx === 6) time = '5m ago'
                else if (displayIdx === 7) time = '6m ago'
                else if (displayIdx === 8) time = '7m ago'
                else if (displayIdx === 9) time = '8m ago'
                else time = `${displayIdx}m ago`
                return (
                  <AnimatedListItem key={n.key}>
                    <NotificationTile n={{ ...n, time }} />
                  </AnimatedListItem>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
        <div style={{ padding: '10px 0 18px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100px', height: '4px', borderRadius: '2px', background: 'oklch(0% 0 0 / 0.15)' }} />
        </div>
      </div>
    </div>
  )
}

const PHONE_W = 380
const PHONE_H_FULL = (PHONE_W / 433) * 882
const CROP_H = PHONE_H_FULL * 0.75

export function LockScreenDemo() {
  return (
    <div
      style={{
        marginLeft: '-2rem',
        display: 'inline-block',
        position: 'relative',
        padding: '16px 16px 0 16px',
        background: 'var(--color-navy)',
        border: '1px solid oklch(0% 0 0 / 0.10)',
        borderRight: '5px solid oklch(0% 0 0 / 0.35)',
        borderBottom: '5px solid oklch(0% 0 0 / 0.35)',
        boxShadow: '12px 12px 0 0 oklch(0% 0 0 / 0.28), 0 20px 60px oklch(0% 0 0 / 0.22), 0 4px 16px oklch(0% 0 0 / 0.12)',
      }}
    >
      <div style={{ width: `${PHONE_W}px`, height: `${CROP_H}px`, overflow: 'hidden' }}>
        <IphoneMockupLight style={{ width: `${PHONE_W}px` }}>
          <LockScreen />
        </IphoneMockupLight>
      </div>
    </div>
  )
}
