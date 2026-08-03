import type { A3ModuleId } from '@/lib/a3/module-catalog'

export interface A3RouteOverviewCopy {
  outcome: string
  evidence: string
  practiceMode: string
  requirements: string[]
}

export const A3_ROUTE_OVERVIEW: Record<A3ModuleId, A3RouteOverviewCopy> = {
  'career-mirror': {
    outcome: 'Convierte tu diagnóstico en una dirección profesional que puedas explicar con claridad.',
    evidence: 'Dirección, identidad profesional, valores centrales y marca personal.',
    practiceMode: 'Reflexión guiada con entregable verificable.',
    requirements: [
      'Definir una dirección profesional concreta.',
      'Expresar una identidad profesional actual.',
      'Relacionar valores y marca personal con evidencia propia.',
    ],
  },
  'value-mining-lab': {
    outcome: 'Descubre el valor demostrable de tu experiencia para reutilizarlo en CV, postulaciones y entrevistas.',
    evidence: 'Valor de proyectos, contribución crítica, aplicación futura y siguiente acción.',
    practiceMode: 'Sesión guiada de extracción de evidencia.',
    requirements: [
      'Describir una contribución profesional relevante.',
      'Separar tarea, aporte personal y valor generado.',
      'Definir cómo reutilizar esa evidencia en la ruta.',
    ],
  },
  'cv-builder-studio': {
    outcome: 'Construye un CV legible, enfocado y respaldado por logros concretos.',
    evidence: 'CV estructurado con resumen, experiencia, competencias y controles ATS.',
    practiceMode: 'Estudio de escritura y revisión documental.',
    requirements: [
      'Definir rol objetivo y palabras clave.',
      'Desarrollar tres logros profesionales.',
      'Completar los controles ATS críticos.',
    ],
  },
  'job-decoder': {
    outcome: 'Entiende qué busca realmente una oferta y cómo se relaciona con tu experiencia.',
    evidence: 'Requisitos, señales, mapa de ajuste, brechas y plan de postulación.',
    practiceMode: 'Análisis estructurado de una oferta real.',
    requirements: [
      'Separar requisitos obligatorios y deseables.',
      'Contrastar la oferta con el CV aprobado.',
      'Preparar preguntas y ajustes para la postulación.',
    ],
  },
  'answer-architecture': {
    outcome: 'Prepara respuestas esenciales que conecten tu trayectoria con el rol objetivo.',
    evidence: 'Autopresentación, motivación, fortaleza, desafío STAR y cierre de contratación.',
    practiceMode: 'Construcción de respuestas con tiempos de 30, 45 y 60 segundos.',
    requirements: [
      'Completar cinco respuestas esenciales.',
      'Usar evidencia personal y estructura STAR.',
      'Practicar versiones de distinta duración.',
    ],
  },
  'coach-practice-room': {
    outcome: 'Mejora tus respuestas mediante una segunda versión consciente y comparable.',
    evidence: 'Tres prácticas con versión inicial, versión mejorada y aprendizaje explícito.',
    practiceMode: 'Práctica iterativa con retroalimentación opcional de IA.',
    requirements: [
      'Practicar autopresentación, motivación y desafío.',
      'Crear una versión mejorada de cada respuesta.',
      'Explicar qué cambió y por qué.',
    ],
  },
  'communication-gym': {
    outcome: 'Entrena ritmo, pausas, claridad y cierre antes de una simulación completa.',
    evidence: 'Guiones, tiempos reales, pausas deliberadas, autoevaluación y segunda entrega.',
    practiceMode: 'Práctica oral cronometrada; no se almacena audio.',
    requirements: [
      'Cronometrar autopresentación y motivación.',
      'Completar tres pausas deliberadas.',
      'Registrar una segunda entrega y su reflexión.',
    ],
  },
  'first-recruiter-simulation': {
    outcome: 'Completa una primera entrevista de selección y observa dónde necesitas mejorar.',
    evidence: 'Ocho respuestas cronometradas, autoevaluaciones y debrief de la entrevista.',
    practiceMode: 'Simulación escrita y oral guiada; no se almacena audio ni video.',
    requirements: [
      'Responder las ocho etapas de la entrevista.',
      'Mantener tiempos reales dentro de rango.',
      'Completar STAR y un debrief accionable.',
    ],
  },
  'risk-difficult-questions-lab': {
    outcome: 'Prepara respuestas honestas y seguras para preguntas que podrían desordenar tu entrevista.',
    evidence: 'Tres planes de riesgo, tres respuestas bajo presión y debrief final.',
    practiceMode: 'Laboratorio de preparación y presión cronometrada.',
    requirements: [
      'Preparar tres riesgos profesionales distintos.',
      'Evitar evasión, culpabilización y lenguaje defensivo.',
      'Practicar diferenciación, fracaso y motivo de salida.',
    ],
  },
  'basic-interview-mission': {
    outcome: 'Integra toda la ruta en una entrevista completa y observa tu nivel de preparación actual.',
    evidence: 'Doce respuestas, evaluación transversal e informe final de preparación.',
    practiceMode: 'Misión final cronometrada; no se almacena audio ni video.',
    requirements: [
      'Completar las doce etapas de la entrevista.',
      'Demostrar dos respuestas STAR y manejo de una pregunta difícil.',
      'Cerrar con preguntas propias, reflexión y siguiente acción.',
    ],
  },
}
