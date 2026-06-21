'use client'

import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import KeywordHighlightedText from '@/components/practice/KeywordHighlightedText'
import PracticeQuestionHint from '@/components/practice/PracticeQuestionHint'
import { practiceQuestions, PracticeQuestion } from '@/data/practiceQuestions'
import { PRACTICE_SESSION_KEY, readSessionJson, writeSessionJson } from '@/lib/ai/session-persist'

const domainColors: Record<string, string> = {
  d1: 'text-c3',
  d2: 'text-c2',
  d3: 'text-c1',
  d4: 'text-c6',
}

const difficultyColors: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/30',
}

type QuizState = 'question' | 'revealed'
type PageMode = 'quiz' | 'review'
type AnswerRecord = { selected: string }

type FilterSource = 'all' | 'core' | 'others'
type FilterDomain = 'all' | 'd1' | 'd2' | 'd3' | 'd4'
type FilterDifficulty = 'all' | 'Easy' | 'Medium' | 'Hard'
type FilterSet = 'all' | 'pt' | 'section' | 'final'

interface FilterState {
  source: FilterSource
  domain: FilterDomain
  difficulty: FilterDifficulty
  set: FilterSet
  shuffle: boolean
}

const DEFAULT_FILTERS: FilterState = { source: 'all', domain: 'all', difficulty: 'all', set: 'all', shuffle: false }

