import type { Page } from 'playwright'

export const Q_TEXT = [
  '.ques-text',
  '[class*="ques-text"]',
  '.question-text',
  '[class*="questionText"]',
  '.exam-question p',
  '.quiz-question-text',
  'h4.question',
  '[data-testid="question-text"]',
  '.block-head + div p',
  '.top-head ~ div p',
  '.dangerouslySetInnerHTML p',
]

export const QUESTION_PANEL = [
  '.ExamQuestionsBlock',
  '.examBlock .left',
  'fieldset.Questions-list',
  '.Questions-list',
  '.quiz-question-wrapper',
  '.exam-question-container',
  '[class*="question-container"]',
  '[class*="quizQuestion"]',
  '.quiz-content',
  '.exam-content',
  'main .container',
]

export const NEXT_BTN = [
  'button.btn-next',
  'button[class*="btn-next"]',
  'button:has-text("Next")',
  'button:has-text("NEXT")',
  '[aria-label="Next"]',
  '.navigation-next',
  'button[class*="next"]',
]

export const START_BTN = [
  'button.btn-startQuiz',
  'button:has-text("Start")',
  'button:has-text("START")',
]

export const RESUME_BTN = [
  'button:has-text("Resume Quiz")',
  'button:has-text("Resume")',
  'button:has-text("Continue")',
]

export const CONFIRM_START_BTN = [
  'button:has-text("Yes, Start")',
  'button:has-text("Yes Start")',
  'button:has-text("Start Exam")',
]

export const QUESTION_NAV_NUM = [
  '.exam-sidebar button',
  '.sidebar-question',
  '[class*="questionNumber"]',
  '[class*="question-number"]',
  '.ques-nav button',
  '.question-palette button',
]

export const tryText = async (page: Page, selectors: string[]): Promise<string> => {
  const match = await selectors.reduce<Promise<string>>(async (prev, sel) => {
    const found = await prev
    if (found) return found
    try {
      const el = page.locator(sel).first()
      const visible = await el.isVisible({ timeout: 1200 }).catch(() => false)
      if (!visible) return ''
      const text = (await el.innerText()).trim()
      return text || ''
    } catch {
      return ''
    }
  }, Promise.resolve(''))
  return match
}

export const clickFirstVisible = async (page: Page, selectors: string[]): Promise<boolean> => {
  const clicked = await selectors.reduce<Promise<boolean>>(async (prev, sel) => {
    if (await prev) return true
    try {
      const btn = page.locator(sel).first()
      if (await btn.isVisible({ timeout: 1200 })) {
        await btn.click()
        await page.waitForTimeout(1200)
        return true
      }
    } catch {
      // try next selector
    }
    return false
  }, Promise.resolve(false))
  return clicked
}

export const waitForQuestion = async (page: Page): Promise<void> => {
  await page.waitForSelector('.ExamQuestionsBlock, .Questions-list, ' + Q_TEXT.join(', '), {
    timeout: 12_000,
  }).catch(() => undefined)
  await page.waitForTimeout(500)
}

export const downloadInlineDiagrams = async (
  page: Page,
  outputDir: string,
  baseName: string,
): Promise<number> => {
  const imgs = page.locator(`${Q_TEXT.join(', ')} img`)
  const count = await imgs.count()
  if (count === 0) return 0

  const saved = await Array.from({ length: count }).reduce<Promise<number>>(async (prev, _, i) => {
    const total = await prev
    const img = imgs.nth(i)
    const src = await img.getAttribute('src')
    if (!src || src.startsWith('data:')) return total
    try {
      const response = await page.request.get(src.startsWith('http') ? src : new URL(src, page.url()).toString())
      const buffer = await response.body()
      const ext = src.includes('.png') ? 'png' : src.includes('.jpg') || src.includes('.jpeg') ? 'jpg' : 'png'
      const path = `${outputDir}/${baseName}-diagram-${i + 1}.${ext}`
      await Bun.write(path, buffer)
      return total + 1
    } catch {
      return total
    }
  }, Promise.resolve(0))

  return saved
}

export const questionPanelLocator = (page: Page) => page.locator('.ExamQuestionsBlock').first()

export const enterExam = async (page: Page): Promise<void> => {
  await page.waitForSelector('button.btn-startQuiz, button:has-text("Resume Quiz"), button:has-text("Start Quiz")', {
    timeout: 30_000,
  }).catch(() => undefined)

  const startQuiz = page.locator('button.btn-startQuiz').first()
  if (await startQuiz.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await startQuiz.click()
    await page.waitForTimeout(1_500)
  } else {
    const fallback = page.getByRole('button', { name: /Resume Quiz|Start Quiz/i }).first()
    await fallback.click({ timeout: 10_000 })
    await page.waitForTimeout(1_500)
  }

  const confirm = page.getByRole('button', { name: /Yes, Start/i }).first()
  if (await confirm.isVisible({ timeout: 8_000 }).catch(() => false)) {
    await confirm.click()
  }

  await page.waitForSelector('.exam-header', { timeout: 30_000 }).catch(() => undefined)
  await page.waitForTimeout(1_500)
}

export const goToQuestion = async (page: Page, questionNumber: number): Promise<boolean> => {
  const header = page.locator('.exam-header')
  const before = await header.innerText().catch(() => '')
  const label = String(questionNumber)

  const candidates = [
    page.locator('li').filter({ hasText: new RegExp(`^${label}$`) }),
    page.locator('.ques-sidebar button').filter({ hasText: new RegExp(`^${label}$`) }),
    page.locator('.exam-sidebar button').filter({ hasText: new RegExp(`^${label}$`) }),
    page.locator('[class*="sidebar"] button').filter({ hasText: new RegExp(`^${label}$`) }),
    page.locator('[class*="question-palette"] button').filter({ hasText: new RegExp(`^${label}$`) }),
    page.locator('button.ques-no').filter({ hasText: new RegExp(`^${label}$`) }),
  ]

  const clicked = await candidates.reduce<Promise<boolean>>(async (prev, locator) => {
    if (await prev) return true
    if (await locator.first().isVisible({ timeout: 800 }).catch(() => false)) {
      await locator.first().click()
      await page.waitForTimeout(1_500)
      return true
    }
    return false
  }, Promise.resolve(false))

  if (!clicked) {
    const exact = page.getByText(label, { exact: true })
    const count = await exact.count()
    await Array.from({ length: count }).reduce<Promise<boolean>>(async (prev, _, i) => {
      if (await prev) return true
      const el = exact.nth(i)
      const box = await el.boundingBox().catch(() => null)
      if (!box || box.width > 56 || box.height > 56) return false
      await el.click()
      await page.waitForTimeout(1_500)
      return true
    }, Promise.resolve(false))
  }

  const after = await header.innerText().catch(() => '')
  if (after.includes(`Question ${label} `) || after.includes(`Question ${label} of`)) return true
  if (before !== after && after.length > 0) return true
  return clickFirstVisible(page, NEXT_BTN)
}
