import { NextResponse } from 'next/server'

/**
 * The former experimental transcription endpoint was not used by the
 * canonical A2 experience and did not have a production-grade upload/auth
 * boundary. Keep an explicit tombstone so old clients fail closed.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'La transcripción de audio no está disponible.',
      code: 'a2_transcription_retired',
    },
    {
      status: 410,
      headers: { 'Cache-Control': 'private, no-store' },
    },
  )
}
