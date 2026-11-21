import { useCallback, useEffect, useState } from 'react'

const KEY = 'prompt-school.v1'

export type Progress = {
  /** lesson ids marked done */
  done: string[]
  /** best quiz score out of the round count */
  quizBest: number
  /** prompts built end-to-end */
  built: number
  /** prompts tuned */
  tuned: number
}

const EMPTY: Progress = { done: [], quizBest: 0, built: 0, tuned: 0 }

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      done: Array.isArray(parsed.done) ? parsed.done.filter((d) => typeof d === 'string') : [],
      quizBest: typeof parsed.quizBest === 'number' ? parsed.quizBest : 0,
      built: typeof parsed.built === 'number' ? parsed.built : 0,
      tuned: typeof parsed.tuned === 'number' ? parsed.tuned : 0,
    }
  } catch {
    return EMPTY
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY)

  // Read after mount so the markup is identical on first paint.
  useEffect(() => {
    setProgress(read())
  }, [])

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = fn(prev)
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* private mode: progress just won't persist */
      }
      return next
    })
  }, [])

  const toggleLesson = useCallback(
    (id: string) => {
      update((p) => ({
        ...p,
        done: p.done.includes(id) ? p.done.filter((d) => d !== id) : [...p.done, id],
      }))
    },
    [update],
  )

  const recordQuiz = useCallback(
    (score: number) => {
      update((p) => ({ ...p, quizBest: Math.max(p.quizBest, score) }))
    },
    [update],
  )

  const countBuild = useCallback(() => {
    update((p) => ({ ...p, built: p.built + 1 }))
  }, [update])

  const countTune = useCallback(() => {
    update((p) => ({ ...p, tuned: p.tuned + 1 }))
  }, [update])

  return { progress, toggleLesson, recordQuiz, countBuild, countTune }
}
