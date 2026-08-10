export type UserRole = 'patient' | 'caregiver' | 'survivor' | 'learner'
export type PreferredTopic = 'diagnosis' | 'therapy' | 'nutrition' | 'emotional-support' | 'caregiver' | 'survivorship'

export interface LocalUserProfile {
  displayName?: string
  role?: UserRole
  preferredTopics: PreferredTopic[]
  onboardingCompleted: boolean
}

export interface ActivityItem { id: string; label: string; href: string }
export interface LearningProgress { diagnosis: number; treatment: number; caregiver: number; survivorship: number; glossaryViewed: number }
export interface UserProgress {
  journeyStage?: string
  completedStages: string[]
  savedArticles: string[]
  savedGlossaryTerms: string[]
  selectedQuestions: string[]
  checklistProgress: Record<string, string[]>
  quizProgress: Record<string, number>
  learning: LearningProgress
  recentActivity: ActivityItem[]
  lastActivity?: ActivityItem
  notificationsEnabled: boolean
}
export interface LocalUserData { version: 1; profile: LocalUserProfile; progress: UserProgress }
