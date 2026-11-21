export type Duel = {
  id: string
  ask: string
  a: string
  b: string
  better: 'a' | 'b'
  why: string
}

export const duels: Duel[] = [
  {
    id: 'coffee',
    ask: 'Promoting a small business',
    a: 'please could you kindly write something nice and short about our new coffee shop for social media, thanks in advance',
    b: 'Write 3 short Instagram captions for a new coffee shop in Cebu City. Friendly tone, no hashtags, under 20 words each.',
    better: 'b',
    why: 'B names the job (3 captions), the place, the tone and the length. A says “something nice and short” and leaves four decisions to the AI.',
  },
  {
    id: 'landlord',
    ask: 'Asking for a repair',
    a: 'Email my landlord about the tap.',
    b: 'Write a polite 4-sentence email to my landlord asking him to fix the kitchen tap this week. Mention that it has been leaking for 3 days.',
    better: 'b',
    why: 'Same cost, more information: who, what, when, and how long it has been broken. The AI does not have to invent a reason.',
  },
  {
    id: 'homework',
    ask: 'Learning something new',
    a: 'Explain photosynthesis to a 10-year-old using a kitchen comparison, in 5 short sentences.',
    b: 'Tell me everything about photosynthesis. Make it long and detailed with all the science.',
    better: 'a',
    why: 'A sets the reader, the comparison and the length. B asks for “everything”, which is how you get three pages you will not read.',
  },
  {
    id: 'polite',
    ask: 'Cutting the fat',
    a: 'Hi! I hope this message finds you well. I was wondering if you could possibly help me to maybe write a short message to my team about the meeting being moved? Thank you so much!',
    b: 'Write a 2-sentence message to my team: the 3pm meeting moved to 4pm.',
    better: 'b',
    why: 'B is about 4× shorter and still answers every question. A’s politeness costs tokens and adds no information.',
  },
  {
    id: 'table',
    ask: 'Getting something usable',
    a: 'Give me ideas for a weekend trip.',
    b: 'Give me 4 weekend trip ideas within 2 hours of Cebu City as a table: place, travel time, best for, rough cost.',
    better: 'b',
    why: 'A returns a wall of text. B returns a table you can compare and act on, because the shape was asked for.',
  },
  {
    id: 'vague',
    ask: 'Fixing your own writing',
    a: 'Make this better: “We are a company that does many things for many clients.”',
    b: 'Rewrite this sentence in 15 words or fewer, for a website homepage, in a plain and confident tone: “We are a company that does many things for many clients.”',
    better: 'b',
    why: '“Better” is a mood; “15 words, homepage, plain and confident” is a target. B is longer, but it is one round instead of four.',
  },
  {
    id: 'question',
    ask: 'Getting unstuck',
    a: 'Plan my week.',
    b: 'Plan my week around 3 priorities: finish the report by Thursday, gym twice, and call my mother. Ask me one question if something important is missing.',
    better: 'b',
    why: 'A gives the AI a blank calendar to guess at. B gives three anchors and invites one clarifying question instead of a wrong answer.',
  },
  {
    id: 'followup',
    ask: 'Saving a round-trip',
    a: 'Write a covering letter for a job, then make it shorter, then make it friendlier, then remove the clichés.',
    b: 'Write a 150-word covering letter for a barista job. Friendly, no clichés like “team player”, 3 short paragraphs.',
    better: 'b',
    why: 'A is four prompts pretending to be one — every follow-up reloads the whole conversation. B puts the constraints in the first message.',
  },
]
