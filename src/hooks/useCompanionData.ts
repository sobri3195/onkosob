import { useLocalStorage } from './useLocalStorage'
import type { CareEvent, DailyNote, MedicationLog, MedicationSchedule, SymptomEntry } from '@/types/companion'

export const companionKeys = { events:'lentera.companion.events', symptoms:'lentera.companion.symptoms', medications:'lentera.companion.medications', logs:'lentera.companion.medication-logs', daily:'lentera.companion.daily' } as const
const isArray = <T,>(value: unknown): value is T[] => Array.isArray(value)
export function useCompanionData(){
  const [events,setEvents]=useLocalStorage<CareEvent[]>(companionKeys.events,[],isArray)
  const [symptoms,setSymptoms]=useLocalStorage<SymptomEntry[]>(companionKeys.symptoms,[],isArray)
  const [medications,setMedications]=useLocalStorage<MedicationSchedule[]>(companionKeys.medications,[],isArray)
  const [logs,setLogs]=useLocalStorage<MedicationLog[]>(companionKeys.logs,[],isArray)
  const [daily,setDaily]=useLocalStorage<DailyNote[]>(companionKeys.daily,[],isArray)
  return {events,setEvents,symptoms,setSymptoms,medications,setMedications,logs,setLogs,daily,setDaily}
}
export function localDate(date=new Date()){const offset=date.getTimezoneOffset();return new Date(date.getTime()-offset*60000).toISOString().slice(0,10)}
export function clearCompanionData(keys:(keyof typeof companionKeys)[] = Object.keys(companionKeys) as (keyof typeof companionKeys)[]){keys.forEach(key=>localStorage.removeItem(companionKeys[key]));window.dispatchEvent(new Event('lentera-companion-reset'))}
