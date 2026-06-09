/**
 * Generate D1 seed SQL from data/labs.ts
 *
 * Usage:
 *   bun run scripts/seed-labs.ts
 *   bunx wrangler d1 execute aws-saa-questions --local --file=scripts/labs-seed.sql
 *   bunx wrangler d1 execute aws-saa-questions --remote --file=scripts/labs-seed.sql
 */

import { writeFileSync } from 'fs'
import { labs } from '../data/labs'
import { labToInsertSql } from '../lib/labs'

const rows = labs.map((lab) => labToInsertSql(lab))
const sql = rows.join('\n')

writeFileSync('scripts/labs-seed.sql', sql + '\n')
console.log(`Generated ${rows.length} lab rows → scripts/labs-seed.sql`)
