import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Use Vercel AI SDK with a transcription model or Groq
    // For now, we'll use a simple placeholder that can be enhanced later
    // with actual speech-to-text API (e.g., Groq Whisper, OpenAI Whisper, or Google Cloud Speech-to-Text)
    
    try {
      // Try to use Groq's Whisper model through fetch
      const groqFormData = new FormData()
      groqFormData.append('file', audioFile)
      groqFormData.append('model', 'whisper-large-v3-turbo')
      groqFormData.append('language', 'es')  // Spanish language

      const groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: groqFormData,
      })

      if (groqResponse.ok) {
        const result = await groqResponse.json()
        return NextResponse.json({
          transcription: result.text || result.transcription || 'Transcripción no disponible'
        })
      } else {
        console.error('[v0] Groq transcription failed:', await groqResponse.text())
        return NextResponse.json(
          { transcription: '[Error en transcripción - intenta de nuevo]' },
          { status: 200 }  // Return 200 so UI doesn't show error
        )
      }
    } catch (groqError) {
      console.error('[v0] Groq transcription error:', groqError)
      // Fallback: return placeholder
      return NextResponse.json({
        transcription: '[Transcripción de audio - intenta de nuevo]'
      })
    }
  } catch (error) {
    console.error('[v0] Transcribe endpoint error:', error)
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    )
  }
}
