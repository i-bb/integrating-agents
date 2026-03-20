import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { Tracker } from './tracker'
import type { AnalysisResult } from './types'

export type TrackerStatus = 'recording' | 'analyzing' | 'done' | 'error'

export interface TrackerContextValue {
  sessionId: string
  eventCount: number
  status: TrackerStatus
  results: AnalysisResult | null
  errorMessage: string | null
  analyze: () => Promise<void>
  trackView: (view: string, title: string) => void
}

export const TrackerContext = createContext<TrackerContextValue | null>(null)

const API_URL = import.meta.env.VITE_TRACKER_API_URL as string

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const trackerRef = useRef<Tracker | null>(null)
  const [sessionId, setSessionId] = useState('')
  const [eventCount, setEventCount] = useState(0)
  const [status, setStatus] = useState<TrackerStatus>('recording')
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (trackerRef.current) return
    const tracker = new Tracker(API_URL)
    trackerRef.current = tracker
    setSessionId(tracker.getSessionId())

    const interval = setInterval(() => {
      setEventCount(tracker.getEventCount())
    }, 2000)

    return () => {
      clearInterval(interval)
      tracker.destroy()
      trackerRef.current = null
    }
  }, [])

  const trackView = useCallback((view: string, title: string) => {
    trackerRef.current?.trackView(view, title)
    // Update count immediately
    setTimeout(() => {
      if (trackerRef.current) setEventCount(trackerRef.current.getEventCount())
    }, 0)
  }, [])

  const analyze = useCallback(async () => {
    if (!trackerRef.current) return
    const sid = trackerRef.current.getSessionId()
    setStatus('analyzing')
    setErrorMessage(null)

    try {
      const res = await fetch(`${API_URL}/analyze/${sid}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error || `HTTP ${res.status}`)
      }
      const data = await res.json() as AnalysisResult
      setResults(data)
      setStatus('done')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Analysis failed')
      setStatus('error')
    }
  }, [])

  return (
    <TrackerContext.Provider value={{ sessionId, eventCount, status, results, errorMessage, analyze, trackView }}>
      {children}
    </TrackerContext.Provider>
  )
}
