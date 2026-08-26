export type JourneyStatus = 'Belum' | 'Saat ini' | 'Selesai'
export interface SymptomEntry { id:string; symptom:string; severity:'Ringan'|'Sedang'|'Berat'; date:string; duration?:string; note?:string }
export interface Appointment { id:string; date:string; time:string; type:string; location:string; clinician?:string; contact?:string; completed:boolean; prep:number }
export interface MedicationEntry { id:string; name:string; schedule:string; time:string; notes:string; status:'pending'|'taken'|'skipped'|'archived'; kind?:'resep'|'nonresep'|'suplemen'; skippedReason?:string; scheduleChanged?:boolean }
export interface ConsultationQuestion { id:string; text:string; category:string; answered?:boolean }
export interface ChecklistState { id:string; category:string; items:{id:string;text:string;done:boolean}[] }
export interface FollowUpPlan { id:string; date:string; title:string; tasks:string[]; history:boolean }
export interface SavedItem { id:string; type:'Artikel'|'Istilah'|'Pertanyaan'|'Journey'; title:string }
export interface PatientDocument { id:string; title:string; filename:string; category:string; date:string }
export interface DocumentComparison { id:string; olderDocumentId:string; newerDocumentId:string; changes:string; question:string; linkedFollowUpId?:string; createdAt:string }
export interface CaregiverTask { id:string; title:string; assignee:string; status:'perlu-dibantu'|'dikerjakan'|'selesai'; comment:string; expiresAt:string; permissions:('schedule'|'checklist'|'documents'|'questions')[]; revoked:boolean; activity:string[] }
export interface SafetyCheckIn { id:string; date:string; wellbeing:'Baik'|'Cukup'|'Buruk'; symptoms:string[]; severity:'Ringan'|'Sedang'|'Berat'; hydration:'Baik'|'Sulit'; activity:'Normal'|'Terbatas'|'Tidak mampu'; note:string }
export interface PatientAppState {
  profile:{displayName:string}; journey:Record<string,JourneyStatus>; symptoms:SymptomEntry[]; appointments:Appointment[];
  medications:MedicationEntry[]; questions:ConsultationQuestion[]; checklists:ChecklistState[]; followUps:FollowUpPlan[];
  documents:PatientDocument[]; savedItems:SavedItem[]; learning:Record<string,number>;
  documentComparisons:DocumentComparison[]; caregiverTasks:CaregiverTask[]; safetyCheckIns:SafetyCheckIn[];
  preferences:{notifications:boolean;interests:string[];onboardingComplete:boolean;theme:'dark'|'light'}
}
