-- ============================================================
-- InterviewReady — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Questions (public content, read-only for all) ─────────────────────────
create table if not exists public.questions (
  id           text primary key,             -- e.g. 'dsa-1'
  topic_id     text not null,                -- e.g. 'dsa'
  title        text not null,
  description  text not null,
  hint         text,
  solution     text not null,
  difficulty   text not null check (difficulty in ('easy', 'medium', 'hard')),
  tags         text[] not null default '{}',
  created_at   timestamptz not null default now()
);

create index if not exists questions_topic_idx      on public.questions (topic_id);
create index if not exists questions_difficulty_idx on public.questions (difficulty);

-- ── Users ────────────────────────────────────────────────────
create table if not exists public.users (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  name         text,
  image        text,
  provider     text not null,          -- 'github' | 'google'
  provider_id  text not null,          -- OAuth account ID
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create unique index if not exists users_provider_idx on public.users (provider, provider_id);

-- ── Sessions ─────────────────────────────────────────────────
create table if not exists public.sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  name         text not null,
  topics       text[] not null default '{}',   -- array of TopicId strings
  target_date  date,
  is_active    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists sessions_user_idx on public.sessions (user_id);

-- Enforce only one active session per user
create unique index if not exists sessions_active_user_idx
  on public.sessions (user_id)
  where is_active = true;

-- ── Question Progress ────────────────────────────────────────
create table if not exists public.question_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  session_id    uuid not null references public.sessions(id) on delete cascade,
  question_id   text not null,          -- e.g. 'dsa-1'
  topic_id      text not null,          -- e.g. 'dsa'
  status        text not null default 'done' check (status in ('done', 'struggling', 'skipped')),
  completed_at  timestamptz not null default now(),
  unique (user_id, session_id, question_id)
);

create index if not exists progress_session_idx on public.question_progress (session_id);
create index if not exists progress_user_idx    on public.question_progress (user_id);

-- ── Row Level Security ───────────────────────────────────────
alter table public.questions         enable row level security;
alter table public.users             enable row level security;
alter table public.sessions          enable row level security;
alter table public.question_progress enable row level security;

-- Drop policies if they already exist (safe to re-run)
drop policy if exists "questions: public read" on public.questions;
drop policy if exists "users: own row"         on public.users;
drop policy if exists "sessions: own rows"     on public.sessions;
drop policy if exists "progress: own rows"     on public.question_progress;

-- Questions are publicly readable (no auth required)
create policy "questions: public read" on public.questions
  for select using (true);

-- Users can only read/update their own row
create policy "users: own row" on public.users
  for all using (id = auth.uid());

-- Sessions belong to a user
create policy "sessions: own rows" on public.sessions
  for all using (user_id = auth.uid());

-- Progress belongs to a user
create policy "progress: own rows" on public.question_progress
  for all using (user_id = auth.uid());

-- ── Auto-update updated_at ───────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_updated_at    on public.users;
drop trigger if exists sessions_updated_at on public.sessions;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();
