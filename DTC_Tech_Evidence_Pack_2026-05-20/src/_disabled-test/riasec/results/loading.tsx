export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando tus resultados RIASEC...</p>
      </div>
    </div>
  )
}
