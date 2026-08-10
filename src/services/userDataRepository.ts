import type { LocalUserData, LocalUserProfile, UserProgress } from '@/types/user'
import { loadUserData, saveUserData } from './storage'
export interface UserDataRepository { getProfile(): Promise<LocalUserProfile | null>; saveProfile(profile: LocalUserProfile): Promise<void>; getProgress(): Promise<UserProgress>; saveProgress(progress: UserProgress): Promise<void> }
export class LocalUserDataRepository implements UserDataRepository {
  async getProfile() { return loadUserData().data.profile }
  async saveProfile(profile: LocalUserProfile) { const { data } = loadUserData(); saveUserData({ ...data, profile }) }
  async getProgress() { return loadUserData().data.progress }
  async saveProgress(progress: UserProgress) { const { data } = loadUserData(); saveUserData({ ...data, progress }) }
  save(data: LocalUserData) { saveUserData(data) }
}
