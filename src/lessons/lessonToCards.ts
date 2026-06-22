import type { Lesson, InteractiveExercise } from './types'

// ─── Card types (superset of CardBasedLessonFlow + exercise extension) ────────
type HookCard = {
  kind: 'hook'
  question: string
  subtext: string
}

type ContentCard = {
  kind: 'content'
  insight?: string
  body: string
  boldTerms: string[]
}

type CheckCard = {
  kind: 'check'
  question: string
  options: string[]
  correctIndex: number
  correctFeedback: string
  wrongFeedback: string
}

type ExerciseCard = {
  kind: 'exercise'
  exercise: InteractiveExercise
}

export type Card = HookCard | ContentCard | CheckCard | ExerciseCard

// ─── Converter ────────────────────────────────────────────────────────────────
export function lessonToCards(lesson: Lesson): Card[] {
  const cards: Card[] = []

  // 1. Hook card using the lesson introduction
  cards.push({
    kind: 'hook',
    question: lesson.content.introduction,
    subtext: 'Think about it before you continue',
  })

  // 2. One or more cards per section
  for (const section of lesson.content.sections) {
    // a. Content card
    cards.push({
      kind: 'content',
      body: section.content,
      boldTerms: [],
    })

    // b. Knowledge check card (if present)
    if (section.knowledgeCheck) {
      const kc = section.knowledgeCheck
      cards.push({
        kind: 'check',
        question: kc.question,
        options: kc.options,
        correctIndex: kc.correctIndex,
        correctFeedback: kc.explanation,
        wrongFeedback: kc.explanation,
      })
    }

    // c. Interactive exercise card (if present)
    if (section.interactiveExercise) {
      cards.push({
        kind: 'exercise',
        exercise: section.interactiveExercise,
      })
    }
  }

  return cards
}
