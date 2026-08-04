import 'server-only'

import { NextResponse } from 'next/server'

export const ADMIN_UNAVAILABLE_CODE = 'ADMIN_MODEL_NOT_CONFIGURED'

export function adminUnavailableResponse() {
  return NextResponse.json(
    {
      error: 'La administración de usuarios aún no está configurada.',
      code: ADMIN_UNAVAILABLE_CODE,
      message:
        'Se requiere un modelo de roles, auditoría y permisos instalado en la base de datos antes de habilitar esta función.',
    },
    { status: 503 },
  )
}

export function retiredPillarOverrideResponse() {
  return NextResponse.json(
    {
      error: 'Los desbloqueos y reinicios administrativos heredados fueron retirados.',
      code: 'ADMIN_PILLAR_OVERRIDE_RETIRED',
      message:
        'El avance A1 → A4 solo puede originarse en los flujos canónicos y su evidencia persistida.',
    },
    { status: 410 },
  )
}
