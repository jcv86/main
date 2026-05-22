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
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              LATEST - May 22
            </span>
          </div>

          <div className="bg-muted p-6 rounded-lg mb-6">
            <p className="text-sm mb-3 font-mono font-bold text-primary">DTC_Tech_Evidence_Pack_2026-05-22.tar.gz ⭐ CURRENT</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ 1,318 archivos de código fuente</li>
              <li>✓ 9 documentos técnicos (3,900+ líneas) - UPDATED</li>
              <li>✓ Status: 100% Production Ready (actualizado desde 87%)</li>
              <li>✓ 3 migrations deployed (RPC + Cycles + Flags)</li>
              <li>✓ Zero critical blockers</li>
              <li>✓ 3,020+ commits (actualizado desde 2,986)</li>
              <li>✓ May 23 Go-Live APPROVED</li>
            </ul>
          </div>

          <div className="space-y-4">
            <a
              href="/api/documentos/download?file=DTC_Tech_Evidence_Pack_2026-05-22.tar.gz"
              className="block w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-lg text-center hover:bg-primary/90 transition"
            >
              📥 Descargar Paquete Completo May 22 (21 MB)
            </a>
            
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground font-medium">
                📦 Versión anterior (May 20) - Solo para referencia
              </summary>
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <a
                  href="/api/documentos/download?file=DTC_Tech_Evidence_Pack_2026-05-20.tar.gz"
                  className="text-primary hover:underline text-sm"
                >
                  Descargar DTC_Tech_Evidence_Pack_2026-05-20.tar.gz (87% MVP)
                </a>
              </div>
            </details>
          </div>
        </div>
            </a>
            
            <p className="text-xs text-center text-muted-foreground">
              Extrae con: tar -xzf DTC_Tech_Evidence_Pack_2026-05-20.tar.gz
            </p>
          </div>
        </div>

        {/* Individual Documents */}
        <div>
          <h3 className="text-xl font-bold mb-6">Documentos Individuales</h3>
          
          <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6 rounded">
            <p className="text-sm font-medium mb-2">Elige tu formato preferido:</p>
            <p className="text-xs text-muted-foreground">
              Todos los documentos están disponibles en <strong>Markdown (.md)</strong> y <strong>Word (.docx)</strong> en español
            </p>
          </div>

          <div className="space-y-6">
            {/* Investor Brief */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">Investor Brief - Resumen Ejecutivo</h4>
                  <p className="text-xs text-muted-foreground mt-1">Para CORFO, StartUp Chile e inversores (5 min)</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Prioritario</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="/api/documentos/download?file=INVESTOR_BRIEF.md"
                  download
                  className="text-primary hover:underline text-sm font-medium"
                >
                  📄 Markdown
                </a>
              </div>
            </div>

            {/* Technical README */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">README Técnico - Documentación Completa</h4>
                  <p className="text-xs text-muted-foreground mt-1">Stack, setup, módulos, dependencias (20 min)</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Desarrolladores</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="/api/documentos/download?file=README_TECHINICAL.md"
                  download
                  className="text-primary hover:underline text-sm font-medium"
                >
                  📄 Markdown
                </a>
              </div>
            </div>

            {/* MVP Checklist */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">MVP Progress Checklist - Status 100%</h4>
                  <p className="text-xs text-muted-foreground mt-1">Completitud por módulo y estado de features (10 min)</p>
                </div>
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">MVP Status</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="/api/documentos/download?file=MVP_PROGRESS_CHECKLIST.md"
                  download
                  className="text-primary hover:underline text-sm font-medium"
                >
                  📄 Markdown
                </a>
              </div>
            </div>

            {/* Architecture */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">Technical Architecture - Diseño del Sistema</h4>
                  <p className="text-xs text-muted-foreground mt-1">Diagramas, seguridad, escalabilidad (25 min)</p>
                </div>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Técnico</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="/api/documentos/download?file=TECHNICAL_ARCHITECTURE.md"
                  download
                  className="text-primary hover:underline text-sm font-medium"
                >
                  📄 Markdown
                </a>
              </div>
            </div>

            {/* Git & Deploy */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">Git & Deploy Status - 3,020+ Commits</h4>
                  <p className="text-xs text-muted-foreground mt-1">Historial, deployment, performance metrics (10 min)</p>
                </div>
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">DevOps</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="/api/documentos/download?file=GIT_AND_DEPLOY_STATUS.md"
                  download
                  className="text-primary hover:underline text-sm font-medium"
                >
                  📄 Markdown
                </a>
              </div>
            </div>

            {/* Setup Guide */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">Download & Use - Guía de Setup</h4>
                  <p className="text-xs text-muted-foreground mt-1">Instrucciones paso a paso para correr localmente (15 min)</p>
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">Getting Started</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="/api/documentos/download?file=DOWNLOAD_AND_USE.md"
                  download
                  className="text-primary hover:underline text-sm font-medium"
                >
                  📄 Markdown
                </a>
              </div>
            </div>

            {/* Paquete Completado */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">Paquete Completado - Resumen May 22</h4>
                  <p className="text-xs text-muted-foreground mt-1">Checklist de completitud, próximos hitos (3 min)</p>
                </div>
                <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded">Resumen</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="/api/documentos/download?file=DOCUMENTATION_COMPLETE_2026-05-22.md"
                  download
                  className="text-primary hover:underline text-sm font-medium"
                >
                  📄 Markdown
                </a>
              </div>
            </div>

            {/* Env Example */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">.env.example - Variables de Entorno</h4>
                  <p className="text-xs text-muted-foreground mt-1">Template sin valores sensibles (reference only)</p>
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">Config</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="/api/documentos/download?file=.env.example"
                  download
                  className="text-primary hover:underline text-sm font-medium"
                >
                  📄 Text File
                </a>
              </div>
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
            Paquete generado: 2026-05-22 | MVP: 100% Production Ready | Production: Live
          </p>
          <p className="mt-2">
            Para más información, lee INVESTOR_BRIEF.md o README_TECHINICAL.md
          </p>
        </div>
      </div>
    </div>
  )
}
