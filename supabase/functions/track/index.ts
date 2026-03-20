import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RawEvent {
  sessionId: string
  userId: string
  eventId: string
  seq: number
  timestamp: string
  eventType: string
  url?: string
  pageTitle?: string
  element?: {
    tag?: string
    text?: string
    ariaLabel?: string
    id?: string
    href?: string
    type?: string
    name?: string
    classes?: string[]
  }
  elementPath?: string[]
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json() as { events?: RawEvent[] }
    const events: RawEvent[] = body.events ?? []

    // Validate required fields
    const valid = events.filter(
      (e) => e.sessionId && e.eventId && e.eventType && e.timestamp
    )

    if (valid.length === 0) {
      return new Response(JSON.stringify({ received: 0 }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const rows = valid.map((e) => ({
      session_id: e.sessionId,
      user_id: e.userId,
      event_id: e.eventId,
      seq: e.seq,
      timestamp: e.timestamp,
      event_type: e.eventType,
      url: e.url ?? null,
      page_title: e.pageTitle ?? null,
      element_tag: e.element?.tag ?? null,
      element_text: e.element?.text ?? null,
      element_aria: e.element?.ariaLabel ?? null,
      element_id: e.element?.id ?? null,
      element_href: e.element?.href ?? null,
      element_path: e.elementPath ?? null,
      raw_event: e,
    }))

    const { error } = await supabase
      .from('user_events')
      .upsert(rows, { onConflict: 'event_id', ignoreDuplicates: true })

    if (error) {
      console.error('[track] Supabase upsert error:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ received: rows.length }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[track] Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
