// OpenAI Helper - Centralizado para todos los calls de IA
// Usa OPENAI_API_KEY directamente, sin AI SDK

export interface OpenAIOptions {
  temperature?: number
  max_tokens?: number
  top_p?: number
}

export async function callOpenAI(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  model: string = 'gpt-4o-mini',
  options: OpenAIOptions = {}
): Promise<string> {
  const {
    temperature = 0.7,
    max_tokens = 2000,
    top_p = 1,
  } = options

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      top_p,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('[v0] OpenAI API error:', error)
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function callOpenAIStructured<T>(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  schema: object,
  model: string = 'gpt-4o-mini',
  options: OpenAIOptions = {}
): Promise<T> {
  const {
    temperature = 0.7,
    max_tokens = 2000,
    top_p = 1,
  } = options

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      top_p,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'response',
          schema,
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('[v0] OpenAI API error:', error)
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || '{}'
  return JSON.parse(content)
}

export async function callOpenAIStream(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  model: string = 'gpt-4o-mini',
  options: OpenAIOptions = {}
): Promise<ReadableStream> {
  const {
    temperature = 0.7,
    max_tokens = 2000,
    top_p = 1,
  } = options

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      top_p,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('[v0] OpenAI API error:', error)
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
  }

  return response.body as ReadableStream
}
