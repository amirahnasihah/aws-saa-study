/**
 * One-off test for lib/ai/json parsing robustness.
 * Run: bun run scripts/test-ai-json.ts
 * Reproduces the "raw JSON leaked to UI" bug: model output that the strict
 * parser rejects, falling back to dumping the raw {"reply":...} blob.
 */
import { parseAIJson, salvageText } from '../lib/ai/json'

interface ChatJson {
  reply?: string
  youtubeQuery?: string
  docsSearchPhrase?: string
}

let failures = 0
const check = (name: string, pass: boolean, detail?: string): void => {
  console.log(`${pass ? '✅' : '❌'} ${name}${detail ? ` — ${detail}` : ''}`)
  if (!pass) failures += 1
}

// 1. Clean JSON (baseline — already worked)
const clean = '{"reply":"Use SQS for decoupling","youtubeQuery":"AWS SQS","docsSearchPhrase":"SQS queue"}'
check('clean JSON', parseAIJson<ChatJson>(clean)?.reply === 'Use SQS for decoupling')

// 2. Wrapped in code fences with surrounding newlines
const fenced = '```json\n{"reply":"Aurora is managed","youtubeQuery":"Aurora","docsSearchPhrase":"Aurora"}\n```'
check('code-fenced JSON', parseAIJson<ChatJson>(fenced)?.reply === 'Aurora is managed')

// 3. Prose BEFORE the JSON (common with free models)
const prefixed = 'Sure! Here is the JSON:\n{"reply":"S3 CRR copies objects","youtubeQuery":"S3 CRR","docsSearchPhrase":"S3 replication"}'
check('prose before JSON', parseAIJson<ChatJson>(prefixed)?.reply === 'S3 CRR copies objects')

// 4. Prose AFTER the JSON
const suffixed = '{"reply":"Placement groups cluster EC2","youtubeQuery":"EC2 PG","docsSearchPhrase":"placement groups"}\n\nHope that helps!'
check('prose after JSON', parseAIJson<ChatJson>(suffixed)?.reply === 'Placement groups cluster EC2')

// 5. Truncated JSON (hit token limit mid-string) — must still salvage reply
const truncated = '{"reply":"VPC peering connects two VPCs privately without going over the public internet, and it is not transiti'
const t = parseAIJson<ChatJson>(truncated)
check('truncated JSON parses', t?.reply?.startsWith('VPC peering connects two VPCs') ?? false, t?.reply?.slice(0, 30))

// 6. salvageText guard: even on unparseable blob, never return the braces
const salvaged = salvageText(truncated, 'reply')
check('salvageText recovers reply', salvaged?.startsWith('VPC peering connects') ?? false)

// 7. Plain prose (no JSON at all) — parser returns null, salvage returns null,
//    so the route correctly shows the prose as-is.
check('plain prose → null', parseAIJson<ChatJson>('Just a normal answer.') === null)
check('plain prose → no salvage', salvageText('Just a normal answer.', 'reply') === null)

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILED`}`)
process.exit(failures === 0 ? 0 : 1)
