import { useEffect, useRef } from 'react'

const GRID = 48
const TRACE_COUNT = 10
const TRACE_SPEED = 0.45
const TRACE_LENGTH = 14
const NODE_PULSE_DURATION = 140
const TURN_PROBABILITY = 0.4

interface Point { x: number; y: number }
interface Direction { dx: number; dy: number }

const DIRS: Direction[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
]

interface Trace {
  segments: Point[]
  dir: Direction
  progress: number
  age: number
  maxAge: number
  colorIdx: number
}

interface NodePulse {
  x: number
  y: number
  age: number
  colorIdx: number
}

function snapToGrid(v: number): number {
  return Math.round(v / GRID) * GRID
}

function pickDir(current: Direction): Direction {
  if (Math.random() < TURN_PROBABILITY) {
    const perpendicular = DIRS.filter(d => d.dx !== current.dx && d.dy !== current.dy)
    return perpendicular[Math.floor(Math.random() * perpendicular.length)]
  }
  return current
}

function createTrace(w: number, h: number): Trace {
  const centerX = w / 2
  const centerY = h * 0.4
  const spreadX = w * 0.35
  const spreadY = h * 0.3
  const rx = centerX + (Math.random() + Math.random() - 1) * spreadX
  const ry = centerY + (Math.random() + Math.random() - 1) * spreadY
  const x = snapToGrid(Math.max(GRID, Math.min(w - GRID, rx)))
  const y = snapToGrid(Math.max(GRID, Math.min(h - GRID, ry)))
  const dir = DIRS[Math.floor(Math.random() * DIRS.length)]
  return {
    segments: [{ x, y }],
    dir,
    progress: 0,
    age: 0,
    maxAge: 500 + Math.random() * 700,
    colorIdx: Math.floor(Math.random() * 3),
  }
}

const PALETTE = ['43, 79, 127', '212, 168, 83', '196, 125, 90']

export default function CircuitGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const traces: Trace[] = []
    const nodes: NodePulse[] = []

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < TRACE_COUNT; i++) {
      traces.push(createTrace(window.innerWidth, window.innerHeight))
    }

    function tick() {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx!.clearRect(0, 0, w, h)

      const cx = w / 2
      const cy = h * 0.4
      const radX = w * 0.5
      const radY = h * 0.45

      for (let t = 0; t < traces.length; t++) {
        const trace = traces[t]
        trace.age++
        trace.progress += TRACE_SPEED / GRID

        if (trace.progress >= 1) {
          trace.progress = 0
          const last = trace.segments[trace.segments.length - 1]
          trace.dir = pickDir(trace.dir)
          const nx = snapToGrid(last.x + trace.dir.dx * GRID)
          const ny = snapToGrid(last.y + trace.dir.dy * GRID)

          if (nx < GRID || nx > w - GRID || ny < GRID || ny > h - GRID) {
            trace.dir = { dx: -trace.dir.dx, dy: -trace.dir.dy }
            const bx = snapToGrid(last.x + trace.dir.dx * GRID)
            const by = snapToGrid(last.y + trace.dir.dy * GRID)
            trace.segments.push({ x: bx, y: by })
          } else {
            trace.segments.push({ x: nx, y: ny })
          }

          if (trace.segments.length > 2) {
            const prev = trace.segments[trace.segments.length - 3]
            const curr = trace.segments[trace.segments.length - 2]
            if (prev.x !== trace.dir.dx + curr.x || prev.y !== trace.dir.dy + curr.y) {
              nodes.push({ x: curr.x, y: curr.y, age: 0, colorIdx: trace.colorIdx })
            }
          }
          if (trace.segments.length > TRACE_LENGTH) trace.segments.shift()
        }

        if (trace.age > trace.maxAge) { traces[t] = createTrace(w, h); continue }

        const fadeIn = Math.min(trace.age / 60, 1)
        const fadeOut = Math.max(1 - (trace.age - trace.maxAge + 120) / 120, 0)
        const life = Math.min(fadeIn, trace.age > trace.maxAge - 120 ? fadeOut : 1)
        if (trace.segments.length < 2) continue

        for (let i = 0; i < trace.segments.length - 1; i++) {
          const a = trace.segments[i]
          const b = trace.segments[i + 1]
          const segFade = (i + 1) / trace.segments.length
          const midX = (a.x + b.x) / 2
          const midY = (a.y + b.y) / 2
          const distNorm = Math.sqrt(((midX - cx) / radX) ** 2 + ((midY - cy) / radY) ** 2)
          const radialFade = Math.max(1 - distNorm, 0)
          const alpha = segFade * life * radialFade * 0.18
          if (alpha < 0.005) continue

          const traceColor = PALETTE[trace.colorIdx]
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          if (i === trace.segments.length - 2) {
            ctx!.lineTo(a.x + (b.x - a.x) * trace.progress, a.y + (b.y - a.y) * trace.progress)
          } else { ctx!.lineTo(b.x, b.y) }
          ctx!.strokeStyle = `rgba(${traceColor}, ${alpha * 0.3})`
          ctx!.lineWidth = 4
          ctx!.stroke()

          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          if (i === trace.segments.length - 2) {
            ctx!.lineTo(a.x + (b.x - a.x) * trace.progress, a.y + (b.y - a.y) * trace.progress)
          } else { ctx!.lineTo(b.x, b.y) }
          ctx!.strokeStyle = `rgba(${traceColor}, ${alpha})`
          ctx!.lineWidth = 1
          ctx!.stroke()
        }
      }

      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i]
        node.age++
        if (node.age > NODE_PULSE_DURATION) { nodes.splice(i, 1); continue }
        const distNorm = Math.sqrt(((node.x - cx) / radX) ** 2 + ((node.y - cy) / radY) ** 2)
        const radialFade = Math.max(1 - distNorm, 0)
        const t = node.age / NODE_PULSE_DURATION
        const pulse = Math.sin(t * Math.PI)
        const alpha = pulse * radialFade * 0.3
        if (alpha < 0.005) continue
        const size = 2 + pulse * 2
        ctx!.fillStyle = `rgba(${PALETTE[node.colorIdx]}, ${alpha})`
        ctx!.fillRect(node.x - size / 2, node.y - size / 2, size, size)
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true" />
}
