-- Phase 8: user-entered follow-up organization. No clinical schedules are generated.
create type public.follow_up_plan_status as enum ('active','completed','paused');
create type public.follow_up_task_status as enum ('planned','scheduled','completed','cancelled');
create table public.follow_up_plans (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(title) between 1 and 160), plan_date date not null, next_follow_up_date date,
 interval_text text check(length(interval_text)<=500), facility text check(length(facility)<=160), clinician text check(length(clinician)<=160),
 notes text check(length(notes)<=5000), status public.follow_up_plan_status not null default 'active', checklist jsonb not null default '[]',
 selected_symptom_ids uuid[] not null default '{}', linked_document_ids uuid[] not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.follow_up_tasks (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 plan_id uuid not null references public.follow_up_plans(id) on delete cascade, title text not null check(length(title) between 1 and 160), type text not null,
 planned_date date, completed_date date, status public.follow_up_task_status not null default 'planned', note text check(length(note)<=3000),
 linked_appointment_id uuid, linked_document_id uuid references public.documents(id) on delete set null, created_at timestamptz not null default now()
);
create table public.follow_up_visits (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 plan_id uuid references public.follow_up_plans(id) on delete cascade, visit_date date not null, facility text, clinician text,
 discussion_notes text, unclear_notes text, next_steps text, requested_tests text, medications_discussed text,
 questions_answered text, unanswered_questions text, weight_note text, symptom_notes text, medication_list text,
 appointment_notes text, next_follow_up_date date, created_at timestamptz not null default now()
);
create table public.follow_up_questions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 plan_id uuid references public.follow_up_plans(id) on delete cascade, category text not null, question_text text not null check(length(question_text)<=1000),
 answered boolean not null default false, created_at timestamptz not null default now()
);
create table public.follow_up_caregiver_permissions (
 plan_id uuid not null references public.follow_up_plans(id) on delete cascade, caregiver_user_id uuid not null references auth.users(id) on delete cascade,
 can_view_upcoming boolean not null default false, can_view_checklist boolean not null default false,
 can_view_documents boolean not null default false, can_view_questions boolean not null default false,
 primary key(plan_id,caregiver_user_id)
);
create index follow_up_plans_owner_date on public.follow_up_plans(user_id,next_follow_up_date);
create index follow_up_tasks_plan_date on public.follow_up_tasks(plan_id,planned_date);
create index follow_up_visits_owner_date on public.follow_up_visits(user_id,visit_date desc);
alter table public.follow_up_plans enable row level security; alter table public.follow_up_tasks enable row level security;
alter table public.follow_up_visits enable row level security; alter table public.follow_up_questions enable row level security;
alter table public.follow_up_caregiver_permissions enable row level security;
-- Owner CRUD is explicit. Caregiver reads require an accepted relationship and granular permission.
create policy follow_up_plans_owner_all on public.follow_up_plans for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy follow_up_plans_caregiver_read on public.follow_up_plans for select using(exists(select 1 from public.follow_up_caregiver_permissions p join public.caregiver_relationships r on r.owner_user_id=user_id and r.caregiver_user_id=p.caregiver_user_id where p.plan_id=id and p.caregiver_user_id=auth.uid() and p.can_view_upcoming and r.status='accepted'));
create policy follow_up_tasks_owner_all on public.follow_up_tasks for all using(user_id=auth.uid() and exists(select 1 from public.follow_up_plans p where p.id=plan_id and p.user_id=auth.uid())) with check(user_id=auth.uid() and exists(select 1 from public.follow_up_plans p where p.id=plan_id and p.user_id=auth.uid()));
create policy follow_up_tasks_caregiver_read on public.follow_up_tasks for select using(exists(select 1 from public.follow_up_caregiver_permissions fp join public.caregiver_relationships r on r.caregiver_user_id=fp.caregiver_user_id join public.follow_up_plans p on p.id=fp.plan_id where fp.plan_id=plan_id and p.user_id=user_id and fp.caregiver_user_id=auth.uid() and fp.can_view_checklist and r.owner_user_id=p.user_id and r.status='accepted'));
create policy follow_up_visits_owner_all on public.follow_up_visits for all using(user_id=auth.uid()) with check(user_id=auth.uid()); -- private notes are owner-only
create policy follow_up_questions_owner_all on public.follow_up_questions for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy follow_up_questions_caregiver_read on public.follow_up_questions for select using(exists(select 1 from public.follow_up_caregiver_permissions fp join public.caregiver_relationships r on r.caregiver_user_id=fp.caregiver_user_id join public.follow_up_plans p on p.id=fp.plan_id where fp.plan_id=plan_id and p.user_id=user_id and fp.caregiver_user_id=auth.uid() and fp.can_view_questions and r.owner_user_id=p.user_id and r.status='accepted'));
create policy follow_up_permissions_owner_all on public.follow_up_caregiver_permissions for all using(exists(select 1 from public.follow_up_plans p where p.id=plan_id and p.user_id=auth.uid())) with check(exists(select 1 from public.follow_up_plans p join public.caregiver_relationships r on r.owner_user_id=p.user_id where p.id=plan_id and p.user_id=auth.uid() and r.caregiver_user_id=caregiver_user_id and r.status='accepted'));
create policy follow_up_permissions_caregiver_read on public.follow_up_caregiver_permissions for select using(caregiver_user_id=auth.uid());
create function public.enforce_follow_up_task_owner() returns trigger language plpgsql as $$begin if not exists(select 1 from public.follow_up_plans where id=new.plan_id and user_id=new.user_id) then raise exception 'Follow-up task owner must match plan owner'; end if; return new; end$$;
create trigger follow_up_task_owner before insert or update on public.follow_up_tasks for each row execute function public.enforce_follow_up_task_owner();
