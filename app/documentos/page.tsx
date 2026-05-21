import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Descargas | Despega Tu Carrera',
  description: 'Descarga el paquete técnico completo de DTC Despega Tu Carrera',
}

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Centro de Descargas</h1>
          <p className="text-xl text-muted-foreground">
            Paquete técnico completo para StartUp Chile, CORFO e inversores
          </p>
        </div>

        {/* Main Package */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">DTC Tech Evidence Package</h2>
              <p className="text-muted-foreground">
                Código completo + Documentación técnica profesional
              </p>
            </div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              21 MB
            </span>
          </div>

          <div className="bg-muted p-6 rounded-lg mb-6">
            <p className="text-sm mb-3 font-mono">DTC_Tech_Evidence_Pack_2026-05-20.tar.gz</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ 1,318 archivos de código fuente</li>
              <li>✓ 8 documentos técnicos (2,500+ líneas)</li>
              <li>✓ .env.example template</li>
              <li>✓ Git history (2,986 commits)</li>
              <li>✓ Instrucciones de setup (30 min)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <a
              href="/api/documentos/download?file=DTC_Tech_Evidence_Pack_2026-05-20.tar.gz"
              className="block w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-lg text-center hover:bg-primary/90 transition"
            >
              📥 Descargar Paquete Completo (21 MB)
            </a>
            
            <p className="text-xs text-center text-muted-foreground">
              Extrae con: tar -xzf DTC_Tech_Evidence_Pack_2026-05-20.tar.gz
            </p>
          </div>
        </div>

        {/* Individual Documents */}
        <div>
          <h3 className="text-xl font-bold mb-4">Documentos Individuales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Investor Brief */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2">INVESTOR_BRIEF.md</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Resumen ejecutivo para CORFO, StartUp Chile e inversores. (5 min)
              </p>
              <a
                href="/api/documentos/download?file=INVESTOR_BRIEF.md"
                download
                className="text-primary hover:underline text-sm font-medium"
              >
                Descargar →
              </a>
            </div>

            {/* Technical README */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2">README_TECHNICAL.md</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Documentación técnica completa: stack, setup, módulos. (20 min)
              </p>
              <a
                href="/api/documentos/download?file=README_TECHNICAL.md"
                download
                className="text-primary hover:underline text-sm font-medium"
              >
                Descargar →
              </a>
            </div>

            {/* MVP Checklist */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2">MVP_PROGRESS_CHECKLIST.md</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Status detallado: 87% MVP completitud por módulo. (10 min)
              </p>
              <a
                href="/api/documentos/download?file=MVP_PROGRESS_CHECKLIST.md"
                download
                className="text-primary hover:underline text-sm font-medium"
              >
                Descargar →
              </a>
            </div>

            {/* Architecture */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2">TECHNICAL_ARCHITECTURE.md</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Arquitectura del sistema, seguridad, escalabilidad. (25 min)
              </p>
              <a
                href="/api/documentos/download?file=TECHNICAL_ARCHITECTURE.md"
                download
                className="text-primary hover:underline text-sm font-medium"
              >
                Descargar →
              </a>
            </div>

            {/* Git & Deploy */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2">GIT_AND_DEPLOY_STATUS.md</h4>
              <p className="text-sm text-muted-foreground mb-4">
                2,986 commits, deploy history, performance metrics. (10 min)
              </p>
              <a
                href="/api/documentos/download?file=GIT_AND_DEPLOY_STATUS.md"
                download
                className="text-primary hover:underline text-sm font-medium"
              >
                Descargar →
              </a>
            </div>

            {/* Setup Guide */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2">DOWNLOAD_AND_USE.md</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Instrucciones paso a paso para setup local (30 min). (15 min)
              </p>
              <a
                href="/api/documentos/download?file=DOWNLOAD_AND_USE.md"
                download
                className="text-primary hover:underline text-sm font-medium"
              >
                Descargar →
              </a>
            </div>

            {/* Env Example */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2">.env.example</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Template de variables de entorno (sin valores sensibles).
              </p>
              <a
                href="/api/documentos/download?file=.env.example"
                download
                className="text-primary hover:underline text-sm font-medium"
              >
                Descargar →
              </a>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mt-12 bg-muted p-8 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Quick Start (3 pasos)</h3>
          <div className="space-y-4 font-mono text-sm">
            <div>
              <p className="text-muted-foreground mb-1">1. Extrae el paquete:</p>
              <p className="bg-background p-3 rounded">tar -xzf DTC_Tech_Evidence_Pack_2026-05-20.tar.gz</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">2. Instala dependencias:</p>
              <p className="bg-background p-3 rounded">cd DTC_Tech_Evidence_Pack_2026-05-20 && pnpm install</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">3. Corre el servidor:</p>
              <p className="bg-background p-3 rounded">cp .env.example .env.local && pnpm dev</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground border-t border-border pt-8">
          <p>
            Paquete generado: 2026-05-20 | MVP: 87% | Production: Live
          </p>
          <p className="mt-2">
            Para más información, lee INVESTOR_BRIEF.md o README_TECHNICAL.md
          </p>
        </div>
      </div>
    </div>
  )
}
