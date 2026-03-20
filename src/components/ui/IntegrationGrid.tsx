import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { saasIcons, type SaasIcon } from './saasIcons'

const COLS = 5
const ROWS = 4
const VISIBLE = COLS * ROWS
const CELL_SIZE = 80
const CELL_STRIDE = 96
const CHAIN_SIZE = 4

// Wire connections — includes multi-cell spans
const WIRE_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 8], [8, 9],
  [10, 11], [11, 12], [12, 13], [13, 14],
  [15, 16], [16, 17], [17, 18], [18, 19],
  [0, 2], [1, 3], [2, 4],
  [5, 7], [6, 8], [7, 9],
  [10, 12], [11, 13], [12, 14],
  [15, 17], [16, 18], [17, 19],
  [0, 3], [1, 4], [5, 8], [5, 9],
  [10, 13], [10, 14], [15, 18], [15, 19],
  [0, 5], [5, 10], [10, 15],
  [1, 6], [6, 11], [11, 16],
  [2, 7], [7, 12], [12, 17],
  [3, 8], [8, 13], [13, 18],
  [4, 9], [9, 14], [14, 19],
  [0, 10], [1, 11], [2, 12], [3, 13], [4, 14],
  [5, 15], [6, 16], [7, 17], [8, 18], [9, 19],
  [0, 15], [1, 16], [2, 17], [3, 18], [4, 19],
]

