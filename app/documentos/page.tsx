export default function DocumentosPage() {
  const bundles = [
    {
      name: "Paquete Principal de Entrega",
      file: "ENTREGA_FINAL_22_MAYO_2026.tar.gz",
      size: "22 KB",
      description: "9 documentos principales en español. Recomendado para inversores, CORFO y StartUp Chile.",
      featured: true,
    },
    {
      name: "Documentación Completa",
      file: "DOCUMENTOS_COMPLETOS_22_MAYO_2026.tar.gz",
      size: "753 KB",
      description: "Todos los documentos técnicos (297+ archivos) en español.",
    },
    {
      name: "Paquete Técnico Completo",
      file: "DTC_Tech_Evidence_Pack_2026-05-22.tar.gz",
      size: "2.7 MB",
      description: "Código fuente completo con documentación técnica.",
    },
    {
      name: "Documentación Bilingüe",
      file: "Paquete_Documentacion_Completo_2026-05-22.tar.gz",
      size: "781 KB",
      description: "Documentación en español e inglés (referencia técnica).",
    },
  ]

  const documentos = [
    { file: "INFO.md", titulo: "Información del Proyecto", categoria: "General" },
    { file: "LEEME.md", titulo: "Introducción General", categoria: "General" },
    { file: "RESUMEN_INVERSOR.md", titulo: "Resumen para Inversores", categoria: "Ejecutivo" },
    { file: "LISTA_PROGRESO_MVP.md", titulo: "Estado del MVP (100%)", categoria: "Progreso" },
    { file: "ARQUITECTURA_TECNICA.md", titulo: "Arquitectura Técnica", categoria: "Técnico" },
    { file: "LEEME_TECNICO.md", titulo: "Guía Técnica", categoria: "Técnico" },
    { file: "ESTADO_GIT_Y_DEPLOY.md", titulo: "Estado Git y Deploy", categoria: "DevOps" },
    { file: "DESCARGA_Y_USO.md", titulo: "Descarga y Uso", categoria: "Primeros Pasos" },
    { file: "DOCUMENTACION_COMPLETA_2026-05-22.md", titulo: "Documentación Completa", categoria: "Referencia" },
  ]

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            Centro de Descargas
          </h1>
          <p className="text-xl text-muted-foreground mb-2">DTC - Despega Tu Carrera</p>
          <p className="text-sm text-muted-foreground">
            22 de Mayo 2026 · 100% Listo para Producción · Versión 6.0.0
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Paquetes Descargables</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {bundles.map((bundle) => (
              <article
                key={bundle.file}
                className={`rounded-lg border p-6 ${
                  bundle.featured ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                {bundle.featured && (
                  <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                    Recomendado
                  </span>
                )}
                <h3 className="text-lg font-semibold text-foreground mb-2">{bundle.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">Tamaño: {bundle.size}</p>
                <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{bundle.description}</p>
                <a
                  href={`/descargas/${bundle.file}`}
                  download
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Descargar TAR.GZ
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Documentos Individuales</h2>
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {documentos.map((doc) => (
              <div
                key={doc.file}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{doc.titulo}</h3>
                  <p className="text-xs text-muted-foreground">
                    {doc.categoria} · {doc.file}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/descargas/documentos/${doc.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-md border border-border text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    Ver
                  </a>
                  <a
                    href={`/descargas/documentos/${doc.file}`}
                    download
                    className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Descargar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-3">Cómo usar los archivos</h2>
          <ol className="space-y-2 text-sm text-foreground/80 list-decimal list-inside leading-relaxed">
            <li>Descargar el paquete principal: <strong>ENTREGA_FINAL_22_MAYO_2026.tar.gz</strong></li>
            <li>Extraer: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">tar -xzf ENTREGA_FINAL_22_MAYO_2026.tar.gz</code></li>
            <li>Leer primero: <strong>RESUMEN_INVERSOR.md</strong> (para inversores) o <strong>LEEME.md</strong> (general)</li>
            <li>Convertir a PDF: abrir el archivo en navegador y usar Ctrl+P / Cmd+P</li>
          </ol>
        </section>

        <footer className="text-center text-sm text-muted-foreground">
          <p>DTC - Despega Tu Carrera · 22 de Mayo 2026</p>
          <p>Status: 100% Production Ready · Go-Live: 23 de Mayo 2026</p>
        </footer>
      </div>
    </main>
  )
}
