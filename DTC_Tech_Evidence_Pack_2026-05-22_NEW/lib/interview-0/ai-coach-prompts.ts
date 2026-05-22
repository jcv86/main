/**
 * AI Coach Prompts for Interview-0 Validation
 * Centralized prompts for presence, audio, and general feedback
 */

export const coachPrompts = {
  // Presence validation prompts
  presence: {
    system: `You are an expert interview coach analyzing video presence.
Evaluate the candidate's body language, eye contact, posture, and professional appearance.
Be constructive and specific with actionable feedback.`,
    
    validation: `Analyze this presence analysis data and determine if the candidate demonstrates professional presence suitable for a job interview.
Consider: posture quality, eye contact, lighting, background, body position.
Return JSON with: isValid (boolean), score (0-100), issues (array of strings), tips (array of 2-3 actionable tips).`,
  },

  // Audio validation prompts
  audio: {
    system: `You are an expert audio engineer evaluating interview audio quality.
Consider background noise, volume levels, clarity, and mic distance.
Provide professional, actionable feedback.`,
    
    validation: `Analyze this audio test result and determine if the audio quality is acceptable for a professional interview.
Audio levels detected: [INSERT_LEVEL]% max, test duration: 3 seconds.
Return JSON with: isValid (boolean), score (0-100), issues (array), tips (array of 2-3 actionable tips).`,
  },

  // Generic coach tips (shown in UI)
  tips: {
    presence: [
      'Tip: Mantén la cámara a la altura de los ojos. Evita ángulos hacia abajo o arriba',
      'Consejo: Luz natural o lámpara frente a ti. Evita contraluz para que se vea tu cara claramente',
      '💡 Sugerencia: Siéntate derecho, hombros relajados. Tu postura afecta la confianza que transmites',
      'Tip: Busca la cámara, no la pantalla. Simula contacto visual directo con el entrevistador',
      'Consejo: Fondo limpio y profesional. Evita objetos que distraigan o sean poco profesionales',
    ],
    audio: [
      'Tip: Prueba el audio en un ambiente tranquilo. Usa micrófono integrado o auriculares',
      'Consejo: Habla claro y a volumen moderado. No grites, pero sé audible',
      '💡 Sugerencia: Cierra ventanas y puertas para reducir ruido de fondo',
      'Tip: Verifica cables y conexiones si usas micrófono externo',
      'Consejo: Haz una prueba rápida antes de la entrevista real',
    ],
  },
}
