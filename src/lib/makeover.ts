import { tokensOf, wordsOf } from './tokens'

export type Severity = 'miss' | 'wobble'

export type Finding = {
  id: string
  severity: Severity
  title: string
  why: string
  /** how much of the teaching score this costs */
  weight: number
}

export type Makeover = {
  /** 0–100, only ever a teaching score */
  score: number
  verdict: string
  findings: Finding[]
  strengths: string[]
  fillerHits: string[]
  drafted: string
  before: number
  after: number
  followUps: number
  stillMissing: string[]
  vagueWords: string[]
}

const FILLERS: { re: RegExp; label: string }[] = [
  { re: /\bplease\b/gi, label: 'please' },
  { re: /\bcould you kindly\b/gi, label: 'could you kindly' },
  { re: /\bkindly\b/gi, label: 'kindly' },
  { re: /\bif you don'?t mind\b/gi, label: "if you don't mind" },
  { re: /\bi was wondering if\b/gi, label: 'I was wondering if' },
  { re: /\bwould you mind\b/gi, label: 'would you mind' },
  { re: /\bthank you( so much| very much| in advance)?\b/gi, label: 'thank you' },
  { re: /\bthanks in advance\b/gi, label: 'thanks in advance' },
  { re: /\bi hope (this|you)\b[^.!?\n]*(?=[.!?\n]|$)/gi, label: 'I hope… (small talk)' },
  { re: /\bas an ai\b/gi, label: 'as an AI' },
]

const VAGUE: string[] = [
  'something',
  'stuff',
  'things',
  'thing',
  'nice',
  'good',
  'better',
  'a bit',
  'some',
  'etc',
  'whatever',
  'asap',
  'properly',
  'appropriate',
]

const RE_AUDIENCE =
  /\b(audience|readers?|beginners?|kids?|children|students?|customers?|clients?|boss|manager|team|employer|landlord|neighbou?r|parents?|family|friends?|interviewer|recruiter|for (?:my|a|an|our|the)|to (?:my|a|an|our|the))\b/i

const RE_FORMAT =
  /\b(bullets?|list|table|steps?|numbered|paragraphs?|sentences?|email|letter|headline|title|caption|captions|summary|outline|recipe|plan|schedule|checklist|draft|essay|message|note|bio|tweet|post|comparison)\b/i

const RE_LENGTH =
  /\b\d+\s+(?:\w+\s+){0,2}(words?|sentences?|lines?|bullets?|paragraphs?|points?|characters?)\b|\b(under|max|at most|no more than)\b/i

const RE_SOFT_LENGTH = /\b(short|brief|concise|one-liner|quick)\b/i

const RE_TONE =
  /\b(tone|friendly|formal|casual|polite|warm|professional|funny|cheerful|simple|plain|easy|no jargon|beginner[- ]friendly|confident|honest)\b/i

const RE_CLARIFY =
  /\b(ask me|if unclear|if anything|if something|unsure|don'?t guess|before you (start|answer|begin))\b/i

function cleanAsk(text: string): string {
  let s = ` ${text} `
  for (const f of FILLERS) s = s.replace(f.re, ' ')
  s = s.replace(/^(?:\s*)(hi|hello|hey)[,!. ]+/i, '')
  s = s.replace(/[ \t]+/g, ' ')
  s = s.replace(/\s*([,.!?;:])\s*/g, '$1 ')
  s = s.replace(/\s+/g, ' ').trim()
  s = s.replace(/^[,.;:\s-]+/, '')
  if (!s) return ''
  s = s[0].toUpperCase() + s.slice(1)
  if (!/[.!?]$/.test(s)) s += '.'
  return s
}

export function makeover(raw: string): Makeover {
  const text = raw.trim().replace(/\s+/g, ' ')
  const words = wordsOf(text)
  const before = tokensOf(text)

  const fillerHits: string[] = []
  for (const f of FILLERS) {
    const matches = text.match(f.re)
    if (matches?.length && !fillerHits.includes(f.label)) fillerHits.push(f.label)
  }
  // "could you kindly" already covers the bare "kindly"
  if (fillerHits.includes('could you kindly')) {
    const i = fillerHits.indexOf('kindly')
    if (i > -1) fillerHits.splice(i, 1)
  }

  const vagueHits = VAGUE.filter((v) => new RegExp(`\\b${v}\\b`, 'i').test(text))

  const hasAudience = RE_AUDIENCE.test(text)
  const hasFormat = RE_FORMAT.test(text)
  const hasLength = RE_LENGTH.test(text)
  const softLength = !hasLength && RE_SOFT_LENGTH.test(text)
  const hasTone = RE_TONE.test(text)
  const hasClarify = RE_CLARIFY.test(text)

  const findings: Finding[] = []
  const strengths: string[] = []

  if (words < 6) {
    findings.push({
      id: 'short',
      severity: 'miss',
      weight: 15,
      title: 'Too short to aim at',
      why: `Only ${words || 'zero'} ${words === 1 ? 'word' : 'words'}. Under six words the AI has to invent the situation, and invented situations are where wrong answers come from.`,
    })
  }

  if (vagueHits.length && (words < 12 || !hasFormat)) {
    const quote = vagueHits.slice(0, 3).map((v) => `“${v}”`).join(', ')
    findings.push({
      id: 'vague',
      severity: 'miss',
      weight: 12,
      title: 'Words the AI cannot measure',
      why: `${quote} ${vagueHits.length === 1 ? 'means' : 'all mean'} something different to everyone. Swap ${vagueHits.length === 1 ? 'it' : 'them'} for a number, a name or an example.`,
    })
  }

  if (hasAudience) {
    strengths.push('You named who it is for — the tone follows from that.')
  } else {
    findings.push({
      id: 'audience',
      severity: 'miss',
      weight: 12,
      title: 'No reader named',
      why: 'Without a reader, the AI guesses between a text to a friend and an email to a bank. One short phrase fixes it: “for my landlord”, “for beginners”.',
    })
  }

  if (hasFormat) {
    strengths.push('You asked for a shape — that is what makes it usable.')
  } else {
    findings.push({
      id: 'format',
      severity: 'wobble',
      weight: 9,
      title: 'No shape asked for',
      why: 'Ask for bullets, a table or a numbered list. You get something you can actually skim instead of three paragraphs to read twice.',
    })
  }

  if (hasLength) {
    strengths.push('You set a size in numbers, so “too long” never happens.')
  } else if (softLength) {
    findings.push({
      id: 'soft-length',
      severity: 'wobble',
      weight: 8,
      title: '“Short” is not a number',
      why: 'To one model short is 30 words, to another it is 200. Say “under 60 words” or “3 bullet points” and both of you can check it — this is the single easiest way to cut tokens.',
    })
  } else {
    findings.push({
      id: 'length',
      severity: 'wobble',
      weight: 9,
      title: 'No size set',
      why: 'Length is the biggest token lever you have. “3 sentences” or “under 100 words” can cut an answer in half without losing anything you needed.',
    })
  }

  if (!hasTone) {
    findings.push({
      id: 'tone',
      severity: 'wobble',
      weight: 6,
      title: 'No tone or style',
      why: 'Ask for the voice once — “plain and friendly”, “formal”, “no jargon”. Otherwise the default voice is the AI’s, not yours.',
    })
  } else {
    strengths.push('You set the tone, so the rewriting stage is shorter.')
  }

  if (fillerHits.length) {
    findings.push({
      id: 'filler',
      severity: 'wobble',
      weight: 6,
      title: 'Polite filler to drop',
      why: `${fillerHits.slice(0, 4).join(', ')} — friendly in an email, wasted in a prompt. AI has no feelings to spare; the words are pure cost.`,
    })
  } else if (words > 10) {
    strengths.push('No polite filler — your prompt is already lean.')
  }

  if (!hasClarify && words >= 6) {
    findings.push({
      id: 'clarify',
      severity: 'wobble',
      weight: 4,
      title: 'No escape hatch',
      why: 'Add “if something is unclear, ask me one question before answering”. One short question is cheaper than a long wrong answer you have to redo.',
    })
  }

  // Score: each gap has its own price. Capped so an empty box never reads as 0/100.
  findings.sort((a, b) => b.weight - a.weight)
  let score = 100
  for (const f of findings) score -= f.weight
  if (words < 3) score -= 6
  score = Math.max(12, Math.min(100, score))

  const verdict =
    score >= 85
      ? 'Clear enough to answer in one go'
      : score >= 65
        ? 'Nearly there — expect one follow-up'
        : score >= 45
          ? 'Foggy — expect two follow-ups'
          : 'The AI is mostly guessing'

  const followUps = score >= 85 ? 0 : score >= 65 ? 1 : score >= 45 ? 2 : 3

  const ask = cleanAsk(text)
  const missing: string[] = []
  if (!hasAudience) missing.push("For: [who will read it — e.g. my customers]")
  if (!hasFormat) missing.push('Format: [e.g. 3 short bullet points]')
  if (!hasLength) missing.push('Length: [e.g. under 120 words]')
  if (!hasTone) missing.push('Tone: [e.g. plain and friendly]')

  const parts: string[] = [ask || 'Write … [what you want, in one line].']
  if (missing.length) parts.push(missing.join('\n'))
  if (!hasClarify) parts.push('If anything is unclear, ask me one question before you start.')

  const drafted = parts.join('\n\n')

  return {
    score,
    verdict,
    findings: findings.slice(0, 5),
    strengths,
    fillerHits,
    drafted,
    before,
    after: tokensOf(drafted),
    followUps,
    stillMissing: missing,
    vagueWords: vagueHits,
  }
}
