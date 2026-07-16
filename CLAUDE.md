# Project guidelines

When working in this repository, follow these standards:

## TypeScript

- Use `unknown` instead of `any` for type safety
- Prefer type-driven design—let types guide the implementation
- Avoid `switch` statements; use pattern matching or object maps instead

## Control flow

- Minimize `for` loops; prefer `map`, `filter`, `reduce`, `forEach`, or recursion where appropriate

## General

- Follow existing code patterns in the codebase
- Keep changes minimal and focused
- Ensure no sensitive information, typos, or debugging code in commits

## Mobile inputs

- Any `<input>`/`<textarea>` must render at ≥16px on mobile — iOS Safari auto-zooms the viewport on focus when the computed font-size is below that. Use the `text-base sm:text-[<desktop-size>]` pattern (e.g. `text-base sm:text-[0.8rem]`) so the field is 16px on small screens and keeps the smaller mono aesthetic from `sm:`/`md:` up.

## Deep Notes content standard (study material)

This repo is a SAA-C03 study app. When enriching a Deep Notes card (`data/awsServices.ts`), a scenario (`data/scenarios.ts`), or any learning content, ALWAYS aim for the full recipe below — don't just write a paragraph. The goal is recall under exam pressure, not reference docs. Apply every ingredient that genuinely fits the service (skip one only when it adds nothing, and say why).

**The ingredients of a good card:**

1. **Anatomy / breakdown** — split the service into its parts and say what each does. In `ServiceCard` use `detailsLabel` + `storageDetails` (one component per line) and/or a `diagram` (`steps[]`) showing the internal pieces. Example: Redshift → Cluster → Leader/Compute nodes → slices → managed storage.
2. **Comparison table(s)** — `compare: [...]` with `{ label, headers, rows, takeaway }`. At least one table that pits the service against the 2–3 services it's confused with on the exam (e.g. Athena vs Redshift Spectrum vs Redshift), and a `takeaway` line that states the discriminator + exam keyword mapping.
3. **Diagram** — a `mermaid` spec (`MermaidSpec | MermaidSpec[]` — use an array for multiple). Flowchart for flow/anatomy, decision tree for "which one do I pick". Match the existing style: quoted node labels, `<br/>`, emoji, a `caption` that ends with the exam takeaway. (Hand-drawn / roughjs style is fine where the renderer supports it.)
4. **Cara mudah ingat (memory aids)** — use one or more deliberately:
   - **Akronim / mnemonic** → the `ingat` field (e.g. EMR = "Energetik Mandor Ramai-pekerja").
   - **Kaitkan dengan familiar** → a real-world analogy as a Mermaid flowchart (e.g. EMR = Kilang Kerupuk Lekor, ETL = buat Jus Mangga, Grab/Shopee/Netflix analogies). This is the highest-recall ingredient — prefer a local/Malaysian analogy.
   - **Mind map** → the anatomy diagram doubles as one.
   - **Teach-it-back** → phrase the `caption`/`takeaway` as if explaining to a friend ("INGAT exam: …").
5. **Exam triggers + traps** — `scenario` (keyword → service mapping, "X → service A, BUKAN service B") and `tips` (the gotchas, the "jangan keliru" pairs). State the discriminating keyword the exam uses.
6. **Sources + searchability** — `docs[]` (official AWS doc links, fact-check claims against them), and a rich `keywords[]` so the AI hint/explain routes and internal-link finder can match the card.
7. **Pricing** — include real AWS pricing in `tips[]` (prefixed with `PRICING:` for searchability). State the unit (per GB-month, per hour, per request, per 1K events…), the free tier if any, and the exam-relevant cost discriminator (e.g. "cheapest EBS = sc1 $0.015/GB", "ALB = $0.0225/hr + $0.008/LCU-hr"). Verify pricing against AWS pricing pages or docs. Add a `pricing` keyword to `keywords[]`. Exam loves cost-optimization questions — knowing approximate numbers helps pick the cheapest/most expensive option.

**Recall scaffold (the "buku sifir" layer — apply to EVERY card, not just database):** the ingredients above build the reference; these make it stick. The card type already has homes for most of them — fill them, don't skip:

8. **Maksud mudah + sebab apa wujud (plain meaning + the WHY)** — the `fungsi` field ("Apa Dia") must open in dead-simple Manglish: what is this thing if you explain it to a friend who's never seen AWS. Then the `sebabApa` field answers **why it exists / what pain it removes** (e.g. "RDS Proxy wujud sebab Lambda buka beribu connection → RDS pengsan; proxy pool connection supaya RDS tak kena banjir"). WHY beats WHAT for recall — a learner who knows the problem remembers the fix.
9. **Bila guna (when) + exam keywords** — already covered: `gunaUntuk` renders as "Guna Bila" (the trigger), and `keywords[]` + the `scenario` field carry the exam keyword→service mapping. Make the keyword list rich so the AI hint/explain + internal-link finder match the card. State the discriminating keyword the exam uses ("survive AZ outage" → Multi-AZ, "reporting slow down prod" → Read Replica).
10. **Quick sifir (cheat-sheet to memorize)** — `sifir: string[]`. 3–6 crisp one-line facts a learner can rote-memorize and recite the morning of the exam. Each line = a hard discriminator or number ("Multi-AZ = HA, BUKAN scaling", "Aurora = 6 copies / 3 AZ", "DAX = microsecond, DynamoDB sendiri = millisecond", "GSI = bila-bila masa + own capacity; LSI = creation time je + max 5"). Tight, no prose. Think times-table.
11. **Contoh perangkap soalan (trap questions)** — `perangkap: TrapQuestion[]` with `{ soalan, umpan, betul }`. Write 1–3 questions phrased like the real SAA-C03: `soalan` = the baited stem; `umpan` = the answer that *looks* right + why the exam baits it (proper Bahasa Melayu "umpan" = bait, NOT the Indonesian "jebakan"); `betul` = the correct pick + the keyword that gives it away. This is the highest-value exam-prep ingredient — it rehearses the misdirection the exam actually uses (e.g. "cache untuk RDS → DAX?" umpan: DAX nampak macam cache DB; betul: ElastiCache, sebab DAX cakap DynamoDB API je).

