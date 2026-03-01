import { useEffect, useMemo, useState } from 'react'

type LearningProgress = {
  readMap: Record<string, boolean>
  bookmarks: string[]
  lastReadId?: string
}

const KEY = 'onko-radiasi-learning-progress'

const initialState: LearningProgress = {
  readMap: {},
  bookmarks: []
}

const readProgress = (): LearningProgress => {
  const raw = localStorage.getItem(KEY)
  if (!raw) return initialState

  try {
    const parsed = JSON.parse(raw) as Partial<LearningProgress>
    return {
      readMap: parsed.readMap ?? {},
      bookmarks: parsed.bookmarks ?? [],
      lastReadId: parsed.lastReadId
    }
  } catch {
    return initialState
  }
}

export function useLearningProgress() {
  const [state, setState] = useState<LearningProgress>(initialState)

  useEffect(() => {
    setState(readProgress())
  }, [])

  const save = (next: LearningProgress) => {
    setState(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  return useMemo(
    () => ({
      state,
      markRead: (articleId: string) => {
        if (state.readMap[articleId]) return
        save({
          ...state,
          readMap: { ...state.readMap, [articleId]: true },
          lastReadId: articleId
        })
      },
      toggleBookmark: (articleId: string) => {
        const exists = state.bookmarks.includes(articleId)
        save({
          ...state,
          bookmarks: exists ? state.bookmarks.filter((id) => id !== articleId) : [articleId, ...state.bookmarks]
        })
      }
    }),
    [state]
  )
}
