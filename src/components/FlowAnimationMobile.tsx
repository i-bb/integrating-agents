import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CYCLE_DURATION, QUERIES, PROVIDER_LOGOS } from './flowAnimationData'

const ease4 = [0.22, 1, 0.36, 1] as [number, number, number, number]
const cardShadow = '3px 3px 0 0 rgba(239,239,235,0.18), 0 2px 6px rgba(0,0,0,0.15)'
const heavyShadow = '4px 4px 0 0 rgba(239,239,235,0.22), 0 3px 8px rgba(0,0,0,0.2)'
const nodeBase = 'border border-white/[0.12] bg-white/[0.07]'

type Phase = 'query' | 'tasks' | 'providers' | 'failed' | 'lastmile' | 'hold'

const PHASE_TIMES: { phase: Phase; at: number }[] = [
  { phase: 'query', at: 0 },
  { phase: 'tasks', at: 1500 },
  { phase: 'providers', at: 3000 },
  { phase: 'failed', at: 5000 },
  { phase: 'lastmile', at: 10000 },
  { phase: 'hold', at: 13000 },
]

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
      <span className="inline-block w-[1px] h-[12px] bg-[var(--color-secondary)] ml-[2px] animate-pulse" />
    </span>
  )
}

function VConnector({ visible, failed }: { visible: boolean; failed?: boolean }) {
  return (
    <div className="flex justify-center py-1">
      <motion.div
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scaleY: visible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: ease4 }}
        style={{ transformOrigin: 'top' }}
      >
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <line x1="5" y1="0" x2="5" y2="14" stroke={failed ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" strokeDasharray={failed ? '3 3' : 'none'} />
          <path d="M2 11 L5 16 L8 11" stroke={failed ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  )
}