interface PracticeSessionState {
  filters: FilterState
  mode: PageMode
  currentIndex: number
  reviewIndex: number
  selected: string | null
  quizState: QuizState
  score: { correct: number; total: number }
  finished: boolean
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function useQuestionHintHighlight(questionId: string) {
  const [highlight, setHighlight] = useState<string[]>([])
  const [prevId, setPrevId] = useState(questionId)
  if (questionId !== prevId) {
    setPrevId(questionId)
    setHighlight([])
  }
  return [highlight, setHighlight] as const
}

export default function PracticePage() {
  // Read any persisted session state synchronously on first render — before
  // any effect can overwrite sessionStorage with the freshly-initialized defaults.
  const persistedRef = useRef<Partial<PracticeSessionState> | null>(null)
  if (persistedRef.current === null) {
    persistedRef.current = readSessionJson<Partial<PracticeSessionState>>(PRACTICE_SESSION_KEY, {})
  }
  // True once the persisted state (if any) has been applied to the state setters below.
  const hasRestoredRef = useRef(false)
  // True while the questions fetch should restore position/answer state instead of resetting it.
  const skipNextResetRef = useRef(false)

  const [questions, setQuestions] = useState<PracticeQuestion[]>(practiceQuestions)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [mode, setMode] = useState<PageMode>('quiz')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [quizState, setQuizState] = useState<QuizState>('question')
  const [answers, setAnswers] = useState<Record<number, AnswerRecord>>({})
  const [finished, setFinished] = useState(false)

  const score = Object.entries(answers).reduce(
    (acc, [idx, ans]) => {
      const question = questions[Number(idx)]
      if (!question) return acc
      return {
        total: acc.total + 1,
        correct: acc.correct + (ans.selected === question.correctId ? 1 : 0),
      }
    },
    { correct: 0, total: 0 },
  )

  // Persist session state on every change.
  useEffect(() => {
    writeSessionJson(PRACTICE_SESSION_KEY, {
      filters, mode, currentIndex, reviewIndex, selected, quizState, score, finished,
    } satisfies PracticeSessionState)
  }, [filters, mode, currentIndex, reviewIndex, selected, quizState, score, finished])

  const goToQuestion = useCallback((index: number, answerMap: Record<number, AnswerRecord>) => {
    const clamped = Math.min(Math.max(index, 0), Math.max(questions.length - 1, 0))
    const saved = answerMap[clamped]
    setCurrentIndex(clamped)
    setSelected(saved?.selected ?? null)
    setQuizState(saved ? 'revealed' : 'question')
    setFinished(false)
  }, [questions.length])

  useEffect(() => {
    // Apply persisted session state once, on the very first effect run. This re-triggers
    // the effect with the restored filters instead of fetching with the SSR-safe defaults.
    if (!hasRestoredRef.current) {
      hasRestoredRef.current = true
      const p = persistedRef.current
      if (p?.filters) {
        setFilters(p.filters)
        setMode(p.mode ?? 'quiz')
        setReviewIndex(p.reviewIndex ?? 0)
        setCurrentIndex(p.currentIndex ?? 0)
        setSelected(p.selected ?? null)
        setQuizState(p.quizState ?? 'question')
        setFinished(p.finished ?? false)
        skipNextResetRef.current = true
        return
      }
    }

    const params = new URLSearchParams()
    if (filters.source !== 'all') params.set('source', filters.source)
    if (filters.domain !== 'all') params.set('domain', filters.domain)
    if (filters.difficulty !== 'all') params.set('difficulty', filters.difficulty)
    if (filters.set !== 'all') params.set('set', filters.set)
    const url = `/api/questions${params.toString() ? '?' + params.toString() : ''}`

    fetch(url)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          const qs = data as PracticeQuestion[]
          setQuestions(filters.shuffle ? shuffleArray(qs) : qs)
          return qs
        }
        return null
      })
      .catch(() => {
        let qs = [...practiceQuestions]
        if (filters.source !== 'all') qs = qs.filter((q) => q.source === filters.source)
        if (filters.domain !== 'all') qs = qs.filter((q) => q.domain === filters.domain)
        if (filters.difficulty !== 'all') qs = qs.filter((q) => q.difficulty === filters.difficulty)
        if (filters.set === 'pt')      qs = qs.filter((q) => /^wz\d/.test(q.id))
        if (filters.set === 'section') qs = qs.filter((q) => q.id.startsWith('wzs'))
        if (filters.set === 'final')   qs = qs.filter((q) => q.id.startsWith('wzf'))
        const finalQs = qs.length ? qs : practiceQuestions
        setQuestions(filters.shuffle ? shuffleArray(finalQs) : finalQs)
        return finalQs
      })
      .then((qs) => {
        if (skipNextResetRef.current) {
          // Restoring a session: keep the persisted position/answer state, just clamp it to bounds.
          skipNextResetRef.current = false
          const total = qs?.length ?? practiceQuestions.length
          setCurrentIndex((i) => Math.min(Math.max(i, 0), Math.max(total - 1, 0)))
        } else {
          setCurrentIndex(0)
          setSelected(null)
          setQuizState('question')
          setAnswers({})
          setFinished(false)
        }
      })
  }, [filters])

  const q = questions[Math.min(currentIndex, questions.length - 1)]
  const isCorrect = selected === q.correctId

  const handleSelect = useCallback((id: string) => {
    if (quizState === 'revealed') return
    setAnswers((prev) => ({ ...prev, [currentIndex]: { selected: id } }))
    setSelected(id)
    setQuizState('revealed')
  }, [quizState, currentIndex])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true)
      return
    }
    goToQuestion(currentIndex + 1, answers)
  }, [currentIndex, questions.length, answers, goToQuestion])

  const handlePrev = useCallback(() => {
    goToQuestion(currentIndex - 1, answers)
  }, [currentIndex, answers, goToQuestion])

  const handleJump = useCallback((i: number) => {
    goToQuestion(i, answers)
  }, [answers, goToQuestion])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setSelected(null)
    setQuizState('question')
    setAnswers({})
    setFinished(false)
  }, [])

  const handleModeSwitch = useCallback((next: PageMode) => {
    setMode(next)
    handleRestart()
  }, [handleRestart])

  return (
    <>
      <Nav activePage="practice" />
      <main className="mx-auto max-w-[1280px] px-4 pt-[calc(3.5rem+1.5rem)] pb-28">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-space-mono text-2xl font-bold text-aws-text mb-1">Practice Questions</h1>
            <p className="text-aws-muted text-sm">AWS SAA-C03 · MCQ · Scenario-based · With full explanations</p>
          </div>

          {/* mode toggle */}
          <div className="flex shrink-0 items-center gap-1 bg-white/4 border border-aws-border rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('quiz')}
              className={`font-space-mono text-[0.65rem] font-bold px-3 py-1.5 rounded-md transition-all duration-150 ${
                mode === 'quiz'
                  ? 'bg-c1/20 border border-c1/40 text-c1'
                  : 'text-aws-muted hover:text-aws-text'
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => handleModeSwitch('review')}
              className={`font-space-mono text-[0.65rem] font-bold px-3 py-1.5 rounded-md transition-all duration-150 ${
                mode === 'review'
                  ? 'bg-c1/20 border border-c1/40 text-c1'
                  : 'text-aws-muted hover:text-aws-text'
              }`}
            >
              Review
            </button>
          </div>
        </div>

        <FilterBar filters={filters} onChange={setFilters} />

        {mode === 'review' ? (
          <ReviewMode
            questions={questions}
            index={reviewIndex}
            onIndexChange={setReviewIndex}
          />
        ) : finished ? (
          <FinishedScreen score={score} onRestart={handleRestart} />
        ) : (
          <QuestionCard
            q={q}
            index={currentIndex}
            total={questions.length}
            selected={selected}
            quizState={quizState}
            isCorrect={isCorrect}
            score={score}
            answers={answers}
            onSelect={handleSelect}
            onNext={handleNext}
            onPrev={handlePrev}
            onJump={handleJump}
          />
        )}

        <SiteFooter tagline="AWS SAA-C03 · Practice Questions · Good luck! 💪" />
      </main>
    </>
  )
}

const SET_LABELS: Record<FilterSet, string> = {
  all:     'All',
  pt:      'Practice Tests',
  section: 'Section Tests',
  final:   'Final Test',
}

function FilterBar({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) {
  const activeCount =
    (filters.source !== 'all' ? 1 : 0) +
    (filters.domain !== 'all' ? 1 : 0) +
    (filters.difficulty !== 'all' ? 1 : 0) +
    (filters.set !== 'all' ? 1 : 0) +
    (filters.shuffle ? 1 : 0)

  const pill = (active: boolean) =>
    `font-space-mono text-[0.62rem] font-bold px-2.5 py-1 rounded-lg border transition-all duration-150 ${
      active ? 'bg-c1/20 border-c1/40 text-c1' : 'bg-white/3 border-aws-border/50 text-aws-muted hover:text-aws-text hover:bg-white/6'
    }`

  return (
    <div className="mb-6 bg-aws-card border border-aws-border rounded-xl p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted">Filters</span>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <span className="font-space-mono text-[0.6rem] text-c1">{activeCount} active</span>
          )}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange(DEFAULT_FILTERS)}
              className="font-space-mono text-[0.6rem] text-aws-muted hover:text-red-400 transition-colors"
            >
              reset
            </button>
          )}
        </div>
      </div>

      {/* By Set */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-space-mono text-[0.58rem] text-aws-muted w-14 shrink-0">By Set</span>
        {(['all', 'pt', 'section', 'final'] as FilterSet[]).map((s) => (
          <button key={s} type="button" onClick={() => onChange({ ...filters, set: s })} className={pill(filters.set === s)}>
            {SET_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Source */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-space-mono text-[0.58rem] text-aws-muted w-14 shrink-0">Source</span>
        {(['all', 'core', 'others'] as FilterSource[]).map((s) => (
          <button key={s} type="button" onClick={() => onChange({ ...filters, source: s })} className={pill(filters.source === s)}>
            {s === 'all' ? 'All' : s === 'core' ? 'Core' : 'Others'}
          </button>
        ))}
      </div>

      {/* Domain */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-space-mono text-[0.58rem] text-aws-muted w-14 shrink-0">Domain</span>
        {(['all', 'd1', 'd2', 'd3', 'd4'] as FilterDomain[]).map((d) => (
          <button key={d} type="button" onClick={() => onChange({ ...filters, domain: d })} className={pill(filters.domain === d)}>
            {d === 'all' ? 'All' : d === 'd1' ? 'D1 Secure' : d === 'd2' ? 'D2 Resilient' : d === 'd3' ? 'D3 Perform' : 'D4 Cost'}
          </button>
        ))}
      </div>

      {/* Difficulty */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-space-mono text-[0.58rem] text-aws-muted w-14 shrink-0">Level</span>
        {(['all', 'Easy', 'Medium', 'Hard'] as FilterDifficulty[]).map((d) => (
          <button key={d} type="button" onClick={() => onChange({ ...filters, difficulty: d })} className={pill(filters.difficulty === d)}>
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...filters, shuffle: !filters.shuffle })}
          className={`ml-2 ${pill(filters.shuffle)}`}
        >
          🔀 Shuffle
        </button>
      </div>
    </div>
  )
}

function QuestionNumberGrid({
  current,
  total,
  answeredIndices,
  onSelect,
  variant = 'modal',
}: {
  current: number
  total: number
  answeredIndices: Set<number>
  onSelect: (i: number) => void
  variant?: 'modal' | 'sidebar'
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (variant !== 'sidebar') return
    const active = scrollRef.current?.querySelector<HTMLElement>('[data-current="true"]')
    active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [current, variant])

  const cellClass = (i: number) => {
    const answered = answeredIndices.has(i)
    const isCurrent = i === current
    if (variant === 'sidebar') {
      return [
        'flex h-8 w-8 items-center justify-center rounded-full border font-space-mono text-[0.68rem] transition-all duration-150 shrink-0',
        isCurrent
          ? 'border-c1 bg-c1/15 text-c1 font-bold ring-2 ring-c1/30'
          : answered
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
            : 'border-aws-border/50 bg-white/3 text-aws-muted hover:border-aws-border hover:text-aws-text',
      ].join(' ')
    }
    return [
      'font-space-mono text-[0.65rem] py-1.5 rounded-lg border transition-all duration-150',
      isCurrent
        ? 'bg-c1/20 border-c1/40 text-c1 font-bold'
        : answered
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : 'bg-white/3 border-aws-border/40 text-aws-muted hover:bg-white/8 hover:text-aws-text',
    ].join(' ')
  }

  if (variant === 'sidebar') {
    return (
      <div
        ref={scrollRef}
        className="nav-scroll flex-1 min-h-0 overflow-y-auto pr-1 -mr-1"
      >
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Question ${i + 1}`}
              aria-current={i === current ? 'step' : undefined}
              data-current={i === current ? 'true' : undefined}
              className={cellClass(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="nav-scroll grid grid-cols-8 gap-1.5 max-h-[min(40vh,16rem)] overflow-y-auto pr-1">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={cellClass(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

function QuestionGrid({
  current,
  total,
  answeredIndices,
  onSelect,
  onClose,
}: {
  current: number
  total: number
  answeredIndices: Set<number>
  onSelect: (i: number) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-24 lg:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-aws-card border border-aws-border rounded-2xl p-4 w-full max-w-[1280px] shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="font-space-mono text-[0.65rem] text-aws-muted uppercase tracking-widest">
            Jump to question
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-space-mono text-xs text-aws-muted hover:text-aws-text transition-colors"
          >
            ✕
          </button>
        </div>
        <QuestionNumberGrid
          current={current}
          total={total}
          answeredIndices={answeredIndices}
          onSelect={(i) => { onSelect(i); onClose() }}
          variant="modal"
        />
      </div>
    </div>
  )
}

function QuestionProgressStrip({
  index,
  total,
  onOpenPicker,
  score,
  badge,
}: {
  index: number
  total: number
  onOpenPicker: () => void
  score?: { correct: number; total: number }
  badge?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-c1 to-c5 rounded-full transition-all duration-500"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
      <button
        type="button"
        onClick={onOpenPicker}
        className="font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text whitespace-nowrap transition-colors"
        title="Jump to question"
      >
        {index + 1} / {total}
      </button>
      {score ? (
        <span className="font-space-mono text-[0.65rem] text-emerald-400 whitespace-nowrap">
          {score.correct}/{score.total} correct
        </span>
      ) : null}
      {badge}
    </div>
  )
}

function FloatingQuizNav({
  index,
  total,
  onPrev,
  onNext,
  onOpenPicker,
  nextDisabled,
  nextLabel = 'Next →',
}: {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onOpenPicker: () => void
  nextDisabled: boolean
  nextLabel?: string
}) {
  return (
    <>
      <div className="h-28 md:h-24" />
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] md:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[1280px] px-4 z-50">
        <div className="flex gap-2 bg-aws-card/80 backdrop-blur-md border border-aws-border rounded-2xl p-2 shadow-xl">
          <button
            type="button"
            onClick={onPrev}
            disabled={index === 0}
            className="flex-1 py-2.5 rounded-xl font-space-mono text-sm font-bold border transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed bg-white/4 border-aws-border text-aws-muted hover:text-aws-text hover:bg-white/8"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={onOpenPicker}
            className="px-4 py-2.5 rounded-xl font-space-mono text-[0.65rem] font-bold border border-aws-border/50 text-aws-muted hover:text-aws-text hover:bg-white/6 transition-all duration-150 whitespace-nowrap"
            title="Jump to question"
          >
            {index + 1} / {total}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="flex-1 py-2.5 rounded-xl font-space-mono text-sm font-bold border transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed bg-c1/15 border-c1/40 text-c1 hover:bg-c1/25"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </>
  )
}

function ReviewMode({
  questions,
  index,
  onIndexChange,
}: {
  questions: PracticeQuestion[]
  index: number
  onIndexChange: (i: number) => void
}) {
  const [showPicker, setShowPicker] = useState(false)
  const total = questions.length
  const clampedIndex = Math.min(Math.max(index, 0), Math.max(total - 1, 0))
  const q = questions[clampedIndex]
  const [hintHighlight, setHintHighlight] = useQuestionHintHighlight(q.id)
  const isLast = clampedIndex + 1 >= total

  return (
    <div>
      <QuestionProgressStrip
        index={clampedIndex}
        total={total}
        onOpenPicker={() => setShowPicker(true)}
        badge={
          <span className="font-space-mono text-[0.62rem] uppercase tracking-widest px-2 py-0.5 rounded border border-c3/35 bg-c3/10 text-c3 whitespace-nowrap">
            Review
          </span>
        }
      />

      <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden mb-3">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-aws-border/60 bg-white/2 flex-wrap">
          <span className={`font-space-mono text-[0.6rem] font-bold uppercase tracking-widest ${domainColors[q.domain]}`}>
            {q.domainLabel}
          </span>
          <span className="text-aws-border">·</span>
          <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded-full border ${difficultyColors[q.difficulty]}`}>
            {q.difficulty}
          </span>
          <span className="text-aws-border">·</span>
          <span className="font-space-mono text-[0.58rem] text-emerald-400/90">Correct answer shown</span>
        </div>

        <div className="px-5 py-5">
          {q.screenshotUrl && (
            <figure className="mb-4 rounded-lg overflow-hidden border border-aws-border/60 bg-black/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.screenshotUrl}
                alt={q.screenshotCredit ? 'AWS architecture diagram illustrating the scenario' : `Question ${q.pageNumber ?? clampedIndex + 1} reference screenshot`}
                className="w-full h-auto"
                loading="lazy"
              />
              {q.screenshotCredit ? (
                <figcaption className="px-3 py-1.5 font-space-mono text-[0.58rem] text-aws-muted border-t border-aws-border/40">
                  Architecture diagram —{' '}
                  <a href={q.screenshotCredit} target="_blank" rel="noopener noreferrer" className="underline hover:text-aws-orange">
                    AWS Documentation
                  </a>
                </figcaption>
              ) : q.pageNumber ? (
                <figcaption className="px-3 py-1.5 font-space-mono text-[0.58rem] text-aws-muted border-t border-aws-border/40">
                  Practice test page {q.pageNumber}
                </figcaption>
              ) : null}
            </figure>
          )}
          {hintHighlight.length > 0 ? (
            <KeywordHighlightedText
              text={q.scenario}
              studyKeywords={hintHighlight}
              bankKeywords={q.keywords}
              className="text-[0.92rem] text-aws-text leading-relaxed"
            />
          ) : (
            <p className="text-[0.92rem] text-aws-text leading-relaxed">{q.scenario}</p>
          )}
        </div>

        <PracticeQuestionHint
          key={q.id}
          questionId={q.id}
          question={q.scenario}
          domainLabel={q.domainLabel}
          keywords={q.keywords}
          options={q.options}
          reviewMode
          onHintActive={(_active, terms) => setHintHighlight(terms)}
        />

        <div className="px-5 pb-5 space-y-2.5">
          {q.options.map((opt) => {
            const correct = opt.id === q.correctId
            return (
              <div
                key={opt.id}
                className={`w-full px-4 py-3 rounded-xl border text-[0.88rem] leading-snug ${
                  correct
                    ? 'bg-emerald-500/12 border-emerald-500/50 text-emerald-300 font-semibold'
                    : 'bg-white/2 border-aws-border/40 text-aws-muted'
                }`}
              >
                <span className="flex items-start gap-3">
                  <span className="font-space-mono text-[0.65rem] font-bold mt-0.5 shrink-0 opacity-60">
                    {opt.id.toUpperCase()}
                  </span>
                  <span>{opt.text}</span>
                  {correct && <span className="ml-auto shrink-0 text-emerald-400">✓</span>}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <ExplanationBlock q={q} selected={q.correctId} isCorrect={true} reviewMode={true} />

      <FloatingQuizNav
        index={clampedIndex}
        total={total}
        onPrev={() => onIndexChange(clampedIndex - 1)}
        onNext={() => onIndexChange(clampedIndex + 1)}
        onOpenPicker={() => setShowPicker(true)}
        nextDisabled={isLast}
      />

      {showPicker && (
        <QuestionGrid
          current={clampedIndex}
          total={total}
          answeredIndices={new Set()}
          onSelect={onIndexChange}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

function QuestionCard({
  q,
  index,
  total,
  selected,
  quizState,
  isCorrect,
  score,
  answers,
  onSelect,
  onNext,
  onPrev,
  onJump,
}: {
  q: PracticeQuestion
  index: number
  total: number
  selected: string | null
  quizState: QuizState
  isCorrect: boolean
  score: { correct: number; total: number }
  answers: Record<number, AnswerRecord>
  onSelect: (id: string) => void
  onNext: () => void
  onPrev: () => void
  onJump: (i: number) => void
}) {
  const [showPicker, setShowPicker] = useState(false)
  const [hintHighlight, setHintHighlight] = useQuestionHintHighlight(q.id)
  const answeredIndices = new Set(Object.keys(answers).map(Number))
  const isLast = index + 1 >= total

  return (
    <div>
      <QuestionProgressStrip
        index={index}
        total={total}
        score={score}
        onOpenPicker={() => setShowPicker(true)}
      />

      <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden mb-3">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-aws-border/60 bg-white/2 flex-wrap">
          <span className={`font-space-mono text-[0.6rem] font-bold uppercase tracking-widest ${domainColors[q.domain]}`}>
            {q.domainLabel}
          </span>
          <span className="text-aws-border">·</span>
          <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded-full border ${difficultyColors[q.difficulty]}`}>
            {q.difficulty}
          </span>
          <span className="text-aws-border">·</span>
          <span className="font-space-mono text-[0.58rem] text-aws-muted">Select one answer</span>
        </div>

        <div className="px-5 py-5">
          {q.screenshotUrl && (
            <figure className="mb-4 rounded-lg overflow-hidden border border-aws-border/60 bg-black/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.screenshotUrl}
                alt={q.screenshotCredit ? 'AWS architecture diagram illustrating the scenario' : `Question ${q.pageNumber ?? index + 1} reference screenshot`}
                className="w-full h-auto"
                loading="lazy"
              />
              {q.screenshotCredit ? (
                <figcaption className="px-3 py-1.5 font-space-mono text-[0.58rem] text-aws-muted border-t border-aws-border/40">
                  Architecture diagram —{' '}
                  <a href={q.screenshotCredit} target="_blank" rel="noopener noreferrer" className="underline hover:text-aws-orange">
                    AWS Documentation
                  </a>
                </figcaption>
              ) : q.pageNumber ? (
                <figcaption className="px-3 py-1.5 font-space-mono text-[0.58rem] text-aws-muted border-t border-aws-border/40">
                  Practice test page {q.pageNumber}
                </figcaption>
              ) : null}
            </figure>
          )}
          {hintHighlight.length > 0 ? (
            <KeywordHighlightedText
              text={q.scenario}
              studyKeywords={hintHighlight}
              bankKeywords={q.keywords}
              className="text-[0.92rem] text-aws-text leading-relaxed"
            />
          ) : (
            <p className="text-[0.92rem] text-aws-text leading-relaxed">{q.scenario}</p>
          )}
        </div>

        {quizState === 'question' && (
          <PracticeQuestionHint
            questionId={q.id}
            question={q.scenario}
            domainLabel={q.domainLabel}
            keywords={q.keywords}
            options={q.options}
            onHintActive={(_active, terms) => setHintHighlight(terms)}
          />
        )}

        <div className="px-5 pb-5 space-y-2.5">
          {q.options.map((opt) => (
            <OptionButton
              key={opt.id}
              opt={opt}
              selected={selected}
              correctId={q.correctId}
              quizState={quizState}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      {quizState === 'revealed' && selected && (
        <ExplanationBlock q={q} selected={selected} isCorrect={isCorrect} />
      )}

      <FloatingQuizNav
        index={index}
        total={total}
        onPrev={onPrev}
        onNext={onNext}
        onOpenPicker={() => setShowPicker(true)}
        nextDisabled={quizState !== 'revealed'}
        nextLabel={isLast ? 'Results →' : 'Next →'}
      />

      {showPicker && (
        <QuestionGrid
          current={index}
          total={total}
          answeredIndices={answeredIndices}
          onSelect={(i) => { onJump(i); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

function OptionButton({
  opt,
  selected,
  correctId,
  quizState,
  onSelect,
  desktopStyle = false,
}: {
  opt: { id: string; text: string }
  selected: string | null
  correctId: string
  quizState: QuizState
  onSelect: (id: string) => void
  desktopStyle?: boolean
}) {
  const isSelected = selected === opt.id
  const isCorrect = opt.id === correctId
  const revealed = quizState === 'revealed'

  let className =
    'w-full text-left border text-[0.88rem] leading-snug transition-all duration-200 '

  if (desktopStyle) {
    className += 'px-4 py-3.5 rounded-lg flex items-center gap-3 '
  } else {
    className += 'px-4 py-3 rounded-xl '
  }

  if (!revealed) {
    className += desktopStyle
      ? 'bg-white/4 border-aws-border/70 text-aws-text hover:border-c1/30 hover:bg-white/6 cursor-pointer'
      : 'bg-white/3 border-aws-border text-aws-text hover:border-white/20 hover:bg-white/6 cursor-pointer'
  } else if (isCorrect) {
    className += 'bg-emerald-500/12 border-emerald-500/50 text-emerald-300 font-semibold'
  } else if (isSelected && !isCorrect) {
    className += 'bg-red-500/12 border-red-500/50 text-red-300'
  } else {
    className += 'bg-white/2 border-aws-border/40 text-aws-muted'
  }

  const radioClass = revealed
    ? isCorrect
      ? 'border-emerald-400 bg-emerald-400'
      : isSelected
        ? 'border-red-400 bg-red-400'
        : 'border-aws-border/50 bg-transparent'
    : isSelected
      ? 'border-c1 bg-c1'
      : 'border-aws-border/60 bg-transparent'

  return (
    <button type="button" className={className} onClick={() => onSelect(opt.id)} disabled={revealed}>
      {desktopStyle ? (
        <>
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${radioClass}`}
            aria-hidden
          >
            {isSelected && !revealed && <span className="h-2 w-2 rounded-full bg-aws-bg" />}
          </span>
          <span className="flex-1 min-w-0">
            <span className="font-semibold">{opt.id.toUpperCase()}.</span> {opt.text}
          </span>
          {revealed && isCorrect && <span className="ml-auto shrink-0 text-emerald-400">✓</span>}
          {revealed && isSelected && !isCorrect && <span className="ml-auto shrink-0 text-red-400">✗</span>}
        </>
      ) : (
        <span className="flex items-start gap-3">
          <span className="font-space-mono text-[0.65rem] font-bold mt-0.5 shrink-0 opacity-60">
            {opt.id.toUpperCase()}
          </span>
          <span>{opt.text}</span>
          {revealed && isCorrect && <span className="ml-auto shrink-0 text-emerald-400">✓</span>}
          {revealed && isSelected && !isCorrect && <span className="ml-auto shrink-0 text-red-400">✗</span>}
        </span>
      )}
    </button>
  )
}

function ExplanationBlock({
  q,
  selected,
  isCorrect,
  reviewMode = false,
}: {
  q: PracticeQuestion
  selected: string
  isCorrect: boolean
  reviewMode?: boolean
}) {
  return (
    <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden">
      {/* verdict — hidden in review mode (answer is always correct) */}
      {!reviewMode && (
        <div
          className={`flex items-center gap-2 px-5 py-3 border-b ${
            isCorrect
              ? 'bg-emerald-500/8 border-emerald-500/30'
              : 'bg-red-500/8 border-red-500/30'
          }`}
        >
          <span className={`text-lg ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
            {isCorrect ? '✓' : '✗'}
          </span>
          <span className={`font-space-mono text-sm font-bold ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </span>
        </div>
      )}

      <div className="px-5 py-4 space-y-4">
        {/* correct explanation */}
        <div className="bg-emerald-500/6 border border-emerald-500/20 rounded-lg px-4 py-3">
          <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-emerald-400/70 mb-1.5">
            ✓ Correct — {q.options.find((o) => o.id === q.correctId)?.text}
          </p>
          <p className="text-[0.85rem] text-aws-text leading-relaxed">{q.explanation.correct}</p>
        </div>

        {/* incorrect explanations */}
        <div className="space-y-2">
          <p className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted">
            Why the other options are wrong
          </p>
          {q.options
            .filter((o) => o.id !== q.correctId)
            .map((opt) => (
              <div
                key={opt.id}
                className={`rounded-lg px-4 py-3 border ${
                  !reviewMode && opt.id === selected && !isCorrect
                    ? 'bg-red-500/8 border-red-500/25'
                    : 'bg-white/2 border-aws-border/40'
                }`}
              >
                <p
                  className={`font-space-mono text-[0.58rem] uppercase tracking-widest mb-1.5 ${
                    !reviewMode && opt.id === selected && !isCorrect ? 'text-red-400/70' : 'text-aws-muted'
                  }`}
                >
                  ✗ {opt.text}
                </p>
                <p className="text-[0.82rem] text-aws-text leading-relaxed">
                  {q.explanation.incorrects[opt.id]}
                </p>
              </div>
            ))}
        </div>

        {/* keywords */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {q.keywords.map((kw) => (
            <span
              key={kw}
              className="font-space-mono text-[0.6rem] px-2.5 py-0.5 rounded-full border border-c1/25 text-c1/70 bg-c1/5"
            >
              {kw}
            </span>
          ))}
        </div>

        {q.reference && (
          <div className="pt-2 border-t border-aws-border/40">
            <a
              href={q.reference}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-space-mono text-[0.62rem] text-aws-muted hover:text-c4 transition-colors"
            >
              <span>📎</span>
              <span>Official Reference →</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function FinishedScreen({ score, onRestart }: { score: { correct: number; total: number }; onRestart: () => void }) {
  const pct = Math.round((score.correct / score.total) * 100)
  const grade =
    pct >= 90 ? { label: 'Excellent!', color: 'text-emerald-400', emoji: '🏆' }
    : pct >= 72 ? { label: 'Passed!', color: 'text-c1', emoji: '✅' }
    : pct >= 60 ? { label: 'Almost There', color: 'text-amber-400', emoji: '📚' }
    : { label: 'Keep Studying', color: 'text-red-400', emoji: '💪' }

  return (
    <div className="text-center space-y-6">
      <div className="bg-aws-card border border-aws-border rounded-xl px-8 py-10">
        <p className="text-5xl mb-4">{grade.emoji}</p>
        <p className={`font-space-mono text-2xl font-bold ${grade.color} mb-2`}>{grade.label}</p>
        <p className="text-aws-muted text-sm mb-6">
          {score.correct} out of {score.total} correct
        </p>

        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="2.5" />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={pct >= 72 ? '#34d399' : pct >= 60 ? '#fbbf24' : '#f87171'}
              strokeWidth="2.5"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-space-mono text-2xl font-bold ${grade.color}`}>{pct}%</span>
          </div>
        </div>

        <p className="font-space-mono text-[0.65rem] text-aws-muted mb-1">AWS SAA-C03 pass mark is 72%</p>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-3 rounded-xl font-space-mono text-sm font-bold bg-c1/15 border border-c1/40 text-c1 hover:bg-c1/25 transition-all duration-150"
      >
        Try Again ↩
      </button>
    </div>
  )
}
