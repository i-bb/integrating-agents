-- Events table: one row per captured user interaction
CREATE TABLE IF NOT EXISTS user_events (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id      text        NOT NULL,
  user_id         text        NOT NULL,
  event_id        text        NOT NULL UNIQUE,
  seq             integer     NOT NULL,
  timestamp       timestamptz NOT NULL,
  event_type      text        NOT NULL,
  url             text,
  page_title      text,
  element_tag     text,
  element_text    text,
  element_aria    text,
  element_id      text,
  element_href    text,
  element_path    jsonb,
  raw_event       jsonb       NOT NULL DEFAULT '{}',
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_events_session_id_idx ON user_events (session_id);
CREATE INDEX IF NOT EXISTS user_events_user_id_idx ON user_events (user_id);
CREATE INDEX IF NOT EXISTS user_events_created_at_idx ON user_events (created_at);

-- Analysis cache: one row per analyzed session
CREATE TABLE IF NOT EXISTS analysis_results (
  id                    uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id            text        NOT NULL UNIQUE,
  analyzed_at           timestamptz DEFAULT now(),
  event_count           integer,
  summary               text,
  tasks                 jsonb,
  patterns              jsonb,
  automation_candidates jsonb,
  raw_response          text
);
