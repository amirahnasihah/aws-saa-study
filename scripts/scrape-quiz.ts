/**
 * Whizlabs quiz scraper — DOM extraction + screenshot + D1 SQL generation
 *
 * Usage:
 *   bun run scripts/scrape-whizlabs-quiz.ts \
 *     --url "https://business.whizlabs.com/.../exam/start" \
 *     --set wz2 \
 *     --total 65 \
 *     [--headless]
 *
 * Flow:
 *   Pass 1 — navigate every question forward, grab text + options, take screenshot
 *   Pass 2 — submit exam, scrape review page for correct answers + explanations
 *   Output — scripts/wz{set}.sql  +  scripts/wz{set}-notes.json
 */

import { chromium, type Page } from 'playwright'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface CliArgs { url: string; set: string; total: number; headless: boolean }

const parseArgs = (): CliArgs => {
  const args = process.argv.slice(2)
  const get = (flag: string): string | undefined => {
    const i = args.indexOf(flag)
    return i !== -1 ? args[i + 1] : undefined
  }
  const url = get('--url')
  const set = get('--set')
  const totalStr = get('--total')
  if (!url || !set || !totalStr) {
    console.error('Usage: bun run scripts/scrape-whizlabs-quiz.ts --url <url> --set <id> --total <n> [--headless]')
    process.exit(1)
  }
  return { url, set, total: parseInt(totalStr, 10), headless: args.includes('--headless') }
}

// ---------------------------------------------------------------------------
// Auth — navigate to quiz URL, detect login redirect
// ---------------------------------------------------------------------------

const STORAGE_STATE = resolve('scripts/.playwright-storage-state.json')

const waitForLogin = async (): Promise<void> => {
  console.log('\n⚠  Not logged in — log in the browser window, then press Enter here.')
  await new Promise<void>((res) => { process.stdin.once('data', () => res()) })
}

const isOnLoginPage = (url: string): boolean =>
  url.includes('/login') || url.includes('/signin') || url === 'https://business.whizlabs.com/'

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

const tryText = async (page: Page, selectors: string[]): Promise<string> => {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first()
      const visible = await el.isVisible({ timeout: 1500 }).catch(() => false)
      if (visible) {
        const t = await el.innerText()
        if (t.trim()) return t.trim()
      }
    } catch { /* next */ }
  }
  return ''
}

const tryAll = async (page: Page, selectors: string[]): Promise<string[]> => {
  for (const sel of selectors) {
    try {
      const els = await page.locator(sel).all()
      const texts = await Promise.all(els.map((e) => e.innerText().catch(() => '')))
      const filtered = texts.map((t) => t.trim()).filter(Boolean)
      if (filtered.length > 0) return filtered
    } catch { /* next */ }
  }
  return []
}

// ---------------------------------------------------------------------------
// Whizlabs-specific selectors (discovered from DOM inspection)
// ---------------------------------------------------------------------------

// Question text
const Q_TEXT = [
  '.ques-text',
  '[class*="ques-text"]',
  '.question-text',
  '[class*="questionText"]',
  '.exam-question p',
  '.quiz-question-text',
  // MUI/generic fallbacks
  'h4.question',
  '[data-testid="question-text"]',
]

// Option containers (each contains one answer choice A/B/C/D)
const OPTION_CONTAINERS = [
  'li.option',
  '.option-container',
  '[class*="option-container"]',
  '[class*="optionContainer"]',
  'ul.options > li',
  '.answers-list > li',
  '[class*="answer-option"]',
]

// Text inside each option
const OPTION_TEXT = [
  '.option-text',
  '[class*="option-text"]',
  '[class*="optionText"]',
  '.answer-text',
  'label',
]

// Next/Previous navigation
const NEXT_BTN = [
  'button.btn-next',
  'button[class*="btn-next"]',
  'button:has-text("Next")',
  'button:has-text("NEXT")',
  '[aria-label="Next"]',
  '.navigation-next',
  'button[class*="next"]',
]

// Submit/Finish
const SUBMIT_BTN = [
  'button.btn-submit:not(.btn-start)',
  'button:has-text("Submit")',
  'button:has-text("Finish Test")',
  'button:has-text("Finish Exam")',
  'button:has-text("SUBMIT")',
  '[class*="btn-submit"]:not([class*="btn-start"])',
]

// Correct answer indicators in review mode
const CORRECT_INDICATOR = [
  '.correct-answer',
  '[class*="correct-answer"]',
  '[class*="correctAnswer"]',
  '.right-answer',
  '[class*="right-answer"]',
  '[data-correct="true"]',
  'li.option.correct',
  'li[class*="correct"]',
]

