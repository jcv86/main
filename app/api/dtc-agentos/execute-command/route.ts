import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'La ejecución pública de comandos internos de AgentOS fue retirada.',
      code: 'PUBLIC_AGENTOS_COMMAND_EXECUTION_RETIRED',
      message:
        'Los comandos internos solo podrán ejecutarse desde flujos server-owned con autorización y validadores específicos.',
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
