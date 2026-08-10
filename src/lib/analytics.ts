export type EducationEvent = 'journey_stage_opened'|'glossary_term_opened'|'checklist_completed'|'question_added'|'quiz_completed'|'article_saved'
export function trackEvent(_event: EducationEvent, _metadata?: Record<string, string | number | boolean>) { /* privacy-safe no-op */ }
