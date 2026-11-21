import { useEffect, useState } from 'react'
import { Builder } from './components/Builder'
import { Learn } from './components/Learn'
import { Play } from './components/Play'
import { Tune } from './components/Tune'
import { lessons } from './data/lessons'
import { useProgress } from './lib/progress'

type Tab = 'learn' | 'build' | 'tune' | 'play'

const TABS: { id: Tab; label: string }[] = [
  { id: 'learn', label: 'Learn' },
  { id: 'build', label: 'Build' },
  { id: 'tune', label: 'Fix mine' },
  { id: 'play', label: 'Play' },
]

function tabFromHash(): Tab {
  const raw = window.location.hash.replace('#', '')
  return TABS.some((t) => t.id === raw) ? (raw as Tab) : 'learn'
}

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#d1492a" />
      <path
        d="M8.5 12.2c0-2.3 1.8-3.9 4.3-3.9 2.4 0 4.1 1.5 4.1 3.6 0 1.6-.9 2.5-2.3 3.4-1.2.8-1.5 1.3-1.5 2.4v.4h-2.4v-.6c0-1.7.6-2.6 2-3.5 1.1-.7 1.5-1.2 1.5-2.1 0-1-.8-1.7-1.9-1.7-1.2 0-2 .8-2 2h-2.3z"
        fill="#fbf5e9"
      />
      <circle cx="12.2" cy="22.4" r="1.5" fill="#fbf5e9" />
      <circle cx="21" cy="16" r="1.2" fill="#fbf5e9" opacity=".55" />
      <circle cx="24" cy="20.5" r="1" fill="#fbf5e9" opacity=".4" />
      <circle cx="20.5" cy="23" r=".8" fill="#fbf5e9" opacity=".3" />
    </svg>
  )
}

export default function App() {
  const [tab, setTab] = useState<Tab>('learn')
  const [seed, setSeed] = useState<string | undefined>(undefined)
  const [seedAt, setSeedAt] = useState(0)
  const { progress, toggleLesson, recordQuiz, countBuild, countTune } = useProgress()

  useEffect(() => {
    setTab(tabFromHash())
    const onHash = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function go(next: Tab) {
    setTab(next)
    if (window.location.hash !== `#${next}`) window.location.hash = next
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goTune(text: string) {
    setSeed(text)
    setSeedAt(Date.now())
    go('tune')
  }

  const doneCount = progress.done.length

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only rounded-md bg-ink px-3 py-2 text-sheet focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex h-16 items-center gap-3">
            <button
              type="button"
              onClick={() => go('learn')}
              className="flex items-center gap-2.5 rounded-xl text-left"
              aria-label="Prompt School home"
            >
              <Mark />
              <span>
                <span className="block font-display text-[1.05rem] font-bold leading-none tracking-tight">
                  Prompt School
                </span>
                <span className="hidden text-[0.72rem] leading-tight text-ink-soft sm:block">
                  ask better, spend less
                </span>
              </span>
            </button>

            <nav className="ml-auto hidden items-center gap-1 sm:flex" aria-label="Sections">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="tab"
                  aria-current={tab === t.id ? 'page' : undefined}
                  onClick={() => go(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:ml-3">
              <span className="rounded-full border border-line bg-sheet px-2.5 py-1 text-[0.72rem] font-medium text-ink-soft">
                {doneCount}/{lessons.length} lessons
              </span>
            </div>
          </div>

          <nav
            className="-mx-1 flex gap-1 overflow-x-auto pb-2 sm:hidden"
            aria-label="Sections, mobile"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="tab shrink-0"
                aria-current={tab === t.id ? 'page' : undefined}
                onClick={() => go(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        {tab === 'learn' ? (
          <Learn done={progress.done} toggleLesson={toggleLesson} go={go} />
        ) : null}
        {tab === 'build' ? <Builder countBuild={countBuild} goTune={goTune} /> : null}
        {tab === 'tune' ? (
          <Tune key={seedAt} seed={seed} countTune={countTune} />
        ) : null}
        {tab === 'play' ? <Play recordQuiz={recordQuiz} best={progress.quizBest} /> : null}
      </main>

      <footer className="border-t border-line/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-7 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Prompt School — a free, offline course about asking better questions. Progress is kept in
            this browser only.
          </p>
          <p className="mono">token counts are estimates · 1 token ≈ 4 characters</p>
        </div>
      </footer>
    </div>
  )
}