// Explanation text
const EXPLANATION = [
  '.explanation',
  '[class*="explanation"]',
  '.solution',
  '[class*="solution"]',
  '.answer-explanation',
  '.rationale',
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RawOption { id: string; text: string }

interface RawQuestion {
  index: number
  scenario: string
  options: RawOption[]
  screenshotPath: string
}

interface AnsweredQuestion extends RawQuestion {
  correctId: string
  explanation: string
  domain: string
  domainLabel: string
  difficulty: string
  keywords: string[]
  reference: string
}

// ---------------------------------------------------------------------------
// Extract options for current question
// ---------------------------------------------------------------------------

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

const extractOptions = async (page: Page): Promise<RawOption[]> => {
  // Try option containers
  for (const containerSel of OPTION_CONTAINERS) {
    try {
      const containers = await page.locator(containerSel).all()
      if (containers.length >= 2) {
        const opts: RawOption[] = []
        for (let i = 0; i < containers.length; i++) {
          // Try to get just the text part, not the radio button label
          let text = ''
          for (const textSel of OPTION_TEXT) {
            try {
              const inner = containers[i].locator(textSel).first()
              if (await inner.isVisible({ timeout: 300 }).catch(() => false)) {
                text = (await inner.innerText()).trim()
                if (text) break
              }
            } catch { /* next */ }
          }
          if (!text) text = (await containers[i].innerText().catch(() => '')).trim()
          if (text) opts.push({ id: LABELS[i], text })
        }
        if (opts.length >= 2) return opts
      }
    } catch { /* next */ }
  }

  // Fallback: all option texts
  const texts = await tryAll(page, OPTION_TEXT)
  return texts.slice(0, 6).map((text, i) => ({ id: LABELS[i], text }))
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

const clickBtn = async (page: Page, selectors: string[], label: string): Promise<boolean> => {
  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).last()
      if (await btn.isVisible({ timeout: 1500 })) {
        await btn.click()
        await page.waitForTimeout(1500)
        return true
      }
    } catch { /* next */ }
  }
  console.warn(`  ⚠  Could not find ${label} button`)
  return false
}

const goToQuestion = async (page: Page, index: number): Promise<void> => {
  // Try question number sidebar/nav
  const selectors = [
    `button.question-nav-btn:has-text("${index}")`,
    `[class*="question-number"]:has-text("${index}")`,
    `[class*="questionNumber"]:has-text("${index}")`,
    `span:has-text("${index}")`,
  ]
  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).first()
      if (await btn.isVisible({ timeout: 400 })) {
        await btn.click()
        await page.waitForTimeout(800)
        return
      }
    } catch { /* next */ }
  }
}

// ---------------------------------------------------------------------------
// Pass 1: walk forward through all questions
// ---------------------------------------------------------------------------

const pass1 = async (
  page: Page, total: number, screenshotDir: string, setId: string,
): Promise<RawQuestion[]> => {
  console.log(`\n=== Pass 1: Collecting ${total} questions ===`)
  const questions: RawQuestion[] = []

  for (let i = 1; i <= total; i++) {
    console.log(`  Q${i}/${total}...`)

    // Wait for question content to render
    await page.waitForSelector(Q_TEXT.join(', '), { timeout: 8000 }).catch(() => undefined)
    await page.waitForTimeout(600)

    // Screenshot
    const screenshotPath = join(screenshotDir, `${setId}-${String(i).padStart(3, '0')}.png`)
    await page.screenshot({ path: screenshotPath, fullPage: false }).catch(() => undefined)

    // Extract
    const scenario = await tryText(page, Q_TEXT)
    const options = await extractOptions(page)

    if (!scenario) {
      console.warn(`    ⚠  No text for Q${i} — saving debug HTML`)
      const html = await page.content()
      writeFileSync(join(screenshotDir, `debug-q${i}.html`), html)
    } else {
      console.log(`    ✓ "${scenario.slice(0, 60)}..." (${options.length} opts)`)
    }

    questions.push({ index: i, scenario, options, screenshotPath })

    // Move to next question
    if (i < total) {
      const moved = await clickBtn(page, NEXT_BTN, 'Next')
      if (!moved) {
        console.warn(`    ⚠  Stopping at Q${i}`)
        break
      }
    }
  }

  console.log(`  Collected ${questions.length} questions`)
  return questions
}

