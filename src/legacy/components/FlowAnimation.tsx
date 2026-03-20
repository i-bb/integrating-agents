import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlowAnimationMobile from './FlowAnimationMobile'
import { CYCLE_DURATION, QUERIES, PROVIDER_LOGOS } from './flowAnimationData'

function useIsDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

// Layout positions (viewBox 820 x 300)
const QUERY_POS = { x: 10, y: 95, w: 175, h: 110 }
const TASK_POSITIONS = [
  { x: 255, y: 18, w: 130, h: 52 },
  { x: 255, y: 115, w: 130, h: 52 },
  { x: 255, y: 212, w: 130, h: 52 },
]
const PROVIDER_POSITIONS = [
  { x: 455, y: 14, s: 48 },
  { x: 455, y: 84, s: 48 },
  { x: 455, y: 154, s: 48 },
  { x: 455, y: 224, s: 48 },
]
const OUTPUT_POSITIONS = [
  { x: 640, y: 18, w: 135, h: 52 },
  { x: 640, y: 115, w: 135, h: 52 },
  { x: 640, y: 212, w: 135, h: 52 },
]

// "Last Mile" container box bounds (wraps tasks + providers)
const LM_BOX = { x: 238, y: -2, w: 278, h: 300, r: 0 }

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

const nodeBase = 'border border-white/[0.12] bg-white/[0.07]'
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

function FlowAnimationDesktop() {
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
    <div className="w-full select-none">
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
                <p className="text-[13px] text-white font-medium leading-[1.4]">
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
                    <p className="text-[11px] text-white/90 uppercase tracking-wider leading-tight font-semibold">{task}</p>
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
                          initial={{ fillOpacity: 0.7 }}
                          animate={{ fillOpacity: [0.7, 1, 0.9] }}
                          transition={{ duration: 2.5, delay: 5.0, ease: 'easeInOut' }}
                        >
                          <path d={logo.path} />
                        </motion.svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="white" fillOpacity="0.45">
                          <path d={logo.path} />
                        </svg>
                      )}
                    </div>
                    <p className={`text-[10px] mt-1 text-center leading-none font-medium ${isActive ? 'text-white' : 'text-white/50'}`}>
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
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="rgba(248,113,113,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <p className="text-[11px] text-red-300/90 leading-tight font-medium">{label}</p>
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
                  className="text-[13px] font-black tracking-[0.25em] uppercase px-3 py-0.5"
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
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--color-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-90">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <p className="text-[11px] text-white/90 leading-tight font-medium">{output}</p>
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

export default function FlowAnimation() {
  const isDesktop = useIsDesktopLayout()
  if (isDesktop) return <FlowAnimationDesktop />
  return <FlowAnimationMobile />
}
