import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

interface UserEventRow {
  seq: number
  event_type: string
  page_title: string | null
  url: string | null
  element_tag: string | null
  element_text: string | null
  element_aria: string | null
  element_id: string | null
  element_href: string | null
  element_path: string[] | null
  timestamp: string
}

function buildNarrative(events: UserEventRow[]): string {
  return events.map((e, i) => {
    const n = i + 1
    switch (e.event_type) {
      case 'pageview':
        return `${n}. Navigated to "${e.page_title ?? ''}" (${e.url ?? ''})`
      case 'click': {
        const label = e.element_text || e.element_aria || e.element_id || e.element_tag || 'element'
        const context = e.element_path && e.element_path.length >= 2
          ? ` in ${e.element_path[e.element_path.length - 2]}`
          : ''
        return `${n}. Clicked "${label}" ${e.element_tag ?? ''}${context}`
      }
      case 'submit':
        return `${n}. Submitted form ("${e.element_text || 'form'}" button) on "${e.page_title ?? ''}"`
      case 'input_change':
        return `${n}. Filled in "${e.element_id || 'field'}" field on "${e.page_title ?? ''}"`
      default:
        return `${n}. ${e.event_type} on "${e.page_title ?? ''}"`
    }
  }).join('\n')
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  if (minutes === 0) return `${seconds} seconds`
  return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} seconds`
}

async function callLLM(prompt: string, openrouterKey: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openrouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://onlastmile.com',
      'X-Title': 'Last Mile Tracker',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error ${res.status}: ${err}`)
  }

  const data = await res.json() as {
    choices: { message: { content: string } }[]
  }
  return data.choices[0].message.content
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // Extract sessionId from URL path: /functions/v1/analyze/{sessionId}
  const url = new URL(req.url)
  const pathParts = url.pathname.split('/').filter(Boolean)
  const sessionId = pathParts[pathParts.length - 1]

  if (!sessionId || sessionId === 'analyze') {
    return new Response(JSON.stringify({ error: 'Missing sessionId' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Check cache first
  const { data: cached } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle()

  if (cached) {
    return new Response(JSON.stringify({
      sessionId: cached.session_id,
      eventCount: cached.event_count,
      analyzedAt: cached.analyzed_at,
      summary: cached.summary,
      tasks: cached.tasks ?? [],
      patterns: cached.patterns ?? [],
      automationCandidates: cached.automation_candidates ?? [],
      cached: true,
    }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // Fetch events
  const { data: events, error: eventsError } = await supabase
    .from('user_events')
    .select('seq, event_type, page_title, url, element_tag, element_text, element_aria, element_id, element_href, element_path, timestamp')
    .eq('session_id', sessionId)
    .order('seq', { ascending: true })

  if (eventsError) {
    return new Response(JSON.stringify({ error: eventsError.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  if (!events || events.length === 0) {
    return new Response(JSON.stringify({ error: 'No events found for this session' }), {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  if (events.length < 3) {
    return new Response(JSON.stringify({ error: 'Not enough events to analyze (minimum 3)' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const narrative = buildNarrative(events as UserEventRow[])
  const firstTs = new Date(events[0].timestamp).getTime()
  const lastTs = new Date(events[events.length - 1].timestamp).getTime()
  const duration = formatDuration(lastTs - firstTs)

  const prompt = `You are analyzing a web session to identify what tasks the user performed.
Your goal is to help a team understand user behavior to identify automation opportunities.

Session: ${sessionId}
Duration: ${duration}
Event count: ${events.length}

User interactions (in order):
---
${narrative}
---

Respond with ONLY a raw JSON object (no markdown, no explanation):

{
  "summary": "2-3 sentence description of what the user did and their apparent goal",
  "tasks": [
    {
      "name": "Short task name",
      "description": "What the user was trying to accomplish",
      "steps": ["step description", "step description"],
      "startSeq": 1,
      "endSeq": 4
    }
  ],
  "patterns": [
    {
      "description": "Observed behavioral pattern",
      "significance": "Why this matters for automation"
    }
  ],
  "automationCandidates": [
    {
      "task": "Task name",
      "reasoning": "Why this is a good automation candidate",
      "estimatedImpact": "high"
    }
  ]
}`

  const openrouterKey = Deno.env.get('OPENROUTER_API_KEY')!
  let rawResponse = ''

  try {
    rawResponse = await callLLM(prompt, openrouterKey)
  } catch (err) {
    console.error('[analyze] LLM call failed:', err)
    return new Response(JSON.stringify({ error: 'LLM call failed' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // Parse JSON — strip possible markdown fences
  let parsed: {
    summary: string
    tasks: unknown[]
    patterns: unknown[]
    automationCandidates: unknown[]
  }
  try {
    const cleaned = rawResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()
    parsed = JSON.parse(cleaned)
  } catch {
    // Retry with explicit instruction
    try {
      rawResponse = await callLLM(
        prompt + '\n\nIMPORTANT: Respond with only raw JSON. No markdown, no backticks, no explanation.',
        openrouterKey,
      )
      parsed = JSON.parse(rawResponse.trim())
    } catch (err) {
      console.error('[analyze] JSON parse failed after retry:', err)
      return new Response(JSON.stringify({ error: 'Failed to parse LLM response as JSON' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }
  }

  const analyzedAt = new Date().toISOString()

  await supabase.from('analysis_results').upsert({
    session_id: sessionId,
    analyzed_at: analyzedAt,
    event_count: events.length,
    summary: parsed.summary,
    tasks: parsed.tasks,
    patterns: parsed.patterns,
    automation_candidates: parsed.automationCandidates,
    raw_response: rawResponse,
  }, { onConflict: 'session_id' })

  return new Response(JSON.stringify({
    sessionId,
    eventCount: events.length,
    analyzedAt,
    summary: parsed.summary,
    tasks: parsed.tasks ?? [],
    patterns: parsed.patterns ?? [],
    automationCandidates: parsed.automationCandidates ?? [],
    cached: false,
  }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