// ---------------------------------------------------------------------------
// Pass 2: review page — correct answers + explanations
// ---------------------------------------------------------------------------

const extractCorrectId = async (page: Page): Promise<string> => {
  // DOM evaluation: find position of the correct answer element among its siblings
  const idx = await page.evaluate((): number => {
    const selectors = [
      'li.correct', 'li.right', 'li[class*="correct"]', 'li[class*="right-answer"]',
      '[data-correct="true"]', '[data-is-correct="true"]',
      '.correct-answer', '.correct-option', '.right-answer',
      '[class*="correctAnswer"]', '[class*="rightAnswer"]',
    ]
    for (const s of selectors) {
      const correct = document.querySelector(s)
      if (!correct) continue
      const parent = correct.closest('ul, ol, [class*="options"], [class*="answers"], [class*="option-list"]')
      if (!parent) continue
      const items = Array.from(parent.children)
      const pos = items.findIndex((item) => item === correct || item.contains(correct))
      if (pos >= 0) return pos
    }
    return -1
  })

  if (idx >= 0 && idx < LABELS.length) return LABELS[idx]

  // Text-based fallback: look for "Correct Answer: B" or similar
  for (const sel of CORRECT_INDICATOR) {
    try {
      const el = page.locator(sel).first()
      if (await el.isVisible({ timeout: 500 })) {
        const text = (await el.innerText().catch(() => '')).trim()
        const m = text.match(/^([A-F])[.\s)]/) ??
                  text.match(/Answer[:\s]+([A-F])/i) ??
                  text.match(/^([A-F])$/)
        if (m) return m[1]
      }
    } catch { /* next */ }
  }

  return '?' // unknown — flag for manual review
}

const pass2 = async (
  page: Page, questions: RawQuestion[],
): Promise<Array<{ correctId: string; explanation: string }>> => {
  console.log('\n=== Pass 2: Collecting answers from review ===')
  const results: Array<{ correctId: string; explanation: string }> = []

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    console.log(`  Review Q${q.index}/${questions.length}...`)
    await goToQuestion(page, q.index)
    await page.waitForTimeout(600)

    const correctId = await extractCorrectId(page)
    const explanation = await tryText(page, EXPLANATION)
    results.push({ correctId, explanation })

    if (i < questions.length - 1) {
      await clickBtn(page, NEXT_BTN, 'Next').catch(() => undefined)
    }
  }

  return results
}

// ---------------------------------------------------------------------------
// Domain detection
// ---------------------------------------------------------------------------

type DomainRule = [string[], string, string]

const DOMAIN_RULES: DomainRule[] = [
  [['vpc', 'subnet', 'nacl', 'security group', 'vpn', 'direct connect', 'transit gateway', 'route 53', 'cloudfront', 'alb', 'nlb', 'elb', 'load balancer', 'nat gateway', 'waf', 'shield', 'guardduty', 'iam', 'kms', 'organizations', 'scp', 'cognito'], 'd1', 'Design Secure Architectures'],
  [['s3', 'glacier', 'efs', 'fsx', 'storage gateway', 'ebs', 'rds', 'aurora', 'dynamodb', 'elasticache', 'redshift', 'lake formation', 'backup', 'multi-az', 'replication', 'cross-region'], 'd2', 'Design Resilient Architectures'],
  [['sqs', 'sns', 'eventbridge', 'step functions', 'lambda', 'api gateway', 'kinesis', 'firehose', 'microservice', 'serverless', 'event-driven', 'fargate', 'ecs', 'eks', 'auto scaling', 'cloudfront', 'global accelerator'], 'd3', 'Design High-Performing Architectures'],
  [['cost', 'billing', 'savings plan', 'reserved', 'spot instance', 'right-sizing', 'trusted advisor', 'compute optimizer'], 'd4', 'Design Cost-Optimized Architectures'],
]

const detectDomain = (text: string): { domain: string; domainLabel: string } => {
  const lower = text.toLowerCase()
  for (const [keywords, domain, domainLabel] of DOMAIN_RULES) {
    if (keywords.some((kw) => lower.includes(kw))) return { domain, domainLabel }
  }
  return { domain: 'd1', domainLabel: 'Design Secure Architectures' }
}

// ---------------------------------------------------------------------------
// Keyword extraction
// ---------------------------------------------------------------------------

