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

**The 6 ingredients of a good card:**

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

**Also:** whenever a card introduces a term, acronym, or internal component the learner won't know (HDFS, SPICE, shard, UltraWarn, DPU, partition pruning…), add it to `data/glossary.ts` — both the `glossaryCategories` list and a one-line `glossary` definition. Keep definitions plain-language and exam-focused.

**Language:** content is Malay-English mix (matching the user's study voice); AWS service names, technical terms, and code stay English. Verify facts against AWS docs (use the `aws-documentation` MCP) before asserting them. Run `npx tsc --noEmit` after edits.

**Reducing gaps across pages:** the same recipe applies to `/scenarios`, `/visual` architectures, and the glossary. When you enrich one service, check its siblings in the same section for the same depth, and surface (don't silently skip) any card left thin.
