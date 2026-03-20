import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  gold: boolean
  phase: number
}

function makeNodes(w: number, h: number): Node[] {
  const area = w * h
  const count = Math.max(24, Math.min(72, Math.round(area / 14000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    r: Math.random() * 1.8 + 1.2,
    gold: Math.random() < 0.1,
    phase: Math.random() * Math.PI * 2,
  }))
}

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const MAX_DIST = 140
    // Brand hex (resolved from CSS vars in browser earlier)
    const NAVY_RGB = '0,59,117'
    const GOLD_RGB = '237,179,69'

    let w = 0
    let h = 0
    let nodes: Node[] = []
    let dpr = devicePixelRatio || 1

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      if (rect.width === w && rect.height === h) return
      dpr = devicePixelRatio || 1
      w = rect.width
      h = rect.height
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      nodes = makeNodes(w, h)
    }

    function tick(t: number) {
      ctx.clearRect(0, 0, w, h)

      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx) }
          if (n.x > w) { n.x = w; n.vx = -Math.abs(n.vx) }
          if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy) }
          if (n.y > h) { n.y = h; n.vy = -Math.abs(n.vy) }
        }
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const frac = 1 - dist / MAX_DIST
            const isGold = a.gold || b.gold
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = isGold
              ? `rgba(${GOLD_RGB},${(frac * 0.18).toFixed(3)})`
              : `rgba(${NAVY_RGB},${(frac * 0.11).toFixed(3)})`
            ctx.lineWidth = isGold ? 1 : 0.75
            ctx.stroke()
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        const pulse = n.gold
          ? 0.65 + 0.35 * Math.sin(t * 0.0012 + n.phase)
          : 1
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2)
        ctx.fillStyle = n.gold
          ? `rgba(${GOLD_RGB},${(0.55 * pulse).toFixed(3)})`
          : `rgba(${NAVY_RGB},0.22)`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  )
}
