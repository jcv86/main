"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MessageSquare,
  List,
  BarChart3,
  Users,
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  Loader2,
  FileSlidersIcon as SliderIcon,
  ChevronUp,
  ChevronDown,
  GripVertical,
  CheckSquare,
  ToggleLeft,
  Target,
  TrendingUp,
  HelpCircle,
  RefreshCw,
  Lightbulb,
  ChevronDownIcon,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Big Five personality traits
const BIG_FIVE_TRAITS = {
  openness: { color: "bg-purple-500", icon: Brain },
  conscientiousness: { color: "bg-blue-500", icon: CheckCircle },
  extraversion: { color: "bg-green-500", icon: Users },
  agreeableness: { color: "bg-yellow-500", icon: MessageSquare },
  neuroticism: { color: "bg-red-500", icon: BarChart3 },
}

// Question types
type QuestionType = "scale" | "open" | "multiple" | "scenario" | "ranking" | "checkbox" | "slider" | "binary"

interface Question {
  id: number
  type: QuestionType
  trait: keyof typeof BIG_FIVE_TRAITS
  question: string
  instruction?: string
  options?: string[]
  items?: string[] // Para preguntas de ranking
  min?: number // Para slider
  max?: number // Para slider
  step?: number // Para slider
  reverse?: boolean
  // Sistema de ayuda
  explanation?: string
  examples?: string[]
  alternativeFormulations?: string[]
  tips?: string[]
}

