export const PAGE_CATEGORIES=['Artikel','Diagnosis','Terapi','Nutrisi','Efek Samping','Follow-up','Caregiver','Lainnya'] as const
export const QUESTION_CATEGORIES=['Diagnosis','Pemeriksaan','Terapi','Efek Samping','Follow-up','Lainnya'] as const
export type Appearance='dark'|'light'|'system'
export interface ExtensionSavedPage {id:string;title:string;url:string;faviconUrl?:string;category?:string;note?:string;createdAt:string}
export interface ExtensionSavedSelection {id:string;text:string;pageTitle:string;url:string;category?:string;note?:string;createdAt:string}
export interface ExtensionQuestion {id:string;question:string;sourceText?:string;sourceUrl?:string;category?:string;createdAt:string}
export interface SavedTerm {id:string;term:string;sourceUrl?:string;note?:string;createdAt:string}
export interface ExtensionPreferences {baseUrl:string;appearance:Appearance}
export interface LenteraExtensionState {version:1;pages:ExtensionSavedPage[];selections:ExtensionSavedSelection[];questions:ExtensionQuestion[];savedTerms:SavedTerm[];preferences:ExtensionPreferences}
export type SavedKind='pages'|'selections'|'questions'|'savedTerms'
