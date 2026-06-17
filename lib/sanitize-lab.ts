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

export const sanitizeLabText = (text: string | undefined): string => {
  const value = text ?? ''
  return phraseReplacements
    .reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), value)
    .replace(/whizlabs?/gi, 'lab')
    .replace(/\s{2,}/g, ' ')
    .trim()
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
  source: lab.source === 'whizlabs' ? 'course' : lab.source,
  sourceUrl: undefined,
})
