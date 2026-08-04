import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'La carga pública legacy de documentos del Día 1 fue retirada.',
      code: 'A2_DAY1_PUBLIC_UPLOAD_RETIRED',
      replacement: '/api/a2/day1/analyze',
      message:
        'El Día 1 canónico guarda evidencia estructurada. Los archivos personales no se publicarán hasta disponer de almacenamiento privado verificado.',
    },
    {
      status: 410,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )
}
