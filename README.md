# Prompt School

A small, free app that teaches non-technical people how to ask an AI for what they
actually want — and how to spend fewer tokens doing it.

Four tabs, no accounts, no backend:

- **Learn** — eight short lessons (say what you want, name the reader, ask for a
  shape, set a number, cut the filler, show an example, let it ask you one
  question), each with a foggy prompt beside a clear one. Progress is stored in
  `localStorage`.
- **Build** — a five-question wizard that assembles a structured prompt
  (task / reader / format / length / tone + "if unclear, ask one question"),
  editable before you copy it.
- **Fix mine** — paste any prompt and get a rule-based makeover: a teaching score,
  what the AI would have to guess, the polite filler to drop, and a tuned draft
  with bracketed blanks.
- **Play** — an eight-round duel: two prompts, pick the better one, read why.
  Best score is remembered per browser.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # tsc -b + vite build → dist/
npx serve dist   # preview the static build
```

## Notes

- Vite + React 19 + TypeScript, Tailwind v4 (`@tailwindcss/vite`), no runtime
  dependencies beyond React.
- Nothing is sent anywhere: no API calls, no analytics. The only network request
  is Google Fonts (Fraunces + Instrument Sans); with the fonts blocked the page
  still works, in Georgia and the system sans.
- Token counts are **estimates**: 1 token ≈ 4 characters ≈ ¾ of a word, which is
  the usual rule of thumb for everyday English. The app says so wherever a number
  appears.
- The makeover engine (`src/lib/makeover.ts`) is regex-based on purpose: it can
  point at what is missing but never rewrites your meaning.
