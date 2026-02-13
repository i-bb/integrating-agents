import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CYCLE_DURATION = 24000

interface QueryData {
  query: string
  tasks: string[]
  providers: number[]
  failedOutputs: string[]
  outputs: string[]
}

const FAILED_LABELS = [
  'Incomplete output',
  'Wrong format',
  'Not actionable',
]

const QUERIES: QueryData[] = [
  {
    query: 'Analyze our Q4 pipeline and flag at-risk deals',
    tasks: ['Extract CRM data', 'Score deal health', 'Generate risk report'],
    providers: [0, 1, 2],
    failedOutputs: FAILED_LABELS,
    outputs: ['Pipeline Analysis', 'Sales Intelligence', 'Risk Report'],
  },
  {
    query: 'Summarize 200 vendor contracts for compliance gaps',
    tasks: ['Parse legal docs', 'Cross-ref regulations', 'Flag violations'],
    providers: [1, 2, 3],
    failedOutputs: FAILED_LABELS,
    outputs: ['Compliance Audit', 'Regulatory Map', 'Violation Report'],
  },
  {
    query: 'Build a competitive pricing model for APAC expansion',
    tasks: ['Gather market data', 'Analyze pricing', 'Model scenarios'],
    providers: [2, 0, 3],
    failedOutputs: FAILED_LABELS,
    outputs: ['Market Analysis', 'Pricing Model', 'Scenario Report'],
  },
  {
    query: 'Audit support tickets for product insight patterns',
    tasks: ['Classify themes', 'Correlate with churn', 'Extract requests'],
    providers: [0, 1, 2],
    failedOutputs: FAILED_LABELS,
    outputs: ['Theme Analysis', 'Churn Insights', 'Feature Roadmap'],
  },
  {
    query: 'Draft board-ready materials from quarterly data',
    tasks: ['Pull financials', 'Synthesize narrative', 'Format deliverables'],
    providers: [1, 0, 3],
    failedOutputs: FAILED_LABELS,
    outputs: ['Financial Summary', 'Board Narrative', 'Slide Deck'],
  },
  {
    query: 'Identify upsell opportunities across our install base',
    tasks: ['Segment accounts', 'Analyze usage', 'Rank expansion'],
    providers: [2, 3, 1],
    failedOutputs: FAILED_LABELS,
    outputs: ['Account Segments', 'Usage Insights', 'Revenue Map'],
  },
]

const PROVIDER_LOGOS: { name: string; path: string }[] = [
  {
    name: 'Anthropic',
    path: 'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z',
  },
  {
    name: 'OpenAI',
    path: 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z',
  },
  {
    name: 'Gemini',
    path: 'M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81',
  },
  {
    name: 'Grok',
    path: 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
  },
]

// Layout positions (viewBox 820 x 300)
const QUERY_POS = { x: 10, y: 95, w: 175, h: 110 }
const TASK_POSITIONS = [
  { x: 255, y: 22, w: 125, h: 44 },
  { x: 255, y: 118, w: 125, h: 44 },
  { x: 255, y: 214, w: 125, h: 44 },
]
const PROVIDER_POSITIONS = [
  { x: 460, y: 14, s: 38 },
  { x: 460, y: 84, s: 38 },
  { x: 460, y: 154, s: 38 },
  { x: 460, y: 224, s: 38 },
]
const OUTPUT_POSITIONS = [
  { x: 640, y: 22, w: 125, h: 44 },
  { x: 640, y: 118, w: 125, h: 44 },
  { x: 640, y: 214, w: 125, h: 44 },
]

// "Last Mile" container box bounds (wraps tasks + providers)
const LM_BOX = { x: 240, y: 2, w: 273, h: 278, r: 0 }

function getPathD(x1: number, y1: number, x2: number, y2: number): string {
  const cx1 = x1 + (x2 - x1) * 0.4
  const cx2 = x1 + (x2 - x1) * 0.6
  return `M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`
}

function TypedText({ text, durationMs }: { text: string; durationMs: number }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    const perChar = durationMs / text.length
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, perChar)
    return () => clearInterval(id)
  }, [text, durationMs])

  return (
    <span>
      {displayed}
      <span className="inline-block w-[1px] h-[10px] bg-[var(--color-secondary)] ml-[2px] animate-pulse" />
    </span>
  )
}

