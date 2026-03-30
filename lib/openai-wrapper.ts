/**
 * OpenAI API wrapper for consistent usage across routes
 */

import { OpenAIResponse } from "@/lib/types/api-common"

export interface OpenAICallOptions {
  model?: string
  maxTokens?: number
  temperature?: number
}

export async function callOpenAI(
  systemPrompt: string,
  userMessage: string,
  options: OpenAICallOptions = {}
): Promise<string> {
  const {
    model = "gpt-4o-mini",
    maxTokens = 800,
    temperature = 0.7,
  } = options

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable not set")
  }

  console.log("[v0] Calling OpenAI with model:", model)

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("[v0] OpenAI API error:", error)
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = (await response.json()) as OpenAIResponse

  if (data.error) {
    throw new Error(`OpenAI error: ${data.error.message}`)
  }

  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error("No response content from OpenAI")
  }

  console.log("[v0] OpenAI response received, length:", content.length)
  return content
}

/**
 * Call OpenAI with JSON response parsing
 */
export async function callOpenAIJSON<T = unknown>(
  systemPrompt: string,
  userMessage: string,
  options: OpenAICallOptions = {}
): Promise<T> {
  const response = await callOpenAI(systemPrompt, userMessage, options)
  
  if (!response || response.trim() === "") {
    console.error("[v0] Empty response from OpenAI")
    throw new Error("Empty response from AI - no content to parse")
  }

  try {
    return JSON.parse(response) as T
  } catch (error) {
    console.error("[v0] Failed to parse JSON response:", {
      response: response.substring(0, 200),
      error: (error as Error).message,
    })
    throw new Error(`Failed to parse AI response as JSON: ${(error as Error).message}`)
  }
}
