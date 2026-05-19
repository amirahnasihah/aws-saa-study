import { practiceQuestions } from '../data/practiceQuestions'
import { writeFileSync } from 'fs'

const escape = (s: string) => s.replace(/'/g, "''")

const rows = practiceQuestions.map((q) => {
  const options = escape(JSON.stringify(q.options))
  const explanation = escape(JSON.stringify(q.explanation))
  const keywords = escape(JSON.stringify(q.keywords))
  const reference = q.reference ? `'${escape(q.reference)}'` : 'NULL'
  const source = q.source ?? 'custom'

  return `INSERT OR IGNORE INTO questions (id, domain, domain_label, difficulty, scenario, options, correct_id, explanation, reference, keywords, source) VALUES ('${escape(q.id)}', '${q.domain}', '${escape(q.domainLabel)}', '${q.difficulty}', '${escape(q.scenario)}', '${options}', '${escape(q.correctId)}', '${explanation}', ${reference}, '${keywords}', '${source}');`
})

const sql = rows.join('\n')
writeFileSync('scripts/seed.sql', sql)
console.log(`Generated ${rows.length} INSERT statements → scripts/seed.sql`)
