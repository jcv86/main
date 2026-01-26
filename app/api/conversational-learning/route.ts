import { NextRequest } from 'next/server'
import { streamText, generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@supabase/supabase-js'
import { enhancedPlatformBrainQuery } from '@/lib/enhanced-platform-brain'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    const profileContext = await extractLearningProfile(conversationText)

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
      console.error('Error querying brain:', error)
    }

    // Build system prompt
    const systemPrompt = CONVERSATIONAL_SYSTEM_PROMPT
      .replace('{phase}', currentPhase)
      .replace('{profile}', JSON.stringify(profileContext))
      .replace('{bookContext}', bookContext)

    // Stream the response for real-time conversation feel
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7, // Slightly more creative for natural conversation
      maxTokens: 500,
    })

    // Save conversation async (don't wait for it)
    result.done.then(async () => {
      if (userId && userId !== 'demo') {
        try {
          const fullText = await result.text
          await supabase.from('learning_conversations').insert({
            user_id: userId,
            phase: currentPhase,
            user_message: userMessage,
            coach_response: fullText,
            learning_profile: profileContext,
            created_at: new Date().toISOString(),
          })
        } catch (error) {
          console.error('Error saving conversation:', error)
        }
      }
    })

    // Return streaming response
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error in conversational learning:', error)
    return new Response(JSON.stringify({ error: 'Error processing your message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function extractLearningProfile(conversationText: string) {
  try {
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      system: `Extract the user's learning profile from this conversation. 
      Return JSON with: interests (array), experience_level (beginner/intermediate/advanced), 
      learning_style (reading/discussion/practice), goals (array), time_availability (hours per week).
      Be concise and factual.`,
      messages: [
        {
          role: 'user',
          content: conversationText,
        },
      ],
    })

    return JSON.parse(text)
  } catch (error) {
    console.error('Error extracting profile:', error)
    return {
      interests: ['professional development'],
      experience_level: 'intermediate',
      learning_style: 'reading',
      goals: [],
      time_availability: 5,
    }
  }
}
