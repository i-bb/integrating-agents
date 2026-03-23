import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react'
import { motion } from 'framer-motion'

export interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<'svg'> {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: number
  numSquares?: number
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}

type Square = {
  id: number
  pos: [number, number]
  iteration: number
}

export function AnimatedGridPattern({
  width = 48,
  height = 48,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 100,
  className,
  maxOpacity = 0.05,
  duration = 4,
  repeatDelay = 1,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId()
  const containerRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [squares, setSquares] = useState<Square[]>([])

  const getPos = useCallback((): [number, number] => {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ]
  }, [dimensions.height, dimensions.width, height, width])

  const generateSquares = useCallback(
    (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
        iteration: 0,
      }))
    },
    [getPos]
  )

  const updateSquarePosition = useCallback(
    (squareId: number) => {
      setSquares((currentSquares) => {
        const current = currentSquares[squareId]
        if (!current || current.id !== squareId) return currentSquares

        const nextSquares = currentSquares.slice()
        nextSquares[squareId] = {
          ...current,
          pos: getPos(),
          iteration: current.iteration + 1,
        }

        return nextSquares
      })
    },
    [getPos]
  )

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares))
    }
  }, [dimensions.width, dimensions.height, generateSquares, numSquares])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    // Seed dimensions immediately from the element's current size
    const rect = element.getBoundingClientRect()
    setDimensions({ width: rect.width, height: rect.height })

    // Only update on genuine window resize — not mobile scroll bar show/hide
    let debounceTimer: ReturnType<typeof setTimeout>
    const resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        for (const entry of entries) {
          setDimensions((prev) => {
            const nextW = Math.round(entry.contentRect.width)
            const nextH = Math.round(entry.contentRect.height)
            // Ignore height-only changes under 100px — these are mobile browser chrome toggling
            if (Math.abs(nextW - prev.width) < 2 && Math.abs(nextH - prev.height) < 100) {
              return prev
            }
            return { width: nextW, height: nextH }
          })
        }
      }, 200)
    })

    resizeObserver.observe(element)
    return () => {
      clearTimeout(debounceTimer)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={className}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {squares.map(({ pos: [squareX, squareY], id: squareId, iteration }) => (
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: maxOpacity }}
          transition={{
            duration,
            repeat: 1,
            delay: (squareId * 0.01) % 2,
            repeatType: 'reverse',
            ease: 'easeInOut',
            repeatDelay,
          }}
          onAnimationComplete={() => updateSquarePosition(squareId)}
          key={`${squareId}-${iteration}`}
          width={width - 1}
          height={height - 1}
          x={squareX * width + 1}
          y={squareY * height + 1}
          fill="currentColor"
          strokeWidth="0"
        />
      ))}
    </svg>
  )
}
