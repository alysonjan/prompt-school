import { useState } from 'react'
import { tokenLabel, tokensOf } from '../lib/tokens'
import { CopyButton, SectionHead } from './bits'

type Key = 'task' | 'audience' | 'format' | 'length' | 'tone'

const STEPS: {
  key: Key
  title: string
  hint: string
  options?: string[]
  placeholder?: string
}[] = [
  {
    key: 'task',
    title: 'What should it do?',
    hint: 'Start with a verb: write, explain, list, shorten, compare, plan. One line beats a paragraph.',
    placeholder: 'Write a short birthday message for my dad, who likes fishing.',
  },
  {
    key: 'audience',
    title: 'Who is going to read it?',
    hint: 'The reader decides the tone — the same words to a boss and to a nephew are two different messages.',
    options: ['my boss', 'my customers', 'a total beginner', 'my family', 'a stranger online'],
  },
  {
    key: 'format',
    title: 'What shape do you want back?',
    hint: 'A shape you can skim is worth more than a shape you have to re-read.',
    options: ['a short paragraph', '3–5 bullet points', 'a numbered list', 'a table', 'an email reply'],
  },
  {
    key: 'length',
    title: 'How long?',
    hint: 'A number, not a feeling. This is the cheapest token saving there is.',
    options: ['1–2 sentences', 'under 100 words', 'under 300 words', 'as short as possible'],
  },
  {
    key: 'tone',
    title: 'What voice?',
    hint: 'Name the voice once and skip the “make it friendlier” follow-up later.',
    options: ['friendly', 'formal', 'simple, no jargon', 'a little funny'],
  },
]

const EXAMPLES = [
  'Write a birthday message for my dad, who likes fishing',
  'Explain a bank loan in simple words',
  'Summarise this article in 3 bullets',
  'Plan my week around 3 priorities',
  'Reply to an angry customer email',
]

function buildPrompt(a: Record<Key, string>): string {
  const lines: string[] = []
  lines.push(a.task.trim() || 'Write … [what you want, in one line].')
  lines.push('')

  const details: string[] = []
  details.push(`For: ${a.audience || '[who will read it]'}`)
  details.push(`Format: ${a.format || '[a shape, e.g. 3 bullets]'}`)
  details.push(`Length: ${a.length || '[a number, e.g. under 100 words]'}`)
  details.push(`Tone: ${a.tone || '[a voice, e.g. plain and friendly]'}`)
  lines.push(details.join('\n'))
  lines.push('')
  lines.push('If anything is unclear, ask me one question before you start.')
  return lines.join('\n')
}

