// Exam-day & registration content — sourced from AWS Certification policies
// (aws.amazon.com/certification/policies/during-testing). Shared by the
// about page and the exam-guide page. Literal Tailwind class strings only
// (no dynamic `text-${x}`) so JIT keeps them in the build.

export type DeliveryMode = 'center' | 'online'

export const registerSteps = [
  {
    n: '01',
    title: 'Sign in to AWS Certification',
    body: "Use aws.training/certification. Your AWS Certification Account name must be in Roman characters and match the ID you'll bring to the exam.",
  },
  {
    n: '02',
    title: 'Pick SAA-C03',
    body: 'Solutions Architect Associate — confirm the current exam guide (65 questions, 130 min, 720/1000 to pass).',
  },
  {
    n: '03',
    title: 'Choose delivery',
    body: 'Pearson VUE test center (in person) or Online Proctored / OnVUE (remote, live proctor via webcam).',
  },
  {
    n: '04',
    title: 'Pay & schedule',
    body: '$150 USD. Holders of an active AWS certification get 50% off. Pick a date, time, and language.',
  },
  {
    n: '05',
    title: 'Pick a language',
    body: 'English, Japanese, Korean, Simplified Chinese, Spanish, Portuguese-BR, French, Italian, and more depending on availability.',
  },
] as const

export const delivery: {
  mode: DeliveryMode
  label: string
  sub: string
  points: string[]
}[] = [
  {
    mode: 'center',
    label: 'Test Center',
    sub: 'Pearson VUE · in person',
    points: [
      'Arrive 15–30 min before your appointment',
      '2 primary IDs, or 1 primary + 1 secondary ID',
      'A photo may be taken at check-in',
      'Unscheduled breaks allowed — timer keeps running',
      'You cannot leave the building during the exam',
      'Scratch work: use the provided erasable note board — no personal paper or pens',
    ],
  },
  {
    mode: 'online',
    label: 'Online Proctored',
    sub: 'OnVUE · remote live proctor',
    points: [
      'Launch up to 30 min early; >15 min late = forfeit',
      '1 primary ID (name must match account exactly)',
      'Pass the system test + workspace check first',
      'Stay on camera the entire time, no standing',
      "No breaks — don't leave the camera frame",
      'No physical paper or pens — use the on-screen whiteboard/notes only',
    ],
  },
]

export const deliveryAccent: Record<DeliveryMode, { dot: string; pill: string; text: string }> = {
  center: { dot: 'bg-c3', pill: 'bg-c3/10 text-c3 border-c3/20', text: 'text-c3' },
  online: { dot: 'bg-c4', pill: 'bg-c4/10 text-c4 border-c4/20', text: 'text-c4' },
}

export const duringTesting = [
  'Agree to the Candidate Code of Conduct (5 min). Refusal ends the exam with no refund.',
  'No penalty for wrong answers — blanks are scored as wrong, so answer every question.',
  'Navigate freely and flag items for review before submitting.',
  'No scheduled breaks on any AWS exam, test center or online.',
  'The Roman-character name on your ID must match your AWS Certification Account exactly.',
  'Need a name change? Process it at least 2 business days before your exam.',
] as const
