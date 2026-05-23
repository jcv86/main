'use client'

export default function DocumentsPage() {
  const documents = [
    { name: 'INFO.md', title: 'Información Completa del Proyecto' },
    { name: 'LEEME.md', title: 'Introducción General' },
    { name: 'RESUMEN_INVERSOR.md', title: 'Resumen Inversor - Ejecutivo' },
    { name: 'LISTA_PROGRESO_MVP.md', title: 'Lista de Progreso MVP' },
    { name: 'ARQUITECTURA_TECNICA.md', title: 'Arquitectura Técnica' },
    { name: 'LEEME_TECNICO.md', title: 'Guía Técnica Completa' },
    { name: 'ESTADO_GIT_Y_DEPLOY.md', title: 'Estado de Git y Deploy' },
    { name: 'DESCARGA_Y_USO.md', title: 'Descarga y Uso' },
    { name: 'DOCUMENTACION_COMPLETA_2026-05-22.md', title: 'Documentación Completa' },
  ]

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Centro de Descargas</h1>
          <p className="text-xl text-muted-foreground">DTC - Despega Tu Carrera</p>
          <p className="text-sm text-muted-foreground mt-2">Fecha: 22 de Mayo 2026 | Status: 100% Production Ready | Versión: 6.0.0</p>
        </div>

        {/* Bundles */}
        <div className="mb-12 bg-card border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">📦 Paquetes Descargables</h2>
          <div className="space-y-4">
            <div className="border rounded p-4 hover:bg-accent transition">
              <h3 className="font-bold text-lg mb-2">Paquete Principal (22 KB)</h3>
              <p className="text-sm mb-3">9 documentos principales en español + .env.ejemplo</p>
              <a 
                href="/api/documentos/download?file=ENTREGA_FINAL_22_MAYO_2026.tar.gz"
                className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90"
              >
                Descargar TAR.GZ
              </a>
            </div>
            <div className="border rounded p-4 hover:bg-accent transition">
              <h3 className="font-bold text-lg mb-2">Documentación Completa (753 KB)</h3>
              <p className="text-sm mb-3">297+ documentos técnicos en español</p>
              <a 
                href="/api/documentos/download?file=DOCUMENTOS_COMPLETOS_22_MAYO_2026.tar.gz"
                className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90"
              >
                Descargar TAR.GZ
              </a>
            </div>
          </div>
        </div>

        {/* Main Documents */}
        <div className="bg-card border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">📄 Documentos Principales</h2>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.name} className="border rounded p-4 hover:bg-accent transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">{doc.name}</p>
                  </div>
                  <div className="flex gap-2 whitespace-nowrap">
                    <a 
                      href={`/api/documentos/ver/${doc.name}`}
                      className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded hover:opacity-90"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver
                    </a>
                    <a 
                      href={`/api/documentos/download?file=${doc.name}`}
                      className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded hover:opacity-90"
                    >
                      Descargar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground border-t pt-8">
          <p>Todos los documentos en español • 22 de Mayo 2026 • Versión 6.0.0</p>
          <p className="mt-2">Estado: 100% Listo para Entregar a CORFO, StartUp Chile e Inversores</p>
        </div>
      </div>
    </main>
  )
}
