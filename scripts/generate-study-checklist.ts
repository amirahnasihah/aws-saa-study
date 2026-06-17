import { readFileSync, writeFileSync } from "fs";

type CourseItem = {
  order_by: number;
  video_name?: string | null;
  lab_name?: string | null;
  quiz_name?: string | null;
  reading_material_name?: string | null;
  description?: string | null;
  s3_link?: string | null;
  activity_id?: number | null;
  questions_count?: number | null;
  time_hour?: number | null;
  time_minute?: number | null;
  time_second?: number | null;
  duration_hour?: number | null;
  duration_minutes?: number | null;
  section_heading?: string | null;
};

type OutlineItem = {
  type: "lecture" | "lab" | "quiz" | "reading";
  name: string;
  duration: string | null;
  questions: number | null;
};

type SectionMeta = {
  num: number;
  priority: string;
  done: boolean;
};

const courseData = JSON.parse(
  readFileSync("/tmp/whizlabs-course.json", "utf8"),
) as { data: CourseItem[] };
const items = courseData.data;
const existingChecklist = readFileSync("STUDY-CHECKLIST.md", "utf8");

const headers = items.filter(
  (item) =>
    item.section_heading &&
    !item.video_name &&
    !item.lab_name &&
    !item.quiz_name &&
    !item.reading_material_name &&
    item.section_heading !== "Hands-on Labs",
);

const sectionMeta: Record<string, SectionMeta> = {
  Introduction: { num: 1, priority: "", done: true },
  "Getting Started With AWS": { num: 2, priority: "", done: true },
  Compute: { num: 3, priority: "", done: true },
  Storage: { num: 4, priority: "", done: true },
  "Securtity, Identity and Compliance": {
    num: 5,
    priority: "🔴 Domain 1 (30%)",
    done: false,
  },
  Database: { num: 6, priority: "🟠 Domains 2 & 3", done: false },
  "Machine Learning": {
    num: 7,
    priority: "🟢 know-what-it-does",
    done: false,
  },
  "Management and Governance": { num: 8, priority: "🟡", done: false },
  "Networking & Content Delivery": {
    num: 9,
    priority: "🔴 heavily tested",
    done: false,
  },
  Analytics: { num: 10, priority: "🟢/🟡", done: false },
  "Application Integration": {
    num: 11,
    priority: "🟠 SQS/SNS tested",
    done: false,
  },
  Containers: { num: 12, priority: "🟡", done: false },
  "Migration & Transfer": { num: 13, priority: "🟢", done: false },
  "AWS Cost Management": {
    num: 14,
    priority: "🟠 Domain 4 (20%)",
    done: false,
  },
};

const notesBySection: Partial<Record<number, string>> = {
  9: "> Biggest section and very high yield. Do this thoroughly even if it means skimming §7/§10/§13.\n\n",
  8: "> Long section. Prioritize the conceptual lectures; the demos are skimmable at 1.5×.\n\n",
  10: "> Skim EMR/QuickSight/OpenSearch; focus the comparisons below.\n\n",
  7: "> Exam tests these shallowly: match the service to the use case.\n\n",
};

const formatLectureDuration = (item: CourseItem): string | null => {
  const parts: string[] = [];
  if (item.time_hour) parts.push(`${item.time_hour}h`);
  if (item.time_minute) parts.push(`${item.time_minute}m`);
  if (item.time_second) parts.push(`${item.time_second}s`);
  const value = parts.join(" ").replace(/^0h /, "");
  return value || null;
};

const formatLabDuration = (item: CourseItem): string | null => {
  const parts: string[] = [];
  if (item.duration_hour) parts.push(`${item.duration_hour}h`);
  if (item.duration_minutes) parts.push(`${item.duration_minutes}m`);
  const value = parts.join(" ").replace(/^0h /, "");
  return value || null;
};

const toOutlineItem = (item: CourseItem): OutlineItem | null => {
  if (item.lab_name) {
    return {
      type: "lab",
      name: item.lab_name,
      duration: formatLabDuration(item),
      questions: null,
    };
  }
  if (item.video_name) {
    return {
      type: "lecture",
      name: item.video_name,
      duration: formatLectureDuration(item),
      questions: null,
    };
  }
  if (item.quiz_name) {
    return {
      type: "quiz",
      name: item.quiz_name,
      duration: null,
      questions: item.questions_count ?? null,
    };
  }
  if (item.reading_material_name || (item.s3_link && item.description)) {
    return {
      type: "reading",
      name: item.reading_material_name ?? item.description ?? "Reading material",
      duration: null,
      questions: null,
    };
  }
  return null;
};

const sections = headers.map((header, index) => {
  const start = header.order_by;
  const end = headers[index + 1]?.order_by ?? 9999;
  const outlineItems = items
    .filter(
      (item) =>
        (item.video_name ||
          item.lab_name ||
          item.quiz_name ||
          item.reading_material_name ||
          (item.s3_link && item.description)) &&
        item.order_by >= start &&
        item.order_by < end,
    )
    .sort((a, b) => a.order_by - b.order_by)
    .map(toOutlineItem)
    .filter((item): item is OutlineItem => item !== null);

  const meta = sectionMeta[header.section_heading ?? ""] ?? {
    num: index + 1,
    priority: "",
    done: false,
  };

  return {
    heading: header.section_heading ?? "",
    items: outlineItems,
    ...meta,
  };
});

