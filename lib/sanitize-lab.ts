import type { Lab, LabStepContent, LabTask } from '@/lib/labs'

const phraseReplacements: ReadonlyArray<readonly [RegExp, string]> = [
  [/from your whizlabs dashboard/gi, 'from the lab console'],
  [/from your whizlab dashboard/gi, 'from the lab console'],
  [/from whizlabs labs console/gi, 'from the lab console'],
  [/whizlabs labs console/gi, 'lab console'],
  [/whizlabs dashboard/gi, 'lab console'],
  [/welcome to whizlabs server/gi, 'Welcome to Lab Server'],
  [/hi whizlabs/gi, 'Hi Lab'],
  [/whizlab api/gi, 'Lab API'],
  [/whizlabs_sg/gi, 'lab_sg'],
  [/s3:\/\/whizlabs\b/gi, 's3://lab-bucket'],
  [/name whizlabs\.\./gi, 'name lab-bucket..'],
  [/https?:\/\/(?:business\.)?whizlabs\.com[^\s)'"]*/gi, ''],
  [/business\.whizlabs\.com/gi, ''],
]

const demoPasswords = [
  'Whizvpn123@',
  'mydatabasepassword',
  'lab@123',
  '123@lab',
  'lab123',
] as const

const secretReplacements: ReadonlyArray<readonly [RegExp, string]> = [
  [/Password:\s*password\b/gi, 'Password: <example-password>'],
  [/UNIX Password:\s*password\b/gi, 'UNIX Password: <example-password>'],
  [/New Password:\s*password\b/gi, 'New Password: <example-password>'],
  [/Retype New Password:\s*password\b/gi, 'Retype New Password: <example-password>'],
  [/Master password:\s*Enter\s+lab123/gi, 'Master password: Enter <example-password>'],
  [/Confirm password:\s*Enter\s+lab123/gi, 'Confirm password: Enter <example-password>'],
]

const redactDemoSecrets = (text: string): string =>
  secretReplacements
    .reduce(
      (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
      demoPasswords.reduce((acc, password) => acc.replaceAll(password, '<example-password>'), text),
    )

export const sanitizeLabText = (text: string | undefined): string => {
  const value = text ?? ''
  const branded = phraseReplacements
    .reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), value)
    .replace(/whizlabs?/gi, 'lab')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return redactDemoSecrets(branded)
}

const sanitizeStep = (step: LabStepContent): LabStepContent => ({
  ...step,
  text: sanitizeLabText(step.text),
  images: step.images,
})

const sanitizeTask = (task: LabTask): LabTask => ({
  title: sanitizeLabText(task.title),
  steps: task.steps.map(sanitizeStep),
})

export const sanitizeLab = (lab: Lab): Lab => ({
  ...lab,
  title: sanitizeLabText(lab.title),
  summary: sanitizeLabText(lab.summary),
  services: (lab.services ?? []).map((s) => sanitizeLabText(s)),
  takeaways: (lab.takeaways ?? []).map((t) => sanitizeLabText(t)),
  tasks: (lab.tasks ?? []).map(sanitizeTask),
  source: lab.source === 'whizlabs' ? 'course' : (lab.source ?? 'course'),
  sourceUrl: undefined,
})
