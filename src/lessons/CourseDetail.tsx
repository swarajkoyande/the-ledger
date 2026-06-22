// Course detail — header (description, level, hours, total XP) + vertical subtopic
// syllabus with lessons and quiz gates. Quiz gating: a subtopic with hasQuizAfter
// locks subsequent subtopics until its quiz is passed. Business 101 groups subtopics
// by module. Empty-scaffold courses render "in production" rows.
import { motion } from 'framer-motion'
import { ChevronLeft, Play, Lock, CheckCircle2, Trophy, Star, Clock, Layers, Construction } from 'lucide-react'
import type { Course, Subtopic, Lesson, Quiz } from './types'
import type { T } from './theme'
import { O, N, GREEN, diffColor } from './theme'

export function CourseDetail({ course, t, completedLessons, passedQuizzes, onOpenLesson, onOpenQuiz, onBack }: {
  course: Course; t: T
  completedLessons: Set<string>; passedQuizzes: Set<string>
  onOpenLesson: (sub: Subtopic, lesson: Lesson) => void
  onOpenQuiz: (quiz: Quiz) => void
  onBack: () => void
}) {
  const dc = diffColor(course.difficulty)

  // Compute per-subtopic unlock state from quiz gates.
  const unlocked: boolean[] = []
  let gateOpen = true
  for (const sub of course.subtopics) {
    unlocked.push(gateOpen)
    if (sub.hasQuizAfter && sub.quizzes.length > 0 && sub.quizzes[0].questions.length > 0) {
      if (!passedQuizzes.has(sub.quizzes[0].id)) gateOpen = false
    }
  }

  const completedCount = course.subtopics.filter(s => s.lessons.length > 0 && s.lessons.every(l => completedLessons.has(l.id))).length
  const totalWithLessons = course.subtopics.filter(s => s.lessons.length > 0).length
  const pct = totalWithLessons ? Math.round((completedCount / totalWithLessons) * 100) : 0

  let lastModule: string | undefined

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: t.BG }}>
      {/* Header bar */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 flex items-center gap-3" style={{ background: t.BG }}>
        <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: t.CA }}>
          <ChevronLeft size={16} style={{ color: t.MT }} />
        </button>
        <span className="text-[13px] font-bold truncate" style={{ color: t.MT }}>{course.title}</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-safe-lg">
        {/* Course hero */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: N }}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-3xl">{course.icon}</span>
            <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded" style={{ background: dc.bg, color: dc.fg }}>{dc.label}</span>
          </div>
          <h1 className="text-xl font-extrabold text-white leading-tight mb-1.5" style={{ letterSpacing: '-0.01em' }}>{course.title}</h1>
          <p className="text-[12px] leading-relaxed mb-3" style={{ color: '#9aa9cc' }}>{course.description}</p>
          <div className="flex items-center gap-3 text-[11px]" style={{ color: '#7687b2' }}>
            <span className="flex items-center gap-1"><Clock size={11} /> {course.hours}h</span>
            <span className="flex items-center gap-1"><Layers size={11} /> {course.subtopics.length} topics</span>
            <span className="flex items-center gap-1"><Star size={11} style={{ color: O }} /> {course.xp} XP</span>
          </div>
          {!course.comingSoon && (
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-[9px]" style={{ color: '#7687b2' }}>Progress</span>
                <span className="text-[9px] font-bold" style={{ color: O }}>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: O }} />
              </div>
            </div>
          )}
        </div>

        {course.comingSoon && (
          <div className="rounded-xl px-4 py-3 mb-4 flex items-center gap-2.5" style={{ background: 'rgba(217,119,6,0.10)' }}>
            <Construction size={18} style={{ color: '#d97706' }} className="flex-shrink-0" />
            <p className="text-[12px] leading-snug" style={{ color: t.ST }}>
              <span className="font-bold" style={{ color: '#d97706' }}>In production. </span>
              The syllabus below is scaffolded; lessons and quiz questions are being authored.
            </p>
          </div>
        )}

        {/* Syllabus */}
        <div className="flex flex-col gap-3">
          {course.subtopics.map((sub, i) => {
            const isUnlocked = unlocked[i] && !course.comingSoon
            const lesson = sub.lessons[0]
            const lessonDone = lesson ? completedLessons.has(lesson.id) : false
            const quiz = sub.hasQuizAfter ? sub.quizzes[0] : undefined
            const quizPassed = quiz ? passedQuizzes.has(quiz.id) : false
            const showModule = sub.module && sub.module !== lastModule
            if (sub.module) lastModule = sub.module

            return (
              <div key={sub.slug}>
                {showModule && (
                  <div className="flex items-center gap-2 mt-2 mb-1 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: O }}>{sub.module}</span>
                    <div className="flex-1 h-px" style={{ background: t.LINE }} />
                  </div>
                )}

                {/* Lesson row */}
                <motion.button
                  whileTap={isUnlocked && lesson ? { scale: 0.99 } : {}}
                  onClick={() => isUnlocked && lesson && onOpenLesson(sub, lesson)}
                  className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left"
                  style={{ background: t.W, boxShadow: t.SH, opacity: isUnlocked || course.comingSoon ? 1 : 0.5 }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: lessonDone ? 'rgba(22,163,74,0.15)' : isUnlocked ? N : t.CA }}>
                    {course.comingSoon ? <Construction size={14} style={{ color: t.GT }} />
                     : lessonDone ? <CheckCircle2 size={15} style={{ color: GREEN }} />
                     : isUnlocked ? <Play size={13} className="text-white" />
                     : <Lock size={13} style={{ color: t.GT }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold leading-snug" style={{ color: t.MT }}>
                      {i + 1}. {sub.title}
                    </p>
                    {lesson ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px]" style={{ color: t.GT }}>{lesson.durationMinutes} min</span>
                        {sub.knowledgeCheckCount ? <><span style={{ color: t.GT }}>·</span><span className="text-[10px]" style={{ color: t.GT }}>{sub.knowledgeCheckCount} checks</span></> : null}
                        <span style={{ color: t.GT }}>·</span>
                        <Star size={8} style={{ color: O }} /><span className="text-[10px]" style={{ color: O }}>+{lesson.xpReward}</span>
                      </div>
                    ) : (
                      <span className="text-[10px]" style={{ color: t.GT }}>{course.comingSoon ? 'Lesson in production' : 'No lesson'}</span>
                    )}
                  </div>
                </motion.button>

                {/* Quiz gate row */}
                {quiz && (
                  <button
                    onClick={() => isUnlocked && onOpenQuiz(quiz)}
                    disabled={!isUnlocked}
                    className="w-full flex items-center gap-3 rounded-2xl p-3 text-left mt-2 ml-3"
                    style={{ width: 'calc(100% - 0.75rem)', background: quizPassed ? 'rgba(22,163,74,0.06)' : t.BG,
                             border: `1.5px dashed ${quizPassed ? GREEN : t.LINE}`, opacity: isUnlocked ? 1 : 0.5 }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: quizPassed ? 'rgba(22,163,74,0.15)' : t.CA }}>
                      {quizPassed ? <CheckCircle2 size={14} style={{ color: GREEN }} /> : <Trophy size={13} style={{ color: O }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold leading-snug" style={{ color: t.MT }}>{quiz.title}</p>
                      <span className="text-[10px]" style={{ color: t.GT }}>
                        {quiz.questions.length > 0 ? `${quiz.maxQuestions} Q · pass ${quiz.passingScore}% · +${quiz.xpReward} XP` : 'In production'}
                        {!quizPassed && quiz.questions.length > 0 ? ' · unlocks next topic' : ''}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
