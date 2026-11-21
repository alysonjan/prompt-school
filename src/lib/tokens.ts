export function wordsOf(text: string): number {
  const t = text.trim()
  return t ? t.split(/\s+/).length : 0
}

/**
 * Rough token estimate. Rule of thumb for everyday English: 1 token ≈ 4
 * characters (about ¾ of a word). Good enough to teach the idea — never
 * presented as a bill.
 */
export function tokensOf(text: string): number {
  const t = text.trim()
  if (!t) return 0
  return Math.max(1, Math.round(t.length / 4))
}

export function tokenLabel(n: number): string {
  return `≈ ${n.toLocaleString('en-US')} ${n === 1 ? 'token' : 'tokens'}`
}

export function pct(a: number, b: number): number {
  if (b <= 0) return 0
  return Math.round((a / b) * 100)
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the old way */
  }
  try {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}
