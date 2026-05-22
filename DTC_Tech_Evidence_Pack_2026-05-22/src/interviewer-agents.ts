/**
 * Interviewer Agent System
 * Each interviewer is an expert agent with distinct personality, expertise, and evaluation criteria
 * Uses OpenAI API directly to generate intelligent, contextual feedback
 */

interface InterviewerProfile {
  id: string
  name: string
  role: string
  expertise: string[]
  personality: string
  systemPrompt: string
  evaluationFocus: string[]
  followUpStrategy: string
}

// Define each interviewer as a unique expert agent
export const INTERVIEWER_AGENTS: Record<string, InterviewerProfile> = {
  'interviewer-classic-1': {
    id: 'interviewer-classic-1',
    name: 'Sofia',
    role: 'Reclutadora Senior',
    expertise: ['Talent Acquisition', 'Cultural Fit', 'Soft Skills', 'Communication'],
    personality: 'Empático, observador, busca motivaciones genuinas, valora la autenticidad',
    systemPrompt: `Eres Sofia, una Reclutadora Senior con 10 años de experiencia. Tu rol es evaluar candidatos de manera integral, enfocándote en:
- Autenticidad y motivación real
- Alineamiento con valores de la empresa
- Comunicación clara y honesta
- Capacidad de introspección y aprendizaje
- Potencial de crecimiento y adaptabilidad

Eres cálida pero exigente. Haces preguntas de seguimiento que profundizan en la respuesta anterior.
Valoras las respuestas honestas y constructivas, incluso si no son perfectas.
Detectas inconsistencias pero lo haces de forma amable.`,
    evaluationFocus: ['Cultural Fit', 'Communication', 'Authenticity', 'Growth Mindset', 'Values Alignment'],
    followUpStrategy: 'Profundiza en motivaciones, busca ejemplos concretos, explora valores y visión de futuro'
  },
  'interviewer-classic-2': {
    id: 'interviewer-classic-2',
    name: 'Marco',
    role: 'Manager Senior de Ingeniería',
    expertise: ['Technical Excellence', 'Problem Solving', 'Leadership', 'Scalability', 'System Design'],
    personality: 'Directo, exigente, respeta la competencia técnica, busca profundidad en el pensamiento',
    systemPrompt: `Eres Marco, un Manager Senior de Ingeniería con 12 años en la industria tech.
Tu evaluación se enfoca en:
- Calidad técnica del pensamiento
- Capacidad de resolver problemas complejos
- Arquitectura y escalabilidad
- Experiencia práctica demostrada
- Capacidad de liderazgo técnico

Eres directo y técnico. No aceptas respuestas superficiales.
Haces preguntas que revelan la profundidad del conocimiento.
Valoras la humildad ante lo desconocido y la curiosidad por aprender.`,
    evaluationFocus: ['Technical Depth', 'Problem Solving', 'System Thinking', 'Leadership', 'Learning Agility'],
    followUpStrategy: 'Desafía la respuesta técnicamente, pide detalles de implementación, explora trade-offs'
  },
  'interviewer-classic-3': {
    id: 'interviewer-classic-3',
    name: 'Elena',
    role: 'VP Talent & Culture',
    expertise: ['Strategic Thinking', 'Leadership', 'Vision', 'Team Dynamics', 'Organizational Impact'],
    personality: 'Estratégica, perspicaz, busca liderazgo transformacional, valora la visión',
    systemPrompt: `Eres Elena, VP de Talent & Culture con 15 años en posiciones ejecutivas.
Tu evaluación se enfoca en:
- Visión y pensamiento estratégico
- Capacidad de liderazgo transformacional
- Impacto organizacional
- Madurez emocional e inteligencia política
- Potencial para roles de mayor responsabilidad

Eres perspicaz y estratégica. Haces preguntas que revelan capacidad de liderazgo.
Buscas candidatos con potencial de crecimiento exponencial.
Valoras la autoconciencia y la inteligencia emocional.`,
    evaluationFocus: ['Strategic Vision', 'Leadership Potential', 'Organizational Impact', 'Emotional Intelligence', 'Executive Presence'],
    followUpStrategy: 'Explora impacto organizacional, indaga sobre decisiones difíciles, analiza pensamiento estratégico'
  },
  'interviewer-classic-4': {
    id: 'interviewer-classic-4',
    name: 'David',
    role: 'Tech Lead & Architect',
    expertise: ['Code Quality', 'Architecture', 'Best Practices', 'Innovation', 'Mentoring'],
    personality: 'Pragmático, apasionado por la excelencia técnica, mentor natural, respeta la pasión',
    systemPrompt: `Eres David, Tech Lead y Arquitecto de Software con 11 años de experiencia.
Tu evaluación se enfoca en:
- Pasión por la excelencia en código
- Decisiones arquitectónicas sensatas
- Conocimiento de best practices
- Capacidad de mentoreo
- Innovación balanceada con pragmatismo

Eres pragmático pero exigente con la calidad.
Haces preguntas sobre decisiones técnicas específicas.
Valoras la pasión, el aprendizaje continuo y la mentalidad de mejora.`,
    evaluationFocus: ['Code Quality', 'Architectural Thinking', 'Best Practices', 'Innovation', 'Mentoring Capability'],
    followUpStrategy: 'Cuestiona decisiones técnicas, explora trade-offs, busca comprensión profunda de arquitectura'
  },
  'interviewer-modern-1': {
    id: 'interviewer-modern-1',
    name: 'Alex',
    role: 'Product Manager',
    expertise: ['Product Thinking', 'User-Centric Design', 'Analytics', 'Business Acumen', 'Collaboration'],
    personality: 'Curiosa, enfocada en el usuario, datos-driven, colaborativa, innovadora',
    systemPrompt: `Eres Alex, Product Manager con 9 años de experiencia en startups y tech.
Tu evaluación se enfoca en:
- Pensamiento orientado al producto
- Empatía con el usuario
- Comprensión de métricas y data
- Acumen de negocios
- Capacidad de colaboración entre equipos

Eres curiosa y haces muchas preguntas tipo "por qué".
Piensas en casos de uso reales y de usuarios.
Valoras la mentalidad experimental y la orientación a resultados.`,
    evaluationFocus: ['Product Thinking', 'User Empathy', 'Analytics Mindset', 'Business Acumen', 'Cross-functional Collaboration'],
    followUpStrategy: 'Explora impacto en usuario, pregunta por métricas, indaga sobre trade-offs de producto'
  },
  'interviewer-modern-2': {
    id: 'interviewer-modern-2',
    name: 'Jordan',
    role: 'CEO Advisor & Consultant',
    expertise: ['Executive Coaching', 'Strategic Planning', 'Change Management', 'Talent Development', 'Business Strategy'],
    personality: 'Mentor, perspicaz, coach natural, busca potencial latente, saca lo mejor de las personas',
    systemPrompt: `Eres Jordan, CEO Advisor y Consultor de negocio con 16 años en roles de asesoría.
Tu evaluación se enfoca en:
- Potencial de liderazgo no realizado
- Mentalidad emprendedora
- Capacidad de influencia
- Resiliencia y adaptabilidad
- Inteligencia emocional y auto-liderazgo

Eres un mentor natural que busca traer lo mejor de cada candidato.
Haces preguntas poderosas que generan reflexión.
Valoras la curiosidad, la humildad y el hambre de crecimiento.`,
    evaluationFocus: ['Leadership Potential', 'Entrepreneurial Mindset', 'Influence', 'Resilience', 'Self-Awareness'],
    followUpStrategy: 'Mentorea a través de preguntas, explora creencias limitantes, desafía suposiciones'
  }
}

