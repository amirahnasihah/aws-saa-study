/** Core practice test sets seeded in D1 (source = core). */

export type PracticeTestKind = 'pt' | 'section' | 'final'

export type PracticeTestSet = {
  setId: string
  kind: PracticeTestKind
  title: string
  total: number
}

export const COURSE_SLUG = 'aws-solutions-architect-associate'
export const COURSE_ID = '153'

export const CORE_PRACTICE_SETS: PracticeTestSet[] = [
  { setId: 'wz2', kind: 'pt', title: 'Practice Test 2 (SAA-C03)', total: 65 },
  { setId: 'wz3', kind: 'pt', title: 'Practice Test 3 (SAA-C03)', total: 65 },
  { setId: 'wz4', kind: 'pt', title: 'Practice Test 4 (SAA-C03)', total: 65 },
  { setId: 'wz5', kind: 'pt', title: 'Practice Test 5 (SAA-C03)', total: 65 },
  { setId: 'wz6', kind: 'pt', title: 'Practice Test 6 (SAA-C03)', total: 65 },
  { setId: 'wzs1', kind: 'section', title: 'Virtual Private Cloud (VPC)', total: 10 },
  { setId: 'wzs2', kind: 'section', title: 'Storage', total: 5 },
  { setId: 'wzs3', kind: 'section', title: 'Amazon Elastic File System (EFS)', total: 5 },
  { setId: 'wzs4', kind: 'section', title: 'API Gateway', total: 5 },
  { setId: 'wzs5', kind: 'section', title: 'AWS Lambda', total: 4 },
  { setId: 'wzs6', kind: 'section', title: 'Application Integration', total: 7 },
  { setId: 'wzs7', kind: 'section', title: 'Database', total: 10 },
  { setId: 'wzs8', kind: 'section', title: 'Machine Learning', total: 4 },
  { setId: 'wzs9', kind: 'section', title: 'Analytics', total: 5 },
]

export const totalCoreQuestionImages = (): number =>
  CORE_PRACTICE_SETS.reduce((sum, set) => sum + set.total, 0)

export const screenshotPublicPath = (setId: string, index: number): string =>
  setId === 'wz'
    ? `/questions/${setId}-${String(index).padStart(3, '0')}.png`
    : `/questions/${setId}/${setId}-${String(index).padStart(3, '0')}.png`
