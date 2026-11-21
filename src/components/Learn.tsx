import { useState } from 'react'
import { lessons } from '../data/lessons'
import { tokensOf, wordsOf } from '../lib/tokens'
import { Bar, CopyButton, PromptBlock, SectionHead } from './bits'

function Check({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.5 10.5l3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TokenMeter() {
  const [text, setText] = useState('')
  const tokens = tokensOf(text)
  const words = wordsOf(text)
  const pct = Math.min(100, Math.round((tokens / 300) * 100))

  return (
    <div className="sheet p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="kicker">The one word to know: token</p>
        <span className="text-xs text-ink-soft">1 token ≈ 4 characters ≈ ¾ of a word</span>
      </div>
      <p className="mt-2 max-w-[60ch] text-ink-soft">
        AI reads and bills text in small chunks called <strong className="text-ink">tokens</strong>.
        More words in, more tokens out — a bigger bill and a slower answer. Type something and watch
        the meter move.
      </p>

      <label htmlFor="meter" className="mt-4 block text-sm font-semibold">
        Your text
      </label>
      <textarea
        id="meter"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Could you kindly please help me write something nice for my shop, thank you so much!"
        className="mt-2 w-full resize-y rounded-xl border border-line bg-sheet px-3.5 py-3 text-[0.95rem] outline-none placeholder:text-ink-soft/50 focus:border-accent"
      />

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="mono text-2xl font-semibold leading-none">{tokens}</p>
          <p className="mt-1 text-xs text-ink-soft">
            tokens · {words} {words === 1 ? 'word' : 'words'}
          </p>
        </div>
        <p className="max-w-[26ch] text-right text-xs text-ink-soft">
          {tokens === 0
            ? 'An empty box costs nothing. So does a good prompt, compared to three bad ones.'
            : tokens < 40
              ? 'Lean. A typical AI answer is 200–600 tokens, so the prompt is the cheap half.'
              : tokens < 120
                ? 'Reasonable for a real task. Check whether every sentence changes the answer.'
                : 'Getting heavy. Cut the background story and the polite padding first.'}
        </p>
      </div>

      <div className="mt-3">
        <Bar value={pct} max={100} />
      </div>
      <p className="mt-3 border-t border-dashed border-line pt-3 text-sm text-ink-soft">
        The hidden cost: every follow-up re-sends the whole conversation. Ask once, clearly, and you
        pay once.
      </p>
    </div>
  )
}

export function Learn({
  done,
  toggleLesson,
  go,
}: {
  done: string[]
  toggleLesson: (id: string) => void
  go: (tab: 'learn' | 'build' | 'tune' | 'play') => void
}) {
  const [open, setOpen] = useState<string | null>(
    () => lessons.find((l) => !done.includes(l.id))?.id ?? null,
  )

  return (
    <div className="space-y-12">
      <section className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rise">
          <p className="kicker">Free · works offline · nothing you type leaves your device</p>
          <h1 className="mt-3 text-[clamp(2.3rem,6.2vw,3.7rem)]">
            Better questions, <span className="text-accent">smaller</span> bills.
          </h1>
          <p className="mt-4 max-w-[48ch] text-[1.06rem] text-ink-soft">
            Most people lose an hour — and a pile of tokens — asking a foggy question, then asking it
            again three times. Eight short lessons, one builder, one tuner. No jargon, no sign-up.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => go('build')}>
              Build my first prompt
            </button>
            <button type="button" className="btn" onClick={() => go('tune')}>
              Fix a prompt I already wrote
            </button>
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            <strong className="text-ink">{done.length} of {lessons.length}</strong> lessons done
            {done.length === lessons.length ? ' — that is the whole course.' : ' · about 12 minutes total'}
          </p>
        </div>

        <aside className="note mt-2 rotate-[1.2deg] p-5 pt-5 sm:mt-6">
          <p className="kicker">before → after</p>
          <p className="promptbox mt-3 text-[0.82rem] text-ink/80 line-through decoration-accent/50 decoration-2">
            “could you kindly help me write something short and nice about our coffee shop, thanks in
            advance”
          </p>
          <p className="promptbox mt-3 text-[0.82rem] font-medium">
            “Write 2 Instagram captions for a coffee shop in Cebu City. Friendly tone, under 20 words
            each, no hashtags.”
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ink/70">
            Same request. One gets an answer. The other gets “here are five paragraphs about
            marketing”.
          </p>
        </aside>
      </section>

      <TokenMeter />

      <section>
        <SectionHead
          kicker="The course"
          title="Eight habits, in the order that matters"
          blurb="Each card is one habit, one bad example, one good one. Mark it done when you could explain it to a friend."
        />
        <div className="mt-5 flex items-center justify-between text-xs text-ink-soft">
          <span>Lessons done</span>
          <span>
            {done.length} of {lessons.length}
          </span>
        </div>
        <div className="mt-2">
          <Bar value={done.length} max={lessons.length} />
        </div>

        <ol className="mt-6 space-y-3">
          {lessons.map((lesson, i) => {
            const isDone = done.includes(lesson.id)
            const isOpen = open === lesson.id
            return (
              <li key={lesson.id} className="sheet overflow-hidden">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : lesson.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full border text-sm font-semibold ${
                        isDone
                          ? 'border-good/30 bg-good text-sheet'
                          : 'border-line bg-[#f6efe2] text-ink-soft'
                      }`}
                    >
                      {isDone ? <Check className="size-5" /> : String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-display text-[1.06rem] font-semibold leading-snug ${isDone ? 'text-ink-soft' : 'text-ink'}`}
                      >
                        {lesson.title}
                      </span>
                      <span
                        className={`mt-0.5 block text-sm text-ink-soft ${isOpen ? '' : 'line-clamp-1'}`}
                      >
                        {lesson.why}
                      </span>
                    </span>
                    <svg
                      viewBox="0 0 20 20"
                      className={`size-4 shrink-0 text-ink-soft transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    >
                      <path
                        d="M5 8l5 5 5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </h3>

                {isOpen ? (
                  <div className="border-t border-line/70 px-4 pb-5 pt-4 sm:px-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <PromptBlock label="Foggy" text={lesson.foggy} tone="foggy" />
                      <PromptBlock label="Clear" text={lesson.clear} tone="clear" />
                    </div>
                    <p className="mt-4 flex gap-2 rounded-xl bg-[#f6efe2] px-3.5 py-3 text-sm">
                      <span className="font-semibold">Habit:</span>
                      <span className="text-ink-soft">{lesson.tip}</span>
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className={`btn ${isDone ? '' : 'btn-primary'}`}
                        onClick={() => toggleLesson(lesson.id)}
                      >
                        {isDone ? 'Undo — not done yet' : 'Got it, mark as done'}
                      </button>
                      <CopyButton text={lesson.clear} small />
                      {isDone ? (
                        <span className="text-sm text-good">Saved on this device.</span>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="sheet p-5">
          <p className="kicker">Rule of thumb</p>
          <p className="mt-2 font-display text-lg leading-snug">
            A clear prompt is a few tokens longer and a whole round-trip shorter.
          </p>
        </div>
        <div className="sheet p-5">
          <p className="kicker">When to stop tuning</p>
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            If the answer is usable, stop. Rewriting a prompt that already worked is spending tokens
            to feel productive.
          </p>
        </div>
        <div className="sheet p-5">
          <p className="kicker">Next</p>
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            Play the duel: two prompts, pick the better one, learn why. Eight rounds, no typing.
          </p>
          <button type="button" className="btn mt-3" onClick={() => go('play')}>
            Play the duel
          </button>
        </div>
      </section>
    </div>
  )
}
