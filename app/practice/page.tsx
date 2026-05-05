'use client'

import { useState, useCallback } from 'react'
import Nav from '@/components/Nav'
import { practiceQuestions, PracticeQuestion } from '@/data/practiceQuestions'

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

export default function PracticePage() {
  const [mode, setMode] = useState<PageMode>('quiz')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [quizState, setQuizState] = useState<QuizState>('question')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  const q = practiceQuestions[currentIndex]
  const isCorrect = selected === q.correctId

  const handleSelect = useCallback((id: string) => {
    if (quizState === 'revealed') return
    setSelected(id)
    setQuizState('revealed')
    setScore((prev) => ({
      correct: prev.correct + (id === q.correctId ? 1 : 0),
      total: prev.total + 1,
    }))
  }, [quizState, q.correctId])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= practiceQuestions.length) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelected(null)
      setQuizState('question')
    }
  }, [currentIndex])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setSelected(null)
    setQuizState('question')
    setScore({ correct: 0, total: 0 })
    setFinished(false)
  }, [])

  const handleModeSwitch = useCallback((next: PageMode) => {
    setMode(next)
    handleRestart()
  }, [handleRestart])

  return (
    <>
      <Nav activePage="practice" />
      <main className="max-w-[720px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-16">
        {/* header */}
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

        {mode === 'review' ? (
          <ReviewMode />
        ) : finished ? (
          <FinishedScreen score={score} onRestart={handleRestart} />
        ) : (
          <QuestionCard
            q={q}
            index={currentIndex}
            total={practiceQuestions.length}
            selected={selected}
            quizState={quizState}
            isCorrect={isCorrect}
            score={score}
            onSelect={handleSelect}
            onNext={handleNext}
          />
        )}
      </main>
    </>
  )
}

function ReviewMode() {
  const [index, setIndex] = useState(0)
  const total = practiceQuestions.length
  const q = practiceQuestions[index]

  return (
    <div>
      {/* progress bar */}
      <div className="mb-5">
        <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-c1 to-c5 rounded-full transition-all duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* question card */}
      <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden mb-3">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-aws-border/60 bg-white/2">
          <span className="font-space-mono text-[0.58rem] text-aws-muted">Q{index + 1}</span>
          <span className="text-aws-border">·</span>
          <span className={`font-space-mono text-[0.6rem] font-bold uppercase tracking-widest ${domainColors[q.domain]}`}>
            {q.domainLabel}
          </span>
          <span className="text-aws-border">·</span>
          <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded-full border ${difficultyColors[q.difficulty]}`}>
            {q.difficulty}
          </span>
        </div>

        <div className="px-5 py-5">
          <p className="text-[0.92rem] text-aws-text leading-relaxed">{q.scenario}</p>
        </div>

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

      {/* bottom padding so content doesn't hide behind floating bar */}
      <ExplanationBlock q={q} selected={q.correctId} isCorrect={true} reviewMode={true} />
      <div className="h-24" />

      {/* floating prev / next bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[720px] px-4 z-50">
        <div className="flex gap-3 bg-aws-card/80 backdrop-blur-md border border-aws-border rounded-2xl p-2 shadow-xl">
          <button
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
            className="flex-1 py-2.5 rounded-xl font-space-mono text-sm font-bold border transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed bg-white/4 border-aws-border text-aws-muted hover:text-aws-text hover:bg-white/8"
          >
            ← Prev
          </button>
          <span className="font-space-mono text-[0.65rem] text-aws-muted self-center px-2 whitespace-nowrap">
            {index + 1} / {total}
          </span>
          <button
            onClick={() => setIndex((i) => i + 1)}
            disabled={index + 1 >= total}
            className="flex-1 py-2.5 rounded-xl font-space-mono text-sm font-bold border transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed bg-c1/15 border-c1/40 text-c1 hover:bg-c1/25"
          >
            Next →
          </button>
        </div>
      </div>
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
  onSelect,
  onNext,
}: {
  q: PracticeQuestion
  index: number
  total: number
  selected: string | null
  quizState: QuizState
  isCorrect: boolean
  score: { correct: number; total: number }
  onSelect: (id: string) => void
  onNext: () => void
}) {
  return (
    <div>
      {/* progress bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-c1 to-c5 rounded-full transition-all duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <span className="font-space-mono text-[0.65rem] text-aws-muted whitespace-nowrap">
          {index + 1} / {total}
        </span>
        <span className="font-space-mono text-[0.65rem] text-emerald-400 whitespace-nowrap">
          {score.correct}/{score.total} correct
        </span>
      </div>

      {/* question card */}
      <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden mb-4">
        {/* meta row */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-aws-border/60 bg-white/2">
          <span className={`font-space-mono text-[0.6rem] font-bold uppercase tracking-widest ${domainColors[q.domain]}`}>
            {q.domainLabel}
          </span>
          <span className="text-aws-border">·</span>
          <span className={`font-space-mono text-[0.6rem] px-2 py-0.5 rounded-full border ${difficultyColors[q.difficulty]}`}>
            {q.difficulty}
          </span>
          <span className="ml-auto font-space-mono text-[0.58rem] text-aws-muted">Select one answer</span>
        </div>

        {/* scenario */}
        <div className="px-5 py-5">
          <p className="text-[0.92rem] text-aws-text leading-relaxed">{q.scenario}</p>
        </div>

        {/* options */}
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

      {/* explanation */}
      {quizState === 'revealed' && selected && (
        <ExplanationBlock q={q} selected={selected} isCorrect={isCorrect} />
      )}

      {/* next button */}
      {quizState === 'revealed' && (
        <button
          onClick={onNext}
          className="w-full mt-4 py-3 rounded-xl font-space-mono text-sm font-bold bg-c1/15 border border-c1/40 text-c1 hover:bg-c1/25 transition-all duration-150"
        >
          {index + 1 >= practiceQuestions.length ? 'See Results →' : 'Next Question →'}
        </button>
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
}: {
  opt: { id: string; text: string }
  selected: string | null
  correctId: string
  quizState: QuizState
  onSelect: (id: string) => void
}) {
  const isSelected = selected === opt.id
  const isCorrect = opt.id === correctId
  const revealed = quizState === 'revealed'

  let className =
    'w-full text-left px-4 py-3 rounded-xl border text-[0.88rem] leading-snug transition-all duration-200 '

  if (!revealed) {
    className += 'bg-white/3 border-aws-border text-aws-text hover:border-white/20 hover:bg-white/6 cursor-pointer'
  } else if (isCorrect) {
    className += 'bg-emerald-500/12 border-emerald-500/50 text-emerald-300 font-semibold'
  } else if (isSelected && !isCorrect) {
    className += 'bg-red-500/12 border-red-500/50 text-red-300'
  } else {
    className += 'bg-white/2 border-aws-border/40 text-aws-muted'
  }

  return (
    <button className={className} onClick={() => onSelect(opt.id)} disabled={revealed}>
      <span className="flex items-start gap-3">
        <span className="font-space-mono text-[0.65rem] font-bold mt-0.5 shrink-0 opacity-60">
          {opt.id.toUpperCase()}
        </span>
        <span>{opt.text}</span>
        {revealed && isCorrect && <span className="ml-auto shrink-0 text-emerald-400">✓</span>}
        {revealed && isSelected && !isCorrect && <span className="ml-auto shrink-0 text-red-400">✗</span>}
      </span>
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
