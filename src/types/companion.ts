export type CareEventType = 'Konsultasi'|'Kemoterapi'|'Radioterapi'|'Operasi'|'Pemeriksaan Laboratorium'|'Imaging'|'Patologi'|'Follow-up'|'Lainnya'
export type ChecklistItem = { id:string; label:string; done:boolean }
export interface CareEvent { id:string; type:CareEventType; title:string; date:string; time?:string; clinician?:string; location?:string; note?:string; completed:boolean; status:'upcoming'|'completed'|'cancelled'; checklist:ChecklistItem[] }
export interface SymptomEntry { id:string; date:string; symptom:string; severity:'mild'|'moderate'|'severe'; duration?:string; note?:string; relatedDate?:string; action?:string }
export interface MedicationSchedule { id:string; name:string; scheduleText:string; time?:string; startDate:string; endDate?:string; note?:string }
export interface MedicationLog { id:string; medicationId:string; date:string; status:'taken'|'skipped' }
export interface DailyNote { date:string; eating:boolean; drinking:boolean; activity:boolean; rest:boolean }
