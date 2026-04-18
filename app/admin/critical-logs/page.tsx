import { CriticalLogsDashboard } from "@/components/critical-logs-dashboard"

export default function CriticalLogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-muted/90 mb-2">Logs Críticos</h1>
          <p className="text-muted/60">Conversaciones con bajo rendimiento que requieren revisión y mejora</p>
        </div>

        <CriticalLogsDashboard />
      </div>
    </div>
  )
}
