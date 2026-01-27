import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

// Schema para el feedback IA
const FeedbackSchema = z.object({
  fortalezas: z.array(z.string()).describe('Fortalezas identificadas en la respuesta'),
  areas_mejora: z.array(z.string()).describe('Áreas que puede mejorar'),
  sugerencias: z.string().describe('Sugerencias específicas para mejorar'),
  score_contenido: z.number().min(0).max(10).describe('Score del contenido (0-10)'),
  score_entrega: z.number().min(0).max(10).describe('Score de cómo fue entregada (0-10)'),
  score_confianza: z.number().min(0).max(10).describe('Score de confianza mostrada (0-10)'),
})

interface FeedbackParams {
  respuesta: string
  pregunta: string
  perfilTipo: string
  cipCapacity: number
}

/**
 * Genera feedback inteligente usando IA para respuestas de entrevista
 */
export async function generarFeedbackIA(params: FeedbackParams) {
  const { respuesta, pregunta, perfilTipo, cipCapacity } = params

  const prompt = `
Eres un coach de entrevistas experto. Analiza esta respuesta de entrevista y proporciona feedback constructivo.

CONTEXTO:
- Pregunta: ${pregunta}
- Perfil del candidato: ${perfilTipo} (tipos DISC)
- Capacidad actual (CIP): ${cipCapacity}%
- Respuesta del candidato: "${respuesta}"

INSTRUCCIONES:
1. Identifica 3 fortalezas específicas de la respuesta
2. Identifica 2-3 áreas de mejora
3. Da sugerencias prácticas y personalizadas según su perfil ${perfilTipo}
4. Score objetivamente en escala 0-10:
   - Contenido: relevancia, estructura, profundidad
   - Entrega: claridad, confianza, natural
   - Confianza: seguridad demostrada, conexión

Recuerda:
- Si perfil es A (Dominancia): valida rapidez de decisión, liderazgo
- Si perfil es B (Influencia): valida comunicación, conexión emocional
- Si perfil es C (Cumplimiento): valida precisión, análisis, detalles
- Si perfil es D (Estabilidad): valida trabajo en equipo, empatía

Si capacidad < 30%, sugiere respuestas más breves. Si > 70%, sugiere profundidad.
`

  try {
    const { object } = await generateObject({
      model: openai('gpt-3.5-turbo'),
      schema: FeedbackSchema,
      prompt,
    })

    return {
      success: true,
      feedback: object,
      promedio_score: (object.score_contenido + object.score_entrega + object.score_confianza) / 3,
    }
  } catch (error) {
    console.error('[v0] Error generating feedback:', error)
    
    // Fallback feedback if IA fails
    return {
      success: false,
      feedback: {
        fortalezas: ['Buena estructura', 'Respuesta clara', 'Ejemplo relevante'],
        areas_mejora: ['Más especificidad', 'Mejor cierre', 'Conexión con pregunta'],
        sugerencias: 'Practica con ejemplos STAR (Situación, Tarea, Acción, Resultado) para respuestas más impactantes.',
        score_contenido: 7,
        score_entrega: 6,
        score_confianza: 6,
      },
      promedio_score: 6.3,
    }
  }
}

/**
 * Genera recomendaciones personalizadas basadas en perfil
 */
export function generarRecomendacionesPerfil(perfilTipo: string, cipCapacity: number): string[] {
  const recomendacionesPorPerfil = {
    A: [
      'Enfatiza resultados y impacto inmediato',
      'Sé directo y conciso en tus respuestas',
      'Demuestra liderazgo y toma de decisiones rápida',
      'Evita rodeos, ve al punto',
    ],
    B: [
      'Cuéntales historias que conecten emocionalmente',
      'Enfatiza el trabajo en equipo y relaciones',
      'Usa ejemplos con impacto humano',
      'Muestra entusiasmo y energía',
    ],
    C: [
      'Aporta datos y hechos concretos',
      'Explica tu proceso de análisis',
      'Demuestra precisión y atención al detalle',
      'Estructura tus respuestas de forma lógica',
    ],
    D: [
      'Enfatiza la estabilidad y confiabilidad',
      'Muestra empatía hacia el equipo',
      'Habla de apoyo y colaboración',
      'Demuestra consistencia en tus acciones',
    ],
  }

  let recomendaciones = recomendacionesPorPerfil[perfilTipo as keyof typeof recomendacionesPorPerfil] || recomendacionesPorPerfil.C

  // Ajustar según capacidad CIP
  if (cipCapacity < 30) {
    recomendaciones.push('Descansa antes de la entrevista - tu capacidad está baja')
  } else if (cipCapacity > 80) {
    recomendaciones.push('Aprovecha tu alta capacidad para respuestas más profundas y elaboradas')
  }

  return recomendaciones
}

/**
 * Calcula score total de entrevista
 */
export function calcularScoreEntrevista(
  scores: number[],
  cipCapacity: number,
  perfilTipo: string
): { score_total: number; nivel: string; mensaje: string } {
  const promedio = scores.reduce((a, b) => a + b, 0) / scores.length

  // Ajustar score por capacidad CIP (si capacidad es baja, score es más bajo)
  const multiplicador_cip = Math.max(0.5, cipCapacity / 100)
  const score_ajustado = promedio * multiplicador_cip

  let nivel = ''
  let mensaje = ''

  if (score_ajustado >= 8.5) {
    nivel = 'Excelente'
    mensaje = 'Estás muy bien preparado. Tus respuestas fueron impactantes y auténticas.'
  } else if (score_ajustado >= 7) {
    nivel = 'Bueno'
    mensaje = 'Muy buenas respuestas. Pequeños ajustes te llevarán al siguiente nivel.'
  } else if (score_ajustado >= 5.5) {
    nivel = 'Regular'
    mensaje = 'Buen inicio. Enfócate en las áreas de mejora y practica más.'
  } else {
    nivel = 'Por mejorar'
    mensaje = 'Necesitas más práctica. Revisa los puntos clave y vuelve a intentar.'
  }

  return {
    score_total: Math.round(score_ajustado * 10) / 10,
    nivel,
    mensaje,
  }
}
