import { useEffect, useState } from 'react'
import { makeover } from '../lib/makeover'
import type { Makeover } from '../lib/makeover'
import { tokenLabel, tokensOf, wordsOf } from '../lib/tokens'
import { Bar, CopyButton, SectionHead } from './bits'

const SAMPLES = [
  'help me write an email to my landlord',
  'please could you kindly write something nice and short about our new coffee shop for social media, thanks so much in advance!',
  'Explain what interest is to my 12-year-old daughter using a piggy bank, in 3 short sentences.',
]

export function Tune({
  seed,
  countTune,
}: {
  seed?: string
  countTune: () => void
}) {
  const [text, setText] = useState(seed ?? '')
  const [result, setResult] = useState<Makeover | null>(null)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (seed) {
      setText(seed)
      setResult(null)
    }
  }, [seed])

  function run(value: string) {
    const r = makeover(value)
    setResult(r)
    setDraft(r.drafted)
    countTune()
  }

  return (
    <div className="space-y-8">
      <SectionHead
        kicker="The tuner"
        title="Paste a prompt. Get a makeover."
        blurb="No account, no AI call — this runs on rules in your browser. It finds what the AI would have to guess, then shows you a version that leaves nothing open."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="sheet self-start p-5 sm:p-6 lg:sticky lg:top-24">
          <label htmlFor="tune" className="kicker">
            Your prompt
          </label>
          <textarea
            id="tune"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setResult(null)
            }}
            rows={7}
            placeholder="Paste the last thing you asked an AI — the one that needed three follow-ups."
            className="promptbox mt-2 w-full resize-y rounded-xl border border-line bg-sheet px-3.5 py-3 text-[0.92rem] outline-none placeholder:text-ink-soft/50 focus:border-accent"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="mono text-xs text-ink-soft">
              {wordsOf(text)} words · {tokenLabel(tokensOf(text))}
            </span>
            <div className="flex gap-2">
              {text ? (
                <button
                  type="button"
                  className="btn btn-ghost text-xs"
                  onClick={() => {
                    setText('')
                    setResult(null)
                  }}
                >
                  Clear text
                </button>
              ) : null}
              <button
                type="button"
                className="btn btn-primary"
                disabled={text.trim().length < 3}
                onClick={() => run(text)}
              >
                Tune it
              </button>
            </div>
          </div>

          <div className="mt-4 border-t border-dashed border-line pt-4">
            <p className="text-xs text-ink-soft">Or try one of these:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SAMPLES.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  className="chip text-[0.8rem]"
                  onClick={() => {
                    setText(s)
                    run(s)
                  }}
                >
                  {i === 2 ? 'a good one' : `example ${i + 1}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="sheet pop p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="kicker">Verdict</p>
                  <p className="mt-1 font-display text-xl leading-tight">{result.verdict}</p>
                </div>
                <div className="shrink-0 text-center">
                  <div
                    className="stamp stamp-in text-accent"
                    aria-label={`${result.score} out of 100`}
                  >
                    {result.score}
                  </div>
                  <p className="mt-2 text-[0.66rem] uppercase tracking-[0.12em] text-ink-soft">
                    out of 100
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Bar value={result.score} max={100} />
                <div className="mt-1.5 flex justify-between text-[0.7rem] text-ink-soft">
                  <span>12 · guessing</span>
                  <span>100 · nothing to guess</span>
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  A teaching score, not a grade — it counts what the AI would have to invent.
                </p>
              </div>

              {result.findings.length ? (
                <ul className="mt-5 space-y-3">
                  {result.findings.map((f) => (
                    <li key={f.id} className="flex gap-3">
                      <span
                        className={`mt-1.5 size-2.5 shrink-0 rounded-full ${f.severity === 'miss' ? 'bg-accent' : 'bg-warn'}`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-baseline justify-between gap-3 text-[0.95rem] font-semibold">
                          {f.title}
                          <span className="shrink-0 text-[0.66rem] font-medium uppercase tracking-wider text-ink-soft">
                            {f.severity === 'miss' ? 'guesswork' : 'small leak'}
                          </span>
                        </p>
                        <p className="mt-0.5 text-sm text-ink-soft">{f.why}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 rounded-xl bg-good-soft px-3.5 py-3 text-sm text-good">
                  Nothing to fix. This one already tells the AI everything it needs.
                </p>
              )}

              {result.strengths.length ? (
                <ul className="mt-4 space-y-1 border-t border-dashed border-line pt-4 text-sm">
                  {result.strengths.map((s) => (
                    <li key={s} className="flex gap-2 text-ink-soft">
                      <span className="text-good" aria-hidden="true">
                        ✓
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="sheet p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="kicker">Tuned version</p>
                <span className="mono text-[0.7rem] text-ink-soft">
                  {result.before} → {tokensOf(draft)} tokens
                </span>
              </div>

              <label htmlFor="tuned" className="sr-only">
                Tuned prompt
              </label>
              <textarea
                id="tuned"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={Math.min(16, Math.max(6, draft.split('\n').length + 2))}
                className="promptbox mt-2 w-full resize-y rounded-xl border border-line bg-[#fdfaf2] px-3.5 py-3 text-[0.87rem] outline-none focus:border-accent"
              />

              {result.stillMissing.length ? (
                <p className="mt-2 text-xs text-ink-soft">
                  Brackets are blanks for you: {result.stillMissing.map((m) => m.split(':')[0]).join(', ')}.
                  Fill them in and the guessing stops.
                </p>
              ) : null}

              {result.vagueWords.length ? (
                <p className="mt-2 rounded-xl bg-[#f6efe2] px-3.5 py-2.5 text-xs leading-relaxed text-ink-soft">
                  <strong className="text-ink">Still yours to fix:</strong>{' '}
                  {result.vagueWords.map((w) => `“${w}”`).join(', ')} — no rule can know what you
                  meant. Replace each with a name, a number or an example.
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CopyButton text={draft} />
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setText(draft)
                    run(draft)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Tune the tuned one
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-[#f6efe2] px-3.5 py-3 text-sm leading-relaxed text-ink-soft">
                {result.after <= result.before ? (
                  <>
                    Shorter <em>and</em> clearer: {result.before - result.after} tokens saved, before
                    counting the follow-ups you no longer need.
                  </>
                ) : (
                  <>
                    A few tokens longer — {result.before} → {tokensOf(draft)}. That is the honest
                    trade: a vague prompt this size usually needs {result.followUps}{' '}
                    {result.followUps === 1 ? 'more round' : 'more rounds'}, and every round re-sends
                    the whole conversation. Buy clarity once.
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <aside className="space-y-4">
            <div className="sheet p-5 sm:p-6">
              <p className="kicker">What it checks</p>
              <ul className="mt-3 space-y-3 text-sm">
                {[
                  ['A verb and a job', '“write”, “explain”, “list” — not “help me with”.'],
                  ['A reader', 'Who is the answer for? Boss, customer, beginner, family.'],
                  ['A shape', 'Paragraph, bullets, table, numbered steps.'],
                  ['A number', 'A word count or bullet count, not the word “short”.'],
                  ['A voice', 'Friendly, formal, plain. Named once, not fixed later.'],
                  ['The padding', '“Kindly”, “please”, “I hope you are well” — pure token cost.'],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink-soft/40" aria-hidden="true" />
                    <span>
                      <strong className="text-ink">{t}</strong>{' '}
                      <span className="text-ink-soft">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="note rotate-[1deg] p-5 pt-5">
              <p className="kicker">Why rules and not AI</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                This page never calls a model, so it costs nothing and works on a plane. It cannot
                rewrite your meaning — only show the gaps. You fill them in.
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
