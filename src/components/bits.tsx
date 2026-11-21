import { useState } from 'react'
import { copyText, tokenLabel, tokensOf } from '../lib/tokens'

export function CopyButton({ text, small = false }: { text: string; small?: boolean }) {
  const [state, setState] = useState<'idle' | 'ok' | 'no'>('idle')

  async function run() {
    const ok = await copyText(text)
    setState(ok ? 'ok' : 'no')
    window.setTimeout(() => setState('idle'), 1800)
  }

  return (
    <button
      type="button"
      onClick={run}
      className={`btn ${small ? 'text-xs px-3' : ''} ${state === 'ok' ? 'text-good' : ''}`}
      aria-live="polite"
    >
      {state === 'ok' ? 'Copied' : state === 'no' ? 'Select & copy' : 'Copy'}
    </button>
  )
}

export function TokenPill({ text, label }: { text: string; label?: string }) {
  const n = tokensOf(text)
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-sheet px-2.5 py-1 text-[0.72rem] font-medium text-ink-soft">
      {label ? <span className="text-ink-soft/70">{label}</span> : null}
      {tokenLabel(n)}
    </span>
  )
}

const TONES = {
  foggy: 'bg-[#f7eff0] border-[#e6cdc9]',
  clear: 'bg-good-soft/70 border-good/25',
  plain: 'bg-[#f6efe2] border-line',
} as const

export function PromptBlock({
  label,
  text,
  tone = 'plain',
}: {
  label: string
  text: string
  tone?: keyof typeof TONES
}) {
  return (
    <div className={`rounded-2xl border p-4 ${TONES[tone]}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="kicker">{label}</span>
        <span className="mono text-[0.7rem] text-ink-soft">{tokenLabel(tokensOf(text))}</span>
      </div>
      <p className="promptbox text-ink/90">{text}</p>
    </div>
  )
}

export function Bar({ value, max, label }: { value: number; max: number; label?: string }) {
  const width = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div className="h-2.5 overflow-hidden rounded-full bg-line/70">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${width}%` }}
        />
      </div>
      {label ? <p className="mt-2 text-xs text-ink-soft">{label}</p> : null}
    </div>
  )
}

export function SectionHead({
  kicker,
  title,
  blurb,
}: {
  kicker: string
  title: string
  blurb?: string
}) {
  return (
    <div>
      <p className="kicker">{kicker}</p>
      <h2 className="mt-2 text-[clamp(1.5rem,3.4vw,2.1rem)]">{title}</h2>
      {blurb ? <p className="mt-2 max-w-[62ch] text-ink-soft">{blurb}</p> : null}
    </div>
  )
}
