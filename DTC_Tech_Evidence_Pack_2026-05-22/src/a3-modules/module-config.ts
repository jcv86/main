// Complete configuration for all 10 Pillar 3 modules
import type { Module } from './types';

export const ALL_MODULES: Record<string, Module> = {
  // Module 1: Auditoría Inicial
  'auditoria-inicial': {
    id: 'auditoria-inicial',
    name: 'Auditoría Inicial',
    description:
      'Evaluación diagnóstica inicial para establecer tu punto de partida',
    level: 1,
    xp: 70,
    estimatedDuration: 35,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: [],
    nextModule: 'metodo-star',
    sections: [
      {
        id: 'intro-video',
        type: 'lecture',
        title: 'Bienvenida a Pillar 3',
        description: 'Introducción al sistema de entrenamiento',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 0,
          passingPoints: 0,
        },
        content: {
          videoUrl: '/videos/auditoria-inicial-intro.mp4',
          duration: 180,
          learningObjectives: ['Entender la estructura de Pillar 3'],
          keyPoints: ['5 fases de desarrollo', 'Sistema de XP', 'Progresión'],
        },
      },
      {
        id: 'interview-initial',
        type: 'interview',
        title: 'Entrevista Inicial',
        description: 'Cuéntame sobre ti y tus objetivos',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 70,
          passingPoints: 49,
          llmRubric: {
            criteria: [
              {
                name: 'Claridad y Coherencia',
                weight: 20,
              },
              {
                name: 'Autoconocimiento',
                weight: 20,
              },
              {
                name: 'Objetivos Definidos',
                weight: 20,
              },
              {
                name: 'Motivación',
                weight: 20,
              },
              {
                name: 'Disposición al Cambio',
                weight: 20,
              },
            ],
            instructions:
              'Evalúa la calidad y profundidad de la respuesta del usuario',
          },
        },
        content: {
          scenario: 'Entrevista de diagnóstico inicial',
          prompt:
            'Cuéntame: ¿Quién eres? ¿Cuál es tu situación actual? ¿Cuáles son tus objetivos profesionales?',
          recordingTime: 900, // 15 min
          evaluationRubric: {
            criteria: [
              { name: 'Claridad y Coherencia', weight: 20, description: '' },
              { name: 'Autoconocimiento', weight: 20, description: '' },
              { name: 'Objetivos Definidos', weight: 20, description: '' },
              { name: 'Motivación', weight: 20, description: '' },
              { name: 'Disposición al Cambio', weight: 20, description: '' },
            ],
          },
        },
      },
    ],
  },

  // Module 2: Método STAR
  'metodo-star': {
    id: 'metodo-star',
    name: 'Método STAR',
    description:
      'Aprende y practica el framework STAR para responder entrevistas',
    level: 2,
    xp: 120,
    estimatedDuration: 120,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: ['auditoria-inicial'],
    nextModule: 'analisis-vacante',
    sections: [
      {
        id: 'star-lecture',
        type: 'lecture',
        title: 'El Método STAR',
        description: 'Estructura tu respuesta: Situation, Task, Action, Result',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 0,
          passingPoints: 0,
        },
        content: {
          videoUrl: '/videos/metodo-star.mp4',
          duration: 300,
          learningObjectives: [
            'Entender cada componente STAR',
            'Identificar historias relevantes',
          ],
          keyPoints: [
            'S: Contexto específico',
            'T: Tu responsabilidad',
            'A: Acciones que tomaste',
            'R: Resultados medibles',
          ],
          slides: ['/slides/star-1.jpg', '/slides/star-2.jpg'],
        },
      },
      {
        id: 'star-test',
        type: 'test',
        title: 'Test: Análisis STAR',
        description: 'Demuestra tu comprensión del framework',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 50,
          passingPoints: 35,
        },
        content: {
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: '¿Cuál es el propósito principal del framework STAR?',
              options: [
                'Estructurar respuestas de entrevista de forma clara',
                'Memorizar historias predefinidas',
                'Impresionar con términos técnicos',
              ],
              correctAnswer: '0',
              explanation:
                'STAR ayuda a estructurar tus respuestas de manera clara y coherente',
              points: 10,
            },
            {
              id: 'q2',
              type: 'free-response',
              question: 'Proporciona un ejemplo de una acción STAR de tu experiencia',
              correctAnswer: 'N/A',
              explanation: 'Las respuestas se evaluarán por LLM',
              points: 40,
            },
          ],
          passingScore: 70,
          randomizeOrder: false,
          showCorrectAnswersImmediately: true,
        },
      },
      {
        id: 'star-interview',
        type: 'interview',
        title: 'Practica STAR',
        description: 'Graba tu respuesta usando el método STAR',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 70,
          passingPoints: 49,
          llmRubric: {
            criteria: [
              { name: 'Estructura STAR', weight: 30 },
              { name: 'Claridad', weight: 20 },
              { name: 'Resultados Cuantificables', weight: 30 },
              { name: 'Relevancia', weight: 20 },
            ],
            instructions:
              'Evalúa si la respuesta sigue correctamente el framework STAR',
          },
        },
        content: {
          scenario:
            'Describe una situación donde demostraste liderazgo usando STAR',
          prompt:
            'Cuéntame sobre un momento en que lideraste un proyecto. Usa STAR: Situation, Task, Action, Result',
          recordingTime: 600,
          evaluationRubric: {
            criteria: [
              {
                name: 'Estructura STAR',
                weight: 30,
                description: 'Sigue claramente el framework STAR',
              },
              {
                name: 'Claridad',
                weight: 20,
                description: 'Fácil de seguir y entender',
              },
              {
                name: 'Resultados Cuantificables',
                weight: 30,
                description: 'Incluye métricas y resultados medibles',
              },
              {
                name: 'Relevancia',
                weight: 20,
                description: 'La historia es relevante para el rol',
              },
            ],
          },
        },
      },
    ],
  },

  // Module 3: CV Inteligente (Already Real)
  'cv-inteligente': {
    id: 'cv-inteligente',
    name: 'CV Inteligente',
    description: 'Herramienta de análisis y optimización de CV',
    level: 2,
    xp: 120,
    estimatedDuration: 90,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: ['metodo-star'],
    nextModule: 'analisis-vacante',
    sections: [
      {
        id: 'cv-analysis',
        type: 'task',
        title: 'Análisis de Tu CV',
        description: 'Sube tu CV para análisis inteligente',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 120,
          passingPoints: 84,
        },
        content: {
          instructions: 'Sube tu CV en PDF o Word para análisis detallado',
          submissionType: 'file',
          evaluationCriteria: [
            'Completitud de información',
            'Claridad de logros',
            'ATS compatibility',
          ],
        },
      },
    ],
  },

  // Module 4: Análisis de Vacante
  'analisis-vacante': {
    id: 'analisis-vacante',
    name: 'Análisis de Vacante',
    description: 'Aprende a analizar ofertas de trabajo estratégicamente',
    level: 2,
    xp: 120,
    estimatedDuration: 90,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: ['metodo-star'],
    nextModule: 'entrenamiento-guiado',
    sections: [
      {
        id: 'vacancy-lecture',
        type: 'lecture',
        title: 'Análisis Estratégico de Vacantes',
        description: 'Cómo evaluar una oportunidad laboral',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 0,
          passingPoints: 0,
        },
        content: {
          videoUrl: '/videos/analisis-vacante.mp4',
          duration: 300,
          learningObjectives: [
            'Identificar requisitos clave',
            'Evaluar fit cultural',
          ],
          keyPoints: [
            'Requisitos vs deseos',
            'Señales rojas',
            'Oportunidades de crecimiento',
          ],
        },
      },
      {
        id: 'vacancy-test',
        type: 'test',
        title: 'Test: Análisis de Vacante',
        description: 'Demuestra tu capacidad de análisis',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 40,
          passingPoints: 28,
        },
        content: {
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: '¿Cuál es el primer paso al analizar una vacante?',
              options: [
                'Leer el título del trabajo',
                'Identificar requisitos esenciales vs deseables',
                'Aplicar inmediatamente',
              ],
              correctAnswer: '1',
              explanation:
                'Distinguir entre requisitos esenciales y deseables es fundamental',
              points: 20,
            },
          ],
          passingScore: 70,
          randomizeOrder: false,
          showCorrectAnswersImmediately: true,
        },
      },
      {
        id: 'vacancy-interview',
        type: 'interview',
        title: 'Análisis en Vivo',
        description: 'Presenta tu análisis de una vacante real',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 80,
          passingPoints: 56,
          llmRubric: {
            criteria: [
              { name: 'Análisis de Requisitos', weight: 25 },
              { name: 'Evaluación de Fit', weight: 25 },
              { name: 'Identificación de Gaps', weight: 25 },
              { name: 'Propuesta de Valor', weight: 25 },
            ],
            instructions: 'Evalúa la calidad y profundidad del análisis',
          },
        },
        content: {
          scenario: 'Análisis de una vacante específica',
          prompt:
            'Analiza esta vacante: ¿Cuáles son los requisitos clave? ¿Cuál es tu fit? ¿Qué gaps tienes?',
          recordingTime: 600,
          evaluationRubric: {
            criteria: [
              {
                name: 'Análisis de Requisitos',
                weight: 25,
                description: 'Identifica claramente requisitos esenciales',
              },
              {
                name: 'Evaluación de Fit',
                weight: 25,
                description: 'Evalúa realísticamente tu alineación',
              },
              {
                name: 'Identificación de Gaps',
                weight: 25,
                description: 'Reconoce áreas de mejora',
              },
              {
                name: 'Propuesta de Valor',
                weight: 25,
                description: 'Presenta tu propuesta de valor claramente',
              },
            ],
          },
        },
      },
    ],
  },

  // Module 5: Análisis Multimodal (Already Real)
  'analisis-multimodal': {
    id: 'analisis-multimodal',
    name: 'Análisis Multimodal',
    description: 'Análisis avanzado de video y audio',
    level: 2,
    xp: 120,
    estimatedDuration: 60,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: ['metodo-star'],
    nextModule: 'entrenamiento-estructurado',
    sections: [
      {
        id: 'multimodal-analysis',
        type: 'task',
        title: 'Análisis Multimodal',
        description: 'Carga un video para análisis completo',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 120,
          passingPoints: 84,
        },
        content: {
          instructions: 'Carga un video de tu respuesta para análisis detallado',
          submissionType: 'file',
          evaluationCriteria: [
            'Lenguaje corporal',
            'Tono y ritmo',
            'Congruencia verbal-no verbal',
          ],
        },
      },
    ],
  },

  // Module 6: Entrenamiento Guiado
  'entrenamiento-guiado': {
    id: 'entrenamiento-guiado',
    name: 'Entrenamiento Guiado',
    description: 'Lecciones estructuradas con ejercicios prácticos',
    level: 2,
    xp: 120,
    estimatedDuration: 120,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: ['analisis-vacante'],
    nextModule: 'entrenamiento-estructurado',
    sections: [
      {
        id: 'guided-lecture-1',
        type: 'lecture',
        title: 'Fundamentos de Entrevista',
        description: 'Conceptos clave para cualquier entrevista',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 0,
          passingPoints: 0,
        },
        content: {
          videoUrl: '/videos/entrevista-fundamentos.mp4',
          duration: 300,
          learningObjectives: ['Entender la estructura de una entrevista'],
          keyPoints: ['Rapport', 'Escucha activa', 'Preguntas efectivas'],
        },
      },
      {
        id: 'guided-lecture-2',
        type: 'lecture',
        title: 'Lenguaje Corporal y No-Verbales',
        description: 'Impacto del lenguaje corporal en entrevistas',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 0,
          passingPoints: 0,
        },
        content: {
          videoUrl: '/videos/lenguaje-corporal.mp4',
          duration: 300,
          learningObjectives: [
            'Optimizar tu presencia física',
          ],
          keyPoints: [
            'Postura',
            'Contacto visual',
            'Gestos',
          ],
        },
      },
      {
        id: 'guided-lecture-3',
        type: 'lecture',
        title: 'Escucha y Clarificación',
        description: 'Técnicas de escucha activa',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 0,
          passingPoints: 0,
        },
        content: {
          videoUrl: '/videos/escucha-activa.mp4',
          duration: 300,
          learningObjectives: [
            'Mejorar tu capacidad de escucha',
          ],
          keyPoints: [
            'Preguntas aclaratorias',
            'Parafraseo',
            'Validación',
          ],
        },
      },
      {
        id: 'guided-final-interview',
        type: 'interview',
        title: 'Demostración Final',
        description: 'Practica aplicando todos los conceptos aprendidos',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 120,
          passingPoints: 84,
          llmRubric: {
            criteria: [
              { name: 'Aplicación de Conceptos', weight: 30 },
              { name: 'Lenguaje Corporal', weight: 25 },
              { name: 'Escucha Activa', weight: 25 },
              { name: 'Coherencia General', weight: 20 },
            ],
            instructions: 'Evalúa la aplicación integrada de todos los conceptos',
          },
        },
        content: {
          scenario: 'Entrevista completa con múltiples preguntas',
          prompt:
            'Participa en una entrevista completa demostrando todo lo aprendido',
          recordingTime: 1200,
          evaluationRubric: {
            criteria: [
              {
                name: 'Aplicación de Conceptos',
                weight: 30,
                description: 'Aplica conceptos de todas las lecciones',
              },
              {
                name: 'Lenguaje Corporal',
                weight: 25,
                description: 'Lenguaje corporal profesional',
              },
              {
                name: 'Escucha Activa',
                weight: 25,
                description: 'Demuestra escucha genuina',
              },
              {
                name: 'Coherencia General',
                weight: 20,
                description: 'Coherencia en tu presentación',
              },
            ],
          },
        },
      },
    ],
  },

  // Module 7: Entrenamiento Estructurado
  'entrenamiento-estructurado': {
    id: 'entrenamiento-estructurado',
    name: 'Entrenamiento Estructurado',
    description: 'Práctica intensiva con preguntas tipo entrevista',
    level: 3,
    xp: 120,
    estimatedDuration: 150,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: ['entrenamiento-guiado'],
    nextModule: 'simulacion-real',
    sections: [
      {
        id: 'structured-test',
        type: 'test',
        title: 'Test: Errores Comunes',
        description: '10 preguntas sobre errores frecuentes en entrevistas',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 30,
          passingPoints: 21,
        },
        content: {
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: '¿Cuál es un error común en entrevistas?',
              options: [
                'Hablar demasiado sobre ti sin escuchar',
                'Hacer muchas preguntas al entrevistador',
                'Preparar historias demasiado complejas',
              ],
              correctAnswer: '0',
              explanation:
                'Es importante equilibrar hablar y escuchar en una entrevista',
              points: 30,
            },
          ],
          passingScore: 70,
          randomizeOrder: false,
          showCorrectAnswersImmediately: true,
        },
      },
      {
        id: 'structured-interview-set-1',
        type: 'interview',
        title: 'Serie 1: Preguntas Difíciles',
        description: '3 respuestas grabadas a preguntas desafiantes',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 45,
          passingPoints: 31,
          llmRubric: {
            criteria: [
              { name: 'Marco STAR', weight: 30 },
              { name: 'Calidad de Respuesta', weight: 40 },
              { name: 'Comunicación', weight: 30 },
            ],
            instructions:
              'Evalúa tres respuestas con marco STAR y calidad general',
          },
        },
        content: {
          scenario: 'Preguntas comportamentales difíciles',
          prompt:
            'Responde 3 preguntas sobre desafíos que enfrentaste en tu carrera',
          recordingTime: 900,
          evaluationRubric: {
            criteria: [
              {
                name: 'Marco STAR',
                weight: 30,
                description: 'Estructura clara STAR',
              },
              {
                name: 'Calidad de Respuesta',
                weight: 40,
                description: 'Respuestas perspicaces y bien pensadas',
              },
              {
                name: 'Comunicación',
                weight: 30,
                description: 'Comunicación clara y profesional',
              },
            ],
          },
        },
      },
      {
        id: 'structured-interview-set-2',
        type: 'interview',
        title: 'Serie 2: Preguntas Técnicas',
        description: '3 respuestas más a preguntas diferentes',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 45,
          passingPoints: 31,
          llmRubric: {
            criteria: [
              { name: 'Marco STAR', weight: 30 },
              { name: 'Calidad de Respuesta', weight: 40 },
              { name: 'Mejora Visible', weight: 30 },
            ],
            instructions:
              'Evalúa si hay mejora en relación a la primera serie',
          },
        },
        content: {
          scenario: 'Preguntas técnicas y de rol específico',
          prompt:
            'Responde 3 preguntas sobre habilidades técnicas de tu rol',
          recordingTime: 900,
          evaluationRubric: {
            criteria: [
              {
                name: 'Marco STAR',
                weight: 30,
                description: 'Estructura clara STAR',
              },
              {
                name: 'Calidad de Respuesta',
                weight: 40,
                description: 'Respuestas perspicaces y bien pensadas',
              },
              {
                name: 'Mejora Visible',
                weight: 30,
                description: 'Señales de mejora respecto a la primera serie',
              },
            ],
          },
        },
      },
    ],
  },

  // Module 8: Entrenamiento Desafiante (Already Real)
  'entrenamiento-desafiante': {
    id: 'entrenamiento-desafiante',
    name: 'Entrenamiento Desafiante',
    description: 'Entrenamiento en tiempo real con feedback instantáneo',
    level: 3,
    xp: 120,
    estimatedDuration: 120,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: ['entrenamiento-estructurado'],
    nextModule: 'entrenamiento-conversacional',
    sections: [
      {
        id: 'challenging-practice',
        type: 'interview',
        title: 'Práctica en Tiempo Real',
        description: 'Entrenamiento interactivo en tiempo real',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 120,
          passingPoints: 84,
          llmRubric: {
            criteria: [
              { name: 'Rendimiento General', weight: 50 },
              { name: 'Mejora Observada', weight: 30 },
              { name: 'Aplicación de Feedback', weight: 20 },
            ],
            instructions: 'Evalúa el rendimiento general del usuario',
          },
        },
        content: {
          scenario: 'Entrevista desafiante con preguntas variadas',
          prompt: 'Participa en una entrevista desafiante en tiempo real',
          recordingTime: 1800,
          evaluationRubric: {
            criteria: [
              {
                name: 'Rendimiento General',
                weight: 50,
                description: 'Calidad general de respuestas',
              },
              {
                name: 'Mejora Observada',
                weight: 30,
                description: 'Progresión durante la entrevista',
              },
              {
                name: 'Aplicación de Feedback',
                weight: 20,
                description: 'Aplica feedback durante la sesión',
              },
            ],
          },
        },
      },
    ],
  },

  // Module 9: Entrenamiento Conversacional
  'entrenamiento-conversacional': {
    id: 'entrenamiento-conversacional',
    name: 'Entrenamiento Conversacional',
    description: 'Práctica de conversación natural y fluida',
    level: 3,
    xp: 120,
    estimatedDuration: 120,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: ['entrenamiento-desafiante'],
    nextModule: 'simulacion-real',
    sections: [
      {
        id: 'conversational-intro',
        type: 'lecture',
        title: 'Conversación Natural en Entrevistas',
        description: 'Técnicas para conversación fluida y natural',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 0,
          passingPoints: 0,
        },
        content: {
          videoUrl: '/videos/conversacion-natural.mp4',
          duration: 300,
          learningObjectives: ['Desarrollar conversación natural'],
          keyPoints: [
            'Ritmo y pausa',
            'Empatía conversacional',
            'Adaptabilidad',
          ],
        },
      },
      {
        id: 'conversational-sim-1',
        type: 'simulation',
        title: 'Simulación Conversacional 1',
        description: 'Primera simulación completa con interacciones',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 60,
          passingPoints: 42,
          llmRubric: {
            criteria: [
              { name: 'Naturalidad', weight: 40 },
              { name: 'Adaptabilidad', weight: 30 },
              { name: 'Coherencia', weight: 30 },
            ],
            instructions: 'Evalúa la naturalidad de la conversación',
          },
        },
        content: {
          title: 'Simulación Conversacional',
          scenario: 'Conversación natural con entrevistador reclutador',
          stages: [
            {
              id: 'stage-1',
              type: 'interview',
              content: {
                scenario: 'Preguntas iniciales de rapport',
                prompt:
                  'Inicia una conversación natural con preguntas de rapport',
                recordingTime: 600,
                evaluationRubric: {
                  criteria: [
                    {
                      name: 'Naturalidad',
                      weight: 40,
                      description: 'Conversación fluida',
                    },
                    {
                      name: 'Adaptabilidad',
                      weight: 30,
                      description: 'Se adapta al flujo',
                    },
                    {
                      name: 'Coherencia',
                      weight: 30,
                      description: 'Mantiene coherencia',
                    },
                  ],
                },
              },
              passingScore: 70,
            },
          ],
          totalDuration: 20,
          difficulty: 'intermediate',
        },
      },
      {
        id: 'reflection-task',
        type: 'task',
        title: 'Reflexión y Análisis',
        description: 'Analiza tu desempeño conversacional',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 20,
          passingPoints: 14,
          llmRubric: {
            criteria: [
              { name: 'Autoconciencia', weight: 50 },
              { name: 'Identificación de Mejoras', weight: 50 },
            ],
            instructions: 'Evalúa la calidad de la autorreflexión',
          },
        },
        content: {
          instructions:
            'Escribe un análisis de tu desempeño: ¿Qué salió bien? ¿Qué puedes mejorar?',
          submissionType: 'text',
          evaluationCriteria: [
            'Autoconciencia',
            'Identificación de áreas de mejora',
          ],
        },
      },
      {
        id: 'conversational-sim-2',
        type: 'simulation',
        title: 'Simulación Conversacional 2',
        description: 'Segunda simulación con retroalimentación aplicada',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 40,
          passingPoints: 28,
          llmRubric: {
            criteria: [
              { name: 'Mejora Observable', weight: 50 },
              { name: 'Aplicación de Feedback', weight: 50 },
            ],
            instructions: 'Evalúa la mejora respecto a la primera simulación',
          },
        },
        content: {
          title: 'Segunda Simulación Conversacional',
          scenario: 'Conversación más desafiante con preguntas profundas',
          stages: [
            {
              id: 'stage-2',
              type: 'interview',
              content: {
                scenario: 'Preguntas más profundas y desafiantes',
                prompt:
                  'Participa en una conversación más desafiante',
                recordingTime: 800,
                evaluationRubric: {
                  criteria: [
                    {
                      name: 'Mejora Observable',
                      weight: 50,
                      description: 'Se ve mejora respecto a la primera',
                    },
                    {
                      name: 'Aplicación de Feedback',
                      weight: 50,
                      description: 'Aplica feedback previo',
                    },
                  ],
                },
              },
              passingScore: 70,
            },
          ],
          totalDuration: 25,
          difficulty: 'advanced',
        },
      },
    ],
  },

  // Module 10: Simulación Real (Capstone)
  'simulacion-real': {
    id: 'simulacion-real',
    name: 'Simulación Real',
    description:
      'Simulación completa de entrevista profesional (60 minutos)',
    level: 4,
    xp: 40,
    estimatedDuration: 90,
    passingScore: 70,
    allowRetakes: true,
    prerequisites: [
      'entrenamiento-conversacional',
      'entrenamiento-desafiante',
    ],
    sections: [
      {
        id: 'real-sim-intro',
        type: 'lecture',
        title: 'Simulación Real - Instrucciones',
        description: 'Qué esperar en esta simulación profesional',
        required: true,
        scoring: {
          method: 'auto',
          requiresManualReview: false,
          maxPoints: 0,
          passingPoints: 0,
        },
        content: {
          videoUrl: '/videos/simulacion-real-intro.mp4',
          duration: 180,
          learningObjectives: [
            'Entender el formato de la simulación real',
          ],
          keyPoints: [
            '5 etapas',
            '60 minutos total',
            'Feedback completo después',
          ],
        },
      },
      {
        id: 'full-simulation',
        type: 'simulation',
        title: 'Simulación Profesional Completa',
        description: 'Entrevista profesional de 60 minutos con 5 etapas',
        required: true,
        scoring: {
          method: 'llm',
          requiresManualReview: false,
          maxPoints: 40,
          passingPoints: 28,
          llmRubric: {
            criteria: [
              { name: 'Desempeño General', weight: 40 },
              { name: 'Consistencia', weight: 30 },
              { name: 'Progresión', weight: 30 },
            ],
            instructions:
              'Evalúa el desempeño en toda la simulación de 60 minutos',
          },
        },
        content: {
          title: 'Entrevista Profesional Completa',
          scenario:
            'Entrevista formal de 60 minutos con todas las etapas de un proceso real',
          stages: [
            {
              id: 'stage-phone-screen',
              type: 'interview',
              content: {
                scenario: 'Phone screen inicial (10 min)',
                prompt: 'Inicio casual - Cuéntame sobre ti',
                recordingTime: 600,
                evaluationRubric: {
                  criteria: [
                    {
                      name: 'Rapport Inicial',
                      weight: 40,
                      description: 'Establece rapport',
                    },
                    {
                      name: 'Presentación',
                      weight: 60,
                      description: 'Presentación efectiva',
                    },
                  ],
                },
              },
              passingScore: 70,
            },
            {
              id: 'stage-technical-role',
              type: 'interview',
              content: {
                scenario: 'Preguntas técnicas/rol (15 min)',
                prompt: 'Preguntas específicas sobre tu experiencia',
                recordingTime: 900,
                evaluationRubric: {
                  criteria: [
                    {
                      name: 'Profundidad de Respuesta',
                      weight: 50,
                      description: 'Respuestas detalladas',
                    },
                    {
                      name: 'Casos de Uso',
                      weight: 50,
                      description: 'Ejemplos prácticos',
                    },
                  ],
                },
              },
              passingScore: 70,
            },
            {
              id: 'stage-behavioral',
              type: 'interview',
              content: {
                scenario: 'Ronda comportamental (20 min)',
                prompt: 'Preguntas conductuales y de liderazgo',
                recordingTime: 1200,
                evaluationRubric: {
                  criteria: [
                    {
                      name: 'Framework STAR',
                      weight: 40,
                      description: 'Usa STAR efectivamente',
                    },
                    {
                      name: 'Reflexión Personal',
                      weight: 60,
                      description: 'Reflexión genuina',
                    },
                  ],
                },
              },
              passingScore: 70,
            },
            {
              id: 'stage-questions',
              type: 'interview',
              content: {
                scenario: 'Tu turno de preguntas (10 min)',
                prompt: 'Haz preguntas perspicaces al entrevistador',
                recordingTime: 600,
                evaluationRubric: {
                  criteria: [
                    {
                      name: 'Preguntas Perspicaces',
                      weight: 50,
                      description: 'Preguntas bien pensadas',
                    },
                    {
                      name: 'Interés Genuino',
                      weight: 50,
                      description: 'Demuestra interés real',
                    },
                  ],
                },
              },
              passingScore: 70,
            },
            {
              id: 'stage-reflection',
              type: 'task',
              content: {
                instructions:
                  'Reflexiona sobre tu desempeño: ¿Qué salió bien? ¿Qué mejorarías? ¿Cuál fue tu mejor respuesta?',
                submissionType: 'text',
                evaluationCriteria: [
                  'Análisis honesto',
                  'Identificación de fortalezas',
                  'Oportunidades de mejora',
                ],
              },
              passingScore: 70,
            },
          ],
          totalDuration: 60,
          difficulty: 'advanced',
        },
      },
    ],
  },
};

// Helper to get module by ID
export function getModuleById(moduleId: string): Module | undefined {
  return ALL_MODULES[moduleId];
}

// Helper to get all module IDs
export function getAllModuleIds(): string[] {
  return Object.keys(ALL_MODULES);
}

// Helper to get modules by level
export function getModulesByLevel(level: 1 | 2 | 3 | 4): Module[] {
  return Object.values(ALL_MODULES).filter((m) => m.level === level);
}

// Helper to check if module is unlocked
export function isModuleUnlocked(
  moduleId: string,
  completedModules: string[]
): boolean {
  const module = getModuleById(moduleId);
  if (!module) return false;
  if (module.prerequisites.length === 0) return true;
  return module.prerequisites.every((prereq) =>
    completedModules.includes(prereq)
  );
}