const nodeBase = 'border border-white/[0.08] bg-white/[0.05]'
const cardShadow = { boxShadow: '3px 3px 0 0 rgba(239,239,235,0.18), 0 2px 6px rgba(0,0,0,0.15)' }
const heavyShadow = { boxShadow: '4px 4px 0 0 rgba(239,239,235,0.22), 0 3px 8px rgba(0,0,0,0.2)' }

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.2, ease: 'easeInOut' as const, delay }, opacity: { duration: 0.2, delay } },
  }),
}

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
  }),
}

/*
 * Animation timeline (24s cycle):
 *  0.0 - 1.2s  Query types in (fast)
 *  1.5 - 3.0s  Paths draw query -> tasks, task nodes appear
 *  3.0s         All 4 provider logos appear simultaneously
 *  3.5 - 5.0s  Paths draw tasks -> active providers
 *  5.0s         Broken/dashed lines + failed outputs appear
 *  5.0 - 10.0s Failed state holds (~5s for customer to absorb)
 * 10.0 - 11.5s "LAST MILE" container box draws in
 * 11.5 - 12.5s Broken lines repair, tracer dots, correct outputs appear
 * 12.5 - 23.0s Hold successful state (~10.5s for customer to read)
 * 23.0 - 23.8s Fade out
 */