**Voice:** write all of the above in the user's Manglish study voice (casual Malay-English mix) — `sebabApa`, `sifir`, `perangkap` especially. Keep AWS service names, technical terms, units, and code in English. Don't over-Malay-ify technical wording (the user has complained "jangan melayu sgt, susah nak agak dalam English") — keep the English keyword visible so it maps to the exam.

**Pricing reference (us-east-1, approximate — verify before asserting):**

| Service | Free tier | Key price points |
|---|---|---|
| EC2 On-Demand | No | Per-second (Linux, min 60s), per-hour (Windows). t3.medium ~$0.0416/hr |
| EC2 Reserved | No | Up to 72% off (3yr All Upfront Standard RI) |
| EC2 Spot | No | Up to 90% off. 2-min interruption notice |
| EC2 Dedicated Instance | No | +$2/hr region surcharge |
| EC2 Dedicated Host | No | Per-host billing (~$3.20/hr for t3 host) |
| Lambda | 1M req + 400K GB-s/mo forever | $0.20/1M req + $0.00001667/GB-s. Provisioned Concurrency extra |
| ALB | No | $0.0225/hr + $0.008/LCU-hr |
| NLB | No | $0.0225/hr + $0.006/NLCU-hr |
| GWLB | No | $0.0135/hr + $0.0035/GWLCU-hr |
| CLB (legacy) | No | $0.025/hr + $0.008/GB processed |
| ASG | Free | Pay for EC2 instances launched only |
| S3 Standard | No | $0.023/GB-mo. PUT $0.005/1K, GET $0.0004/1K |
| S3 Standard-IA | No | $0.0125/GB-mo + retrieval fee. Min 30 days |
| S3 One Zone-IA | No | $0.01/GB-mo (20% cheaper than Standard-IA) |
| S3 Intelligent-Tiering | No | $0.023/GB-mo + $0.0025/GB monitoring fee |
| Glacier Instant Retrieval | No | $0.004/GB-mo. ms retrieval, no restore. Min 90 days |
| Glacier Flexible Retrieval | No | $0.0036/GB-mo. Restore 1min-12hr. Min 90 days |
| Glacier Deep Archive | No | $0.00099/GB-mo. Restore 12-48hr. Min 180 days |
| EBS gp3 | No | $0.08/GB-mo (includes 3K IOPS + 125 MB/s) |
| EBS io2 | No | $0.125/GB-mo + $0.065/provisioned-IOPS-mo |
| EBS st1 | No | $0.045/GB-mo |
| EBS sc1 | No | $0.015/GB-mo (cheapest EBS) |
| EBS snapshots | No | $0.05/GB-mo (incremental, stored in S3) |
| EFS Standard | No | $0.30/GB-mo (multi-AZ) |
| EFS One Zone | No | $0.16/GB-mo (single AZ) |
| EFS IA | No | $0.016/GB-mo + retrieval fee |
| CloudWatch | 10 metrics, 10 alarms, 5GB logs, 3 dashboards/mo | Detailed monitoring $0.015/inst/hr. Custom metrics $0.30/1K/mo. Alarms $0.10/alarm/mo. Logs $0.50/GB ingested |
| CloudTrail | First copy of mgmt events FREE | Data events $0.10/100K events. Lake $0.75/GB ingested |
| AWS Config | No | $0.003/config item. $0.001/rule evaluation |
| CloudFormation | FREE | Pay only for resources created. No charge for stacks, templates, StackSets |
| Systems Manager | 2K activations, 1K instances free | Standard params free (10K). Advanced $0.05/param/mo. Session Manager free |
| Trusted Advisor | 7 core checks (Basic/Developer) | Full checks need Business ($100+/mo) or Enterprise support |
| Compute Optimizer | FREE | Uses CloudWatch metrics (pay for CW if custom) |
| Organizations | FREE | Consolidated billing + volume discounts at no charge |
| Health Dashboard | Service Health: free. Account: free | API access needs Business/Enterprise support |

**Also:** whenever a card introduces a term, acronym, or internal component the learner won't know (HDFS, SPICE, shard, UltraWarn, DPU, partition pruning…), add it to `data/glossary.ts` — both the `glossaryCategories` list and a one-line `glossary` definition. Keep definitions plain-language and exam-focused.

**Language:** content is Malay-English mix (matching the user's study voice); AWS service names, technical terms, and code stay English. Verify facts against AWS docs (use the `aws-documentation` MCP) before asserting them. Run `npx tsc --noEmit` after edits.

**Reducing gaps across pages:** the same recipe applies to `/scenarios`, `/visual` architectures, and the glossary. When you enrich one service, check its siblings in the same section for the same depth, and surface (don't silently skip) any card left thin.
