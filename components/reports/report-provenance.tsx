import type { A1ProfessionalReport } from '@/lib/reports/a1-professional-report'
import { formatReportDate } from '@/lib/reports/report-evidence'

/** Dates describe the selected persisted sources, not a historical snapshot or signature. */
export function ReportProvenance({ report }: { report: A1ProfessionalReport }) {
  const dates = [
    ['Evaluación A1', report.assessmentDate],
    ['Contexto inicial C1', report.provenance.c1CompletedAt],
    ['Contexto posterior C2', report.provenance.c2CompletedAt],
  ] as const
  return (
    <footer className="border-t border-slate-700 pt-6 text-xs leading-relaxed text-slate-400 print:text-slate-700" data-report-provenance>
      <p className="font-semibold text-slate-200 print:text-slate-950">Documento personal de orientación · A1 “Despega Cerebral”</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        {dates.map(([label, value]) => <div key={label}><dt className="font-medium">{label}</dt><dd className="mt-1">{formatReportDate(value)}</dd></div>)}
      </dl>
      <p className="mt-4">Generado el {formatReportDate(report.generatedAt)}. Última fuente fechada: {formatReportDate(report.provenance.latestDatedSource)}.</p>
      {report.provenance.hasUndatedSources && <p className="mt-2">Hay fuentes sin fecha verificable; no se puede afirmar un corte temporal completo de la evidencia.</p>}
      <p className="mt-2">La impresión reproduce esta vista y sus datos disponibles. No es un documento firmado, una certificación, un diagnóstico ni una garantía de desempeño.</p>
    </footer>
  )
}