// Big Five questions with enhanced help system
const PERSONALITY_QUESTIONS: Question[] = [
  // Openness questions
  {
    id: 1,
    type: "scale",
    trait: "openness",
    question: "Disfruto explorando nuevas ideas y conceptos",
    reverse: false,
    explanation:
      "Esta pregunta evalúa tu apertura a experiencias intelectuales y tu curiosidad por aprender cosas nuevas.",
    examples: [
      "Leer sobre temas que nunca has estudiado antes",
      "Investigar conceptos filosóficos o científicos complejos",
      "Explorar diferentes perspectivas sobre un mismo tema",
      "Buscar activamente información sobre culturas diferentes",
    ],
    alternativeFormulations: [
      "Me siento atraído/a hacia ideas y conceptos que no conozco",
      "Tengo curiosidad por explorar nuevos campos de conocimiento",
      "Me gusta adentrarme en temas e ideas desconocidas",
    ],
    tips: [
      "Piensa en tu reacción cuando encuentras información nueva",
      "Considera si buscas activamente aprender cosas diferentes",
      "Reflexiona sobre tu nivel de curiosidad intelectual",
    ],
  },
  {
    id: 2,
    type: "open",
    trait: "openness",
    question: "Describe una situación donde tu creatividad te ayudó a resolver un problema",
    explanation:
      "Esta pregunta busca entender cómo usas tu creatividad e imaginación para encontrar soluciones innovadoras.",
    examples: [
      "Encontrar una forma original de organizar tu espacio de trabajo",
      "Crear una solución única para un conflicto interpersonal",
      "Inventar un método nuevo para estudiar o aprender",
      "Diseñar una forma creativa de ahorrar dinero o tiempo",
    ],
    alternativeFormulations: [
      "Cuéntame sobre una vez que resolviste un problema de manera creativa",
      "¿Puedes describir un momento donde tu imaginación te ayudó a superar un desafío?",
      "Relata una experiencia donde encontraste una solución original a un problema",
    ],
    tips: [
      "No tiene que ser algo grandioso, puede ser una situación cotidiana",
      "Enfócate en el proceso creativo que usaste",
      "Describe tanto el problema como tu solución innovadora",
      "Explica por qué consideras que tu solución fue creativa",
    ],
  },
  {
    id: 3,
    type: "multiple",
    trait: "openness",
    question: "¿Qué tipo de actividades prefieres en tu tiempo libre?",
    options: ["Leer libros o artículos", "Ver películas o series", "Hacer ejercicio", "Actividades creativas"],
    explanation:
      "Esta pregunta evalúa tus preferencias de ocio y cómo estas reflejan tu apertura a nuevas experiencias.",
    examples: [
      "Leer: novelas, ensayos, artículos científicos, biografías",
      "Ver: documentales, películas de arte, series de diferentes culturas",
      "Ejercicio: deportes nuevos, rutinas variadas, actividades al aire libre",
      "Creativas: pintura, música, escritura, manualidades, cocina experimental",
    ],
    alternativeFormulations: [
      "¿Cómo prefieres pasar tu tiempo libre?",
      "¿Qué actividades de ocio te resultan más atractivas?",
      "¿Cuál de estas opciones describe mejor tus hobbies favoritos?",
    ],
    tips: [
      "Piensa en lo que realmente haces, no en lo que crees que deberías hacer",
      "Considera qué actividad te genera más satisfacción personal",
      "Reflexiona sobre qué tipo de estimulación mental prefieres",
    ],
  },
  {
    id: 4,
    type: "scenario",
    trait: "openness",
    question: "Te ofrecen un trabajo en un campo completamente nuevo. ¿Cómo reaccionas?",
    options: [
      "Lo acepto inmediatamente",
      "Investigo antes de decidir",
      "Prefiero quedarme en mi área",
      "Busco opiniones de otros",
    ],
    explanation: "Esta pregunta mide tu disposición a enfrentar lo desconocido y tu tolerancia a la incertidumbre.",
    examples: [
      "Cambiar de marketing a tecnología",
      "Pasar de educación a emprendimiento",
      "Moverse de finanzas a arte",
      "Transicionar de medicina a consultoría",
    ],
    alternativeFormulations: [
      "Si te propusieran trabajar en un área totalmente diferente, ¿qué harías?",
      "¿Cómo responderías ante una oportunidad laboral en un campo desconocido?",
      "Ante la posibilidad de cambiar completamente de carrera, ¿cuál sería tu reacción?",
    ],
    tips: [
      "Piensa en tu reacción instintiva, no en lo que sería 'correcto'",
      "Considera tu tolerancia al riesgo y la incertidumbre",
      "Reflexiona sobre experiencias pasadas con cambios importantes",
    ],
  },
  {
    id: 5,
    type: "scale",
    trait: "openness",
    question: "Me considero una persona imaginativa",
    reverse: false,
    explanation: "Esta pregunta evalúa tu autopercepción sobre tu capacidad imaginativa y creativa.",
    examples: [
      "Crear historias o escenarios en tu mente",
      "Visualizar soluciones antes de implementarlas",
      "Soñar despierto con posibilidades futuras",
      "Generar ideas originales con facilidad",
    ],
    alternativeFormulations: [
      "Tengo una imaginación muy activa",
      "Soy una persona con mucha creatividad mental",
      "Mi mente genera ideas e imágenes con facilidad",
    ],
    tips: [
      "Piensa en qué tan frecuentemente usas tu imaginación",
      "Considera si otros te han descrito como imaginativo/a",
      "Reflexiona sobre tu capacidad para visualizar escenarios",
    ],
  },

  // Conscientiousness questions
  {
    id: 6,
    type: "scale",
    trait: "conscientiousness",
    question: "Siempre cumplo con mis compromisos y plazos",
    reverse: false,
    explanation: "Esta pregunta evalúa tu confiabilidad y tu capacidad para cumplir con responsabilidades.",
    examples: [
      "Entregar trabajos en la fecha acordada",
      "Llegar puntual a citas y reuniones",
      "Cumplir promesas hechas a amigos y familia",
      "Completar tareas domésticas cuando las planificas",
    ],
    alternativeFormulations: [
      "Soy muy confiable con mis responsabilidades y fechas límite",
      "Puedo contar conmigo mismo/a para cumplir lo que prometo",
      "Rara vez dejo de cumplir con mis obligaciones y compromisos",
    ],
    tips: [
      "Piensa en tu historial real de cumplimiento",
      "Considera qué tan frecuentemente postergas las cosas",
      "Reflexiona sobre cómo otros perciben tu confiabilidad",
    ],
  },
  {
    id: 7,
    type: "open",
    trait: "conscientiousness",
    question: "¿Cómo organizas tu día para ser más productivo?",
    explanation: "Esta pregunta busca entender tus estrategias de organización personal y gestión del tiempo.",
    examples: [
      "Hacer listas de tareas por prioridad",
      "Usar calendarios digitales o físicos",
      "Establecer rutinas matutinas o nocturnas",
      "Dividir proyectos grandes en tareas pequeñas",
      "Usar técnicas como Pomodoro o time-blocking",
    ],
    alternativeFormulations: [
      "¿Qué estrategias usas para estructurar tu día de manera eficiente?",
      "Describe tu método para organizar tus actividades diarias",
      "¿Cómo planificas tu tiempo para maximizar tu productividad?",
    ],
    tips: [
      "Describe métodos específicos que realmente uses",
      "Incluye tanto herramientas digitales como analógicas",
      "Menciona cómo priorizas tus tareas",
      "Explica qué funciona mejor para ti y por qué",
    ],
  },
  {
    id: 8,
    type: "multiple",
    trait: "conscientiousness",
    question: "¿Cómo manejas tus tareas diarias?",
    options: ["Hago listas detalladas", "Uso aplicaciones", "Lo recuerdo mentalmente", "Improviso según el día"],
    explanation: "Esta pregunta evalúa tu estilo de organización y planificación personal.",
    examples: [
      "Listas: papel y lápiz, bullet journal, notas adhesivas",
      "Apps: Todoist, Any.do, Google Tasks, Notion",
      "Mental: confiar en tu memoria, recordatorios mentales",
      "Improvisación: decidir sobre la marcha, flexibilidad total",
    ],
    alternativeFormulations: [
      "¿Cuál es tu método preferido para gestionar tus tareas?",
      "¿Cómo te organizas para no olvidar lo que tienes que hacer?",
      "¿Qué sistema usas para llevar control de tus responsabilidades?",
    ],
    tips: [
      "Elige la opción que más se acerque a tu método principal",
      "Piensa en lo que realmente haces, no en lo ideal",
      "Considera cuál método te da mejores resultados",
    ],
  },
  {
    id: 9,
    type: "scenario",
    trait: "conscientiousness",
    question: "Tienes una fecha límite importante mañana pero surge un plan social atractivo. ¿Qué haces?",
    options: [
      "Termino el trabajo primero",
      "Voy al plan y trabajo después",
      "Busco un equilibrio",
      "Pospongo la fecha límite",
    ],
    explanation: "Esta pregunta mide tu capacidad para priorizar responsabilidades sobre gratificaciones inmediatas.",
    examples: [
      "Proyecto universitario vs. fiesta de cumpleaños",
      "Presentación laboral vs. cena con amigos",
      "Entrega de informe vs. evento social especial",
      "Examen importante vs. concierto favorito",
    ],
    alternativeFormulations: [
      "Si tuvieras que elegir entre una responsabilidad urgente y un plan divertido, ¿qué harías?",
      "¿Cómo actúas cuando hay conflicto entre obligaciones y diversión?",
      "Ante la tensión entre deber y placer, ¿cuál es tu tendencia natural?",
    ],
    tips: [
      "Piensa en tu comportamiento real en situaciones similares",
      "Considera tu nivel de tolerancia al estrés de última hora",
      "Reflexiona sobre qué te genera más ansiedad: decepcionar o no cumplir",
    ],
  },
  {
    id: 10,
    type: "scale",
    trait: "conscientiousness",
    question: "Soy muy organizado en mi trabajo y vida personal",
    reverse: false,
    explanation: "Esta pregunta evalúa tu autopercepción sobre tu nivel general de organización.",
    examples: [
      "Escritorio ordenado y sistema de archivos claro",
      "Horarios estructurados y rutinas establecidas",
      "Espacios personales limpios y organizados",
      "Documentos importantes bien clasificados y accesibles",
    ],
    alternativeFormulations: [
      "Mantengo un alto nivel de orden en todas las áreas de mi vida",
      "Soy una persona muy estructurada y metódica",
      "Me caracterizo por ser ordenado/a y sistemático/a",
    ],
    tips: [
      "Considera tanto tu espacio físico como tu organización mental",
      "Piensa en cómo otros describirían tu nivel de organización",
      "Reflexiona sobre qué tan cómodo/a te sientes con el desorden",
    ],
  },

  // Extraversion questions
  {
    id: 11,
    type: "scale",
    trait: "extraversion",
    question: "Me siento cómodo siendo el centro de atención",
    reverse: false,
    explanation: "Esta pregunta evalúa tu comodidad con la visibilidad social y ser el foco de atención.",
    examples: [
      "Hablar en público sin nerviosismo",
      "Ser el anfitrión en reuniones sociales",
      "Contar historias en grupos grandes",
      "Liderar presentaciones o actividades grupales",
    ],
    alternativeFormulations: [
      "Disfruto cuando todas las miradas están puestas en mí",
      "Me siento natural siendo el protagonista en situaciones sociales",
      "No me incomoda ser el foco de atención en un grupo",
    ],
    tips: [
      "Piensa en tu reacción física y emocional ante la atención",
      "Considera si buscas o evitas ser el centro de atención",
      "Reflexiona sobre tu nivel de comodidad en presentaciones públicas",
    ],
  },
  {
    id: 12,
    type: "open",
    trait: "extraversion",
    question: "Describe cómo te comportas en una fiesta donde no conoces a nadie",
    explanation:
      "Esta pregunta evalúa tu comportamiento social en situaciones nuevas y tu iniciativa para conectar con otros.",
    examples: [
      "Buscar activamente conocer gente nueva",
      "Esperar a que otros se acerquen a ti",
      "Encontrar una persona conocida y quedarte cerca",
      "Ayudar al anfitrión para tener una actividad",
      "Observar desde un lugar cómodo antes de interactuar",
    ],
    alternativeFormulations: [
      "¿Cómo actúas cuando llegas a un evento social donde eres el único desconocido?",
      "Describe tu estrategia para socializar en un ambiente completamente nuevo",
      "¿Qué haces cuando te encuentras en una reunión social sin conocidos?",
    ],
    tips: [
      "Describe tu comportamiento real, no el ideal",
      "Incluye tanto tus acciones como tus sentimientos",
      "Menciona cómo te sientes al inicio vs. después de un tiempo",
      "Explica qué estrategias usas para sentirte más cómodo/a",
    ],
  },
  {
    id: 13,
    type: "multiple",
    trait: "extraversion",
    question: "¿Cómo prefieres recargar energías después de un día difícil?",
    options: ["Salir con amigos", "Hacer ejercicio", "Estar solo en casa", "Actividades tranquilas"],
    explanation: "Esta pregunta evalúa si recargas energía a través de la interacción social o la soledad.",
    examples: [
      "Salir: bares, restaurantes, eventos sociales, llamar amigos",
      "Ejercicio: gimnasio, correr, deportes, actividades físicas grupales",
      "Solo: leer, meditar, ver series, descansar en silencio",
      "Tranquilas: música suave, baño relajante, caminar, yoga",
    ],
    alternativeFormulations: [
      "¿Qué te ayuda más a recuperarte después de un día estresante?",
      "¿Cuál es tu método preferido para restaurar tu energía?",
      "¿Cómo prefieres descomprimirte al final de un día agotador?",
    ],
    tips: [
      "Piensa en lo que realmente te funciona, no en lo que crees que debería",
      "Considera qué te hace sentir genuinamente mejor",
      "Reflexiona sobre tu fuente natural de energía",
    ],
  },
  {
    id: 14,
    type: "scenario",
    trait: "extraversion",
    question: "En una reunión de trabajo, ¿cómo sueles participar?",
    options: [
      "Hablo frecuentemente",
      "Participo cuando es necesario",
      "Escucho más que hablo",
      "Evito hablar en público",
    ],
    explanation: "Esta pregunta mide tu nivel de participación y comodidad en situaciones grupales profesionales.",
    examples: [
      "Frecuente: proponer ideas, hacer preguntas, liderar discusiones",
      "Necesario: hablar cuando tienes algo importante que aportar",
      "Escuchar: procesar información antes de hablar, observar dinámicas",
      "Evitar: preferir comunicación escrita, nerviosismo al hablar",
    ],
    alternativeFormulations: [
      "¿Cuál es tu estilo típico de participación en reuniones grupales?",
      "¿Cómo te comportas generalmente en juntas o meetings?",
      "¿Qué rol tiendes a tomar en las discusiones de equipo?",
    ],
    tips: [
      "Piensa en tu comportamiento promedio, no en casos excepcionales",
      "Considera tu nivel de comodidad vs. tu nivel de participación",
      "Reflexiona sobre cómo otros describirían tu estilo en reuniones",
    ],
  },
  {
    id: 15,
    type: "scale",
    trait: "extraversion",
    question: "Disfruto conocer gente nueva",
    reverse: false,
    explanation: "Esta pregunta evalúa tu interés y entusiasmo por establecer nuevas conexiones sociales.",
    examples: [
      "Sentir emoción al conocer personas en eventos",
      "Buscar activamente hacer nuevos amigos",
      "Disfrutar conversaciones con desconocidos",
      "Sentir energía positiva al expandir tu círculo social",
    ],
    alternativeFormulations: [
      "Me emociona la posibilidad de hacer nuevas conexiones sociales",
      "Encuentro estimulante conocer personas diferentes",
      "Me atrae la idea de ampliar mi círculo de conocidos",
    ],
    tips: [
      "Piensa en tu reacción emocional ante nuevas personas",
      "Considera si buscas o evitas oportunidades sociales",
      "Reflexiona sobre qué tan energizante vs. agotador te resulta socializar",
    ],
  },

  // Agreeableness questions
  {
    id: 16,
    type: "scale",
    trait: "agreeableness",
    question: "Siempre trato de ayudar a otros cuando lo necesitan",
    reverse: false,
    explanation: "Esta pregunta evalúa tu disposición natural a brindar apoyo y asistencia a otros.",
    examples: [
      "Ofrecer ayuda sin que te la pidan",
      "Dedicar tiempo a resolver problemas de otros",
      "Priorizar las necesidades ajenas sobre las propias",
      "Sentir satisfacción al ser útil para otros",
    ],
    alternativeFormulations: [
      "Me esfuerzo por brindar apoyo a quienes me rodean",
      "Tengo una fuerte tendencia a asistir a otros en dificultades",
      "Naturalmente busco formas de ser útil para los demás",
    ],
    tips: [
      "Piensa en tu comportamiento espontáneo, no forzado",
      "Considera qué tan frecuentemente ofreces ayuda",
      "Reflexiona sobre tu motivación interna para ayudar",
    ],
  },
  {
    id: 17,
    type: "open",
    trait: "agreeableness",
    question: "¿Cómo manejas los conflictos con otras personas?",
    explanation: "Esta pregunta evalúa tu estilo de manejo de conflictos y tu preferencia por la armonía social.",
    examples: [
      "Buscar soluciones de compromiso",
      "Evitar confrontaciones directas",
      "Mediar entre partes en conflicto",
      "Priorizar mantener la relación sobre ganar la discusión",
      "Usar comunicación empática y comprensiva",
    ],
    alternativeFormulations: [
      "Describe tu estrategia típica para resolver desacuerdos interpersonales",
      "¿Cuál es tu enfoque cuando surgen tensiones con otros?",
      "¿Cómo respondes cuando hay conflicto en tus relaciones?",
    ],
    tips: [
      "Describe patrones reales de comportamiento, no ideales",
      "Incluye tanto tus acciones como tus sentimientos",
      "Menciona si prefieres evitar, confrontar o mediar",
      "Explica qué te motiva en tu forma de manejar conflictos",
    ],
  },
  {
    id: 18,
    type: "multiple",
    trait: "agreeableness",
    question: "¿Qué es más importante para ti en el trabajo?",
    options: ["Ambiente colaborativo", "Reconocimiento personal", "Autonomía", "Competencia saludable"],
    explanation: "Esta pregunta evalúa tus valores laborales y qué tan importante es la armonía grupal para ti.",
    examples: [
      "Colaborativo: trabajo en equipo, apoyo mutuo, decisiones consensuadas",
      "Reconocimiento: logros individuales, feedback positivo, visibilidad",
      "Autonomía: independencia, flexibilidad, control sobre tu trabajo",
      "Competencia: desafíos, metas ambiciosas, superación de otros",
    ],
    alternativeFormulations: [
      "¿Qué aspecto del ambiente laboral valoras más?",
      "¿Cuál de estos elementos te motiva más en tu trabajo?",
      "¿Qué característica del trabajo te genera mayor satisfacción?",
    ],
    tips: [
      "Piensa en qué te hace sentir más satisfecho/a laboralmente",
      "Considera qué extrañarías más si no lo tuvieras",
      "Reflexiona sobre qué te motiva genuinamente vs. lo que crees que debería",
    ],
  },
  {
    id: 19,
    type: "scenario",
    trait: "agreeableness",
    question: "Un colega te pide ayuda con su trabajo cuando estás ocupado. ¿Qué haces?",
    options: [
      "Lo ayudo inmediatamente",
      "Programo tiempo para ayudarlo",
      "Le sugiero otras opciones",
      "Le digo que no puedo",
    ],
    explanation: "Esta pregunta mide tu disposición a sacrificar tu tiempo por ayudar a otros.",
    examples: [
      "Inmediato: dejar tu trabajo para ayudar ahora",
      "Programar: encontrar un momento específico para ayudar",
      "Sugerir: ofrecer alternativas como otros colegas o recursos",
      "Declinar: priorizar tu trabajo y decir que no puedes",
    ],
    alternativeFormulations: [
      "¿Cómo respondes cuando alguien necesita tu ayuda pero tienes tus propias prioridades?",
      "Si un compañero requiere asistencia mientras estás concentrado en tus tareas, ¿qué haces?",
      "¿Cuál es tu reacción típica ante solicitudes de ayuda cuando estás ocupado/a?",
    ],
    tips: [
      "Piensa en tu reacción instintiva real",
      "Considera tu balance entre ayudar y tus propias necesidades",
      "Reflexiona sobre cómo te sientes cuando dices 'no' a otros",
    ],
  },
  {
    id: 20,
    type: "scale",
    trait: "agreeableness",
    question: "Me preocupo genuinamente por el bienestar de otros",
    reverse: false,
    explanation: "Esta pregunta evalúa tu nivel de empatía y preocupación sincera por el bienestar ajeno.",
    examples: [
      "Sentir tristeza cuando otros sufren",
      "Preguntar regularmente cómo están las personas cercanas",
      "Notar cuando alguien está pasando por dificultades",
      "Sentir alegría genuina por los éxitos de otros",
    ],
    alternativeFormulations: [
      "Siento una preocupación real y profunda por cómo están los demás",
      "El bienestar de otros es algo que me importa sinceramente",
      "Tengo una conexión emocional genuina con el estado de ánimo de otros",
    ],
    tips: [
      "Piensa en tu respuesta emocional automática ante el sufrimiento ajeno",
      "Considera qué tan frecuentemente piensas en el bienestar de otros",
      "Reflexiona sobre si tu preocupación es genuina o por obligación social",
    ],
  },

  // Neuroticism questions
  {
    id: 21,
    type: "scale",
    trait: "neuroticism",
    question: "Me estreso fácilmente ante situaciones difíciles",
    reverse: false,
    explanation: "Esta pregunta evalúa tu tendencia a experimentar estrés y ansiedad ante desafíos.",
    examples: [
      "Sentir tensión física ante problemas",
      "Preocuparse excesivamente por posibles resultados negativos",
      "Tener dificultad para relajarse durante crisis",
      "Experimentar síntomas físicos del estrés frecuentemente",
    ],
    alternativeFormulations: [
      "Las situaciones complicadas me generan estrés con facilidad",
      "Tiendo a sentirme abrumado/a cuando enfrento dificultades",
      "Mi nivel de estrés aumenta rápidamente ante los problemas",
    ],
    tips: [
      "Piensa en tu reacción física y emocional típica",
      "Considera qué tan rápido aparece el estrés en ti",
      "Reflexiona sobre tu tolerancia a la presión y incertidumbre",
    ],
  },
  {
    id: 22,
    type: "open",
    trait: "neuroticism",
    question: "¿Cómo manejas el estrés y la ansiedad en tu vida diaria?",
    explanation: "Esta pregunta busca entender tus estrategias de afrontamiento y regulación emocional.",
    examples: [
      "Técnicas de respiración o meditación",
      "Ejercicio físico para liberar tensión",
      "Hablar con amigos o familia",
      "Evitar situaciones estresantes",
      "Usar distracciones como música o entretenimiento",
      "Buscar ayuda profesional cuando es necesario",
    ],
    alternativeFormulations: [
      "¿Qué estrategias usas para lidiar con la ansiedad y el estrés?",
      "Describe cómo te las arreglas cuando te sientes abrumado/a",
      "¿Cuáles son tus métodos para calmarte cuando estás ansioso/a?",
    ],
    tips: [
      "Describe métodos que realmente uses, no solo los que conoces",
      "Incluye tanto estrategias saludables como menos saludables",
      "Menciona qué tan efectivas son estas estrategias para ti",
      "Explica si buscas ayuda externa o prefieres manejarlo solo/a",
    ],
  },
  {
    id: 23,
    type: "multiple",
    trait: "neuroticism",
    question: "¿Cómo reaccionas ante críticas constructivas?",
    options: ["Las acepto y aprendo", "Me molestan inicialmente", "Las ignoro", "Me afectan mucho"],
    explanation: "Esta pregunta evalúa tu sensibilidad emocional y capacidad de regulación ante feedback negativo.",
    examples: [
      "Aceptar: ver la crítica como oportunidad de crecimiento",
      "Molestar: sentir irritación inicial pero luego reflexionar",
      "Ignorar: descartar la crítica como irrelevante o incorrecta",
      "Afectar: sentir dolor emocional intenso y duradero",
    ],
    alternativeFormulations: [
      "¿Cuál es tu respuesta típica cuando recibes feedback negativo?",
      "¿Cómo te sientes y actúas cuando alguien critica tu trabajo?",
      "¿Qué pasa internamente cuando recibes comentarios correctivos?",
    ],
    tips: [
      "Piensa en tu reacción emocional inmediata",
      "Considera tanto tu respuesta interna como externa",
      "Reflexiona sobre cómo procesas la crítica a largo plazo",
    ],
  },
  {
    id: 24,
    type: "scenario",
    trait: "neuroticism",
    question: "Cometes un error importante en el trabajo. ¿Cómo te sientes?",
    options: ["Tranquilo, busco soluciones", "Preocupado pero enfocado", "Muy ansioso", "Abrumado y estresado"],
    explanation: "Esta pregunta mide tu respuesta emocional ante errores y tu capacidad de manejo del estrés.",
    examples: [
      "Tranquilo: mantener la calma y enfocarse en resolver",
      "Preocupado: sentir inquietud pero mantener funcionalidad",
      "Ansioso: experimentar nerviosismo intenso y preocupación",
      "Abrumado: sentirse paralizado por el estrés y la culpa",
    ],
    alternativeFormulations: [
      "¿Cuál es tu reacción emocional típica ante errores significativos?",
      "¿Cómo te sientes cuando cometes una equivocación importante?",
      "¿Qué experimentas internamente después de un error grave?",
    ],
    tips: [
      "Piensa en tu reacción emocional real, no en cómo crees que deberías reaccionar",
      "Considera tanto la intensidad como la duración de tu respuesta",
      "Reflexiona sobre cómo el error afecta tu funcionamiento general",
    ],
  },
  {
    id: 25,
    type: "scale",
    trait: "neuroticism",
    question: "Mantengo la calma bajo presión",
    reverse: true,
    explanation:
      "Esta pregunta evalúa tu capacidad para mantener estabilidad emocional en situaciones de alta presión.",
    examples: [
      "Mantener la compostura durante crisis",
      "Tomar decisiones claras bajo estrés",
      "No mostrar nerviosismo en situaciones tensas",
      "Ayudar a otros a calmarse durante emergencias",
    ],
    alternativeFormulations: [
      "Soy capaz de mantener mi compostura en situaciones estresantes",
      "Permanezco sereno/a incluso cuando hay mucha presión",
      "No pierdo la calma fácilmente ante situaciones tensas",
    ],
    tips: [
      "Piensa en situaciones de alta presión que has vivido",
      "Considera cómo otros describirían tu comportamiento bajo estrés",
      "Reflexiona sobre tu capacidad de funcionar efectivamente bajo presión",
    ],
  },
  {
    id: 26,
    type: "ranking",
    trait: "openness",
    question: "Ordena estas actividades de tiempo libre según tu preferencia (1 = más preferida)",
    instruction: "Arrastra para reordenar o usa las flechas",
    items: [
      "Leer libros o artículos sobre temas nuevos",
      "Crear arte, música o escribir",
      "Explorar lugares nuevos o viajar",
      "Aprender nuevas habilidades o hobbies",
      "Ver documentales o contenido educativo",
      "Experimentar con recetas o proyectos DIY",
    ],
    reverse: false,
    explanation:
      "Esta pregunta evalúa tus preferencias de ocio y cómo estas reflejan tu apertura a nuevas experiencias.",
    examples: [
      "Leer: novelas de géneros nuevos, artículos científicos, filosofía",
      "Crear: pintura, música, escritura creativa, manualidades",
      "Explorar: viajes a culturas diferentes, lugares desconocidos",
      "Aprender: cursos online, talleres, nuevas habilidades técnicas",
      "Ver: documentales de ciencia, historia, culturas, naturaleza",
      "Experimentar: cocina internacional, proyectos de bricolaje, inventos",
    ],
    alternativeFormulations: [
      "Prioriza estas actividades según qué tan atractivas te resultan",
      "Ordena estas opciones de ocio por tu nivel de interés",
      "Clasifica estas actividades desde la más hasta la menos preferida",
    ],
    tips: [
      "Ordena según tu preferencia real, no lo que crees que es 'correcto'",
      "Piensa en qué actividades te generan más entusiasmo",
      "Considera qué harías si tuvieras tiempo ilimitado",
    ],
  },
  {
    id: 27,
    type: "slider",
    trait: "conscientiousness",
    question: "¿Qué tan organizado eres en una escala del 0 al 100?",
    instruction: "Desliza para seleccionar tu nivel",
    min: 0,
    max: 100,
    step: 5,
    reverse: false,
    explanation: "Esta pregunta evalúa tu autopercepción sobre tu nivel de organización personal.",
    examples: [
      "0-25: Muy desorganizado, caótico, sin sistemas",
      "26-50: Algo desorganizado, organización básica ocasional",
      "51-75: Moderadamente organizado, algunos sistemas establecidos",
      "76-100: Muy organizado, sistemas detallados y consistentes",
    ],
    alternativeFormulations: [
      "En una escala de 0 a 100, ¿cuál es tu nivel de organización personal?",
      "¿Qué puntuación te darías en términos de orden y estructura?",
      "Del 0 al 100, ¿qué tan sistemático/a y ordenado/a eres?",
    ],
    tips: [
      "Considera tanto tu organización física como mental",
      "Piensa en cómo otros evaluarían tu nivel de organización",
      "Reflexiona sobre la consistencia de tu organización",
    ],
  },
  {
    id: 28,
    type: "checkbox",
    trait: "extraversion",
    question: "¿Cuáles de estas situaciones sociales disfrutas? (Selecciona todas las que apliquen)",
    instruction: "Puedes seleccionar múltiples opciones",
    options: [
      "Fiestas grandes con muchas personas",
      "Reuniones pequeñas con amigos cercanos",
      "Eventos de networking profesional",
      "Actividades grupales al aire libre",
      "Presentaciones públicas o hablar en público",
      "Colaborar en proyectos de equipo",
    ],
    reverse: false,
    explanation: "Esta pregunta evalúa tu preferencia por diferentes tipos de interacciones sociales.",
    examples: [
      "Fiestas: celebraciones, discotecas, eventos masivos",
      "Reuniones pequeñas: cenas íntimas, conversaciones profundas",
      "Networking: conferencias, eventos profesionales, conocer colegas",
      "Actividades grupales: deportes, excursiones, actividades al aire libre",
      "Presentaciones: hablar en público, liderar reuniones, dar charlas",
      "Colaboración: trabajar en equipo, proyectos grupales, brainstorming",
    ],
    alternativeFormulations: [
      "¿Qué tipos de interacciones sociales encuentras más gratificantes?",
      "Selecciona las situaciones sociales que más disfrutas",
      "¿En cuáles de estos contextos sociales te sientes más cómodo/a?",
    ],
    tips: [
      "Selecciona solo las que hayas implementado realmente",
      "Considera tanto conocimiento teórico como práctica",
      "Piensa en medidas de seguridad que hayas aplicado en proyectos",
      "No marques conceptos que solo hayas leído sobre ellos",
    ],
  },
  {
    id: 29,
    type: "binary",
    trait: "agreeableness",
    question: "¿Prefieres evitar conflictos o enfrentarlos directamente?",
    instruction: "Elige la opción que mejor te represente",
    options: ["Evitar conflictos", "Enfrentar conflictos directamente"],
    reverse: false,
    explanation: "Esta pregunta evalúa tu estilo natural de manejo de conflictos y tu preferencia por la armonía.",
    examples: [
      "Evitar: buscar la paz, mediar, encontrar compromisos, mantener armonía",
      "Enfrentar: abordar problemas directamente, confrontar cuando es necesario, resolver rápidamente",
    ],
    alternativeFormulations: [
      "¿Tiendes a evitar las confrontaciones o a abordarlas de frente?",
      "¿Prefieres mantener la paz o resolver conflictos directamente?",
      "¿Tu instinto es evitar tensiones o enfrentarlas abiertamente?",
    ],
    tips: [
      "Piensa en tu reacción instintiva ante conflictos",
      "Considera qué te resulta más natural y cómodo",
      "Reflexiona sobre tu comportamiento típico en desacuerdos",
    ],
  },
  {
    id: 30,
    type: "ranking",
    trait: "neuroticism",
    question: "Ordena estas reacciones ante el estrés según qué tan frecuentemente las experimentas",
    instruction: "1 = más frecuente, 6 = menos frecuente",
    items: [
      "Me siento abrumado/a y ansioso/a",
      "Busco apoyo en amigos o familia",
      "Me enfoco en encontrar soluciones prácticas",
      "Necesito tiempo a solas para procesar",
      "Me irrito fácilmente con otros",
      "Mantengo la calma y sigo adelante",
    ],
    reverse: true,
    explanation: "Esta pregunta evalúa tus patrones típicos de respuesta al estrés y tu estabilidad emocional.",
    examples: [
      "Abrumado: sentir ansiedad, pánico, sensación de no poder manejar la situación",
      "Buscar apoyo: llamar amigos, hablar con familia, buscar consuelo",
      "Soluciones: enfocarse en resolver, hacer planes, tomar acción",
      "Tiempo solo: necesitar espacio, reflexionar, procesar internamente",
      "Irritación: molestarse con otros, impaciencia, frustración dirigida",
      "Calma: mantener compostura, seguir funcionando normalmente",
    ],
    alternativeFormulations: [
      "Clasifica estas respuestas al estrés por qué tan típicas son en ti",
      "Ordena estas reacciones desde la más hasta la menos frecuente en tu caso",
      "Prioriza estas respuestas según qué tan seguido las experimentas",
    ],
    tips: [
      "Sé honesto/a sobre tus reacciones reales, no las ideales",
      "Piensa en situaciones estresantes recientes",
      "Considera tus patrones de comportamiento bajo presión",
    ],
  },
]

