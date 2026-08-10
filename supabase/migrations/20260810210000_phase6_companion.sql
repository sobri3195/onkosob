-- Phase 6 private patient-companion storage. No table is publicly readable.
create table if not exists public.care_events (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 type text not null, title text not null, date date not null, time time, clinician text, location text, note text,
 completed boolean not null default false, status text not null default 'upcoming' check (status in ('upcoming','completed','cancelled')),
 checklist jsonb not null default '[]'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.symptom_entries (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 date date not null, symptom text not null, severity text not null check (severity in ('mild','moderate','severe')),
 duration text, note text, related_date date, action_taken text, created_at timestamptz not null default now()
);
create table if not exists public.medication_schedules (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, schedule_text text not null, reminder_time time, start_date date not null, end_date date, note text, created_at timestamptz not null default now()
);
create table if not exists public.medication_logs (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 medication_id uuid not null references public.medication_schedules(id) on delete cascade, log_date date not null,
 status text not null check (status in ('taken','skipped')), created_at timestamptz not null default now(), unique(user_id,medication_id,log_date)
);
create table if not exists public.daily_notes (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 note_date date not null, eating_enough boolean not null default false, drinking_enough boolean not null default false,
 light_activity boolean not null default false, resting boolean not null default false, created_at timestamptz not null default now(), unique(user_id,note_date)
);

do $$ declare t text; begin
 foreach t in array array['care_events','symptom_entries','medication_schedules','medication_logs','daily_notes'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('alter table public.%I force row level security',t);
  execute format('create policy %I on public.%I for select using ((select auth.uid()) = user_id)',t||'_select_own',t);
  execute format('create policy %I on public.%I for insert with check ((select auth.uid()) = user_id)',t||'_insert_own',t);
  execute format('create policy %I on public.%I for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',t||'_update_own',t);
  execute format('create policy %I on public.%I for delete using ((select auth.uid()) = user_id)',t||'_delete_own',t);
 end loop;
end $$;
create index if not exists care_events_user_date on public.care_events(user_id,date);
create index if not exists symptom_entries_user_date on public.symptom_entries(user_id,date desc);
create index if not exists medication_schedules_user on public.medication_schedules(user_id);
