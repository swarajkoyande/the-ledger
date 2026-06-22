// ═══════════════════════════════════════════════════════════════════════════════
// LESSONS CONTENT MODEL
// Mirrors the Ledger Supabase schema (courses → subtopics → lessons/quizzes →
// questions) plus the lesson `content` jsonb shape (sections with bodies, worked
// examples, inline knowledge checks, and interactive games).
//
// `mock: true` flags prose/questions generated as faithful placeholders because the
// long-form text lives in Supabase (unreachable in this environment). Structure,
// game configs, and quiz metadata are real (from ledger-course-content-map.json).
// ═══════════════════════════════════════════════════════════════════════════════

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

// ─── Interactive games ──────────────────────────────────────────────────────────
export interface DragDropConfig {
  scenario: string
  scenarioType?: string
  categories: { id: string; label: string; description?: string; color: string }[]
  items: { id: string; label: string; correctCategory: string }[]
  correctExplanation: string
  xpReward: number
}

export interface CalculatorField {
  id: string
  label: string
  type: 'slider' | 'currency'
  min: number
  max: number
  step?: number
  unit?: string
  defaultValue: number
}

export interface CalculatorConfig {
  calculationType: string
  fields: CalculatorField[]
  formula?: string          // expression in field ids; supports ^ . if absent, calculationType implies the formula
  resultLabel: string
  resultPrefix?: string     // e.g. "$"
  resultSuffix?: string     // e.g. "%"
  xpReward: number
}

export interface ScenarioConfig {
  scenario: string
  scenarioType?: string
  options: { id: string; text: string; isCorrect: boolean; feedback: string; consequence: string }[]
  correctExplanation: string
  xpReward: number
}

export type InteractiveExercise =
  | { type: 'drag-drop'; config: DragDropConfig }
  | { type: 'calculator'; config: CalculatorConfig }
  | { type: 'scenario'; config: ScenarioConfig }

// ─── Lesson content ─────────────────────────────────────────────────────────────
export interface KnowledgeCheck {
  question: string
  options: string[]          // 4 options
  correctIndex: number
  explanation: string
}

export interface WorkedExample {
  title: string
  description: string
}

export interface LessonSection {
  heading: string
  content: string            // markdown: **bold**, lists, \n
  examples?: WorkedExample[]
  knowledgeCheck?: KnowledgeCheck
  interactiveExercise?: InteractiveExercise
}

export interface LessonContent {
  title: string
  introduction: string
  estimatedDurationMinutes: number
  keyTakeaways: string[]
  sections: LessonSection[]
  mock?: boolean             // prose is generated placeholder
}

export interface Lesson {
  id: string
  title: string
  durationMinutes: number
  xpReward: number
  content: LessonContent
}

// ─── Quiz ───────────────────────────────────────────────────────────────────────
export interface QuizOption {
  label: string              // "A".."D" or free label
  value: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  type: 'mcq' | 'calculation'
  questionText: string
  options?: QuizOption[]      // mcq only
  correctAnswer: string      // letter (mcq) or numeric string (calculation)
  explanation: string
  calculationData?: { formula?: string; variables?: Record<string, number>; expectedResult: number; unit?: string }
  mock?: boolean
}

export interface Quiz {
  id: string
  title: string
  description?: string
  coversSubtopics: string[]
  maxQuestions: number
  passingScore: number       // percent
  xpReward: number
  questions: QuizQuestion[]   // empty array = scaffold (no questions yet)
}

// ─── Course structure ───────────────────────────────────────────────────────────
export interface Subtopic {
  slug: string
  title: string
  displayOrder: number
  hasQuizAfter: boolean
  module?: string            // business-101 module grouping
  lessons: Lesson[]
  quizzes: Quiz[]
  knowledgeCheckCount?: number
}

export interface Course {
  slug: string
  title: string
  category: string
  difficulty: Difficulty
  hours: number
  xp: number
  icon: string
  description: string
  order: number
  comingSoon?: boolean
  subtopics: Subtopic[]
}
