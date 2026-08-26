export type EpisodePhase = 'persiapan' | 'kunjungan' | 'tindak-lanjut' | 'selesai'
export type TaskOwner = 'Pasien' | 'Caregiver'
export interface CareTask { id:string; title:string; owner:TaskOwner; dueDate?:string; done:boolean }
export interface CareEpisode { id:string; title:string; date:string; time?:string; location?:string; clinician?:string; phase:EpisodePhase; caregiver?:string; reminder?:string; questions:string[]; documents:string[]; tasks:CareTask[]; visitNote?:VisitSummary; createdAt:string }
export interface VisitSummary { decision:string; therapyChange:string; requestedTests:string; nextVisitDate:string; followUpTasks:string; symptomsToWatch:string }
export type CaregiverScope = 'Jadwal'|'Checklist'|'Dokumen'|'Pengingat'
export interface CaregiverAccess { id:string; name:string; contact:string; scopes:CaregiverScope[]; expiresAt:string; consented:boolean; revokedAt?:string; activity:string[] }
export interface ServiceTicket { id:string; number:string; category:string; subject:string; message:string; status:'Baru'|'Diproses'|'Menunggu informasi'|'Selesai'; assignee?:string; createdAt:string; sla:string; history:string[] }
export interface VerifiedQuestion { id:string; question:string; article?:string; answer?:string; reviewedBy?:string; reviewedAt?:string; status:'Dikirim'|'Ditinjau'|'Terverifikasi' }
export interface WellbeingCheckin { id:string; date:string; feeling:string; transport:boolean; companion:boolean; understanding:boolean; callback:boolean; consent:boolean }
