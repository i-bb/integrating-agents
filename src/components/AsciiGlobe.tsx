import { useEffect, useRef } from 'react'

const CHAR_RAMP = ' .,:;+*?%S#@'

export default function AsciiGlobe({ className = '' }: { className?: string }) {
  const preRef = useRef<HTMLPreElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const pre = preRef.current
    if (!pre) return

    const COLS = 44
    const ROWS = 22
    const R = 10
    let A = 0
    let B = 0

    function render() {
      const output: string[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(' ')
      )
      const zbuf: number[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(0)
      )

      const cosA = Math.cos(A)
      const sinA = Math.sin(A)
      const cosB = Math.cos(B)
      const sinB = Math.sin(B)

      for (let phi = 0; phi < Math.PI; phi += 0.07) {
        const cosPhi = Math.cos(phi)
        const sinPhi = Math.sin(phi)

        for (let theta = 0; theta < 2 * Math.PI; theta += 0.02) {
          const cosTheta = Math.cos(theta)
          const sinTheta = Math.sin(theta)

          const x = R * sinPhi * cosTheta
          const y = R * sinPhi * sinTheta
          const z = R * cosPhi

          const y1 = y * cosA - z * sinA
          const z1 = y * sinA + z * cosA
          const x1 = x * cosB + z1 * sinB
          const z2 = -x * sinB + z1 * cosB

          const ooz = 1 / (z2 + 30)
          const xp = Math.floor(COLS / 2 + 18 * ooz * x1)
          const yp = Math.floor(ROWS / 2 + 9 * ooz * y1)

          if (xp < 0 || xp >= COLS || yp < 0 || yp >= ROWS) continue
          if (ooz <= zbuf[yp][xp]) continue

          zbuf[yp][xp] = ooz

          const nx = sinPhi * cosTheta
          const ny = sinPhi * sinTheta
          const nz = cosPhi

          const ny1 = ny * cosA - nz * sinA
          const nz1 = ny * sinA + nz * cosA
          const nx1 = nx * cosB + nz1 * sinB

          const lx = 0.5
          const ly = -0.7
          const lz = 0.5
          const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz)

          let luminance = (nx1 * lx / lLen + ny1 * ly / lLen + (-nx * sinB + nz1 * cosB) * lz / lLen)
          luminance = Math.max(0, luminance)

          const idx = Math.floor(luminance * (CHAR_RAMP.length - 1))
          output[yp][xp] = CHAR_RAMP[idx]
        }
      }

      pre!.textContent = output.map(row => row.join('')).join('\n')

      A += 0.02
      B += 0.01
      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <pre
      ref={preRef}
      className={`font-mono text-[7px] sm:text-[8px] md:text-[9px] leading-[1.1] text-[var(--color-accent-bright)] opacity-30 select-none whitespace-pre overflow-hidden ${className}`}
    />
  )
}
