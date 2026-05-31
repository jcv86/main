export default function VisualizarDocumento() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Ver Documentos Públicos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEEME */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-bold mb-3">LEEME - Descripción General</h3>
            <div className="flex gap-3">
              <a
                href="/documentos/LEEME"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Ver en navegador →
              </a>
            </div>
          </div>

          {/* RESUMEN_INVERSOR */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-bold mb-3">Resumen Inversor</h3>
            <div className="flex gap-3">
              <a
                href="/documentos/RESUMEN_INVERSOR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Ver en navegador →
              </a>
            </div>
          </div>

          {/* LISTA_PROGRESO_MVP */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-bold mb-3">Lista de Progreso MVP</h3>
            <div className="flex gap-3">
              <a
                href="/documentos/LISTA_PROGRESO_MVP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Ver en navegador →
              </a>
            </div>
          </div>

          {/* ARQUITECTURA_TECNICA */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-bold mb-3">Arquitectura Técnica</h3>
            <div className="flex gap-3">
              <a
                href="/documentos/ARQUITECTURA_TECNICA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Ver en navegador →
              </a>
            </div>
          </div>

          {/* LEEME_TECNICO */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-bold mb-3">Guía Técnica Completa</h3>
            <div className="flex gap-3">
              <a
                href="/documentos/LEEME_TECNICO"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Ver en navegador →
              </a>
            </div>
          </div>

          {/* ESTADO_GIT_Y_DEPLOY */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-bold mb-3">Estado de Git y Deploy</h3>
            <div className="flex gap-3">
              <a
                href="/documentos/ESTADO_GIT_Y_DEPLOY"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Ver en navegador →
              </a>
            </div>
          </div>

          {/* DESCARGA_Y_USO */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-bold mb-3">Descarga y Uso</h3>
            <div className="flex gap-3">
              <a
                href="/documentos/DESCARGA_Y_USO"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Ver en navegador →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 Tip: Presiona Ctrl+P (Windows) o Cmd+P (Mac) mientras ves un documento para guardar como PDF
          </p>
        </div>
      </div>
    </div>
  )
}
