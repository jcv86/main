import { NextResponse } from 'next/server'

const retiredResponse = () =>
  NextResponse.json(
    {
      error: 'La carga pública de ofertas ficticias fue retirada.',
      code: 'A4_PUBLIC_JOB_SEED_RETIRED',
      replacement: '/api/a4/job-matching',
    },
    {
      status: 410,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )

export async function POST() {
  return retiredResponse()
}

export async function GET() {
  return retiredResponse()
}
