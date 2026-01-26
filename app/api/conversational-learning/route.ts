import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { enhancedPlatformBrainQuery } from '@/lib/enhanced-platform-brain'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const CONVERSATIONAL_SYSTEM_PROMPT = `You are Sofia, a warm and conversational learning coach who understands that everyone learns differently. 

Your approach:
- Have natural conversations, NOT ask rigid survey questions - feel like a friend, not a form
- Listen carefully to what the user tells you about their interests, experience, and learning style
- Guide the conversation naturally through these phases:
  1. Greeting: Build rapport, share enthusiasm about their interests
  2. Exploration: Deep dive naturally into their specific goals, experience, challenges, and dreams
  3. Recommendations: Suggest relevant books and resources based on what they've shared - make it personal
  4. Planning: Co-create a realistic learning path that fits their life

Key principles:
- Be warm, encouraging, genuinely curious - this is a real conversation
- Remember and reference what they've shared naturally throughout
- Adapt your vocabulary and style to theirs - mirror their energy
- When suggesting books, explain WHY it matches them specifically
- Ask follow-up questions that show you're listening, not just proceeding through steps
- Help them discover interests they didn't know they had by making connections
- Celebrate their goals and validate their journey

IMPORTANT: When suggesting actions or commitments:
- NEVER impose a single path - always offer AT LEAST 3 options/approaches
- Let the user choose what resonates with them
- Format options clearly and let them decide
- Each option should have a different approach/perspective
- This respects their autonomy and learning preference

Response format:
- Keep responses conversational (usually 2-4 sentences for first interactions, can be longer as you build rapport)
- Use their name if you've learned it
- When presenting options, format them clearly:
  * Option A: [description]
  * Option B: [description]
  * Option C: [description]
- End with a genuine question inviting them to choose or continue the conversation
- Make everything feel like a chat, not an interview

Current conversation phase: {phase}
User's learning profile so far: {profile}
Related books available: {bookContext}`

export async function POST(request: NextRequest) {
  try {
    const { userMessage, conversationHistory, userId, email } = await request.json()

    console.log('[v0] API received:', { userMessage: userMessage?.substring(0, 50), userId })

    // Get user's learning profile from conversation
    const conversationText = conversationHistory
      .map((m: any) => `${m.sender === 'user' ? 'User' : 'Coach'}: ${m.content}`)
      .join('\n')

    // Determine current phase
    let currentPhase = 'greeting'
    const messageCount = conversationHistory.filter((m: any) => m.sender === 'user').length
    if (messageCount >= 1) currentPhase = 'exploration'
    if (messageCount >= 3) currentPhase = 'recommendations'
    if (messageCount >= 5) currentPhase = 'planning'

    // Build user profile from conversation
    let profileContext
    try {
      profileContext = await extractLearningProfile(conversationText, userMessage)
      console.log('[v0] Profile extracted:', profileContext)
    } catch (error) {
      console.error('[v0] Error extracting profile:', error)
      profileContext = {
        interests: ['professional development'],
        experience_level: 'intermediate',
        learning_style: 'reading',
        goals: [],
        time_availability: 5,
      }
    }

    // Query our brain system for relevant books
    let bookContext = ''
    try {
      const brainResults = await enhancedPlatformBrainQuery(
        `Recommend books for someone interested in: ${profileContext.interests.join(', ')}`,
        { limit: 3 }
      )
      bookContext = brainResults.results
        .slice(0, 3)
        .map((r: any) => `- ${r.title} by ${r.author} (${r.category})`)
        .join('\n')
    } catch (error) {
      console.error('[v0] Error querying brain:', error)
    }

    // Build system prompt
    const systemPrompt = CONVERSATIONAL_SYSTEM_PROMPT
      .replace('{phase}', currentPhase)
      .replace('{profile}', JSON.stringify(profileContext))
      .replace('{bookContext}', bookContext)

    console.log('[v0] Creating OpenAI stream...')

    // Create streaming response with OpenAI API
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    })

    console.log('[v0] Stream created, converting to response...')

    // Convert OpenAI stream to text stream for response
    const encoder = new TextEncoder()
    let fullText = ''

    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullText += content
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()

          // After stream is done, save conversation in background
          if (userId && userId !== 'demo') {
            saveConversationWithText(userMessage, userId, currentPhase, profileContext, fullText).catch(
              (error) => console.error('[v0] Error saving conversation:', error)
            )
          }
        } catch (error) {
          console.error('[v0] Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('[v0] Error in conversational learning:', error)
    return new Response(JSON.stringify({ error: 'Error processing your message', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function saveConversationWithText(
  userMessage: string,
  userId: string,
  phase: string,
  profile: any,
  coachResponse: string
) {
  if (!userId || userId === 'demo') return

  try {
    await supabase.from('learning_conversations').insert({
      user_id: userId,
      phase: phase,
      user_message: userMessage,
      coach_response: coachResponse,
      learning_profile: profile,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error saving conversation:', error)
  }
}

async function saveConversation(
  userMessage: string,
  userId: string,
  phase: string,
  profile: any,
  stream: AsyncIterable<any>
) {
  if (!userId || userId === 'demo') return

  try {
    let fullText = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        fullText += content
      }
    }

    await supabase.from('learning_conversations').insert({
      user_id: userId,
      phase: phase,
      user_message: userMessage,
      coach_response: fullText,
      learning_profile: profile,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error saving conversation:', error)
  }
}

async function extractLearningProfile(conversationText: string, userMessage: string) {
  try {
    // Use conversation text if available, otherwise use just the user message
    const textToAnalyze = conversationText.trim() || userMessage

    if (!textToAnalyze) {
      throw new Error('No text to analyze')
    }

    console.log('[v0] Extracting profile from text:', textToAnalyze.substring(0, 100))

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Extract the user's learning profile from this text. 
          Return ONLY valid JSON (no markdown, no code blocks) with: 
          {"interests": [], "experience_level": "intermediate", "learning_style": "reading", "goals": [], "time_availability": 5}`,
        },
        {
          role: 'user',
          content: textToAnalyze,
        },
      ],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content || ''
    console.log('[v0] Extracted profile response:', content.substring(0, 100))

    // Clean up the response in case it has markdown code blocks
    let jsonStr = content.trim()
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    }

    const parsed = JSON.parse(jsonStr)
    return {
      interests: parsed.interests || ['professional development'],
      experience_level: parsed.experience_level || 'intermediate',
      learning_style: parsed.learning_style || 'reading',
      goals: parsed.goals || [],
      time_availability: parsed.time_availability || 5,
    }
  } catch (error) {
    console.error('[v0] Error in extractLearningProfile:', error)
    // Return sensible defaults
    return {
      interests: ['professional development'],
      experience_level: 'intermediate',
      learning_style: 'reading',
      goals: [],
      time_availability: 5,
    }
  }
}
