import { useEffect } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'

// Bar geometry mirrors the favicon exactly, scaled up ~13×
// All bars bottom-align at y=380 in a 420×400 viewBox
const bars = [
  { x: 30,  y: 320, w: 84, h: 60,  opacity: 1.00, entranceDelay: 0.15, breathPeriod: 5.4, breathOffset: 0.0 },
  { x: 130, y: 260, w: 84, h: 120, opacity: 0.85, entranceDelay: 0.30, breathPeriod: 4.8, breathOffset: 0.8 },
  { x: 230, y: 200, w: 84, h: 180, opacity: 0.70, entranceDelay: 0.45, breathPeriod: 5.1, breathOffset: 1.7 },
  { x: 330, y: 120, w: 60, h: 260, opacity: 0.55, entranceDelay: 0.60, breathPeriod: 4.6, breathOffset: 2.5 },
]

const ease = [0.22, 1, 0.36, 1] as const

function Bar(props: typeof bars[number] & { reduced: boolean }) {
  const { x, y, w, h, opacity, entranceDelay, breathPeriod, breathOffset, reduced } = props
  const controls = useAnimation()

  useEffect(() => {
    if (reduced) {
      controls.set({ scaleY: 1 })
      return
    }
    const run = async () => {
      await controls.start({
        scaleY: 1,
        transition: { duration: 0.85, delay: entranceDelay, ease },
      })
      controls.start({
        scaleY: [1, 1.07, 0.95, 1],
        transition: {
          duration: breathPeriod,
          delay: breathOffset * 0.4,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        },
      })
    }
    run()
  }, [])

  return (
    <motion.rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill="#EDB345"
      fillOpacity={opacity}
      initial={{ scaleY: 0 }}
      animate={controls}
      style={{
        transformBox: 'fill-box',
        transformOrigin: 'bottom',
      }}
    />
  )
}

export function HeroAnimation() {
  const reduced = useReducedMotion() ?? false

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
        viewBox="0 0 420 400"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '72%', maxWidth: '360px' }}
        overflow="visible"
      >
        {/* Subtle baseline */}
        <line
          x1="20"
          y1="382"
          x2="400"
          y2="382"
          stroke="#003B75"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
        {bars.map((bar, i) => (
          <Bar key={i} {...bar} reduced={reduced} />
        ))}
      </svg>
    </div>
  )
}
