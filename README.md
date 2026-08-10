
## Environment Setup

Copy `.env.example` to `.env.local` and provide the project URL and **public anon key**. Never place `SUPABASE_SERVICE_ROLE_KEY` in a Vite variable or browser bundle. Without these variables, all public education and existing local progress continue to work, while account features show a configuration notice.

## Supabase Setup

This phase uses Supabase Auth, Postgres, PostgREST, Row Level Security, and one Edge Function. Create a Supabase project, configure the application URL and password-reset redirect (`/reset-password`), then apply the versioned migration. Email confirmation is supported: registration shows a waiting-for-verification state rather than assuming a session.

## Running Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The browser uses only the anon key. The small typed client in `src/lib/supabase.ts` communicates with Supabase's Auth, PostgREST, RPC, and Functions endpoints; privileged credentials exist only in the Edge Function runtime.

## Applying Migrations

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase db seed # optional development categories
supabase functions deploy delete-account
```

The migration creates `profiles`, `categories`, `articles`, `article_references`, `article_revisions`, `editorial_comments`, `tags`, `article_tags`, `saved_items`, `learning_progress`, `consultation_questions`, and `audit_logs`, including constraints and indexes.

## Role Model

Public visitors can read only published articles. Learner, patient, caregiver, and survivor accounts own only their profile and educational data. Editors can create and update their own drafts. Assigned medical reviewers can review, comment, request revision, and approve. Administrators manage editorial roles/categories and can publish an approved, valid article. React route guards improve navigation, but PostgreSQL RLS and RPC transition validation are authoritative.

## Editorial Workflow

The enforced transition is `draft → in_review → revision_required → in_review → approved → published → archived`. Editors submit/resubmit, assigned reviewers request revision or approve, and admins publish/archive. Publishing validates title, excerpt, category, body, SEO description, and required reviewer. Revision notes and immutable snapshots are modeled separately, while workflow and changes write audit events.

## Security Notes

- Profile updates cannot change roles unless the actor is an admin; patient-facing forms never send a role.
- User-owned rows are scoped to `auth.uid()`. Draft visibility is scoped to author, assigned reviewer, or admin.
- Account deletion runs in `supabase/functions/delete-account`; its service role secret is injected by Supabase and never reaches the client.
- Educational synchronization intentionally excludes diagnosis, cancer stage, pathology, medication, and prognosis.
- Local-to-cloud synchronization is explicit, uses unions for set-like data, and prefers existing cloud values for conflicting keyed progress.
