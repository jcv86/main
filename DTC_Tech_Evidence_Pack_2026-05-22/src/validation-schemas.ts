// Validation Schemas - Zod schemas para validación estructurada
import { z } from 'zod'

// A1 Despega Cerebral - DISC Test
export const a1DISCResponseSchema = z.object({
  responses: z.array(z.number().min(1).max(4)).min(12).max(12),
  completed_at: z.string().datetime().optional(),
})

// A2 Conozcamonos 2 - Respuestas
export const a2ConozcamosSchema = z.object({
  objective: z.string()
    .min(10, 'Objetivo muy corto')
    .max(200, 'Objetivo muy largo')
    .trim(),
  learning_preferences: z.array(z.string()).min(1, 'Selecciona al menos un método'),
  weekly_hours: z.enum(['5-10', '10-15', '15-20', '20+']),
  barriers: z.array(z.string()).min(1, 'Selecciona al menos una barrera'),
  plan_structure: z.enum(['structured', 'flexible', 'intensive', 'mixed']),
  skills: z.array(z.string().min(3).max(50)).min(1).max(5),
})

// Búsqueda
export const searchQuerySchema = z.object({
  query: z.string()
    .min(2, 'Búsqueda muy corta')
    .max(100, 'Búsqueda muy larga')
    .trim()
    .refine(
      (val) => !/^[a-z]{20,}$/.test(val.toLowerCase()),
      'Búsqueda no válida'
    ),
  discProfile: z.string().optional(),
})

// Respuesta de búsqueda
export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string().optional(),
  rating: z.number().optional(),
  difficulty: z.string().optional(),
  tags: z.array(z.string()).optional(),
  referenceLinks: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    type: z.string()
  })).optional()
})

// Ruta personalizada guardada
export const routeSaveSchema = z.object({
  user_id: z.string().uuid(),
  ruta_30_dias: z.unknown(),
  ruta_60_dias: z.unknown(),
  ruta_90_dias: z.unknown(),
  focos_priorizados: z.array(z.string()),
  orden_avance: z.object({
    objective: z.string(),
    timePerWeek: z.number()
  }),
  ruta_activa: z.enum(['30', '60', '90']),
})
