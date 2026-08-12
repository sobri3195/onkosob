export type JourneyStatus = 'Belum' | 'Saat ini' | 'Selesai'
export interface SymptomEntry { id:string; symptom:string; severity:'Ringan'|'Sedang'|'Berat'; date:string; duration?:string; note?:string }
export interface Appointment { id:string; date:string; time:string; type:string; location:string; completed:boolean; prep:number }
export interface MedicationEntry { id:string; name:string; schedule:string; time:string; notes:string; status:'pending'|'taken'|'skipped'|'archived' }
export interface ConsultationQuestion { id:string; text:string; category:string }
export interface ChecklistState { id:string; category:string; items:{id:string;text:string;done:boolean}[] }
export interface FollowUpPlan { id:string; date:string; title:string; tasks:string[]; history:boolean }
export interface SavedItem { id:string; type:'Artikel'|'Istilah'|'Pertanyaan'|'Journey'; title:string }
export interface PatientDocument { id:string; title:string; filename:string; category:string; date:string }
export interface PatientAppState {
  profile:{displayName:string}; journey:Record<string,JourneyStatus>; symptoms:SymptomEntry[]; appointments:Appointment[];
  medications:MedicationEntry[]; questions:ConsultationQuestion[]; checklists:ChecklistState[]; followUps:FollowUpPlan[];
  documents:PatientDocument[]; savedItems:SavedItem[]; learning:Record<string,number>;
  preferences:{notifications:boolean;interests:string[];onboardingComplete:boolean;theme:'dark'|'light'}
}
