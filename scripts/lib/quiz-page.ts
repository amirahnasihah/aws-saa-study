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
]

export const QUESTION_PANEL = [
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
  'button:has-text("Resume")',
  'button:has-text("Continue")',
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
  await page.waitForSelector(Q_TEXT.join(', '), { timeout: 12_000 }).catch(() => undefined)
  await page.waitForTimeout(500)
}

export const questionPanelLocator = (page: Page) => {
  const joined = QUESTION_PANEL.join(', ')
  return page.locator(joined).first()
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