function useCyclePhase() {
  const [state, setState] = useState({ queryIdx: 0, elapsed: 0 })
  const startRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    startRef.current = performance.now()
    let alive = true

    const tick = () => {
      if (!alive) return
      const now = performance.now()
      let ms = now - startRef.current
      if (ms >= CYCLE_DURATION) {
        const skippedCycles = Math.floor(ms / CYCLE_DURATION)
        startRef.current += skippedCycles * CYCLE_DURATION
        ms = now - startRef.current
        setState(prev => ({
          queryIdx: (prev.queryIdx + skippedCycles) % QUERIES.length,
          elapsed: ms,
        }))
      } else {
        setState(prev => ({ ...prev, elapsed: ms }))
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        startRef.current = performance.now()
        setState(prev => ({ ...prev, elapsed: 0 }))
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      alive = false
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  let phase: Phase = 'query'
  for (let i = PHASE_TIMES.length - 1; i >= 0; i--) {
    if (state.elapsed >= PHASE_TIMES[i].at) { phase = PHASE_TIMES[i].phase; break }
  }
  const exiting = state.elapsed >= CYCLE_DURATION - 800

  return { queryIdx: state.queryIdx, phase, exiting }
}

export default function FlowAnimationMobile() {
  const { queryIdx, phase, exiting } = useCyclePhase()

  const q = QUERIES[queryIdx]
  const phaseIdx = PHASE_TIMES.findIndex(p => p.phase === phase)
  const showTasks = phaseIdx >= 1
  const showProviders = phaseIdx >= 2
  const showFailed = phaseIdx >= 3 && phaseIdx < 4
  const showLastMile = phaseIdx >= 4
  const providersHighlighted = phaseIdx >= 3

  return (
    <div className="w-full select-none h-[480px] sm:h-[440px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={queryIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: ease4 }}
          className="flex flex-col h-full"
        >
          {/* 1. Query card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: ease4 }}
            className={`${nodeBase} p-3.5 border-l-2 border-l-[var(--color-secondary)]`}
            style={{ boxShadow: cardShadow }}
          >
            <p className="text-[15px] sm:text-[16px] text-white font-medium leading-[1.45]">
              <TypedText text={q.query} durationMs={1200} />
            </p>
          </motion.div>

          <VConnector visible={showTasks} />

          {/* 2. Tasks -- horizontal row of 3 equal cards */}
          <AnimatePresence>
            {showTasks && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-3 gap-1.5"
              >
                {q.tasks.map((task, i) => (
                  <motion.div
                    key={task}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: ease4, delay: i * 0.12 }}
                    className={`${nodeBase} p-2.5 border-t-2 border-t-[var(--color-accent-bright)] flex items-center justify-center text-center`}
                    style={{ boxShadow: cardShadow }}
                  >
                    <p className="text-[10px] sm:text-[11px] text-white/90 uppercase tracking-wider leading-tight font-semibold">{task}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <VConnector visible={showProviders} />

          {/* 3. Provider icons -- all start transparent, active ones highlight after delay */}
          <AnimatePresence>
            {showProviders && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: ease4 }}
                className="flex items-center justify-center gap-3 sm:gap-4 py-1"
              >
                {PROVIDER_LOGOS.map((logo, i) => {
                  const isActive = q.providers.includes(i)
                  const highlighted = providersHighlighted && isActive
                  return (
                    <motion.div
                      key={logo.name}
                      className="flex flex-col items-center gap-1"
                      initial={{ opacity: 0.55 }}
                      animate={{ opacity: highlighted ? 1 : providersHighlighted ? 0.4 : 0.55 }}
                      transition={{ duration: 0.6, ease: ease4 }}
                    >
                      <motion.div
                        className={`w-12 h-12 flex items-center justify-center ${highlighted ? nodeBase : 'border border-white/[0.08] bg-white/[0.04]'}`}
                        animate={{ boxShadow: highlighted ? heavyShadow : 'none' }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.svg
                          viewBox="0 0 24 24" width="20" height="20" fill="white"
                          animate={{ fillOpacity: highlighted ? 0.95 : 0.4 }}
                          transition={{ duration: 0.6, ease: ease4 }}
                        >
                          <path d={logo.path} />
                        </motion.svg>
                      </motion.div>
                      <motion.p
                        className="text-[11px] sm:text-[12px] text-center leading-none font-semibold"
                        animate={{ color: highlighted ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.45)' }}
                        transition={{ duration: 0.6, ease: ease4 }}
                      >
                        {logo.name}
                      </motion.p>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <VConnector visible={showFailed || showLastMile} failed={showFailed} />

          {/* 4 & 5. Failed outputs OR Last Mile resolved outputs */}
          <div className="flex-1 flex flex-col justify-start">
            <AnimatePresence mode="wait">
              {showFailed && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.4 } }}
                  transition={{ duration: 0.5, ease: ease4 }}
                  className="grid grid-cols-3 gap-1.5"
                >
                  {q.failedOutputs.map((label, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: ease4, delay: i * 0.1 }}
                      className="border border-red-400/20 bg-red-400/[0.06] p-2.5 border-t-2 border-t-red-400/50 flex flex-col items-center justify-center text-center gap-1.5"
                      style={{ boxShadow: '3px 3px 0 0 rgba(239,239,235,0.1), 0 2px 6px rgba(0,0,0,0.12)' }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="rgba(248,113,113,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      <p className="text-[12px] sm:text-[13px] text-red-300 leading-tight font-semibold">{label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {showLastMile && (
                <motion.div
                  key="lastmile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: ease4 }}
                >
                  {/* Gold-bordered "Last Mile" container */}
                  <motion.div
                    className="relative border-2 border-[var(--color-secondary)]/50 bg-[var(--color-secondary)]/[0.04] p-3 sm:p-4 mt-2"
                    initial={{ borderColor: 'rgba(232,191,64,0)' }}
                    animate={{ borderColor: 'rgba(232,191,64,0.5)' }}
                    transition={{ duration: 1.0, ease: 'easeInOut' }}
                    style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.2)' }}
                  >
                    {/* "LAST MILE" badge */}
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.5, ease: ease4 }}
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10"
                      style={{ transformOrigin: 'center' }}
                    >
                      <span
                        className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase px-3 py-1 whitespace-nowrap"
                        style={{
                          color: 'var(--color-secondary)',
                          backgroundColor: 'var(--color-accent)',
                          boxShadow: '2px 2px 0 0 rgba(0,0,0,0.25)',
                          borderBottom: '2px solid var(--color-secondary)',
                        }}
                      >
                        Last Mile
                      </span>
                    </motion.div>

                    {/* Correct outputs -- horizontal row of 3 */}
                    <div className="grid grid-cols-3 gap-1.5 mt-2">
                      {q.outputs.map((output, i) => (
                        <motion.div
                          key={output}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease: ease4, delay: 0.3 + i * 0.12 }}
                          className={`${nodeBase} p-2.5 border-t-2 border-t-[var(--color-tertiary)] flex flex-col items-center justify-center text-center gap-1.5`}
                          style={{ boxShadow: heavyShadow }}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--color-tertiary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <p className="text-[12px] sm:text-[13px] text-white font-semibold leading-tight">{output}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
