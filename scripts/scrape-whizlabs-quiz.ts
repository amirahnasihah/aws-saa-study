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
// Auth
// ---------------------------------------------------------------------------

const STORAGE_STATE = resolve('scripts/.playwright-storage-state.json')

const ensureAuth = async (page: Page): Promise<void> => {
  await page.goto('https://business.whizlabs.com', { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.waitForTimeout(1500)
  const isLoggedIn = await page.evaluate(() =>
    document.cookie.includes('session') ||
    document.querySelector('[class*="logout"]') !== null
  )
  if (!isLoggedIn) {
    console.log('\n⚠  Not logged in — log in the browser window, then press Enter here.')
    await new Promise<void>((res) => { process.stdin.once('data', () => res()) })
  }
}

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

const tryText = async (page: Page, selectors: string[]): Promise<string> => {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first()
      const visible = await el.isVisible({ timeout: 1000 }).catch(() => false)
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
// Whizlabs selectors (fallback lists — tuned for Whizlabs UI)
// ---------------------------------------------------------------------------

const Q_TEXT = [
  '.ques-text', '.question-text', '[class*="question_text"]',
  '[class*="questionText"]', '[class*="ques-text"]',
  '.exam-question-text', 'p.question', '.quiz-question p',
]

const OPTION_CONTAINERS = [
  '.option-container', '.answer-option', '[class*="option_container"]',
  'ul.options > li', '.quiz-answers .answer', '[class*="answerOption"]',
]

const OPTION_TEXT = [
  '.option-text', '.answer-text', '[class*="option_text"]',
  '[class*="optionText"]', '[class*="answer_text"]',
  'label.option', '.quiz-answer label', 'ul.options li',
]

const NEXT_BTN = [
  'button:has-text("Next")', 'button:has-text("NEXT")',
  '[class*="next-btn"]', '[class*="nextBtn"]',
  'button[aria-label="Next"]', '.navigation-btn.next',
]

const SUBMIT_BTN = [
  'button:has-text("Submit")', 'button:has-text("Finish")',
  'button:has-text("SUBMIT")', '[class*="submit-btn"]', '[class*="submitBtn"]',
]

const CORRECT_INDICATOR = [
  '[class*="correct"]', '[class*="right-answer"]', '[class*="rightAnswer"]',
  '.correct-answer', '[data-correct="true"]',
]

const EXPLANATION = [
  '.explanation', '[class*="explanation"]', '[class*="solution"]',
  '.answer-explanation', '[class*="answerExplanation"]', '.rationale',
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

const extractOptions = async (page: Page): Promise<RawOption[]> => {
  const LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

  for (const containerSel of OPTION_CONTAINERS) {
    try {
      const containers = await page.locator(containerSel).all()
      if (containers.length >= 2) {
        const opts: RawOption[] = []
        for (let i = 0; i < containers.length; i++) {
          const text = (await containers[i].innerText().catch(() => '')).trim()
          if (text) opts.push({ id: LABELS[i], text })
        }
        if (opts.length >= 2) return opts
      }
    } catch { /* next */ }
  }

  const texts = await tryAll(page, OPTION_TEXT)
  return texts.map((text, i) => ({ id: LABELS[i], text }))
}

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

const clickNext = async (page: Page): Promise<boolean> => {
  for (const sel of NEXT_BTN) {
    try {
      const btn = page.locator(sel).last()
      if (await btn.isVisible({ timeout: 1000 })) {
        await btn.click()
        await page.waitForTimeout(1200)
        return true
      }
    } catch { /* next */ }
  }
  return false
}

const submitExam = async (page: Page): Promise<void> => {
  for (const sel of SUBMIT_BTN) {
    try {
      const btn = page.locator(sel).first()
      if (await btn.isVisible({ timeout: 2000 })) {
        await btn.click()
        await page.waitForTimeout(2000)
        // Handle confirmation dialog
        try {
          const confirm = page.locator('button:has-text("Yes"), button:has-text("Confirm"), button:has-text("OK")').first()
          if (await confirm.isVisible({ timeout: 2000 })) {
            await confirm.click()
            await page.waitForTimeout(2000)
          }
        } catch { /* no dialog */ }
        console.log('  ✓ Submitted exam')
        return
      }
    } catch { /* next */ }
  }
  console.warn('  ⚠  Could not click Submit — check page state')
}

const goToQuestion = async (page: Page, index: number): Promise<void> => {
  try {
    const btn = page.locator(`[class*="question-nav"] >> text="${index}"`).first()
    if (await btn.isVisible({ timeout: 500 })) { await btn.click(); await page.waitForTimeout(600); return }
  } catch { /* next */ }
}

// ---------------------------------------------------------------------------
// Pass 1: forward walk collecting scenario + options + screenshots
// ---------------------------------------------------------------------------

const pass1 = async (
  page: Page, total: number, screenshotDir: string, setId: string,
): Promise<RawQuestion[]> => {
  console.log(`\n=== Pass 1: Collecting ${total} questions ===`)
  const questions: RawQuestion[] = []
  await page.waitForTimeout(3000)

  for (let i = 1; i <= total; i++) {
    console.log(`  Q${i}/${total}...`)

    const screenshotPath = join(screenshotDir, `${setId}-${String(i).padStart(3, '0')}.png`)
    await page.screenshot({ path: screenshotPath, fullPage: false }).catch(() => undefined)

    const scenario = await tryText(page, Q_TEXT)
    const options = await extractOptions(page)
    questions.push({ index: i, scenario, options, screenshotPath })

    if (!scenario) {
      console.warn(`    ⚠  No text extracted for Q${i} — saving debug HTML`)
      const html = await page.content()
      writeFileSync(join(screenshotDir, `debug-q${i}.html`), html)
    }

    if (i < total) {
      const moved = await clickNext(page)
      if (!moved) { console.warn(`    ⚠  Could not click Next at Q${i}`); break }
    }
  }

  console.log(`  Collected ${questions.length} questions`)
  return questions
}

// ---------------------------------------------------------------------------
// Pass 2: review page — correct answers + explanations
// ---------------------------------------------------------------------------

const extractCorrectId = async (page: Page): Promise<string> => {
  const LABELS = ['A', 'B', 'C', 'D', 'E']

  // Check for highlighted correct indicator
  for (const sel of CORRECT_INDICATOR) {
    try {
      const el = page.locator(sel).first()
      if (await el.isVisible({ timeout: 500 })) {
        const text = (await el.innerText().catch(() => '')).trim()
        // Pattern: "A. " or "Answer: B" or just "B"
        const m = text.match(/^([A-F])[.\s)]/) ?? text.match(/Answer[:\s]+([A-F])/i) ?? text.match(/\b([A-F])\b/)
        if (m) return m[1]
      }
    } catch { /* next */ }
  }

  // DOM evaluation: find position of correct element relative to siblings
  const idx = await page.evaluate((): number => {
    const correct = document.querySelector(
      '[data-correct="true"], [data-is-correct="true"], .correct-option, .right-answer'
    )
    if (!correct) return -1
    const parent = correct.closest('ul, ol, .options, [class*="options"]')
    if (!parent) return -1
    const items = Array.from(parent.children)
    return items.findIndex((item) => item === correct || item.contains(correct))
  })
  if (idx >= 0 && idx < LABELS.length) return LABELS[idx]

  return 'A' // unknown — flag for manual review
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

    const correctId = await extractCorrectId(page)
    const explanation = await tryText(page, EXPLANATION)
    results.push({ correctId, explanation })

    if (i < questions.length - 1) await clickNext(page).catch(() => undefined)
  }

  return results
}

// ---------------------------------------------------------------------------
// Domain detection from keywords
// ---------------------------------------------------------------------------

type DomainRule = [string[], string, string]

const DOMAIN_RULES: DomainRule[] = [
  [['vpc', 'subnet', 'nacl', 'security group', 'vpn', 'direct connect', 'transit gateway', 'route 53', 'cloudfront', 'alb', 'nlb', 'elb', 'load balancer', 'nat gateway', 'waf', 'shield', 'guardduty', 'iam', 'kms', 'organizations', 'scp', 'cognito'], 'd1', 'Design Secure Architectures'],
  [['s3', 'glacier', 'efs', 'fsx', 'storage gateway', 'ebs', 'rds', 'aurora', 'dynamodb', 'elasticache', 'redshift', 'lake formation', 'backup', 'multi-az', 'replication', 'cross-region'], 'd2', 'Design Resilient Architectures'],
  [['sqs', 'sns', 'eventbridge', 'step functions', 'lambda', 'api gateway', 'kinesis', 'firehose', 'microservice', 'serverless', 'event-driven', 'fargate', 'ecs', 'eks', 'auto scaling', 'elasticache', 'cloudfront', 'global accelerator'], 'd3', 'Design High-Performing Architectures'],
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
// AWS service keyword extraction
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
  const expl = esc(JSON.stringify({ en: q.explanation }))
  const kws = esc(JSON.stringify(q.keywords))
  const ref = q.reference ? `'${esc(q.reference)}'` : 'NULL'
  const screenshot = `'/questions/${setId}/${setId}-${String(idx).padStart(3, '0')}.png'`

  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source, page_number, screenshot_url) VALUES ('${id}', '${q.domain}', '${esc(q.domainLabel)}', '${q.difficulty}', '${esc(q.scenario)}', '${opts}', '${esc(q.correctId)}', '${expl}', ${ref}, '${kws}', 'whizlab', ${idx}, ${screenshot});`
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

  if (!headless) await ensureAuth(page)

  console.log('\nNavigating to quiz...')
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await page.waitForTimeout(3000)

  // Redirect to login?
  if (page.url().includes('login') || page.url().includes('signin')) {
    console.error('✗ Redirected to login page. Remove storage state and retry without --headless.')
    await browser.close()
    process.exit(1)
  }

  await context.storageState({ path: STORAGE_STATE })

  // Click Start button if present
  try {
    const startBtn = page.locator('button:has-text("Start"), button:has-text("Begin"), a:has-text("Start Exam")').first()
    if (await startBtn.isVisible({ timeout: 3000 })) {
      await startBtn.click()
      await page.waitForTimeout(2000)
    }
  } catch { /* already on question */ }

  // Pass 1
  const rawQuestions = await pass1(page, total, screenshotDir, setId)

  // Submit
  console.log('\n=== Submitting exam ===')
  await submitExam(page)
  await page.waitForTimeout(3000)

  // Pass 2
  const answers = await pass2(page, rawQuestions)

  // Merge
  const finalQuestions: AnsweredQuestion[] = rawQuestions.map((q, i) => {
    const ans = answers[i] ?? { correctId: 'A', explanation: '' }
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

  // Write SQL
  const sql = finalQuestions.map((q, i) => toSqlRow(q, setId, i + 1)).join('\n')
  writeFileSync(sqlPath, sql)
  console.log(`\n✓ SQL → ${sqlPath} (${finalQuestions.length} rows)`)

  // Write notes for awsServices review
  const notes = finalQuestions.map((q, i) => ({
    id: `${setId}-${String(i + 1).padStart(3, '0')}`,
    scenario: q.scenario.slice(0, 200),
    correctId: q.correctId,
    keywords: q.keywords,
    domain: q.domainLabel,
  }))
  writeFileSync(notesPath, JSON.stringify(notes, null, 2))
  console.log(`✓ Notes → ${notesPath}`)

  const noAnswers = finalQuestions.filter((q) => !q.explanation).length
  if (noAnswers > 0) console.warn(`\n⚠  ${noAnswers} questions missing explanation — review ${sqlPath} manually`)

  console.log('\nNext steps:')
  console.log(`  Seed remote D1:`)
  console.log(`    while IFS= read -r line; do bunx wrangler d1 execute aws-saa-questions --remote --command="$line"; done < ${sqlPath}`)
  console.log(`  Seed local D1:`)
  console.log(`    while IFS= read -r line; do bunx wrangler d1 execute aws-saa-questions --local --command="$line"; done < ${sqlPath}`)

  await browser.close()
}

main().catch((err: unknown) => { console.error(err); process.exit(1) })
