import {
  UNDERSTANDING_VERSION, record, validateClarifications,
  type ClarificationQuestion, type ClarificationAnswers,
} from './individual-evidence'

export interface ClarificationSnapshot {
  revision: string
  editRevision: string
  questions: ClarificationQuestion[]
}
export interface ClarificationEnvelope {
  version: typeof UNDERSTANDING_VERSION
  revision: string
  savedAt: string
  answers: ClarificationAnswers
}
export interface ClarificationDependencies<T extends ClarificationSnapshot> {
  authenticate(): Promise<string | null>
  load(userId: string): Promise<T | null>
  persist(userId: string, snapshot: T, envelope: ClarificationEnvelope): Promise<boolean>
  now(): string
}
const MAX_BYTES = 8192
const HEX = /^[a-f0-9]{64}$/
function response(status: number, payload: Record<string, unknown>): Response {
  return Response.json(payload, { status, headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } })
}
async function boundedJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('invalid_body')
  const chunks: Uint8Array[] = []
  let bytes = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_BYTES) { await reader.cancel(); throw new Error('too_large') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  const joined = new Uint8Array(bytes)
  let offset = 0
  for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.length }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(joined)) as unknown
}

/** Pure HTTP orchestration with injectable storage for race/auth tests. No trusted client identity. */
export async function handleClarificationUpdate<T extends ClarificationSnapshot>(request: Request, deps: ClarificationDependencies<T>): Promise<Response> {
  if (request.method !== 'PUT') return response(405, { error: 'Método no permitido.' })
  const origin = request.headers.get('origin')
  if (origin !== new URL(request.url).origin) return response(403, { error: 'La solicitud debe provenir de esta aplicación.' })
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return response(415, { error: 'Se requiere JSON.' })
  try {
    const userId = await deps.authenticate()
    if (!userId) return response(401, { error: 'Inicia sesión nuevamente para guardar.' })
    let raw: unknown
    try { raw = await boundedJson(request) } catch (error) {
      return response(error instanceof Error && error.message === 'too_large' ? 413 : 400, { error: 'La solicitud no es válida o es demasiado grande.' })
    }
    const body = record(raw)
    if (Object.keys(body).length !== 3 || !Object.keys(body).every((key) => ['revision', 'editRevision', 'answers'].includes(key))
      || typeof body.revision !== 'string' || !HEX.test(body.revision) || typeof body.editRevision !== 'string' || !HEX.test(body.editRevision)) {
      return response(400, { error: 'La solicitud contiene campos inválidos.' })
    }
    const snapshot = await deps.load(userId)
    if (!snapshot || snapshot.questions.length === 0) return response(422, { error: 'Aún no hay respuestas verificables para estas aclaraciones.' })
    if (snapshot.revision !== body.revision || snapshot.editRevision !== body.editRevision) return response(409, { error: 'El informe cambió en otra pestaña o sesión. Recarga antes de guardar.' })
    const answers = validateClarifications(body.answers, snapshot.questions)
    if (!answers) return response(422, { error: 'Las aclaraciones no corresponden a las preguntas de este informe.' })
    const envelope: ClarificationEnvelope = { version: UNDERSTANDING_VERSION, revision: snapshot.revision, savedAt: deps.now(), answers }
    if (!await deps.persist(userId, snapshot, envelope)) return response(409, { error: 'Otra actualización llegó primero. Recarga para no sobrescribirla.' })
    return response(200, { success: true, savedAt: envelope.savedAt })
  } catch {
    return response(503, { error: 'No pudimos guardar. Tus cambios siguen en esta pantalla; intenta nuevamente.' })
  }
}
