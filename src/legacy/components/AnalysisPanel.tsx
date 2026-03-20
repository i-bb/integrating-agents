import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTracker } from '../tracker/useTracker'
import type { AnalysisTask, AutomationCandidate } from '../tracker/types'

function ImpactBadge({ impact }: { impact: 'low' | 'medium' | 'high' }) {
  const styles = {
    high: 'bg-green-500/20 text-green-300 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    low: 'bg-red-500/20 text-red-300 border-red-500/30',
  }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded ${styles[impact]}`}>
      {impact}
    </span>
  )
}

function TaskAccordion({ task }: { task: AnalysisTask }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="text-[13px] font-semibold text-white">{task.name}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" className="text-white/50 flex-shrink-0"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1.5 border-t border-white/10">
              <p className="text-[11px] text-white/60 mt-2">{task.description}</p>
              <ol className="space-y-1">
                {task.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-white/80">
                    <span className="text-white/40 font-mono flex-shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CandidateRow({ candidate }: { candidate: AutomationCandidate }) {
  return (
    <div className="border border-white/10 rounded-lg px-3 py-2.5 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-white">{candidate.task}</span>
        <ImpactBadge impact={candidate.estimatedImpact} />
      </div>
      <p className="text-[11px] text-white/65 leading-[1.5]">{candidate.reasoning}</p>
    </div>
  )
}

function Spinner() {
  return (
    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin flex-shrink-0" />
  )
}

export default function AnalysisPanel() {
  const { eventCount, status, results, errorMessage, analyze } = useTracker()
  const [visible, setVisible] = useState(true)

  if (!visible && status === 'done') return null

  return (
    <div
      data-tracker-ignore="true"
      className="fixed bottom-6 right-6 z-50 max-w-xs w-64 lg:w-72"
    >
      <AnimatePresence mode="wait">
        {status === 'recording' && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="bg-[var(--color-accent)] text-white rounded-xl shadow-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <span className="text-[13px] font-semibold">Recording</span>
              </div>
              <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-white/80">
                {eventCount} events
              </span>
            </div>
            <button
              onClick={analyze}
              disabled={eventCount < 3}
              className="w-full py-2 text-[13px] font-semibold bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg cursor-pointer"
            >
              Analyze My Session
            </button>
          </motion.div>
        )}

        {status === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="bg-[var(--color-accent)] text-white rounded-xl shadow-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <Spinner />
              <span className="text-[13px] font-semibold">Analyzing {eventCount} events…</span>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="bg-[var(--color-accent)] text-white rounded-xl shadow-2xl p-4 space-y-3"
          >
            <p className="text-[13px] text-red-300">{errorMessage || 'Analysis failed — try again'}</p>
            <button
              onClick={analyze}
              className="w-full py-2 text-[13px] font-semibold bg-white/10 hover:bg-white/20 transition-colors rounded-lg cursor-pointer"
            >
              Retry
            </button>
          </motion.div>
        )}

        {status === 'done' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="bg-[var(--color-accent)] text-white rounded-xl shadow-2xl overflow-hidden"
            style={{ maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-[14px] font-bold">Session Analysis</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={analyze}
                  title="Re-analyze"
                  className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer rounded"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                  </svg>
                </button>
                <button
                  onClick={() => setVisible(false)}
                  title="Close"
                  className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer rounded"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(80vh - 48px)' }}>
              {/* Summary */}
              <div>
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Summary</p>
                <p className="text-[13px] text-white/90 leading-[1.6]">{results.summary}</p>
              </div>

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Tasks Identified ({results.tasks.length})
                  </p>
                  <div className="space-y-2">
                    {results.tasks.map((task, i) => (
                      <TaskAccordion key={i} task={task} />
                    ))}
                  </div>
                </div>
              )}

              {/* Automation candidates */}
              {results.automationCandidates.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Automation Candidates
                  </p>
                  <div className="space-y-2">
                    {results.automationCandidates.map((c, i) => (
                      <CandidateRow key={i} candidate={c} />
                    ))}
                  </div>
                </div>
              )}

              {results.cached && (
                <p className="text-[10px] text-white/30 text-center">Cached result</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