export default function FlowAnimation() {
  const [queryIdx, setQueryIdx] = useState(0)
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')

  const advance = useCallback(() => {
    setPhase('exit')
    setTimeout(() => {
      setQueryIdx(prev => (prev + 1) % QUERIES.length)
      setPhase('enter')
    }, 800)
  }, [])

  useEffect(() => {
    const id = setInterval(advance, CYCLE_DURATION)
    return () => clearInterval(id)
  }, [advance])

  const q = QUERIES[queryIdx]

  return (
    <div className="hidden lg:block w-full select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={queryIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'enter' ? 1 : 0, scale: phase === 'enter' ? 1 : 0.97 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 820 300" className="w-full h-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">

            {/* ====== LAYER 1: Query -> Tasks ====== */}

            {/* Paths: query -> tasks */}
            {TASK_POSITIONS.map((tp, i) => (
              <motion.path
                key={`qt-${i}`}
                d={getPathD(QUERY_POS.x + QUERY_POS.w, QUERY_POS.y + QUERY_POS.h / 2, tp.x, tp.y + tp.h / 2)}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="1.5"
                fill="none"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                custom={1.5 + i * 0.25}
              />
            ))}

            {/* Tracer dots: query -> tasks */}
            {TASK_POSITIONS.map((tp, i) => {
              const d = getPathD(QUERY_POS.x + QUERY_POS.w, QUERY_POS.y + QUERY_POS.h / 2, tp.x, tp.y + tp.h / 2)
              return (
                <motion.circle
                  key={`dot-qt-${i}`}
                  r="3"
                  fill="var(--color-secondary)"
                  fillOpacity="0.6"
                  initial={{ offsetDistance: '0%', opacity: 0 }}
                  animate={{ offsetDistance: '100%', opacity: [0, 0.7, 0.7, 0] }}
                  transition={{ duration: 1.2, delay: 1.5 + i * 0.25, ease: 'easeInOut' }}
                  style={{ offsetPath: `path('${d}')` }}
                />
              )
            })}

            {/* Query node */}
            <foreignObject x={QUERY_POS.x} y={QUERY_POS.y} width={QUERY_POS.w} height={QUERY_POS.h}>
              <motion.div
                variants={nodeVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                className={`${nodeBase} h-full p-3 border-l-2 border-l-[var(--color-secondary)]`}
                style={cardShadow}
              >
                <p className="text-[11px] text-white/70 font-medium leading-[1.5]">
                  <TypedText text={q.query} durationMs={1200} />
                </p>
              </motion.div>
            </foreignObject>

            {/* Task nodes */}
            {q.tasks.map((task, i) => {
              const tp = TASK_POSITIONS[i]
              return (
                <foreignObject key={`task-${i}`} x={tp.x} y={tp.y} width={tp.w} height={tp.h}>
                  <motion.div
                    variants={nodeVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1.7 + i * 0.25}
                    className={`${nodeBase} h-full p-2.5 border-l-2 border-l-[var(--color-accent-bright)] flex items-center`}
                    style={cardShadow}
                  >
                    <p className="text-[9px] text-white/50 uppercase tracking-wider leading-tight">{task}</p>
                  </motion.div>
                </foreignObject>
              )
            })}

            {/* ====== LAYER 2: All 4 providers appear together at t=5.0 ====== */}

            {PROVIDER_POSITIONS.map((pp, i) => {
              const isActive = q.providers.includes(i)
              const logo = PROVIDER_LOGOS[i]
              return (
                <foreignObject key={`prov-${i}`} x={pp.x} y={pp.y} width={pp.s} height={pp.s + 18}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 3.0 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`${isActive ? nodeBase : 'border border-white/[0.04] bg-white/[0.02]'} flex items-center justify-center`}
                      style={isActive ? { ...heavyShadow, width: pp.s, height: pp.s } : { width: pp.s, height: pp.s }}
                    >
                      {isActive ? (
                        <motion.svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="white"
                          initial={{ fillOpacity: 0.35 }}
                          animate={{ fillOpacity: [0.35, 0.7, 0.5] }}
                          transition={{ duration: 2.5, delay: 5.0, ease: 'easeInOut' }}
                        >
                          <path d={logo.path} />
                        </motion.svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="white" fillOpacity="0.1">
                          <path d={logo.path} />
                        </svg>
                      )}
                    </div>
                    <p className={`text-[8px] mt-1 text-center leading-none ${isActive ? 'text-white/30' : 'text-white/15'}`}>
                      {logo.name}
                    </p>
                  </motion.div>
                </foreignObject>
              )
            })}

            {/* Paths: tasks -> active providers */}
            {q.providers.map((pi, i) => {
              const tp = TASK_POSITIONS[i]
              const pp = PROVIDER_POSITIONS[pi]
              return (
                <motion.path
                  key={`tp-${i}`}
                  d={getPathD(tp.x + tp.w, tp.y + tp.h / 2, pp.x, pp.y + pp.s / 2)}
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="1.5"
                  fill="none"
                  variants={pathVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3.5 + i * 0.25}
                />
              )
            })}

            {/* Tracer dots: tasks -> providers */}
            {q.providers.map((pi, i) => {
              const tp = TASK_POSITIONS[i]
              const pp = PROVIDER_POSITIONS[pi]
              const d = getPathD(tp.x + tp.w, tp.y + tp.h / 2, pp.x, pp.y + pp.s / 2)
              return (
                <motion.circle
                  key={`dot-tp-${i}`}
                  r="3"
                  fill="var(--color-secondary)"
                  fillOpacity="0.6"
                  initial={{ offsetDistance: '0%', opacity: 0 }}
                  animate={{ offsetDistance: '100%', opacity: [0, 0.7, 0.7, 0] }}
                  transition={{ duration: 1.2, delay: 3.5 + i * 0.25, ease: 'easeInOut' }}
                  style={{ offsetPath: `path('${d}')` }}
                />
              )
            })}

            {/* ====== LAYER 3: Broken lines + failed outputs, then Last Mile repairs ====== */}

            {/* Broken/dashed paths: providers -> outputs (appear at t=5.0, hold ~5s) */}
            {q.providers.map((pi, i) => {
              const pp = PROVIDER_POSITIONS[pi]
              const op = OUTPUT_POSITIONS[i]
              return (
                <motion.path
                  key={`po-broken-${i}`}
                  d={getPathD(pp.x + pp.s, pp.y + pp.s / 2, op.x, op.y + op.h / 2)}
                  stroke="rgba(255,100,100,0.25)"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  fill="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 7.0, delay: 5.0, times: [0, 0.05, 0.75, 1], ease: 'easeInOut' }}
                />
              )
            })}

            {/* Failed output nodes (appear at t=5.3, hold ~5s) */}
            {q.failedOutputs.map((label, i) => {
              const op = OUTPUT_POSITIONS[i]
              return (
                <foreignObject key={`out-fail-${i}`} x={op.x} y={op.y} width={op.w} height={op.h}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.95] }}
                    transition={{ duration: 7.0, delay: 5.3, times: [0, 0.05, 0.72, 1], ease: 'easeInOut' }}
                    className="border border-red-400/15 bg-red-400/[0.04] h-full p-2.5 border-l-2 border-l-red-400/40 flex items-center gap-2"
                    style={{ boxShadow: '3px 3px 0 0 rgba(239,239,235,0.1), 0 2px 6px rgba(0,0,0,0.12)' }}
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="rgba(248,113,113,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <p className="text-[9px] text-red-300/50 leading-tight">{label}</p>
                  </motion.div>
                </foreignObject>
              )
            })}

            {/* Outer glow: soft expanded border pulse */}
            <motion.rect
              x={LM_BOX.x - 4}
              y={LM_BOX.y - 4}
              width={LM_BOX.w + 8}
              height={LM_BOX.h + 8}
              rx="0"
              stroke="var(--color-secondary)"
              strokeWidth="1"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0.08] }}
              transition={{ duration: 2.0, delay: 10.0, ease: 'easeOut' }}
            />

            {/* Container box fill: warm gold wash for depth */}
            <motion.rect
              x={LM_BOX.x}
              y={LM_BOX.y}
              width={LM_BOX.w}
              height={LM_BOX.h}
              rx="0"
              fill="var(--color-secondary)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.07, 0.05] }}
              transition={{ duration: 1.5, delay: 10.2, ease: 'easeOut' }}
            />

            {/* "LAST MILE" container box draws in at t=10.0 */}
            <motion.rect
              x={LM_BOX.x}
              y={LM_BOX.y}
              width={LM_BOX.w}
              height={LM_BOX.h}
              rx="0"
              stroke="var(--color-secondary)"
              strokeWidth="2.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0, strokeOpacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, strokeOpacity: [0, 0.7, 0.5] }}
              transition={{
                pathLength: { duration: 1.5, ease: 'easeInOut', delay: 10.0 },
                opacity: { duration: 0.3, delay: 10.0 },
                strokeOpacity: { duration: 2.0, delay: 10.0, ease: 'easeOut' },
              }}
            />

            {/* Z-depth shadow on the box */}
            <motion.rect
              x={LM_BOX.x + 4}
              y={LM_BOX.y + 4}
              width={LM_BOX.w}
              height={LM_BOX.h}
              rx="0"
              fill="none"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 10.3 }}
            />

            {/* "LAST MILE" label: larger, bolder, centered at top edge */}
            <foreignObject x={LM_BOX.x} y={LM_BOX.y - 24} width={LM_BOX.w} height={28}>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 10.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-center"
              >
                <span
                  className="text-[11px] font-black tracking-[0.25em] uppercase px-3 py-0.5"
                  style={{
                    color: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-accent)',
                    boxShadow: '3px 3px 0 0 rgba(0,0,0,0.25)',
                    borderBottom: '2px solid var(--color-secondary)',
                  }}
                >
                  Last Mile
                </span>
              </motion.div>
            </foreignObject>

            {/* Repaired solid paths: providers -> outputs (at t=11.5) */}
            {q.providers.map((pi, i) => {
              const pp = PROVIDER_POSITIONS[pi]
              const op = OUTPUT_POSITIONS[i]
              return (
                <motion.path
                  key={`po-fixed-${i}`}
                  d={getPathD(pp.x + pp.s, pp.y + pp.s / 2, op.x, op.y + op.h / 2)}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1.5"
                  fill="none"
                  variants={pathVariants}
                  initial="hidden"
                  animate="visible"
                  custom={11.5 + i * 0.25}
                />
              )
            })}

            {/* Tracer dots: providers -> outputs (the repair) */}
            {q.providers.map((pi, i) => {
              const pp = PROVIDER_POSITIONS[pi]
              const op = OUTPUT_POSITIONS[i]
              const d = getPathD(pp.x + pp.s, pp.y + pp.s / 2, op.x, op.y + op.h / 2)
              return (
                <motion.circle
                  key={`dot-po-${i}`}
                  r="3"
                  fill="var(--color-secondary)"
                  fillOpacity="0.7"
                  initial={{ offsetDistance: '0%', opacity: 0 }}
                  animate={{ offsetDistance: '100%', opacity: [0, 0.8, 0.8, 0] }}
                  transition={{ duration: 1.2, delay: 11.5 + i * 0.25, ease: 'easeInOut' }}
                  style={{ offsetPath: `path('${d}')` }}
                />
              )
            })}

            {/* Correct output nodes (appear after repair at t=12.0) */}
            {q.outputs.map((output, i) => {
              const op = OUTPUT_POSITIONS[i]
              return (
                <foreignObject key={`out-${i}`} x={op.x} y={op.y} width={op.w} height={op.h}>
                  <motion.div
                    variants={nodeVariants}
                    initial="hidden"
                    animate="visible"
                    custom={12.0 + i * 0.25}
                    className={`${nodeBase} h-full p-2.5 border-l-2 border-l-[var(--color-tertiary)] flex items-center gap-2`}
                    style={heavyShadow}
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--color-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-60">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <p className="text-[9px] text-white/50 leading-tight">{output}</p>
                  </motion.div>
                </foreignObject>
              )
            })}
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