// Enhanced Speech Recognition Hook with better Spanish support
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()

        // Enhanced configuration for Spanish
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "es-ES" // Primary Spanish
        recognitionRef.current.maxAlternatives = 3 // More alternatives for better accuracy

        // Additional Spanish variants for better recognition
        const spanishVariants = ["es-ES", "es-MX", "es-AR", "es-CO", "es-CL"]
        let currentVariantIndex = 0

        // Handle results with enhanced processing
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            const transcript = result[0].transcript

            if (result.isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            setTranscript((prev) => {
              const newTranscript = prev + finalTranscript + " "
              return newTranscript
            })
            setInterimTranscript("")
            resetSilenceTimer()
            setError(null) // Clear any previous errors
          } else {
            setInterimTranscript(interimTranscript)
          }
        }

        // Enhanced error handling
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)

          switch (event.error) {
            case "no-speech":
              setError("No se detectó voz. Intenta hablar más cerca del micrófono.")
              break
            case "audio-capture":
              setError("No se pudo acceder al micrófono. Verifica los permisos.")
              break
            case "not-allowed":
              setError("Permiso de micrófono denegado. Habilita el micrófono en tu navegador.")
              break
            case "network":
              setError("Error de conexión. Verifica tu conexión a internet.")
              break
            case "language-not-supported":
              // Try next Spanish variant
              if (currentVariantIndex < spanishVariants.length - 1) {
                currentVariantIndex++
                recognitionRef.current.lang = spanishVariants[currentVariantIndex]
                console.log(`Trying Spanish variant: ${spanishVariants[currentVariantIndex]}`)
                // Don't set error, just try again
                return
              } else {
                setError("Idioma español no soportado en este navegador.")
              }
              break
            default:
              setError(`Error de reconocimiento: ${event.error}`)
          }

          setIsListening(false)
          setIsInitializing(false)
        }

        // Handle end
        recognitionRef.current.onend = () => {
          setIsListening(false)
          setInterimTranscript("")
          setIsInitializing(false)

          // Auto-restart if it was stopped due to silence timeout
          if (restartTimerRef.current) {
            clearTimeout(restartTimerRef.current)
            restartTimerRef.current = null
          }
        }

        // Handle start
        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setIsInitializing(false)
          setError(null)
          resetSilenceTimer()
        }

        // Handle speech start (user started speaking)
        recognitionRef.current.onspeechstart = () => {
          resetSilenceTimer()
          setError(null)
        }

        // Handle speech end (user stopped speaking)
        recognitionRef.current.onspeechend = () => {
          startSilenceTimer()
        }

        // Handle sound start (any sound detected)
        recognitionRef.current.onsoundstart = () => {
          resetSilenceTimer()
        }

        // Handle sound end (no sound detected)
        recognitionRef.current.onsoundend = () => {
          startSilenceTimer()
        }
      } else {
        setIsSupported(false)
        setError("Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      clearAllTimers()
    }
  }, [])

  const clearAllTimers = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }
  }

  const startSilenceTimer = () => {
    clearAllTimers()

    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        console.log("Stopping due to 3 seconds of silence")
        recognitionRef.current.stop()
      }
    }, 3000) // Stop after 3 seconds of silence
  }

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isInitializing) {
      setIsInitializing(true)
      setError(null)

      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting recognition:", error)
        setError("Error al iniciar el reconocimiento de voz")
        setIsInitializing(false)
      }
    }
  }, [isListening, isInitializing])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && (isListening || isInitializing)) {
      recognitionRef.current.stop()
      clearAllTimers()
    }
  }, [isListening, isInitializing])

  const clearTranscript = useCallback(() => {
    setTranscript("")
    setInterimTranscript("")
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    isInitializing,
    startListening,
    stopListening,
    clearTranscript,
  }
}

