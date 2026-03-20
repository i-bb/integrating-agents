export type EventType = 'pageview' | 'click' | 'submit' | 'input_change'

export interface TrackerElement {
  tag: string
  text?: string
  ariaLabel?: string
  id?: string
  href?: string
  type?: string
  name?: string
  classes?: string[]
}

export interface TrackerEvent {
  sessionId: string
  userId: string
  eventId: string
  seq: number
  timestamp: string        // ISO 8601
  eventType: EventType
  url: string
  pageTitle: string
  element?: TrackerElement
  elementPath?: string[]   // last 4 ancestors: ["section#services", "div.card", "button"]
}

export interface AnalysisTask {
  name: string
  description: string
  steps: string[]
  startSeq: number
  endSeq: number
}

export interface AnalysisPattern {
  description: string
  significance: string
}

export interface AutomationCandidate {
  task: string
  reasoning: string
  estimatedImpact: 'low' | 'medium' | 'high'
}

export interface AnalysisResult {
  sessionId: string
  eventCount: number
  analyzedAt: string
  summary: string
  tasks: AnalysisTask[]
  patterns: AnalysisPattern[]
  automationCandidates: AutomationCandidate[]
  cached: boolean
}
