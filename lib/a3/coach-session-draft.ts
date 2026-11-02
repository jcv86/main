import { groundPracticeFeedback, type PracticeReview } from './practice-feedback'

export interface CoachSessionDraft {
  version: 1
  moduleId: string
  questionIds: string[]
  started: boolean
  currentQuestion: number
  answer: string
  responses: string[]
  practiceReviews: PracticeReview[]
}

/** Local drafts carry practice only; no completion, score, XP or access flag is accepted. */
export function parseCoachSessionDraft(value: unknown, moduleId: string, questions: readonly { id: string; question: string }[]): CoachSessionDraft | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  const keys = ['version', 'moduleId', 'questionIds', 'started', 'currentQuestion', 'answer', 'responses', 'practiceReviews']
  const bounded = (input: unknown, max: number): input is string => typeof input === 'string' && input.length <= max
  if (Object.keys(record).some(key => !keys.includes(key)) || record.version !== 1 || record.moduleId !== moduleId
      || JSON.stringify(record.questionIds) !== JSON.stringify(questions.map(question => question.id))
      || typeof record.started !== 'boolean' || !Number.isInteger(record.currentQuestion)
      || Number(record.currentQuestion) < 0 || Number(record.currentQuestion) >= questions.length
      || !bounded(record.answer, 8000) || !Array.isArray(record.responses)
      || record.responses.length !== record.currentQuestion || record.responses.some(answer => !bounded(answer, 8000) || !answer.trim())
      || !Array.isArray(record.practiceReviews) || record.practiceReviews.length > 8) return null
  const practiceReviews: PracticeReview[] = []
  for (const item of record.practiceReviews) {
    if (!item || typeof item !== 'object' || !questions.some(question => question.question === item.question)
        || !bounded(item.firstAttempt, 8000) || !item.firstAttempt.trim() || !bounded(item.secondAttempt, 8000) || !item.secondAttempt.trim()
        || !bounded(item.recordedAt, 64) || !Number.isFinite(Date.parse(item.recordedAt)) || !item.feedback || typeof item.feedback !== 'object') return null
    const feedback = groundPracticeFeedback({ criterion: item.feedback.criterion, quote: item.feedback.quote }, item.firstAttempt)
    if (!feedback) return null
    practiceReviews.push({ question: item.question, firstAttempt: item.firstAttempt, secondAttempt: item.secondAttempt, feedback, recordedAt: item.recordedAt })
  }
  return { version: 1, moduleId, questionIds: questions.map(question => question.id), started: record.started,
    currentQuestion: Number(record.currentQuestion), answer: record.answer, responses: [...record.responses], practiceReviews }
}