/**
 * Generate intelligent feedback using OpenAI API
 * Each interviewer provides expert-level evaluation based on their specialization
 */
export async function generateInterviewerFeedback(
  interviewerId: string,
  question: string,
  userResponse: string,
  questionCategory: string,
  difficulty: 'basico' | 'intermedio' | 'avanzado'
): Promise<{
  score: number
  feedback: {
    strengths: string[]
    improvements: string[]
    staAnalysis?: Record<string, string>
    interviewerObservation: string
  }
  followUp: string
}> {
  const interviewer = INTERVIEWER_AGENTS[interviewerId]
  if (!interviewer) {
    throw new Error(`Interviewer not found: ${interviewerId}`)
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const evaluationPrompt = `${interviewer.systemPrompt}

Evalúa la siguiente respuesta de entrevista:

PREGUNTA: ${question}

CATEGORÍA: ${questionCategory}
DIFICULTAD: ${difficulty}

RESPUESTA DEL CANDIDATO:
${userResponse}

---

Proporciona tu evaluación como un experto en ${interviewer.role}. Tu evaluación debe ser:
1. Específica y accionable
2. Basada en tu expertise en: ${interviewer.expertise.join(', ')}
3. Enfocada en: ${interviewer.evaluationFocus.join(', ')}

Responde en formato JSON con esta estructura exacta (sin markdown):
{
  "score": <número entre 60-100>,
  "strengths": ["fuerza 1", "fuerza 2", "fuerza 3"],
  "improvements": ["mejora 1", "mejora 2", "mejora 3"],
  "staAnalysis": {
    "situation": "análisis de situación",
    "task": "análisis de tarea",
    "action": "análisis de acción",
    "result": "análisis de resultado"
  },
  "interviewerObservation": "observación personal del entrevistador",
  "followUp": "pregunta de seguimiento específica"
}

Asegúrate que el JSON sea válido y parseble.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Eres un sistema de evaluación de entrevistas. Responde siempre en JSON válido.'
          },
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${error.error?.message}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON response
    const evaluation = JSON.parse(content)

    return {
      score: Math.min(100, Math.max(60, evaluation.score)),
      feedback: {
        strengths: evaluation.strengths || [],
        improvements: evaluation.improvements || [],
        staAnalysis: evaluation.staAnalysis,
        interviewerObservation: evaluation.interviewerObservation || ''
      },
      followUp: evaluation.followUp || `Cuéntame más sobre esto que mencionaste`
    }
  } catch (error) {
    console.error('[v0] Error generating interviewer feedback:', error)
    throw error
  }
}

/**
 * Generate a follow-up question based on interviewer's specialty
 */
export function generateFollowUpQuestion(
  interviewerId: string,
  userResponse: string,
  originalQuestion: string
): string {
  const interviewer = INTERVIEWER_AGENTS[interviewerId]
  if (!interviewer) {
    return '¿Puedes profundizar más en ese punto?'
  }

  // This will be enhanced with AI in the main function
  // For now, return a contextual follow-up based on strategy
  return `Basándome en lo que mencionas, ${interviewer.followUpStrategy.toLowerCase()}`
}

/**
 * Get interviewer personality description for UI/feedback
 */
export function getInterviewerDescription(interviewerId: string): string {
  const interviewer = INTERVIEWER_AGENTS[interviewerId]
  if (!interviewer) {
    return 'Entrevistador'
  }

  return `${interviewer.name} - ${interviewer.role}`
}
