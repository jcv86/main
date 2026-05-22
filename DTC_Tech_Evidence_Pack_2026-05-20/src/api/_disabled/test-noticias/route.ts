export async function GET() {
  const newsApiKey = process.env.NEWS_API_KEY

  return new Response(
    JSON.stringify({
      newsApiKey: newsApiKey ? 'SET' : 'NOT_SET',
      hasKey: !!newsApiKey,
      keyLength: newsApiKey?.length || 0,
      env: process.env.NODE_ENV
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
