// LessonsFlow — jumps directly into the first lesson of a course (no detail screen).
// Owns progress (completed lessons, passed quizzes) and reports XP via onXp.
import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getCourse } from './content'
import type { Quiz } from './types'
import { makeT } from './theme'
import { CardBasedLessonFlow, INTRO_STOCK_MARKET_CARDS } from './CardBasedLessonFlow'
import { lessonToCards } from './lessonToCards'
import { QuizFlow } from './QuizFlow'

type View = 'lesson' | 'quiz'

export function LessonsFlow({ slug, dark, onExit, onXp }: {
  slug: string; dark: boolean; onExit: () => void; onXp: (xp: number) => void
}) {
  const t = makeT(dark)
  const course = getCourse(slug)

  // Find the first subtopic with a lesson
  const firstEntry = useMemo(() => {
    if (!course) return null
    for (const sub of course.subtopics) {
      if (sub.lessons.length > 0) return { sub, lesson: sub.lessons[0] }
    }
    return null
  }, [course])

  const [view, setView] = useState<View>('lesson')
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [completedLessons, setCompleted] = useState<Set<string>>(new Set())
  const [passedQuizzes, setPassed] = useState<Set<string>>(new Set())

  if (!course || !firstEntry) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" style={{ background: t.BG }}>
        <button onClick={onExit} className="text-[13px] font-bold" style={{ color: t.MT }}>Course not found — back</button>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'lesson' && (
        <motion.div key="lesson" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} className="absolute inset-0">
          {(() => {
            const cards = (slug === 'stock-market-essentials' && firstEntry.sub.slug === 'intro-stock-market')
              ? INTRO_STOCK_MARKET_CARDS
              : lessonToCards(firstEntry.lesson)
            return (
              <CardBasedLessonFlow
                key={firstEntry.lesson.id}
                cards={cards}
                t={t}
                xpReward={firstEntry.lesson.xpReward}
                onAward={onXp}
                onComplete={() => {
                  setCompleted(prev => new Set(prev).add(firstEntry.lesson.id))
                  onExit()
                }}
                onBack={onExit}
              />
            )
          })()}
        </motion.div>
      )}

      {view === 'quiz' && activeQuiz && (
        <motion.div key="quiz" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} className="absolute inset-0">
          <QuizFlow
            quiz={activeQuiz} t={t}
            onPass={(xp) => { setPassed(prev => new Set(prev).add(activeQuiz.id)); onXp(xp) }}
            onExit={onExit}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