const AWS_KEYWORDS = [
  'EC2', 'S3', 'RDS', 'Lambda', 'DynamoDB', 'VPC', 'IAM', 'CloudFront', 'Route 53',
  'ELB', 'ALB', 'NLB', 'Auto Scaling', 'CloudWatch', 'CloudTrail', 'SNS', 'SQS',
  'EFS', 'EBS', 'Glacier', 'Aurora', 'Redshift', 'ElastiCache', 'KMS', 'WAF',
  'Shield', 'API Gateway', 'Step Functions', 'EventBridge', 'Kinesis', 'Firehose',
  'Glue', 'Athena', 'EMR', 'Batch', 'Fargate', 'ECS', 'EKS', 'ECR',
  'CodePipeline', 'CodeBuild', 'CodeDeploy', 'CloudFormation', 'Elastic Beanstalk',
  'Transit Gateway', 'Direct Connect', 'VPN', 'NAT Gateway', 'Internet Gateway',
  'FSx', 'Storage Gateway', 'DataSync', 'Transfer Family', 'Backup',
  'GuardDuty', 'Macie', 'Inspector', 'Security Hub', 'Detective',
  'SSO', 'Cognito', 'Directory Service', 'RAM', 'Organizations', 'SCP',
  'Cost Explorer', 'Compute Optimizer', 'Trusted Advisor',
  'X-Ray', 'Systems Manager', 'Parameter Store', 'Secrets Manager',
  'Lake Formation', 'Outposts', 'Wavelength', 'Global Accelerator',
]

const extractKeywords = (text: string): string[] => {
  const lower = text.toLowerCase()
  return AWS_KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase()))
}

// ---------------------------------------------------------------------------
// SQL generation
// ---------------------------------------------------------------------------

