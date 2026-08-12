export type EducationEvent = 'journey_stage_opened'|'glossary_term_opened'|'checklist_completed'|'question_added'|'quiz_completed'|'article_saved'|'follow_up_plan_created'|'follow_up_task_completed'|'follow_up_summary_generated'
export function trackEvent(_event: EducationEvent, _metadata?: Record<string, string | number | boolean>) { /* privacy-safe no-op */ }