export function Builder({
  countBuild,
  goTune,
}: {
  countBuild: () => void
  goTune: (seed: string) => void
}) {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Record<Key, string>>({
    task: '',
    audience: '',
    format: '',
    length: '',
    tone: '',
  })
  const [draft, setDraft] = useState<string | null>(null)
  const [edited, setEdited] = useState('')

  const isDone = step >= STEPS.length
  const current = STEPS[Math.min(step, STEPS.length - 1)]
  const blankCount = (['audience', 'format', 'length', 'tone'] as Key[]).filter((k) => !a[k]).length

  function next() {
    if (step === STEPS.length - 1) {
      const prompt = buildPrompt(a)
      setDraft(prompt)
      setEdited(prompt)
      countBuild()
    }
    setStep((s) => s + 1)
  }

  function pick(key: Key, value: string) {
    setA((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }))
  }

  if (isDone && draft) {
    return (
      <div className="space-y-8">
        <SectionHead
          kicker="Your prompt"
          title="Here it is — edit it, then copy it"
          blurb="Words in [square brackets] are blanks for you to fill. Everything else is already doing a job."
        />

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="sheet p-4 sm:p-5">
            <label htmlFor="draft" className="kicker">
              Draft
            </label>
            <textarea
              id="draft"
              value={edited}
              onChange={(e) => setEdited(e.target.value)}
              rows={11}
              className="promptbox mt-2 w-full resize-y rounded-xl border border-line bg-[#fdfaf2] px-3.5 py-3 outline-none focus:border-accent"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="mono rounded-full border border-line bg-sheet px-2.5 py-1 text-xs">
                  {tokenLabel(tokensOf(edited))}
                </span>
                {blankCount > 0 ? (
                  <span className="rounded-full bg-warn-soft px-2.5 py-1 text-xs text-warn">
                    {blankCount} {blankCount === 1 ? 'blank' : 'blanks'} left
                  </span>
                ) : (
                  <span className="rounded-full bg-good-soft px-2.5 py-1 text-xs text-good">
                    nothing left to guess
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <CopyButton text={edited} />
                <button type="button" className="btn" onClick={() => goTune(edited)}>
                  Tune it further
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="sheet p-5">
              <p className="kicker">Why this works</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                <li>
                  <strong className="text-ink">A verb first.</strong> The AI knows the job before it
                  reads anything else.
                </li>
                <li>
                  <strong className="text-ink">A reader.</strong> Tone stops being a guess.
                </li>
                <li>
                  <strong className="text-ink">A shape and a number.</strong> You decide how much
                  answer you pay for.
                </li>
                <li>
                  <strong className="text-ink">An escape hatch.</strong> One short question costs far
                  less than a wrong answer.
                </li>
              </ul>
            </div>
            <div className="note rotate-[-1deg] p-5 pt-5">
              <p className="kicker">Token maths, honestly</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                This prompt is {tokensOf(edited)} tokens. Without the last four lines it would be
                smaller — and would usually need two or three more rounds to land. Every follow-up
                re-sends the whole conversation, so the “smaller” prompt is often the expensive one.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost w-full"
              onClick={() => {
                setStep(0)
                setDraft(null)
                setA({ task: '', audience: '', format: '', length: '', tone: '' })
              }}
            >
              Start a new one
            </button>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SectionHead
        kicker="The builder"
        title="Five clicks to a prompt that works"
        blurb="You do not have to type a clever prompt. Answer five small questions and the structure writes itself."
      />

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="sheet p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="kicker">
              Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
            </span>
            <div className="flex gap-1.5" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span
                  key={s.key}
                  className={`h-1.5 w-6 rounded-full ${i <= step ? 'bg-accent' : 'bg-line'}`}
                />
              ))}
            </div>
          </div>

          <h2 className="mt-3 text-[clamp(1.4rem,3.2vw,1.9rem)]">{current.title}</h2>
          <p className="mt-2 max-w-[54ch] text-ink-soft">{current.hint}</p>

          <div className="mt-5">
            {current.key === 'task' ? (
              <>
                <label htmlFor="task" className="sr-only">
                  What should the AI do?
                </label>
                <textarea
                  id="task"
                  value={a.task}
                  onChange={(e) => setA((prev) => ({ ...prev, task: e.target.value }))}
                  rows={3}
                  placeholder={current.placeholder}
                  className="w-full resize-y rounded-xl border border-line bg-sheet px-3.5 py-3 text-[1rem] outline-none placeholder:text-ink-soft/50 focus:border-accent"
                />
                <p className="mt-3 text-xs text-ink-soft">Stuck? Borrow one of these:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      className="chip text-[0.82rem]"
                      aria-pressed={a.task === ex}
                      onClick={() => setA((prev) => ({ ...prev, task: prev.task === ex ? '' : ex }))}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {current.options?.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="chip"
                    aria-pressed={a[current.key] === opt}
                    onClick={() => pick(current.key, opt)}
                  >
                    {opt}
                  </button>
                ))}
                <button
                  type="button"
                  className="chip border-dashed"
                  aria-pressed={a[current.key] === ''}
                  onClick={() => pick(current.key, '')}
                >
                  skip
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-dashed border-line pt-4">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={step === 0 && a.task.trim().length < 4}
              onClick={next}
            >
              {step === STEPS.length - 1 ? 'Write my prompt' : 'Next'}
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="sheet p-5">
            <p className="kicker">Building up</p>
            <dl className="mt-3 space-y-2.5 text-sm">
              {STEPS.map((s, i) => (
                <div key={s.key} className="flex gap-2">
                  <dt className="w-4 shrink-0 text-ink-soft/60">{i + 1}</dt>
                  <dd className={a[s.key] ? 'text-ink' : 'text-ink-soft/60'}>
                    {a[s.key] || (i === 0 ? 'the job' : '—')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="note rotate-[1.2deg] p-5 pt-5">
            <p className="kicker">A tip while you click</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              Nothing here is required. Skipping a step leaves a blank in your prompt — which is
              fine, as long as you know the AI will fill it in for you.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