interface RankingComponentProps {
  items: string[]
  value: string[]
  onChange: (newOrder: string[]) => void
  trait: keyof typeof BIG_FIVE_TRAITS
}

const RankingComponent: React.FC<RankingComponentProps> = ({ items, value, onChange, trait }) => {
  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...value]
    const [movedItem] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, movedItem)
    onChange(newOrder)
  }

  const traitConfig = BIG_FIVE_TRAITS[trait]
  const TraitIcon = traitConfig.icon

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <TraitIcon className="w-4 h-4" />
        <span>Arrastra los elementos o usa las flechas para reordenar según tu preferencia</span>
      </div>

      {value.map((item, index) => (
        <div
          key={item}
          className={`flex items-center gap-4 p-4 bg-gradient-to-r from-${trait === "openness" ? "purple" : trait === "conscientiousness" ? "blue" : trait === "extraversion" ? "green" : trait === "agreeableness" ? "yellow" : "red"}-50 to-gray-50 rounded-lg border border-${trait === "openness" ? "purple" : trait === "conscientiousness" ? "blue" : trait === "extraversion" ? "green" : trait === "agreeableness" ? "yellow" : "red"}-200 hover:shadow-md transition-all`}
        >
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-white/50"
              onClick={() => index > 0 && moveItem(index, index - 1)}
              disabled={index === 0}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-white/50"
              onClick={() => index < value.length - 1 && moveItem(index, index + 1)}
              disabled={index === value.length - 1}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          <div
            className={`w-10 h-10 ${traitConfig.color} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}
          >
            {index + 1}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900">{item}</p>
            <p className="text-sm text-gray-600">
              {index === 0 && "🥇 Tu preferencia principal"}
              {index === 1 && "🥈 Segunda opción"}
              {index === 2 && "🥉 Tercera opción"}
              {index > 2 && `#${index + 1} en tu ranking`}
            </p>
          </div>

          <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      ))}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <Target className="w-4 h-4" />
          <span className="font-medium">Consejo:</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Ordena según tu preferencia personal real. No hay respuestas correctas o incorrectas.
        </p>
      </div>
    </div>
  )
}

