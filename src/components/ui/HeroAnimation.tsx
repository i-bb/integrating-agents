/**
 * "The Last Mile Walk"
 *
 * Three visual layers:
 *  1. Ghost fill — four faint gold bars (the bar-chart silhouette at low opacity)
 *  2. Staircase path — draws itself on mount via pathLength, in brand navy
 *  3. Traveling dot — a gold dot that walks the path continuously, fading in/out
 *
 * The staircase ascends in four steps matching the logo's bar proportions.
 * The dot travels from bottom-left to top-right, pauses briefly, then loops —
 * a quiet, perpetual depiction of "the last mile being walked."
 */

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Staircase path: 4 ascending steps matching the 4 logo bars.
// Floor at y=330, rises: 70, 140, 210, 280 (proportional to bar heights).
const PATH_D = 'M 58,330 V 260 H 134 V 190 H 210 V 120 H 286 V 50 H 342'

// Ghost fill rectangles — the bar silhouettes behind the path
const GHOST_BARS = [
  { x: 58,  y: 260, w: 56, h: 70  },
  { x: 134, y: 190, w: 56, h: 140 },
  { x: 210, y: 120, w: 56, h: 210 },
  { x: 286, y: 50,  w: 56, h: 280 },
]

const ease = [0.22, 1, 0.36, 1] as const
const DOT_DURATION = 10_000 // ms for one full traversal

export function HeroAnimation() {
  const reduced = useReducedMotion() ?? false

  // Direct DOM refs — no React state, no re-renders, pure 60fps
  const pathRef = useRef<SVGGeometryElement | null>(null)
  const dotRef  = useRef<SVGCircleElement | null>(null)
  const glowRef = useRef<SVGCircleElement | null>(null)
  const rafRef  = useRef(0)

  useEffect(() => {
    if (reduced) return

    // Start dot after path has finished drawing (1.4s draw + 0.25s delay + 0.15s buffer)
    const startId = setTimeout(() => {
      const path = pathRef.current
      const dot  = dotRef.current
      const glow = glowRef.current
      if (!path || !dot) return

      const totalLen = path.getTotalLength()
      let t0: number | null = null

      const tick = (ts: number) => {
        if (t0 === null) t0 = ts

        const t = ((ts - t0) % DOT_DURATION) / DOT_DURATION

        // Ease-in-out-sine: organic, not mechanical
        const eased = -(Math.cos(Math.PI * t) - 1) / 2
        const pt = path.getPointAtLength(eased * totalLen)

        dot.setAttribute('cx', String(pt.x))
        dot.setAttribute('cy', String(pt.y))

        // Fade in at start, hold, fade out near end
        const alpha =
          t < 0.06 ? t / 0.06
          : t > 0.88 ? (1 - t) / 0.12
          : 1

        dot.style.opacity = String(alpha)

        if (glow) {
          glow.setAttribute('cx', String(pt.x))
          glow.setAttribute('cy', String(pt.y))
          glow.style.opacity = String(alpha * 0.18)
        }

        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    }, 1900)

    return () => {
      clearTimeout(startId)
      cancelAnimationFrame(rafRef.current)
    }
  }, [reduced])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox="0 0 400 380"
        style={{ width: '75%', maxWidth: '360px' }}
        overflow="visible"
      >
        {/* Layer 1: Ghost fill — bar silhouettes */}
        {GHOST_BARS.map((b, i) => (
          <motion.rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill="#EDB345"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.042 }}
            transition={{ duration: 0.9, delay: i * 0.1 }}
          />
        ))}

        {/* Baseline */}
        <motion.line
          x1={40} y1={333} x2={362} y2={333}
          stroke="#003B75"
          strokeWidth={1}
          initial={{ pathLength: 0, strokeOpacity: 0 }}
          animate={{ pathLength: 1, strokeOpacity: 0.09 }}
          transition={{ duration: 0.5, ease }}
        />

        {/* Layer 2: Staircase path — draws itself on mount */}
        <motion.path
          ref={pathRef as unknown as React.RefObject<SVGPathElement>}
          d={PATH_D}
          fill="none"
          stroke="#003B75"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, strokeOpacity: 0 }}
          animate={{ pathLength: 1, strokeOpacity: 0.26 }}
          transition={{ duration: 1.4, delay: 0.25, ease }}
        />

        {/* Layer 3: Traveling dot — glow halo + core */}
        <circle
          ref={glowRef}
          r={10}
          fill="#EDB345"
          cx={58}
          cy={330}
          style={{ opacity: 0 }}
        />
        <circle
          ref={dotRef}
          r={4.5}
          fill="#EDB345"
          cx={58}
          cy={330}
          style={{ opacity: 0 }}
        />
      </svg>
    </div>
  )
}
