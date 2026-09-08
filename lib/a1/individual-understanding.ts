import { DISC_TEST_QUESTIONS } from '../disc-test-questions'
import { validateAndScoreDiscResponses } from './disc-scoring'
import {
  KEYS, UNDERSTANDING_VERSION, QUESTIONNAIRE_VERSION, answerList, answerText, record,
  patternEvidence, domainReadings, selectClarifications, validateClarifications,
  clarificationStatements, type Scores, type ItemEvidence,
} from './individual-evidence'

export const CLARIFICATION_KEY = '_a1_understanding_v1'
export interface UnderstandingInput { scores: Scores; responses?: unknown; c1?: unknown; c2?: unknown; revision?: string }

export function buildIndividualUnderstanding(input: UnderstandingInput) {
  const source = record(input.responses)
  const meta = record(source._meta)
  const versionKnown = meta.questionnaireVersion === undefined || meta.questionnaireVersion === QUESTIONNAIRE_VERSION
  const scoring = versionKnown ? validateAndScoreDiscResponses(source) : null
  const hasSelections = Object.prototype.hasOwnProperty.call(source, 'more') || Object.prototype.hasOwnProperty.call(source, 'less')
  const rawValid = Boolean(scoring?.valid && scoring.value)
  const scoreMismatch = rawValid && KEYS.some((key) => scoring!.value!.scores[key] !== input.scores[key])
  const completeScores = KEYS.every((key) => typeof input.scores[key] === 'number' && Number.isInteger(input.scores[key]))
  const impossibleScores = completeScores && (
    KEYS.reduce((sum, key) => sum + input.scores[key]!, 0) !== 0
    || KEYS.reduce((sum, key) => sum + Math.max(0, input.scores[key]!), 0) > DISC_TEST_QUESTIONS.length
  )
  const responseState = !versionKnown ? 'unsupported_version' as const
    : scoreMismatch ? 'score_mismatch' as const
    : impossibleScores ? 'invalid_scores' as const
    : rawValid ? 'available' as const
    : hasSelections ? 'invalid' as const : 'missing' as const
  const readingBlocked = ['invalid', 'invalid_scores', 'score_mismatch', 'unsupported_version'].includes(responseState)
  const pattern = patternEvidence(readingBlocked ? { D: null, I: null, S: null, C: null } : input.scores)
  const items: ItemEvidence[] = responseState === 'available' ? DISC_TEST_QUESTIONS.map((question) => {
    const more = question.opciones.find((option) => option.texto === scoring!.value!.responses.more[String(question.id)])!
    const less = question.opciones.find((option) => option.texto === scoring!.value!.responses.less[String(question.id)])!
    return { questionId: question.id, question: question.pregunta, more: { text: more.texto, dimension: more.dimension }, less: { text: less.texto, dimension: less.dimension } }
  }) : []
  const domains = domainReadings(items, pattern.primary)
  const questions = selectClarifications(domains)
  const c1 = record(input.c1), c2 = record(input.c2)
  const envelope = record(c2[CLARIFICATION_KEY])
  const envelopePresent = Object.keys(envelope).length > 0
  const revision = input.revision || null
  const matches = Boolean(revision && envelope.revision === revision && envelope.version === UNDERSTANDING_VERSION)
  const answers = matches ? validateClarifications(envelope.answers, questions) : null
  const clarificationState = !envelopePresent ? 'not_answered' as const : !matches ? 'stale' as const : !answers ? 'invalid' as const : 'saved' as const
  const contextNotes: string[] = []
  if (answerList(c1['2']).length > 1) contextNotes.push('La experiencia incluye más de un rango. Conservamos la respuesta y dejamos pendiente aclarar cuál corresponde.')
  if (answerText(c1['4']) && answerText(c2['1']) && answerText(c1['4']) !== answerText(c2['1'])) contextNotes.push('Tu objetivo inicial y el posterior son diferentes. Se presenta el de C2 como el más reciente, sin borrar el objetivo inicial.')
  if (answerText(c1['6']) && answerText(c2['5'])) contextNotes.push('C1 y C2 usan rangos de tiempo distintos. No los sumamos ni suponemos que una diferencia representa una contradicción.')
  return {
    version: UNDERSTANDING_VERSION,
    questionnaireVersion: meta.questionnaireVersion === QUESTIONNAIRE_VERSION ? QUESTIONNAIRE_VERSION : meta.questionnaireVersion === undefined ? 'legacy-compatible' : 'unknown',
    responseState, readingBlocked, pattern, domains, questions, revision,
    answerCount: items.length,
    selections: Object.fromEntries(KEYS.map((key) => [key, { more: items.filter((item) => item.more.dimension === key).length, less: items.filter((item) => item.less.dimension === key).length }])),
    context: {
      situation: answerText(c1['1']), experience: answerText(c1['2']), challenge: answerText(c1['3']),
      originalGoal: answerText(c1['4']), goal: answerText(c2['1']) || answerText(c1['4']), targetRole: answerText(c2['3']), notes: contextNotes,
    },
    clarificationState, answers, clarificationStatements: clarificationStatements(answers, questions),
    clarificationSavedAt: answers && typeof envelope.savedAt === 'string' ? envelope.savedAt : null,
  }
}
export type IndividualUnderstanding = ReturnType<typeof buildIndividualUnderstanding>