export default function PersonalityTestPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isCompleting, setIsCompleting] = useState(false)
  const [rankingItems, setRankingItems] = useState<{ [key: number]: string[] }>({})

  // Help system state
  const [helpUsedQuestions, setHelpUsedQuestions] = useState<Set<number>>(new Set())
  const [rephraseUsedQuestions, setRephraseUsedQuestions] = useState<Set<number>>(new Set())
  const [isRephrased, setIsRephrased] = useState<{ [key: number]: boolean }>({})
  const [showTips, setShowTips] = useState(false)

  // Speech recognition
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error: speechError,
    isInitializing,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition()

  const question = PERSONALITY_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / PERSONALITY_QUESTIONS.length) * 100
  const isAnswered = answers[question.id] !== undefined

  // Initialize ranking items when question changes
  useEffect(() => {
    if (question.type === "ranking" && question.items && !rankingItems[question.id]) {
      setRankingItems((prev) => ({
        ...prev,
        [question.id]: [...question.items!],
      }))
    }
  }, [question, rankingItems])

  // Update text answer when transcript changes
  useEffect(() => {
    if (transcript && question.type === "open") {
      handleAnswerChange(transcript.trim())
    }
  }, [transcript, question.type])

  // Get question type icon
  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case "scale":
        return BarChart3
      case "open":
        return MessageSquare
      case "multiple":
        return List
      case "scenario":
        return Users
      case "ranking":
        return TrendingUp
      case "checkbox":
        return CheckSquare
      case "slider":
        return SliderIcon
      case "binary":
        return ToggleLeft
      default:
        return Brain
    }
  }

  // Get question type label
  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case "scale":
        return "Escala de Acuerdo"
      case "open":
        return "Respuesta Abierta"
      case "multiple":
        return "Selección Múltiple"
      case "scenario":
        return "Escenario"
      case "ranking":
        return "Ordenar por Preferencia"
      case "checkbox":
        return "Selección Múltiple"
      case "slider":
        return "Deslizador"
      case "binary":
        return "Elección Binaria"
      default:
        return ""
    }
  }

  // Handle answer change
  const handleAnswerChange = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }))
  }

  // Handle help usage
  const handleHelpUsed = () => {
    setHelpUsedQuestions((prev) => new Set([...prev, question.id]))
  }

  // Handle rephrase
  const handleRephrase = () => {
    setRephraseUsedQuestions((prev) => new Set([...prev, question.id]))
    setIsRephrased((prev) => ({
      ...prev,
      [question.id]: !prev[question.id],
    }))
  }

  // Get current question text (original or rephrased)
  const getCurrentQuestionText = () => {
    if (isRephrased[question.id] && question.alternativeFormulations && question.alternativeFormulations.length > 0) {
      return question.alternativeFormulations[0]
    }
    return question.question
  }

  // Handle speech input for open questions
  const handleSpeechInput = () => {
    if (isListening || isInitializing) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < PERSONALITY_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      // Clear speech recognition when moving to next question
      if (isListening) {
        stopListening()
      }
      clearTranscript()
    } else {
      handleComplete()
    }
  }

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      // Clear speech recognition when moving to previous question
      if (isListening) {
        stopListening()
      }
      clearTranscript()
    }
  }

  // Complete assessment
  const handleComplete = async () => {
    setIsCompleting(true)

    // Stop any ongoing speech recognition
    if (isListening) {
      stopListening()
    }

    // Calculate Big Five scores
    const scores = calculateBigFiveScores(answers)

    // Save results to localStorage (in a real app, save to database)
    localStorage.setItem(
      "personalityResults",
      JSON.stringify({
        scores,
        answers,
        helpUsed: Array.from(helpUsedQuestions),
        rephraseUsed: Array.from(rephraseUsedQuestions),
        completedAt: new Date().toISOString(),
        type: "big-five",
      }),
    )

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    router.push("/personality-results")
  }

  // Calculate Big Five scores
  const calculateBigFiveScores = (answers: Record<number, any>) => {
    const traitScores: Record<string, number[]> = {
      openness: [],
      conscientiousness: [],
      extraversion: [],
      agreeableness: [],
      neuroticism: [],
    }

    PERSONALITY_QUESTIONS.forEach((q) => {
      const answer = answers[q.id]
      if (answer === undefined) return

      let score = 0

      switch (q.type) {
        case "scale":
          score = typeof answer === "number" ? answer : 3
          if (q.reverse) score = 6 - score
          break

        case "ranking":
          // Para ranking, calculamos el score basado en las posiciones
          const items = answer as string[]
          const originalItems = q.items || []

          // Calculamos un score basado en qué tan "positivo" es el ranking
          let rankingScore = 0
          items.forEach((item, position) => {
            const originalIndex = originalItems.indexOf(item)
            // Items más "positivos" en posiciones altas dan más puntos
            const positionWeight = (items.length - position) / items.length
            rankingScore += positionWeight
          })

          score = Math.round((rankingScore / items.length) * 5) + 1
          if (q.reverse) score = 6 - score
          break

        case "checkbox":
          // Para checkbox, el score depende de cuántas opciones seleccionaron
          const selectedOptions = answer as number[]
          const selectionRatio = selectedOptions.length / (q.options?.length || 1)
          score = Math.round(selectionRatio * 4) + 1
          break

        case "slider":
          // Para slider, normalizamos el valor al rango 1-5
          const sliderValue = answer as number
          const min = q.min || 0
          const max = q.max || 100
          const normalizedValue = (sliderValue - min) / (max - min)
          score = Math.round(normalizedValue * 4) + 1
          if (q.reverse) score = 6 - score
          break

        case "binary":
          // Para binarias, convertimos 0/1 a 1-5 (1 o 5)
          score = answer === 0 ? 1 : 5
          if (q.reverse) score = 6 - score
          break

        case "open":
          // Scoring mejorado para preguntas abiertas
          const text = (answer || "").toLowerCase()
          const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length

          score = Math.min(5, Math.max(1, Math.floor(wordCount / 5) + 1))

          const keywords = getTraitKeywords(q.trait)
          const keywordMatches = keywords.filter((keyword) => text.includes(keyword)).length
          score = Math.min(5, score + keywordMatches * 0.3)

          if (wordCount > 20) {
            score = Math.min(5, score + 0.5)
          }
          break

        case "multiple":
        case "scenario":
          score = Math.round(((answer || 0) / 3) * 4) + 1
          break
      }

      traitScores[q.trait].push(score)
    })

    // Calcular promedios y convertir a escala 0-100
    const finalScores: Record<string, number> = {}
    Object.keys(traitScores).forEach((trait) => {
      const scores = traitScores[trait]
      const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 3
      finalScores[trait] = Math.round(((average - 1) / 4) * 100)
    })

    return finalScores
  }

  // Get trait-specific keywords for open-ended questions
  const getTraitKeywords = (trait: keyof typeof BIG_FIVE_TRAITS): string[] => {
    switch (trait) {
      case "openness":
        return [
          "creativo",
          "imaginativo",
          "curioso",
          "nuevo",
          "innovador",
          "artístico",
          "original",
          "explorar",
          "experimentar",
          "diferente",
        ]
      case "conscientiousness":
        return [
          "organizado",
          "responsable",
          "puntual",
          "disciplinado",
          "planificado",
          "metódico",
          "eficiente",
          "orden",
          "estructura",
          "sistemático",
        ]
      case "extraversion":
        return [
          "social",
          "energético",
          "hablador",
          "activo",
          "entusiasta",
          "expresivo",
          "extrovertido",
          "gente",
          "grupo",
          "comunicativo",
        ]
      case "agreeableness":
        return [
          "amable",
          "cooperativo",
          "empático",
          "comprensivo",
          "colaborativo",
          "considerado",
          "generoso",
          "ayudar",
          "apoyo",
          "equipo",
        ]
      case "neuroticism":
        return [
          "ansioso",
          "estresado",
          "preocupado",
          "nervioso",
          "emocional",
          "sensible",
          "inestable",
          "estrés",
          "ansiedad",
          "tensión",
        ]
      default:
        return []
    }
  }

  // Render question based on type
  const renderQuestion = () => {
    switch (question.type) {
      case "scale":
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{getCurrentQuestionText()}</p>
            <p className="text-sm text-muted-foreground">Indica qué tan de acuerdo estás con esta afirmación</p>
            <RadioGroup
              value={answers[question.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(Number.parseInt(value))}
              className="space-y-3"
            >
              {[1, 2, 3, 4, 5].map((value) => {
                const labels = [
                  "Totalmente en desacuerdo",
                  "En desacuerdo",
                  "Neutral",
                  "De acuerdo",
                  "Totalmente de acuerdo",
                ]
                return (
                  <div
                    key={value}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={value.toString()} id={`option-${value}`} />
                    <Label htmlFor={`option-${value}`} className="flex-1 cursor-pointer font-medium">
                      {labels[value - 1]}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
        )

      case "open":
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{getCurrentQuestionText()}</p>

            {/* Speech Recognition Controls */}
            {isSupported && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <Button
                    type="button"
                    variant={isListening || isInitializing ? "destructive" : "default"}
                    size="sm"
                    onClick={handleSpeechInput}
                    disabled={isInitializing}
                    className="flex items-center gap-2"
                  >
                    {isInitializing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Iniciando...
                      </>
                    ) : isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        Detener Grabación
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        Hablar Respuesta
                      </>
                    )}
                  </Button>

                  {isListening && (
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      Escuchando... (se detiene automáticamente tras 3s de silencio)
                    </div>
                  )}

                  {transcript && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearTranscript}
                      className="text-xs bg-transparent"
                    >
                      Limpiar Transcripción
                    </Button>
                  )}
                </div>

                {/* Speech Error Display */}
                {speechError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{speechError}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Real-time transcription display */}
            {(transcript || interimTranscript) && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Transcripción en Tiempo Real</span>
                </div>
                <div className="text-sm leading-relaxed">
                  <span className="text-green-900">{transcript}</span>
                  {interimTranscript && (
                    <span className="text-green-600 italic opacity-75 bg-green-100 px-1 rounded">
                      {interimTranscript}
                    </span>
                  )}
                  {isListening && !interimTranscript && (
                    <span className="text-green-600 italic opacity-50">Esperando tu voz...</span>
                  )}
                </div>
                <div className="mt-2 text-xs text-green-700">
                  Palabras: {transcript.split(/\s+/).filter((word) => word.length > 0).length} | Caracteres:{" "}
                  {transcript.length}
                </div>
              </div>
            )}

            {/* Browser not supported warning */}
            {!isSupported && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Reconocimiento de voz no disponible. Puedes escribir tu respuesta normalmente.
                </AlertDescription>
              </Alert>
            )}

            <Textarea
              placeholder="Escribe tu respuesta aquí o usa el botón de micrófono para hablar..."
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 10 caracteres para continuar. Actual: {(answers[question.id] || "").length}
            </p>
          </div>
        )

      case "multiple":
      case "scenario":
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{getCurrentQuestionText()}</p>
            <RadioGroup
              value={answers[question.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(Number.parseInt(value))}
              className="space-y-3"
            >
              {question.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "ranking":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Ranking de Preferencias
              </Badge>
              <span className="text-sm text-muted-foreground">{question.instruction}</span>
            </div>
            <p className="text-lg font-medium">{getCurrentQuestionText()}</p>

            <RankingComponent
              items={question.items || []}
              value={rankingItems[question.id] || question.items || []}
              onChange={(newOrder) => {
                setRankingItems((prev) => ({ ...prev, [question.id]: newOrder }))
                handleAnswerChange(newOrder)
              }}
              trait={question.trait}
            />
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                Selección Múltiple
              </Badge>
              <span className="text-sm text-muted-foreground">{question.instruction}</span>
            </div>
            <p className="text-lg font-medium">{getCurrentQuestionText()}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`checkbox-${index}`}
                    checked={((answers[question.id] as number[]) || []).includes(index)}
                    onCheckedChange={(checked) => {
                      const currentAnswers = (answers[question.id] as number[]) || []
                      if (checked) {
                        handleAnswerChange([...currentAnswers, index])
                      } else {
                        handleAnswerChange(currentAnswers.filter((i) => i !== index))
                      }
                    }}
                  />
                  <Label htmlFor={`checkbox-${index}`} className="flex-1 cursor-pointer font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              Seleccionadas: {((answers[question.id] as number[]) || []).length} de {question.options?.length || 0}
            </div>
          </div>
        )

      case "slider":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <SliderIcon className="w-3 h-3" />
                Deslizador
              </Badge>
              <span className="text-sm text-muted-foreground">{question.instruction}</span>
            </div>
            <p className="text-lg font-medium">{getCurrentQuestionText()}</p>

            <div className="space-y-4">
              <Slider
                value={[(answers[question.id] as number) || question.min || 0]}
                onValueChange={(value) => handleAnswerChange(value[0])}
                min={question.min || 0}
                max={question.max || 100}
                step={question.step || 1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{question.min || 0}</span>
                <span className="font-medium text-lg text-primary">{answers[question.id] || question.min || 0}</span>
                <span>{question.max || 100}</span>
              </div>
            </div>
          </div>
        )

      case "binary":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <ToggleLeft className="w-3 h-3" />
                Elección Binaria
              </Badge>
              <span className="text-sm text-muted-foreground">{question.instruction}</span>
            </div>
            <p className="text-lg font-medium">{getCurrentQuestionText()}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[question.id] === index ? "default" : "outline"}
                  className="p-6 h-auto text-left justify-start"
                  onClick={() => handleAnswerChange(index)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        answers[question.id] === index ? "bg-primary border-primary" : "border-muted-foreground"
                      }`}
                    >
                      {answers[question.id] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Check if answer is valid
  const isValidAnswer = () => {
    const answer = answers[question.id]

    switch (question.type) {
      case "open":
        return answer && (answer as string).length >= 10
      case "ranking":
        return answer && Array.isArray(answer) && answer.length === question.items?.length
      case "checkbox":
        return answer && Array.isArray(answer) && (answer as number[]).length > 0
      case "slider":
        return answer !== undefined && answer !== null
      case "binary":
        return answer !== undefined
      default:
        return answer !== undefined
    }
  }

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <CardTitle>Evaluación Completada</CardTitle>
            <CardDescription>Analizando tus respuestas...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={100} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">Procesando resultados...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Evaluación de Personalidad</h1>
            <p className="text-muted-foreground mb-6">Descubre tus rasgos de personalidad con el modelo Big Five</p>
          </div>

          {/* Question Card */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  {/* Question Type Badge */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {(() => {
                        const Icon = getQuestionTypeIcon(question.type)
                        return <Icon className="w-3 h-3" />
                      })()}
                      {getQuestionTypeLabel(question.type)}
                    </Badge>

                    {/* Help and Rephrase badges */}
                    {helpUsedQuestions.has(question.id) && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Ayuda Usada
                      </Badge>
                    )}
                    {rephraseUsedQuestions.has(question.id) && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Reformulada
                      </Badge>
                    )}

                    {/* Speech Recognition Badge for open questions */}
                    {question.type === "open" && isSupported && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Mic className="w-3 h-3" />
                        Voz Disponible
                      </Badge>
                    )}
                  </div>

                  {/* Trait Badge */}
                  <Badge className={`${BIG_FIVE_TRAITS[question.trait].color} text-white`}>
                    {(() => {
                      const Icon = BIG_FIVE_TRAITS[question.trait].icon
                      return <Icon className="w-3 h-3 mr-1" />
                    })()}
                    {question.trait.charAt(0).toUpperCase() + question.trait.slice(1)}
                  </Badge>
                </div>

                {/* Help and Rephrase buttons */}
                <div className="flex gap-2 mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleHelpUsed}>
                        <HelpCircle className="w-4 h-4 mr-2" />
                        ¿No entiendes la pregunta?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Ayuda para esta pregunta</DialogTitle>
                        <DialogDescription>Te ayudamos a entender mejor qué estamos evaluando</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {question.explanation && (
                          <div>
                            <h4 className="font-semibold mb-2">¿Qué evalúa esta pregunta?</h4>
                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                          </div>
                        )}

                        {question.examples && question.examples.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Ejemplos:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {question.examples.map((example, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {question.tips && question.tips.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Consejos para responder:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {question.tips.map((tip, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {question.alternativeFormulations && question.alternativeFormulations.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handleRephrase}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reformular pregunta
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">{renderQuestion()}</CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <Button onClick={handleNext} disabled={!isValidAnswer()}>
                {currentQuestion === PERSONALITY_QUESTIONS.length - 1 ? "Completar Test" : "Siguiente"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Tips Panel */}
            <Collapsible open={showTips} onOpenChange={setShowTips}>
              <Card className="mt-6">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <CardTitle className="text-lg">Consejos Generales</CardTitle>
                      </div>
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${showTips ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        • <strong>Sé honesto/a:</strong> No hay respuestas correctas o incorrectas
                      </p>
                      <p>
                        • <strong>Piensa en tu comportamiento típico:</strong> No en situaciones excepcionales
                      </p>
                      <p>
                        • <strong>Usa la ayuda:</strong> Si no entiendes una pregunta, usa el botón de ayuda
                      </p>
                      <p>
                        • <strong>Reformula si es necesario:</strong> Algunas preguntas tienen versiones alternativas
                      </p>
                      {question.type === "open" && isSupported && (
                        <p>
                          • <strong>Reconocimiento de voz:</strong> Puedes hablar tus respuestas en preguntas abiertas
                        </p>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Big Five Info Panel */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Big Five - Rasgos de Personalidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(BIG_FIVE_TRAITS).map(([trait, config]) => {
                    const Icon = config.icon
                    return (
                      <div key={trait} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`w-8 h-8 ${config.color} rounded-full flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{trait.charAt(0).toUpperCase() + trait.slice(1)}</p>
                          <p className="text-xs text-muted-foreground">
                            {trait === "openness" && "Apertura a experiencias"}
                            {trait === "conscientiousness" && "Responsabilidad"}
                            {trait === "extraversion" && "Extroversión"}
                            {trait === "agreeableness" && "Amabilidad"}
                            {trait === "neuroticism" && "Neuroticismo"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