const UNIQUE_EDGES: [number, number][] = (() => {
  const seen = new Set<string>()
  const result: [number, number][] = []
  for (const [a, b] of WIRE_EDGES) {
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`
    if (!seen.has(key)) {
      seen.add(key)
      result.push([a, b])
    }
  }
  return result
})()

// Build lookup: for any pair of cells, find the direct edge if one exists
const EDGE_LOOKUP = new Map<string, boolean>()
for (const [a, b] of UNIQUE_EDGES) {
  EDGE_LOOKUP.set(`${Math.min(a, b)}-${Math.max(a, b)}`, true)
}

function hasEdge(a: number, b: number): boolean {
  return EDGE_LOOKUP.has(`${Math.min(a, b)}-${Math.max(a, b)}`)
}

const RECOGNIZABLE = new Set([
  'googlesheets', 'zoom', 'stripe', 'github',
  'gmail', 'shopify', 'notion', 'figma', 'openai',
])

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function cellCenter(idx: number): { x: number; y: number } {
  const col = idx % COLS
  const row = Math.floor(idx / COLS)
  return {
    x: col * CELL_STRIDE + CELL_SIZE / 2,
    y: row * CELL_STRIDE + CELL_SIZE / 2,
  }
}

// Pick N cells that form a connected chain (each consecutive pair has a wire)
function pickConnectedChain(
  count: number,
  avoid: Set<number>,
  displayIcons: SaasIcon[],
  isFirst: boolean,
): number[] {
  const allCells = Array.from({ length: VISIBLE }, (_, i) => i)
  const eligible = allCells.filter(i => !avoid.has(i))
  const startPool = eligible.length > 0 ? eligible : allCells

  // Try multiple times to find a connected chain
  for (let attempt = 0; attempt < 40; attempt++) {
    const start = startPool[Math.floor(Math.random() * startPool.length)]
    const chain = [start]
    const used = new Set([start])

    for (let step = 1; step < count; step++) {
      // Find all cells connected to the last cell in chain that aren't used
      const last = chain[chain.length - 1]
      const candidates = allCells.filter(
        c => !used.has(c) && !avoid.has(c) && hasEdge(last, c)
      )
      if (candidates.length === 0) break
      const next = candidates[Math.floor(Math.random() * candidates.length)]
      chain.push(next)
      used.add(next)
    }

    if (chain.length === count) {
      if (isFirst) {
        const hasRecognizable = chain.some(idx => RECOGNIZABLE.has(displayIcons[idx]?.slug))
        if (hasRecognizable) return chain
        // Keep trying for a recognizable one, but accept after many attempts
        if (attempt > 20) return chain
      } else {
        return chain
      }
    }
  }

  // Fallback: just pick random cells
  return shuffle(startPool).slice(0, count)
}

export function IntegrationGrid() {
  const reduced = useReducedMotion()

  const [displayIcons, setDisplayIcons] = useState<SaasIcon[]>(() => {
    const shuffled = shuffle(saasIcons)
    return shuffled.slice(0, VISIBLE)
  })
  const poolRef = useRef<SaasIcon[]>([])
  const visibleSlugsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const displayed = new Set(displayIcons.map(i => i.slug))
    visibleSlugsRef.current = displayed
    poolRef.current = shuffle(saasIcons.filter(i => !displayed.has(i.slug)))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Animation state
  const [brightCells, setBrightCells] = useState<Set<number>>(new Set())
  const [entranceDone, setEntranceDone] = useState(false)
  const [wiresVisible, setWiresVisible] = useState(false)
  const [fadingCells, setFadingCells] = useState<Set<number>>(new Set())
  // Pulse: which segment index is currently animating (-1 = none)
  const [pulseSegIdx, setPulseSegIdx] = useState(-1)
  const [pulseChain, setPulseChain] = useState<number[]>([])
  const lastCellsRef = useRef<Set<number>>(new Set())
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRef = useRef(true)
  const mountedRef = useRef(true)
  const runCycleRef = useRef<() => void>(() => {})

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!mountedRef.current) return
      setEntranceDone(true)
      setWiresVisible(true)
    }, reduced ? 200 : 1800)
    return () => clearTimeout(t)
  }, [reduced])

  const doSwap = useCallback((cellIdx: number): Promise<void> => {
    return new Promise(resolve => {
      setFadingCells(prev => new Set([...prev, cellIdx]))

      setTimeout(() => {
        if (!mountedRef.current) { resolve(); return }

        setDisplayIcons(prev => {
          const next = [...prev]
          const pool = poolRef.current
          const visible = visibleSlugsRef.current

          let replacement: SaasIcon | null = null
          let rIdx = -1
          for (let i = 0; i < pool.length; i++) {
            if (!visible.has(pool[i].slug)) {
              replacement = pool[i]
              rIdx = i
              break
            }
          }

          if (!replacement || rIdx < 0) {
            poolRef.current = shuffle(saasIcons.filter(i => !visible.has(i.slug)))
            if (poolRef.current.length > 0) {
              replacement = poolRef.current[0]
              rIdx = 0
            } else {
              return prev
            }
          }

          poolRef.current.splice(rIdx, 1)
          const old = next[cellIdx]
          poolRef.current.push(old)
          visible.delete(old.slug)
          visible.add(replacement.slug)
          next[cellIdx] = replacement
          return next
        })

        setFadingCells(prev => {
          const n = new Set(prev)
          n.delete(cellIdx)
          return n
        })

        setTimeout(() => resolve(), 500)
      }, 500)
    })
  }, [])

  // Timing
  const PULSE_TRAVEL = 800    // ms for pulse to travel one segment
  const PULSE_PAUSE = 300     // ms pause at each node (heartbeat lands)
  const SWAP_STAGGER = 300    // ms between each cell swap
  const CYCLE_REST_MIN = 3000
  const CYCLE_REST_RAND = 2000

  const runCycle = useCallback(() => {
    if (!mountedRef.current) return

    const chain = pickConnectedChain(CHAIN_SIZE, lastCellsRef.current, displayIcons, isFirstRef.current)
    if (chain.length < CHAIN_SIZE) return

    isFirstRef.current = false
    setPulseChain(chain)

    // Sequentially pulse along each segment: 0->1, 1->2, 2->3
    // Each segment: pulse travels (PULSE_TRAVEL), then pauses (PULSE_PAUSE) and cell lights up
    const totalSegments = chain.length - 1
    let elapsed = 0

    for (let seg = 0; seg < totalSegments; seg++) {
      const segStart = elapsed

      // Start pulse on this segment
      setTimeout(() => {
        if (!mountedRef.current) return
        setPulseSegIdx(seg)
      }, segStart)

      // Pulse arrives: brighten the destination cell
      setTimeout(() => {
        if (!mountedRef.current) return
        setBrightCells(prev => new Set([...prev, chain[seg + 1]]))
      }, segStart + PULSE_TRAVEL)

      elapsed += PULSE_TRAVEL + PULSE_PAUSE
    }

    // Also brighten the first cell at the start
    setBrightCells(new Set([chain[0]]))

    // After all pulses complete: clear pulse, start swaps
    const swapStart = elapsed + 200
    setTimeout(() => {
      if (!mountedRef.current) return
      setPulseSegIdx(-1)
      setPulseChain([])

      const swapAll = async () => {
        for (let i = 0; i < chain.length; i++) {
          if (!mountedRef.current) return
          await doSwap(chain[i])
          if (i < chain.length - 1) {
            await new Promise(r => setTimeout(r, SWAP_STAGGER))
          }
        }

        if (!mountedRef.current) return
        setBrightCells(new Set())
        lastCellsRef.current = new Set(chain)

        const wait = CYCLE_REST_MIN + Math.random() * CYCLE_REST_RAND
        cycleTimerRef.current = setTimeout(() => {
          if (mountedRef.current) runCycleRef.current()
        }, wait)
      }

      swapAll()
    }, swapStart)
  }, [displayIcons, doSwap, PULSE_TRAVEL, PULSE_PAUSE, SWAP_STAGGER, CYCLE_REST_MIN, CYCLE_REST_RAND])

  useEffect(() => {
    runCycleRef.current = runCycle
  }, [runCycle])

  useEffect(() => {
    if (!entranceDone || reduced) return
    const t = setTimeout(() => {
      if (mountedRef.current) runCycleRef.current()
    }, 1500)
    return () => {
      clearTimeout(t)
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current)
    }
  }, [entranceDone, reduced])

  const gridW = COLS * CELL_STRIDE
  const gridH = ROWS * CELL_STRIDE

  // Build the current pulse segment SVG path
  const currentPulsePath = (() => {
    if (pulseSegIdx < 0 || pulseChain.length < 2 || pulseSegIdx >= pulseChain.length - 1) return null
    const from = cellCenter(pulseChain[pulseSegIdx])
    const to = cellCenter(pulseChain[pulseSegIdx + 1])
    return `M${from.x} ${from.y} L${to.x} ${to.y}`
  })()

  // Unique key for pulse animation (forces remount on segment change)
  const pulseKey = `pulse-${pulseSegIdx}-${pulseChain.join(',')}`

  return (
    <div className="integration-grid-wrap" aria-hidden="true">
      <div
        className="integration-grid"
        style={{
          width: gridW,
          height: gridH,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CELL_STRIDE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_STRIDE}px)`,
          gap: 0,
          position: 'relative',
        }}
      >
        {/* SVG wire overlay */}
        <svg
          width={gridW}
          height={gridH}
          viewBox={`0 0 ${gridW} ${gridH}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {/* Static grey wires — always visible, always grey */}
          {UNIQUE_EDGES.map(([a, b]) => {
            const ca = cellCenter(a)
            const cb = cellCenter(b)
            return (
              <motion.line
                key={`${Math.min(a, b)}-${Math.max(a, b)}`}
                x1={ca.x}
                y1={ca.y}
                x2={cb.x}
                y2={cb.y}
                stroke="var(--color-navy)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: wiresVisible ? 0.12 : 0 }}
                transition={{ duration: 0.8 }}
              />
            )
          })}

          {/* Gold heartbeat pulse — travels along one segment at a time */}
          {currentPulsePath && (
            <>
              {/* Outer glow */}
              <motion.path
                key={`glow-${pulseKey}`}
                d={currentPulsePath}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth={12}
                strokeLinecap="round"
                pathLength={1}
                initial={{ strokeDasharray: '0.15 0.85', strokeDashoffset: 1, opacity: 0.35 }}
                animate={{ strokeDashoffset: -0.15, opacity: 0 }}
                transition={{
                  strokeDashoffset: { duration: PULSE_TRAVEL / 1000, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: PULSE_TRAVEL / 1000, ease: 'easeIn', delay: (PULSE_TRAVEL / 1000) * 0.5 },
                }}
              />
              {/* Core pulse */}
              <motion.path
                key={`core-${pulseKey}`}
                d={currentPulsePath}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth={4}
                strokeLinecap="round"
                pathLength={1}
                initial={{ strokeDasharray: '0.12 0.88', strokeDashoffset: 1, opacity: 1 }}
                animate={{ strokeDashoffset: -0.12, opacity: 0 }}
                transition={{
                  strokeDashoffset: { duration: PULSE_TRAVEL / 1000, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: PULSE_TRAVEL / 1000, ease: 'easeIn', delay: (PULSE_TRAVEL / 1000) * 0.6 },
                }}
              />
            </>
          )}
        </svg>

        {/* Grid cells */}
        {displayIcons.map((icon, i) => {
          const row = Math.floor(i / COLS)
          const col = i % COLS
          const delay = reduced ? 0 : 0.6 + row * 0.07 + col * 0.05
          const isBright = brightCells.has(i)
          const isFading = fadingCells.has(i)

          return (
            <motion.div
              key={`cell-${i}`}
              className="integration-cell"
              initial={{ opacity: 0, scale: reduced ? 1 : 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ position: 'relative', zIndex: 2 }}
            >
              <div
                className={`integration-cell-inner${isBright ? ' integration-cell-bright' : ''}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  className="integration-icon"
                  role="img"
                  style={{
                    opacity: isFading ? 0 : 1,
                    transition: 'opacity 0.45s ease',
                  }}
                >
                  <title>{icon.title}</title>
                  <path d={icon.path} />
                </svg>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
