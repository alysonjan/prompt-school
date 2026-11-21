export type Lesson = {
  id: string
  title: string
  why: string
  foggy: string
  clear: string
  tip: string
}

export const lessons: Lesson[] = [
  {
    id: 'say-what',
    title: 'Say exactly what you want',
    why: '“Help me with my email” can mean write it, shorten it, fix the grammar, or reply to it. The AI picks one and usually picks wrong.',
    foggy: 'Help me with my email to the landlord.',
    clear: 'Write a short email to my landlord asking him to fix the leaking tap in the kitchen.',
    tip: 'Start with a verb: write, list, explain, shorten, compare, translate.',
  },
  {
    id: 'context',
    title: 'Add only the details that change the answer',
    why: 'Two facts can change everything (the reader, the situation). A life story changes nothing — and you pay for it in tokens.',
    foggy:
      'So I have this situation, it is kind of complicated, my cousin is getting married and there is a lot going on with the family and everyone is busy, anyway I need help writing something.',
    clear: 'Write a 3-line message to my family saying I can’t attend the wedding because of work.',
    tip: 'Before you hit send, ask: would this detail change what the AI writes? If not, cut it.',
  },
  {
    id: 'audience',
    title: 'Say who is going to read it',
    why: 'The same message to your boss and to your 8-year-old nephew should not sound the same. One line fixes the whole tone.',
    foggy: 'Explain what a mortgage is.',
    clear: 'Explain what a mortgage is to someone who has never borrowed money. Use simple words and one everyday comparison.',
    tip: 'Name the reader, not the tone: “for my landlord” beats “make it professional”.',
  },
  {
    id: 'shape',
    title: 'Ask for the shape you want',
    why: 'Long paragraphs are hard to skim. If you ask for bullet points, a table, or a numbered list, you get something you can actually use.',
    foggy: 'Tell me about healthy breakfasts.',
    clear: 'Give me 5 healthy breakfast ideas as a table with two columns: idea, and why it is good.',
    tip: 'The shape words: bullet list, table, numbered steps, one paragraph, email reply, caption.',
  },
  {
    id: 'length',
    title: 'Ask for the size, in numbers',
    why: '“Short” means 40 words to one model and 200 to the next. “Under 60 words” is a number both of you can check — and it is the fastest way to cut tokens.',
    foggy: 'Summarise this article briefly.',
    clear: 'Summarise this article in 3 bullet points, under 40 words total.',
    tip: 'Put the number in the prompt: 3 bullets, 2 sentences, under 100 words.',
  },
  {
    id: 'filler',
    title: 'Cut the polite filler',
    why: '“Please”, “kindly”, “thank you so much” cost tokens and change nothing. AI has no feelings to spare — you are paying for the words.',
    foggy:
      'Hi! I hope you are doing well. Could you kindly please help me write a thank-you note to my neighbour, thank you so much in advance!',
    clear: 'Write a 2-sentence thank-you note to my neighbour for watering my plants.',
    tip: 'Be polite to people, brief with AI. Keep “please” for the humans.',
  },
  {
    id: 'example',
    title: 'Show one example instead of describing it',
    why: 'An example is worth a paragraph of explanation, and usually fewer tokens. Two or three lines show the style better than the word “professional”.',
    foggy: 'Rewrite my bio in a professional but friendly style.',
    clear:
      'Rewrite my bio in this style: “I build small websites for local shops. Fast, simple, no jargon.”\nMy bio: I am a web developer with 6 years of experience in the Philippines.',
    tip: 'Paste one good line you like and say “match this style”.',
  },
  {
    id: 'ask-me',
    title: 'Let it ask you one question',
    why: 'One short question up front is cheaper than a wrong answer you have to redo. It turns a guessing game into a conversation.',
    foggy: 'Make me a budget.',
    clear: 'Make me a monthly budget for a family of four in Cebu. If anything important is missing, ask me one question before you start.',
    tip: 'Add: “If something is unclear, ask me one question before answering.”',
  },
]
