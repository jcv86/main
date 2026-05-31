/**
 * Direct OpenAI API calls (no AI SDK dependency)
 * Uses fetch with OPENAI_API_KEY environment variable
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_BASE_URL = 'https://api.openai.com/v1'

if (!OPENAI_API_KEY) {
  console.warn('[v0] Warning: OPENAI_API_KEY not set')
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIRequestOptions {
  model?: string
  temperature?: number
  max_tokens?: number
  top_p?: number
}

/**
 * Call OpenAI API directly with fetch
 */
export async function callOpenAI(
  messages: OpenAIMessage[],
  options: OpenAIRequestOptions = {}
): Promise<string> {
  const {
    model = 'gpt-4-turbo',
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
  } = options

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
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
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('No content in OpenAI response')
  }

  return content
}

/**
 * Parse JSON from OpenAI response with fallback
 */
export async function callOpenAIJSON<T>(
  messages: OpenAIMessage[],
  options: OpenAIRequestOptions = {}
): Promise<T> {
  const responseText = await callOpenAI(messages, options)

  try {
    // Try to extract JSON from code blocks
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonString = jsonMatch ? jsonMatch[1].trim() : responseText

    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error('[v0] Failed to parse JSON response:', responseText)
    throw new Error('Failed to parse OpenAI response as JSON')
  }
}

/**
 * Generate text with system prompt
 */
export async function generateWithSystem(
  systemPrompt: string,
  userMessage: string,
  options: OpenAIRequestOptions = {}
): Promise<string> {
  return callOpenAI(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    options
  )
}

/**
 * Generate structured JSON with system prompt
 */
export async function generateJSONWithSystem<T>(
  systemPrompt: string,
  userMessage: string,
  options: OpenAIRequestOptions = {}
): Promise<T> {
  const enhancedPrompt = `${systemPrompt}\n\nRespond with valid JSON only, no additional text.`
  
  return callOpenAIJSON<T>(
    [
      { role: 'system', content: enhancedPrompt },
      { role: 'user', content: userMessage },
    ],
    options
  )
}
