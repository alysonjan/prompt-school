import { useState } from 'react'
import { duels } from '../data/quiz'
import type { Duel } from '../data/quiz'
import { tokenLabel, tokensOf } from '../lib/tokens'
import { SectionHead } from './bits'

type Side = 'a' | 'b'

function badge(score: number, total: number) {
  if (score === total) return { title: 'Prompt scholar', line: 'Every round. Go teach a friend.' }
  if (score >= total - 2) return { title: 'Sharp eye', line: 'You can spot a foggy prompt from across the room.' }
  if (score >= total / 2) return { title: 'Getting there', line: 'Re-read lesson 4 and lesson 5, then try again.' }
  return { title: 'Room to grow', line: 'Start from lesson 1 — the duel will feel obvious afterwards.' }
}

function OptionCard({
  duel,
  side,
  picked,
  onPick,
}: {
  duel: Duel
  side: Side
  picked: Side | null
  onPick: (s: Side) => void
}) {
  const text = side === 'a' ? duel.a : duel.b
  const isBetter = duel.better === side
  const revealed = picked !== null
  const wasPicked = picked === side

  const ring = !revealed
    ? 'border-line hover:border-ink-soft'
    : isBetter
      ? 'border-good bg-good-soft/50'
      : wasPicked
        ? 'border-accent/60 bg-accent-soft/40'
        : 'border-line opacity-70'

  return (
    <button
      type="button"
      onClick={() => onPick(side)}
      disabled={revealed}
      className={`w-full rounded-2xl border p-4 text-left transition ${ring} ${revealed && isBetter ? 'pop' : ''}`}
      aria-label={`Prompt ${side.toUpperCase()}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="grid size-7 place-items-center rounded-full border border-line bg-sheet text-xs font-bold">
          {side.toUpperCase()}
        </span>
        {revealed ? (
          <span
            className={`text-[0.7rem] font-semibold uppercase tracking-wider ${
              isBetter ? 'text-good' : wasPicked ? 'text-accent' : 'text-ink-soft/60'
            }`}
          >
            {isBetter ? 'better' : wasPicked ? 'you picked' : ''}
          </span>
        ) : null}
      </div>
      <p className="promptbox mt-3 text-[0.86rem]">{text}</p>
      {revealed ? (
        <p className="mono mt-3 text-[0.7rem] text-ink-soft">{tokenLabel(tokensOf(text))}</p>
      ) : null}
    </button>
  )
}

export function Play({ recordQuiz, best }: { recordQuiz: (score: number) => void; best: number }) {
  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState<Side | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [finished, setFinished] = useState(false)

  const total = duels.length
  const duel = duels[Math.min(round, total - 1)]
  const wasRight = picked !== null && picked === duel.better

  function pick(side: Side) {
    if (picked) return
    setPicked(side)
    if (side === duel.better) {
      setScore((s) => s + 1)
      setStreak((s) => {
        const n = s + 1
        setBestStreak((b) => Math.max(b, n))
        return n
      })
    } else {
      setStreak(0)
    }
  }

  function next() {
    if (round + 1 >= total) {
      setFinished(true)
      recordQuiz(score)
      return
    }
    setRound((r) => r + 1)
    setPicked(null)
  }

  function restart() {
    setRound(0)
    setPicked(null)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setFinished(false)
  }

  if (finished) {
    const b = badge(score, total)
    return (
      <div className="space-y-8">
        <SectionHead kicker="Result" title="How did the eye do?" />
        <div className="sheet rise mx-auto max-w-xl p-6 text-center">
          <div className="stamp stamp-in inline-block text-accent">
            {score} / {total}
          </div>
          <h2 className="mt-5 text-2xl">{b.title}</h2>
          <p className="mt-2 text-ink-soft">{b.line}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-[#f6efe2] px-3 py-3">
              <p className="mono text-xl font-semibold">{bestStreak}</p>
              <p className="text-xs text-ink-soft">best streak this run</p>
            </div>
            <div className="rounded-xl bg-[#f6efe2] px-3 py-3">
              <p className="mono text-xl font-semibold">{best}</p>
              <p className="text-xs text-ink-soft">best score on this device</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button type="button" className="btn btn-primary" onClick={restart}>
              Play again
            </button>
          </div>
        </div>
        <div className="note mx-auto max-w-xl rotate-[-1deg] p-5 pt-5">
          <p className="kicker">The pattern behind all eight</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">
            The better prompt is not always the shorter one. It is the one that answers the four
            questions the AI would otherwise ask itself: what job, for whom, in what shape, how long.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <SectionHead
        kicker="The duel"
        title="Two prompts. Pick the one that works."
        blurb="No typing. Read both, click the better one, and the reason appears. Eight rounds, about two minutes."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="kicker">
            Round {round + 1} of {total}
          </span>
          <span className="rounded-full bg-[#f6efe2] px-2.5 py-1 text-xs text-ink-soft">
            {duel.ask}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1" aria-label="rounds so far">
            {duels.map((d, i) => (
              <span
                key={d.id}
                className={`size-2 rounded-full ${
                  i < round
                    ? 'bg-good'
                    : i === round
                      ? 'bg-ink'
                      : 'bg-line'
                }`}
              />
            ))}
          </div>
          {streak > 1 ? <span className="text-xs text-good">{streak} in a row</span> : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <OptionCard duel={duel} side="a" picked={picked} onPick={pick} />
        <OptionCard duel={duel} side="b" picked={picked} onPick={pick} />
      </div>

      {picked ? (
        <div className="sheet rise p-5">
          <p className={`font-display text-lg ${wasRight ? 'text-good' : 'text-accent'}`}>
            {wasRight ? 'Exactly.' : 'Close — it was the other one.'}
          </p>
          <p className="mt-2 max-w-[62ch] text-[0.95rem] text-ink-soft">{duel.why}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary" onClick={next}>
              {round + 1 >= total ? 'See my result' : 'Next round'}
            </button>
            <span className="mono text-xs text-ink-soft">
              A {tokenLabel(tokensOf(duel.a))} · B {tokenLabel(tokensOf(duel.b))}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-soft">
          Read both, then click the one you would actually send. Guessing is fine — the explanation
          is the point.
        </p>
      )}
    </div>
  )
}
