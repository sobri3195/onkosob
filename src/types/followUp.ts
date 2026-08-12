export type FollowUpPlanStatus = 'active'|'completed'|'paused'
export type FollowUpTaskStatus = 'planned'|'scheduled'|'completed'|'cancelled'
export type FollowUpTaskType = 'Konsultasi'|'Laboratorium'|'Imaging'|'Pemeriksaan fisik'|'Membawa hasil pemeriksaan'|'Mengambil obat'|'Administrasi'|'Lainnya'
export interface FollowUpPlan { id:string; userId?:string; title:string; planDate:string; nextFollowUpDate?:string; intervalText?:string; facility?:string; clinician?:string; notes?:string; status:FollowUpPlanStatus; createdAt:string; updatedAt:string; selectedSymptomIds:string[]; linkedDocumentIds:string[]; checklist:FollowUpChecklistItem[]; caregiverPermissions?:FollowUpSharePermissions }
export interface FollowUpTask { id:string; planId:string; title:string; type:FollowUpTaskType; plannedDate?:string; completedDate?:string; status:FollowUpTaskStatus; note?:string; linkedAppointmentId?:string; linkedDocumentId?:string; createdAt:string }
export interface FollowUpVisit { id:string; planId?:string; date:string; facility?:string; clinician?:string; discussionNotes?:string; unclearNotes?:string; nextSteps?:string; requestedTests?:string; medicationsDiscussed?:string; questionsAnswered?:string; unansweredQuestions?:string; weightNote?:string; symptomNotes?:string; medicationList?:string; appointmentNotes?:string; nextFollowUpDate?:string; createdAt:string }
export interface FollowUpQuestion { id:string; planId?:string; category:string; text:string; answered:boolean; createdAt:string }
export interface FollowUpChecklistItem { id:string; label:string; done:boolean; custom?:boolean }
export interface FollowUpSharePermissions { upcoming:boolean; checklist:boolean; documents:boolean; questions:boolean }
export interface FollowUpData { plans:FollowUpPlan[]; tasks:FollowUpTask[]; visits:FollowUpVisit[]; questions:FollowUpQuestion[] }
