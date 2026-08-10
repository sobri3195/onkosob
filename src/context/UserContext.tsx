import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { clearUserData, emptyUserData, exportUserData, loadUserData, saveUserData } from '@/services/storage'
import type { ActivityItem, LocalUserData, LocalUserProfile, UserProgress } from '@/types/user'
type UserContextValue = { data: LocalUserData; profile: LocalUserProfile; progress: UserProgress; recovered: boolean; updateProfile: (value: Partial<LocalUserProfile>) => void; updateProgress: (value: Partial<UserProgress>) => void; addActivity: (label: string, href: string) => void; reset: () => void; download: () => void }
const UserContext = createContext<UserContextValue | null>(null)
export function UserProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(loadUserData, []); const [data, setData] = useState(initial.data); const [recovered] = useState(initial.recovered)
  const update = (updater: (current: LocalUserData) => LocalUserData) => setData(current => { const next = updater(current); saveUserData(next); return next })
  const updateProfile = (value: Partial<LocalUserProfile>) => update(current => ({ ...current, profile: { ...current.profile, ...value } }))
  const updateProgress = (value: Partial<UserProgress>) => update(current => ({ ...current, progress: { ...current.progress, ...value } }))
  const addActivity = (label: string, href: string) => { const item: ActivityItem = { id: crypto.randomUUID(), label, href }; update(current => ({ ...current, progress: { ...current.progress, lastActivity: item, recentActivity: [item, ...current.progress.recentActivity].slice(0, 10) } })) }
  const reset = () => { clearUserData(); const next = emptyUserData(); setData(next); saveUserData(next) }
  const download = () => { const blob = new Blob([exportUserData(data)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'data-edukasi-lentera.json'; anchor.click(); URL.revokeObjectURL(url) }
  return <UserContext.Provider value={{ data, profile: data.profile, progress: data.progress, recovered, updateProfile, updateProgress, addActivity, reset, download }}>{children}</UserContext.Provider>
}
export function useUser() { const value = useContext(UserContext); if (!value) throw new Error('useUser must be used inside UserProvider'); return value }
