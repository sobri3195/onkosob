import type { LocalUserData, UserProgress } from '@/types/user'

export const USER_STORAGE_KEY = 'lentera_user_v1'
export const emptyUserData = (): LocalUserData => ({
  version: 1,
  profile: { preferredTopics: [], onboardingCompleted: false },
  progress: { completedStages: [], savedArticles: [], savedGlossaryTerms: [], selectedQuestions: [], checklistProgress: {}, quizProgress: {}, learning: { diagnosis: 0, treatment: 0, caregiver: 0, survivorship: 0, glossaryViewed: 0 }, recentActivity: [], notificationsEnabled: true }
})
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
const legacy = <T>(key: string, fallback: T): T => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback } catch { return fallback } }

export function migrateUserData(value?: unknown): LocalUserData {
  const base = emptyUserData()
  if (!value || typeof value !== 'object') {
    base.progress.savedGlossaryTerms = legacy('lentera.saved.glossary', [])
    base.progress.selectedQuestions = [...legacy<string[]>('lentera.questions.selected', []), ...legacy<string[]>('lentera.questions.custom', [])]
    base.progress.checklistProgress = legacy('lentera.checklists', {})
    base.progress.completedStages = legacy('lentera.journey.progress', [])
    return base
  }
  const input = value as Partial<LocalUserData>; const progress = (input.progress ?? {}) as Partial<UserProgress>
  return { version: 1, profile: { ...base.profile, ...(input.profile ?? {}), preferredTopics: Array.isArray(input.profile?.preferredTopics) ? input.profile.preferredTopics : [] }, progress: { ...base.progress, ...progress, completedStages: strings(progress.completedStages), savedArticles: strings(progress.savedArticles), savedGlossaryTerms: strings(progress.savedGlossaryTerms), selectedQuestions: strings(progress.selectedQuestions), recentActivity: Array.isArray(progress.recentActivity) ? progress.recentActivity.slice(0, 10) : [], learning: { ...base.progress.learning, ...(progress.learning ?? {}) } } }
}
export function loadUserData(): { data: LocalUserData; recovered: boolean } {
  if (typeof window === 'undefined') return { data: emptyUserData(), recovered: false }
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) { const data = migrateUserData(); saveUserData(data); return { data, recovered: false } }
  try { const data = migrateUserData(JSON.parse(raw)); saveUserData(data); return { data, recovered: false } }
  catch { const data = migrateUserData(); saveUserData(data); return { data, recovered: true } }
}
export const saveUserData = (data: LocalUserData) => localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data))
export const clearUserData = () => { Object.keys(localStorage).filter(key => key === USER_STORAGE_KEY || key.startsWith('lentera.') || key === 'onko-radiasi-learning-progress').forEach(key => localStorage.removeItem(key)) }
export const exportUserData = (data: LocalUserData) => JSON.stringify({ savedQuestions: data.progress.selectedQuestions, savedArticles: data.progress.savedArticles, glossaryFavorites: data.progress.savedGlossaryTerms, checklistProgress: data.progress.checklistProgress, journeyProgress: { currentStage: data.progress.journeyStage, completedStages: data.progress.completedStages }, learningProgress: data.progress.learning, quizProgress: data.progress.quizProgress }, null, 2)
export const migrateLocalData = migrateUserData
