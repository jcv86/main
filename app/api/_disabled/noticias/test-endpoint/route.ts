import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return new Response(
    JSON.stringify({
      message: 'API News Test Endpoint',
      apiUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Supabase configured' : 'NOT configured',
      timestamp: new Date().toISOString()
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
