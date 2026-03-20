import { useContext } from 'react'
import { TrackerContext } from './TrackerProvider'
import type { TrackerContextValue } from './TrackerProvider'

export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider')
  return ctx
}
