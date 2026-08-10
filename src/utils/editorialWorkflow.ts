import type { ArticleStatus } from '@/types/content'

export const STATUS_TRANSITIONS: Readonly<Record<ArticleStatus, readonly ArticleStatus[]>> = {
  draft:['in_review'], in_review:['revision_required','approved'], revision_required:['in_review'], approved:['published'], published:['archived'], archived:[],
}
export const canTransition = (from: ArticleStatus, to: ArticleStatus) => STATUS_TRANSITIONS[from].includes(to)
export function transitionStatus(from: ArticleStatus, to: ArticleStatus): ArticleStatus {
  if (!canTransition(from,to)) throw new Error(`Invalid editorial transition: ${from} → ${to}`)
  return to
}