const extractMustAnswer = (sectionNum: number): string | null => {
  const pattern = new RegExp(
    `## ${sectionNum}\\. [\\s\\S]*?### Must be able to answer\\n([\\s\\S]*?)\\n\\n(?:###|---)`,
    "m",
  );
  const match = existingChecklist.match(pattern);
  return match ? match[1].trim() : null;
};

const checkbox = (checked: boolean, label: string): string =>
  `- [${checked ? "x" : " "}] ${label}`;

const sectionStats = (section: (typeof sections)[number]): string => {
  const lectures = section.items.filter((item) => item.type === "lecture").length;
  const labs = section.items.filter((item) => item.type === "lab").length;
  const readings = section.items.filter((item) => item.type === "reading").length;
  const parts: string[] = [];
  if (lectures) parts.push(`${lectures} lectures`);
  if (labs) parts.push(`${labs} labs`);
  if (readings) parts.push(`${readings} reading`);
  return parts.join(" · ");
};

const formatTitle = (heading: string): string =>
  heading.replace("Securtity", "Security");

const renderOutlineItem = (
  item: OutlineItem,
  checked: boolean,
  quizSuffix: string,
): string => {
  const duration = item.duration ? ` (${item.duration})` : "";
  if (item.type === "lecture") return checkbox(checked, `${item.name}${duration}`);
  if (item.type === "lab")
    return checkbox(checked, `🧪 ${item.name}${duration}`);
  if (item.type === "quiz") {
    const count = item.questions ? ` (${item.questions}Q)` : "";
    return checkbox(checked, `${item.name}${count}${quizSuffix}`);
  }
  return checkbox(checked, `📄 ${item.name}`);
};

let output = `# AWS SAA-C03 — Study Checklist

**Exam target:** ~2026-06-28 · **Started checklist:** 2026-06-14
**Source:** [Whizlabs Video Course](https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/oc) · 199 videos · 22 labs · 14 section quizzes

✅ **Done:** §1 Introduction · §2 Getting Started · §3 Compute · §4 Storage
🎯 **Remaining:** §5–§14 below (+ practice exams at the end)

### How to use this
Tick items in **Course outline** as you complete each lecture, lab, or quiz on Whizlabs. The **Must be able to answer** items (§5–§14) are the real exam test — if you can't answer one out loud without notes, rewatch. Don't move on until that section's quiz is ≥80%.

### Exam domain weights (what to protect if time runs short)
| Domain | Weight | Where it lives below |
|--------|--------|----------------------|
| 1 · Design Secure Architectures | **30%** | §5, IAM/KMS everywhere |
| 2 · Design Resilient Architectures | **26%** | §6 DB, §9 Networking, Multi-AZ |
| 3 · Design High-Performing Architectures | **24%** | §6, §9, §10, caching/scaling |
| 4 · Design Cost-Optimized Architectures | **20%** | §14, purchasing options |

Priority legend: 🔴 master fully · 🟠 important · 🟡 moderate · 🟢 know-what-it-does

---

`;

sections
  .filter((section) => section.done)
  .forEach((section) => {
    const stats = sectionStats(section);
    output += `## ${section.num}. ${formatTitle(section.heading)} — ✅ done${stats ? ` · ${stats}` : ""}\n\n`;
    output += `### Course outline\n`;
    section.items.forEach((item) => {
      output += `${renderOutlineItem(item, true, " — ≥80%")}\n`;
    });
    output += "\n---\n\n";
  });

sections
  .filter((section) => !section.done)
  .forEach((section) => {
    const stats = sectionStats(section);
    const priority = section.priority ? ` — ${section.priority}` : "";
    output += notesBySection[section.num] ?? "";
    output += `## ${section.num}. ${formatTitle(section.heading)}${priority}${stats ? ` · ${stats}` : ""}\n\n`;
    output += `### Course outline\n`;
    output += `_Whizlabs order — labs appear where the platform places them._\n\n`;
    section.items.forEach((item) => {
      output += `${renderOutlineItem(item, false, " — target ≥80%")}\n`;
    });

    const mustAnswer = extractMustAnswer(section.num);
    if (mustAnswer) {
      output += `\n### Must be able to answer\n${mustAnswer}\n`;
    }

    output += "\n---\n\n";
  });

output += `## Final exam-readiness (last 3–4 days — separate from this course)

> This course has **no practice exams**. Use your own ~493-question bank here.

- [ ] Practice Exam #1 (timed, 65Q / 130min) → review every wrong + flagged answer
- [ ] Practice Exam #2 → re-watch weakest-domain lectures
- [ ] Practice Exam #3 → drill recurring miss patterns (RDS vs Aurora · gateway vs interface endpoint · SG vs NACL · S3 storage classes)
- [ ] Practice Exam #4 → **scoring ≥80% on fresh questions = ready**
- [ ] Final review: skim glossary + flagged terms only. Nothing new the night before.
- [ ] 🎯 Exam day — light AM glance at cheat sheet, sleep well, arrive early.
`;

writeFileSync("STUDY-CHECKLIST.md", output);
console.log(`Wrote STUDY-CHECKLIST.md (${output.split("\n").length} lines)`);
