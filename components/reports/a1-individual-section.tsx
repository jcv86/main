import type { IndividualUnderstanding } from '@/lib/a1/individual-understanding'
import { RECOGNITION_OPTIONS } from '@/lib/a1/individual-evidence'
import { A1Clarifications } from './a1-clarifications'

export function A1IndividualSection({ value, editRevision }: { value: IndividualUnderstanding; editRevision: string | null }) {
  const available = value.responseState === 'available'
  const recognition = RECOGNITION_OPTIONS.find((option) => option.id === value.answers?.recognition)
  return (
    <section aria-labelledby="a1-individual-heading" className="space-y-6">
      <div><p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Tu lectura individual</p><h2 id="a1-individual-heading" className="mt-2 text-3xl font-semibold">Más allá de una combinación de letras</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">Esta sección conecta lo que elegiste en cada situación con el contexto que declaraste. No atribuye capacidades ni motivaciones que no hayas aportado.</p></div>
      {value.pattern.status === 'ambiguous' && <div role="status" data-report-card className="rounded-xl border border-amber-400/40 p-5"><h3 className="font-semibold">Hay más de una lectura posible del patrón</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">{value.pattern.primary ? `La tendencia principal es ${value.pattern.primary}; la secundaria está empatada entre ${value.pattern.secondaryCandidates.join(' y ')}.` : `El máximo está compartido entre ${value.pattern.primaryCandidates.join(', ')}.`} No elegimos una letra por orden de aparición. Un empate no invalida tus respuestas ni exige que cambies quién eres.</p></div>}
      {!available && <div role="status" data-report-card className="rounded-xl border border-slate-700 p-5 text-sm leading-relaxed text-slate-300">{value.readingBlocked ? 'Las respuestas y el registro del resultado no pueden verificarse conjuntamente, o corresponden a una versión no compatible. No se genera una lectura situacional ni se oculta esta diferencia.' : 'Este registro no incluye las respuestas originales en un formato que podamos reconstruir. Conservamos el contexto y el resultado disponible; no inventamos ejemplos personales.'}</div>}
      <div data-report-card className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 sm:p-6">
        <h3 className="text-xl font-semibold">El contexto desde el que respondiste</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">{[
          ['Situación', value.context.situation], ['Experiencia declarada', value.context.experience],
          ['Desafío actual', value.context.challenge], ['Objetivo más reciente', value.context.goal],
        ].map(([label, text]) => <div key={label}><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-200">{text || 'No informado'}</dd></div>)}</dl>
        {!!value.context.notes.length && <div className="mt-4 space-y-2 border-t border-slate-700 pt-4">{value.context.notes.map((note) => <p key={note} className="text-xs leading-relaxed text-slate-400">{note}</p>)}</div>}
      </div>
      {available && <>
        <p className="text-sm text-slate-400">{value.answerCount} respuestas consideradas en seis ámbitos. Son agrupaciones para explicar tus elecciones, no seis pruebas o puntajes nuevos.</p>
        <div className="grid gap-5 lg:grid-cols-2">{value.domains.map((domain) => <section key={domain.id} data-report-card className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 sm:p-6" aria-labelledby={`individual-${domain.id}`}>
          <h3 id={`individual-${domain.id}`} className="text-xl font-semibold">{domain.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-200">{domain.reading}</p>
          <details className="mt-4 rounded-xl border border-slate-700 p-3"><summary className="cursor-pointer text-sm font-semibold text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">Por qué aparece esto · {domain.evidence.length} respuestas</summary><ol className="mt-3 space-y-4">{domain.evidence.map((item) => <li key={item.questionId} className="text-sm leading-relaxed"><p className="font-medium text-slate-200">Pregunta {item.questionId}: {item.question}</p><p className="mt-1 text-slate-300">Más como tú: «{item.more.text}».</p><p className="text-slate-400">Menos como tú: «{item.less.text}».</p></li>)}</ol></details>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">{domain.pending}</p>
        </section>)}</div>
      </>}
      {(value.clarificationStatements.length > 0 || recognition) && <section data-report-card className="rounded-2xl border border-emerald-400/30 p-5 sm:p-6"><h3 className="text-xl font-semibold">Los matices que tú añadiste</h3><p className="mt-2 text-sm text-slate-400">Declaraciones posteriores, separadas del cuestionario original. No modifican los puntajes.</p><dl className="mt-4 space-y-4">{value.clarificationStatements.map((item) => <div key={item.domain}><dt className="font-semibold text-slate-200">{item.title}</dt><dd className="mt-1 text-sm leading-relaxed text-slate-300">{item.statement}{!item.isEvidence && ' · No se toma como evidencia conductual.'}</dd></div>)}</dl>{recognition && <p className="mt-4 text-sm text-slate-200">Tu perspectiva sobre la lectura: <strong>{recognition.label}</strong>. Esta respuesta no valida ni invalida por sí sola el instrumento.</p>}</section>}
      {available && value.revision && editRevision && <A1Clarifications key={`${value.revision}:${editRevision}`} revision={value.revision} editRevision={editRevision} questions={value.questions} initial={value.answers} stale={value.clarificationState === 'stale'} />}
      <p className="text-xs leading-relaxed text-slate-400">Versión de lectura: {value.version}. Reconstrucción del cuestionario: {value.questionnaireVersion}. Esta lectura orientativa requiere evaluación de uso y validación profesional; no es un diagnóstico ni una evaluación de aptitud laboral.</p>
    </section>
  )
}