const esc = (s: string): string => s.replace(/'/g, "''")

const toSqlRow = (q: AnsweredQuestion, setId: string, idx: number): string => {
  const id = `${setId}-${String(idx).padStart(3, '0')}`
  const opts = esc(JSON.stringify(q.options))
  const expl = esc(JSON.stringify({ en: q.explanation || 'See AWS documentation.' }))
  const kws = esc(JSON.stringify(q.keywords))
  const ref = q.reference ? `'${esc(q.reference)}'` : 'NULL'
  const screenshot = `'/questions/${setId}/${setId}-${String(idx).padStart(3, '0')}.png'`

  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${id}', '${q.domain}', '${esc(q.domainLabel)}', '${q.difficulty}', '${esc(q.scenario || 'TODO')}', '${opts}', '${esc(q.correctId)}', '${expl}', ${ref}, '${kws}', 'core', ${idx}, ${screenshot});`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const main = async (): Promise<void> => {
  const { url, set: setId, total, headless } = parseArgs()

  const screenshotDir = resolve(`public/questions/${setId}`)
  const sqlPath = resolve(`scripts/${setId}.sql`)
  const notesPath = resolve(`scripts/${setId}-notes.json`)
  mkdirSync(screenshotDir, { recursive: true })

  console.log(`\nWhizlabs Scraper — ${setId} (${total} questions)`)
  console.log(`  URL  : ${url}`)
  console.log(`  Mode : ${headless ? 'headless' : 'headed'}`)

  const storageState = existsSync(STORAGE_STATE) ? STORAGE_STATE : undefined
  const browser = await chromium.launch({ headless })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    ...(storageState ? { storageState } : {}),
  })
  const page = await context.newPage()

  // Navigate to quiz
  console.log('\nNavigating to quiz...')
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })

  // Wait for React SPA to render — any button or known class appearing
  console.log('  Waiting for React to render...')
  await page.waitForSelector('button, [class*="btn"], [class*="quiz"], [class*="exam"]', {
    timeout: 20_000,
  }).catch(() => console.warn('  ⚠  Render timeout — continuing anyway'))
  await page.waitForTimeout(1500)

  // Check for login redirect
  if (isOnLoginPage(page.url())) {
    if (headless) {
      console.error('✗ Not logged in. Run without --headless first to log in.')
      await browser.close()
      process.exit(1)
    }
    await waitForLogin()
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.waitForSelector('button, [class*="btn"]', { timeout: 20_000 }).catch(() => undefined)
    await page.waitForTimeout(1500)
  }

  // Save auth state
  await context.storageState({ path: STORAGE_STATE })
  console.log(`  Auth saved → ${STORAGE_STATE}`)

  // Detect page state and handle accordingly
  const hasStartBtn = await page.locator('button.btn-startQuiz').isVisible({ timeout: 3000 }).catch(() => false)
  const hasResumeBtn = await page.locator('button:has-text("Resume"), button:has-text("Continue")').first().isVisible({ timeout: 1000 }).catch(() => false)
  const hasQuestion = await page.locator(Q_TEXT.join(', ')).first().isVisible({ timeout: 1000 }).catch(() => false)

  console.log(`  Page state: startBtn=${hasStartBtn} resumeBtn=${hasResumeBtn} question=${hasQuestion}`)

  if (hasResumeBtn) {
    console.log('  Clicking Resume...')
    await page.locator('button:has-text("Resume"), button:has-text("Continue")').first().click()
    await page.waitForSelector(Q_TEXT.join(', '), { timeout: 10_000 }).catch(() => undefined)
    await page.waitForTimeout(1500)
  } else if (hasStartBtn) {
    console.log('  Clicking Start Quiz...')
    await page.locator('button.btn-startQuiz').first().click()
    await page.waitForSelector(Q_TEXT.join(', '), { timeout: 10_000 }).catch(() => undefined)
    await page.waitForTimeout(1500)
  } else if (!hasQuestion) {
    // Unknown state — save full debug HTML to figure out what's on screen
    const html = await page.content()
    const debugPath = join(screenshotDir, 'debug-start.html')
    writeFileSync(debugPath, html)
    await page.screenshot({ path: join(screenshotDir, 'debug-start.png') })
    console.warn(`  ⚠  Unknown page state. Debug saved:`)
    console.warn(`     HTML: ${debugPath}`)
    console.warn(`     PNG:  ${join(screenshotDir, 'debug-start.png')}`)
    console.warn('  Continuing — questions may not extract correctly.')
  }

  // Pass 1: collect all questions
  const rawQuestions = await pass1(page, total, screenshotDir, setId)

  // Submit exam
  console.log('\n=== Submitting exam ===')
  const submitted = await clickBtn(page, SUBMIT_BTN, 'Submit')
  if (submitted) {
    await page.waitForTimeout(3000)
    // Handle confirmation dialog
    try {
      const confirm = page.locator('button:has-text("Yes"), button:has-text("Confirm"), button:has-text("OK")').first()
      if (await confirm.isVisible({ timeout: 2000 })) {
        await confirm.click()
        await page.waitForTimeout(2500)
      }
    } catch { /* no dialog */ }
  }

  // Pass 2: scrape review for correct answers
  const answers = await pass2(page, rawQuestions)

  // Merge
  const finalQuestions: AnsweredQuestion[] = rawQuestions.map((q, i) => {
    const ans = answers[i] ?? { correctId: '?', explanation: '' }
    const fullText = [q.scenario, ...q.options.map((o) => o.text), ans.explanation].join(' ')
    const { domain, domainLabel } = detectDomain(fullText)
    return {
      ...q,
      correctId: ans.correctId,
      explanation: ans.explanation,
      domain,
      domainLabel,
      difficulty: 'Medium',
      keywords: extractKeywords(fullText),
      reference: '',
    }
  })

  // Write outputs
  const sql = finalQuestions.map((q, i) => toSqlRow(q, setId, i + 1)).join('\n')
  writeFileSync(sqlPath, sql)
  console.log(`\n✓ SQL → ${sqlPath} (${finalQuestions.length} rows)`)

  const notes = finalQuestions.map((q, i) => ({
    id: `${setId}-${String(i + 1).padStart(3, '0')}`,
    scenario: q.scenario.slice(0, 200),
    correctId: q.correctId,
    keywords: q.keywords,
    domain: q.domainLabel,
  }))
  writeFileSync(notesPath, JSON.stringify(notes, null, 2))
  console.log(`✓ Notes → ${notesPath}`)

  const unknown = finalQuestions.filter((q) => q.correctId === '?').length
  const noScenario = finalQuestions.filter((q) => !q.scenario).length
  if (unknown > 0) console.warn(`⚠  ${unknown} questions with unknown correct answer`)
  if (noScenario > 0) console.warn(`⚠  ${noScenario} questions with no scenario text`)

  console.log('\nNext steps:')
  console.log(`  Seed remote: while IFS= read -r line; do bunx wrangler d1 execute aws-saa-questions --remote --command="$line"; done < ${sqlPath}`)
  console.log(`  Seed local:  while IFS= read -r line; do bunx wrangler d1 execute aws-saa-questions --local  --command="$line"; done < ${sqlPath}`)

  await browser.close()
}

main().catch((err: unknown) => { console.error(err); process.exit(1) })
