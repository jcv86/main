"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Code,
  ChevronLeft,
  Mic,
  MicOff,
  AlertCircle,
  Info,
  Database,
  Globe,
  Smartphone,
  Server,
  Palette,
  Shield,
  Settings,
  Volume2,
  Keyboard,
  CheckCircle,
  Trash2,
  Pause,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Target,
  Square,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Technical skill categories
const SKILL_CATEGORIES = {
  frontend: { color: "bg-blue-500", icon: Globe, name: "Frontend" },
  backend: { color: "bg-green-500", icon: Server, name: "Backend" },
  database: { color: "bg-purple-500", icon: Database, name: "Base de Datos" },
  mobile: { color: "bg-orange-500", icon: Smartphone, name: "Móvil" },
  design: { color: "bg-pink-500", icon: Palette, name: "Diseño" },
  security: { color: "bg-red-500", icon: Shield, name: "Seguridad" },
}

// Question types
type QuestionType = "scale" | "open" | "multiple" | "scenario" | "ranking" | "checkbox" | "slider" | "binary" | "code"
type InputMode = "mixed" | "voice-complete"

interface Question {
  id: number
  type: QuestionType
  category: keyof typeof SKILL_CATEGORIES
  question: string
  instruction?: string
  options?: string[]
  items?: string[] // Para preguntas de ranking
  min?: number // Para slider
  max?: number // Para slider
  step?: number // Para slider
  code?: string // Para preguntas de código
  language?: string // Lenguaje de programación
  reverse?: boolean
  // Sistema de ayuda
  explanation?: string
  examples?: string[]
  alternativeFormulations?: string[]
  tips?: string[]
}

// Technical Questions Database
const TECHNICAL_QUESTIONS: Question[] = [
  // Frontend Questions
  {
    id: 1,
    type: "code",
    category: "frontend",
    question: "Optimiza este componente React para mejorar su rendimiento:",
    code: `function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <img src={user.avatar || "/placeholder.svg"} />
          <span>{user.name}</span>
          <span>{user.email}</span>
        </div>
      ))}
    </div>
  );
}`,
    language: "javascript",
    explanation:
      "Este componente puede optimizarse usando React.memo, lazy loading de imágenes, y virtualization para listas grandes.",
    examples: [
      "Usar React.memo para evitar re-renders innecesarios",
      "Implementar lazy loading para las imágenes",
      "Considerar virtualization con react-window para listas grandes",
    ],
    tips: [
      "Piensa en cuándo se re-renderiza este componente",
      "Considera el performance con miles de usuarios",
      "¿Qué pasa si las imágenes son pesadas?",
    ],
  },
  {
    id: 2,
    type: "multiple",
    category: "frontend",
    question: "¿Cuál es la mejor práctica para manejar estado global en una aplicación React grande?",
    options: [
      "Usar solo useState en el componente raíz",
      "Context API para todo el estado",
      "Redux Toolkit con RTK Query",
      "Zustand con persistencia",
      "Combinar Context API para UI y Redux para datos de servidor",
    ],
    explanation:
      "Para aplicaciones grandes, es recomendable separar el estado de UI del estado de servidor, usando diferentes herramientas para cada caso.",
    examples: [
      "Context API: Estado de tema, usuario autenticado",
      "Redux/Zustand: Cache de datos, estado complejo de aplicación",
      "React Query: Estado de servidor, cache automático",
    ],
  },
  {
    id: 3,
    type: "ranking",
    category: "frontend",
    question: "Ordena estas tecnologías frontend según tu nivel de experiencia (mayor a menor):",
    items: ["HTML/CSS", "JavaScript ES6+", "React", "TypeScript", "Next.js", "Vue.js", "Angular", "Svelte"],
    explanation:
      "Este ranking nos ayuda a entender tu stack tecnológico y experiencia relativa con diferentes frameworks.",
  },
  {
    id: 4,
    type: "scenario",
    category: "frontend",
    question:
      "Tu aplicación React se vuelve lenta al cargar una tabla con 10,000 filas. Los usuarios se quejan del performance. ¿Cómo solucionarías este problema paso a paso?",
    explanation:
      "Este escenario evalúa tu capacidad de diagnóstico y optimización de performance en aplicaciones reales.",
    tips: [
      "Considera virtualization",
      "Piensa en paginación",
      "¿Qué herramientas usarías para diagnosticar?",
      "¿Cómo medirías la mejora?",
    ],
  },

  // Backend Questions
  {
    id: 5,
    type: "code",
    category: "backend",
    question: "Revisa esta API REST en Node.js y sugiere mejoras de seguridad y performance:",
    code: `app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = \`SELECT * FROM users WHERE id = \${userId}\`;
  
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send('Error');
      return;
    }
    res.json(result[0]);
  });
});`,
    language: "javascript",
    explanation: "Este código tiene vulnerabilidades de SQL injection y falta de validación de entrada.",
    examples: [
      "Usar prepared statements o ORM",
      "Validar y sanitizar parámetros de entrada",
      "Implementar rate limiting",
      "Agregar logging y manejo de errores apropiado",
    ],
    tips: [
      "¿Qué pasa si userId es malicioso?",
      "¿Cómo protegerías contra ataques?",
      "¿Qué información no debería exponerse?",
    ],
  },
  {
    id: 6,
    type: "multiple",
    category: "backend",
    question: "Para una API que maneja 100,000 requests por minuto, ¿cuál sería la mejor arquitectura?",
    options: [
      "Monolito con cache Redis",
      "Microservicios con API Gateway",
      "Serverless functions",
      "Arquitectura híbrida con CDN",
      "Event-driven con message queues",
    ],
    explanation:
      "Para alto tráfico, necesitas considerar escalabilidad horizontal, cache distribuido, y separación de responsabilidades.",
    examples: [
      "API Gateway: Rate limiting, routing, authentication",
      "Microservicios: Escalabilidad independiente por servicio",
      "Cache: Redis para datos frecuentes, CDN para assets",
    ],
  },
  {
    id: 7,
    type: "checkbox",
    category: "backend",
    question:
      "¿Qué consideraciones de seguridad implementarías en una API de producción? (Selecciona todas las aplicables)",
    options: [
      "Autenticación JWT con refresh tokens",
      "Rate limiting por IP y usuario",
      "Validación de entrada con schemas",
      "HTTPS obligatorio con HSTS",
      "CORS configurado correctamente",
      "Logging de eventos de seguridad",
      "Sanitización de datos de salida",
      "Monitoreo de vulnerabilidades",
    ],
    explanation: "La seguridad en APIs requiere múltiples capas de protección, desde la red hasta la aplicación.",
  },

  // Database Questions
  {
    id: 8,
    type: "code",
    category: "database",
    question: "Optimiza esta consulta SQL que está causando timeouts:",
    code: `SELECT u.name, u.email, 
       COUNT(o.id) as order_count,
       SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2023-01-01'
GROUP BY u.id, u.name, u.email
ORDER BY total_spent DESC;`,
    language: "sql",
    explanation: "Esta consulta puede optimizarse con índices apropiados y posiblemente reestructuración.",
    examples: [
      "Crear índice en users.created_at",
      "Índice compuesto en orders(user_id, total)",
      "Considerar materializar la vista para reportes frecuentes",
    ],
    tips: ["¿Qué índices faltan?", "¿Se puede evitar el GROUP BY?", "¿Es necesario LEFT JOIN o puede ser INNER?"],
  },
  {
    id: 9,
    type: "scenario",
    category: "database",
    question:
      "Tu base de datos PostgreSQL está al 90% de CPU constantemente. Las consultas más lentas involucran JOINs complejos entre 5 tablas. ¿Cómo diagnosticarías y solucionarías este problema?",
    explanation: "Este escenario evalúa tu capacidad de diagnóstico y optimización de bases de datos en producción.",
    tips: [
      "¿Qué herramientas usarías para identificar consultas lentas?",
      "¿Cómo analizarías los planes de ejecución?",
      "¿Considerarías denormalización o cache?",
    ],
  },
  {
    id: 10,
    type: "multiple",
    category: "database",
    question:
      "Para una aplicación con lecturas frecuentes pero escrituras ocasionales, ¿qué estrategia de base de datos recomendarías?",
    options: [
      "Read replicas con PostgreSQL",
      "Cache Redis con write-through",
      "CQRS con Event Sourcing",
      "Base de datos columnares como ClickHouse",
      "Híbrido: PostgreSQL + Elasticsearch",
    ],
    explanation:
      "Para workloads read-heavy, necesitas optimizar para consultas rápidas manteniendo consistencia en escrituras.",
  },

  // Mobile Questions
  {
    id: 11,
    type: "multiple",
    category: "mobile",
    question: "Para desarrollar una app móvil que funcione en iOS y Android, ¿qué tecnología elegirías y por qué?",
    options: [
      "React Native - Reutilización de código web",
      "Flutter - Performance nativo y UI consistente",
      "Ionic - Desarrollo web familiar",
      "Xamarin - Integración con ecosistema Microsoft",
      "Desarrollo nativo - Máximo control y performance",
    ],
    explanation:
      "La elección depende del equipo, requisitos de performance, y necesidades específicas de la aplicación.",
    examples: [
      "React Native: Ideal si ya tienes equipo React",
      "Flutter: Mejor para UI compleja y animaciones",
      "Nativo: Necesario para apps con requisitos específicos de plataforma",
    ],
  },
  {
    id: 12,
    type: "scenario",
    category: "mobile",
    question:
      "Tu app React Native tiene problemas de performance en listas largas y la navegación se siente lenta. Los usuarios reportan crashes ocasionales. ¿Cómo abordarías estos problemas?",
    explanation:
      "Performance en mobile requiere consideraciones específicas de memoria, CPU, y experiencia de usuario.",
    tips: [
      "¿Cómo optimizarías las listas?",
      "¿Qué herramientas usarías para debugging?",
      "¿Cómo manejarías la memoria limitada?",
    ],
  },

  // Design Questions
  {
    id: 13,
    type: "multiple",
    category: "design",
    question:
      "Al diseñar una interfaz para usuarios chilenos, ¿qué consideraciones culturales y de UX son más importantes?",
    options: [
      "Colores que reflejen la identidad chilena",
      "Patrones de navegación familiares en el mercado local",
      "Terminología y lenguaje específico de Chile",
      "Consideraciones de conectividad y dispositivos",
      "Todas las anteriores",
    ],
    explanation:
      "El diseño para mercados específicos requiere entender el contexto cultural, tecnológico y de usuario local.",
  },
  {
    id: 14,
    type: "scenario",
    category: "design",
    question:
      "Necesitas diseñar una app de banca móvil para usuarios chilenos de 50+ años que no son muy tech-savvy. ¿Cuál sería tu enfoque de diseño?",
    explanation: "Diseñar para usuarios menos técnicos requiere priorizar simplicidad, accesibilidad, y confianza.",
    tips: [
      "¿Cómo simplificarías la navegación?",
      "¿Qué elementos generan confianza?",
      "¿Cómo manejarías la accesibilidad?",
    ],
  },

  // Security Questions
  {
    id: 15,
    type: "checkbox",
    category: "security",
    question:
      "¿Qué medidas de seguridad implementarías en una aplicación web que maneja datos financieros? (Selecciona todas las aplicables)",
    options: [
      "Autenticación multifactor obligatoria",
      "Encriptación end-to-end",
      "Auditoría completa de acciones",
      "Tokenización de datos sensibles",
      "WAF (Web Application Firewall)",
      "Monitoreo de anomalías en tiempo real",
      "Backup encriptado y disaster recovery",
      "Penetration testing regular",
    ],
    explanation: "Aplicaciones financieras requieren el más alto nivel de seguridad en múltiples capas.",
  },
  {
    id: 16,
    type: "code",
    category: "security",
    question: "Identifica las vulnerabilidades en este código de autenticación:",
    code: `function login(username, password) {
  const user = db.query(
    \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`
  );
  
  if (user) {
    const token = jwt.sign({ id: user.id }, 'secret123');
    res.cookie('token', token);
    return { success: true, user };
  }
  
  return { success: false };
}`,
    language: "javascript",
    explanation: "Este código tiene múltiples vulnerabilidades críticas de seguridad.",
    examples: [
      "SQL injection en la consulta",
      "Contraseña en texto plano",
      "JWT secret hardcodeado",
      "Cookie sin flags de seguridad",
      "Falta rate limiting",
    ],
    tips: [
      "¿Cómo protegerías contra SQL injection?",
      "¿Cómo deberían almacenarse las contraseñas?",
      "¿Qué flags de seguridad faltan en la cookie?",
    ],
  },

  // Mixed Technical Questions
  {
    id: 17,
    type: "open",
    category: "frontend",
    question:
      "Explica cómo implementarías un sistema de notificaciones en tiempo real para una aplicación web. Considera tanto el frontend como el backend.",
    explanation: "Esta pregunta evalúa tu comprensión de arquitecturas full-stack y tecnologías de tiempo real.",
    tips: [
      "Considera WebSockets, Server-Sent Events, o Push API",
      "¿Cómo manejarías la persistencia de notificaciones?",
      "¿Qué pasa si el usuario está offline?",
    ],
  },
  {
    id: 18,
    type: "slider",
    category: "backend",
    question: "En una escala del 1 al 10, ¿qué tan cómodo te sientes diseñando arquitecturas de microservicios?",
    min: 1,
    max: 10,
    step: 1,
    explanation:
      "Los microservicios requieren entender distributed systems, service discovery, y event-driven architecture.",
  },
  {
    id: 19,
    type: "ranking",
    category: "database",
    question: "Ordena estas bases de datos según tu experiencia práctica (mayor a menor):",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQLite", "DynamoDB", "Cassandra"],
    explanation: "Tu experiencia con diferentes tipos de bases de datos indica tu versatilidad en manejo de datos.",
  },
  {
    id: 20,
    type: "scenario",
    category: "security",
    question:
      "Tu aplicación web fue comprometida y los atacantes accedieron a datos de usuarios. ¿Cuál sería tu plan de respuesta a incidentes paso a paso?",
    explanation: "La respuesta a incidentes de seguridad requiere un plan estructurado y comunicación efectiva.",
    tips: [
      "¿Cuáles serían tus primeros pasos?",
      "¿Cómo comunicarías a los usuarios?",
      "¿Qué medidas preventivas implementarías?",
    ],
  },
]

// Conversational flow for technical skills
const TECHNICAL_CONVERSATION_FLOW = [
  {
    id: "intro",
    category: "Introducción",
    systemMessage:
      "¡Hola! Soy tu asistente especializado en evaluación de habilidades técnicas. Vamos a tener una conversación natural sobre tu experiencia y competencias en desarrollo de software. No es un examen, sino una charla técnica para conocer mejor tu perfil profesional. ¿Estás listo para comenzar?",
    userPrompt: "Responde cuando estés listo para iniciar la evaluación técnica",
    skills: [],
  },
  {
    id: "frontend",
    category: "Desarrollo Frontend",
    systemMessage:
      "Perfecto, comencemos hablando sobre desarrollo frontend. Me gustaría conocer tu experiencia con interfaces de usuario. ¿Con qué tecnologías frontend has trabajado? ¿React, Vue, Angular, o tal vez vanilla JavaScript? Cuéntame sobre algún proyecto frontend que hayas desarrollado y qué desafíos técnicos enfrentaste.",
    userPrompt: "Habla sobre tu experiencia en desarrollo frontend y las tecnologías que manejas",
    skills: ["frontend"],
  },
  {
    id: "backend",
    category: "Desarrollo Backend",
    systemMessage:
      "Interesante tu experiencia frontend. Ahora hablemos del backend. ¿Qué lenguajes de programación del lado del servidor manejas? ¿Has desarrollado APIs REST? ¿Cómo manejas la arquitectura de tus aplicaciones backend? Me gustaría que me cuentes sobre tu experiencia con bases de datos y cómo estructuras tus servicios.",
    userPrompt: "Describe tu experiencia en desarrollo backend, APIs y arquitectura de servicios",
    skills: ["backend", "database"],
  },
  {
    id: "database",
    category: "Bases de Datos",
    systemMessage:
      "Muy bien, profundicemos en bases de datos. ¿Prefieres trabajar con bases de datos relacionales como MySQL o PostgreSQL, o has trabajado con NoSQL como MongoDB? ¿Cómo diseñas los esquemas de datos? ¿Has optimizado consultas complejas? Cuéntame sobre tu experiencia gestionando datos.",
    userPrompt: "Comparte tu experiencia con bases de datos, diseño de esquemas y optimización",
    skills: ["database"],
  },
  {
    id: "mobile_design",
    category: "Mobile y Diseño",
    systemMessage:
      "Ahora me gustaría conocer sobre desarrollo móvil y diseño. ¿Has desarrollado aplicaciones móviles? ¿Nativo, React Native, Flutter, o aplicaciones híbridas? Y en cuanto a diseño, ¿qué tan cómodo te sientes con UX/UI? ¿Trabajas con herramientas de diseño como Figma?",
    userPrompt: "Habla sobre tu experiencia en desarrollo móvil y habilidades de diseño",
    skills: ["mobile", "design"],
  },
  {
    id: "security_devops",
    category: "Seguridad y DevOps",
    systemMessage:
      "Excelente. Para finalizar, hablemos de seguridad y DevOps. ¿Cómo implementas seguridad en tus aplicaciones? ¿Manejas autenticación, encriptación, prevención de vulnerabilidades? ¿Has trabajado con Docker, CI/CD, despliegues en la nube? ¿Qué herramientas de DevOps conoces?",
    userPrompt: "Describe tu experiencia con seguridad, DevOps y despliegue de aplicaciones",
    skills: ["security"],
  },
  {
    id: "problem_solving",
    category: "Resolución de Problemas Técnicos",
    systemMessage:
      "Para cerrar, me gustaría conocer sobre tu enfoque para resolver problemas técnicos. ¿Puedes contarme sobre algún bug complejo que hayas resuelto? ¿Cómo debuggeas código? ¿Qué estrategias usas cuando te enfrentas a tecnologías nuevas que no conoces? ¿Cómo te mantienes actualizado en el mundo tech?",
    userPrompt: "Comparte tu metodología para resolver problemas técnicos y aprender nuevas tecnologías",
    skills: ["frontend", "backend", "database", "mobile", "design", "security"],
  },
  {
    id: "conclusion",
    category: "Conclusión",
    systemMessage:
      "Excelente, hemos terminado nuestra conversación técnica. Ha sido muy enriquecedor conocer sobre tu experiencia y competencias en desarrollo de software. Ahora voy a procesar toda la información técnica que me has compartido para generar tu perfil personalizado de habilidades. ¡Gracias por compartir tu conocimiento!",
    userPrompt: "Puedes agregar cualquier comentario final sobre tu experiencia técnica",
    skills: ["frontend", "backend", "database", "mobile", "design", "security"],
  },
]

// Enhanced Speech Recognition Hook
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
    }
    return () => clearAllTimers()
  }, [])

  const clearAllTimers = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
      initTimeoutRef.current = null
    }
  }

  const startListening = useCallback(() => {
    if (!isSupported || isListening || isInitializing) return

    try {
      setIsInitializing(true)
      setError(null)

      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "es-ES"
      recognition.maxAlternatives = 3

      let hasReceivedFinalResult = false

      recognition.onstart = () => {
        setIsListening(true)
        setIsInitializing(false)
        hasReceivedFinalResult = false
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current)
          initTimeoutRef.current = null
        }
      }

      recognition.onspeechend = () => {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
        silenceTimerRef.current = setTimeout(() => {
          if (recognition && isListening) {
            recognition.stop()
          }
        }, 3000)
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
            hasReceivedFinalResult = true
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript + " ")
          setInterimTranscript("")
        } else {
          setInterimTranscript(interimTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        if (hasReceivedFinalResult && (event.error === "no-speech" || event.error === "aborted")) {
          return
        }
        setIsListening(false)
        setIsInitializing(false)

        switch (event.error) {
          case "not-allowed":
            setError("Permisos de micrófono denegados. Por favor, permite el acceso al micrófono.")
            break
          case "network":
            setError("Error de conexión. Verifica tu conexión a internet.")
            break
          case "no-speech":
            if (!hasReceivedFinalResult) {
              setError("No se detectó voz. Intenta hablar más cerca del micrófono.")
            }
            break
          default:
            setError(`Error de reconocimiento de voz: ${event.error}`)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        setInterimTranscript("")
        setIsInitializing(false)
        clearAllTimers()
      }

      recognitionRef.current = recognition
      recognition.start()

      initTimeoutRef.current = setTimeout(() => {
        if (isInitializing) {
          recognition.stop()
          setError("No se pudo inicializar el reconocimiento de voz.")
          setIsInitializing(false)
        }
      }, 10000)
    } catch (error) {
      setError("Error al inicializar el reconocimiento de voz.")
      setIsInitializing(false)
    }
  }, [isSupported, isListening, isInitializing])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && (isListening || isInitializing)) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    clearAllTimers()
    setIsListening(false)
    setIsInitializing(false)
    setInterimTranscript("")
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

// Text-to-Speech Hook
const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const speak = (text: string) => {
    if (!isSupported) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Try to find a Spanish voice
    const spanishVoice = voices.find(
      (voice) => voice.lang.startsWith("es") || voice.name.toLowerCase().includes("spanish"),
    )

    if (spanishVoice) {
      utterance.voice = spanishVoice
    }

    utterance.lang = "es-ES"
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return { speak, stop, isSpeaking, isSupported }
}

// Drag and Drop Hook for Ranking Questions
const useDragAndDrop = (initialItems: string[]) => {
  const [items, setItems] = useState(initialItems)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (item: string) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetItem: string) => {
    if (!draggedItem) return

    const draggedIndex = items.indexOf(draggedItem)
    const targetIndex = items.indexOf(targetItem)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newItems = [...items]
    newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItem)

    setItems(newItems)
    setDraggedItem(null)
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    setItems(newItems)
  }

  return {
    items,
    setItems,
    handleDragStart,
    handleDragOver,
    handleDrop,
    moveItem,
    draggedItem,
  }
}

export default function TechnicalSkillsTestPage() {
  const { t, language } = useLanguage()
  const router = useRouter()

  // Mode selection
  const [inputMode, setInputMode] = useState<InputMode>("mixed")
  const [showModeSelection, setShowModeSelection] = useState(true)

  // Traditional mode states
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isCompleting, setIsCompleting] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [textAnswer, setTextAnswer] = useState("")
  const [sliderValue, setSliderValue] = useState([5])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState("")

  // Conversational mode states
  const [currentStep, setCurrentStep] = useState(0)
  const [conversationAnswers, setConversationAnswers] = useState<Record<string, string>>({})
  const [isConversationActive, setIsConversationActive] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showCountdown, setShowCountdown] = useState(false)

  // Speech recognition and synthesis
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: speechRecognitionSupported,
    error: speechError,
    isInitializing,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition()

  const { speak, stop: stopSpeaking, isSpeaking, isSupported: textToSpeechSupported } = useTextToSpeech()

  // Drag and drop for ranking questions
  const currentQuestionData = TECHNICAL_QUESTIONS[currentQuestion]
  const {
    items: rankingItems,
    setItems: setRankingItems,
    handleDragStart,
    handleDragOver,
    handleDrop,
    moveItem,
  } = useDragAndDrop(currentQuestionData?.items || [])

  // Auto-start conversation when step changes in voice-complete mode
  useEffect(() => {
    if (inputMode === "voice-complete" && isConversationActive && !isSpeaking && !isListening) {
      const currentStepData = TECHNICAL_CONVERSATION_FLOW[currentStep]
      if (currentStepData && currentStepData.systemMessage) {
        // Start countdown before speaking
        setShowCountdown(true)
        setCountdown(3)

        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              setShowCountdown(false)
              // Start speaking after countdown
              setTimeout(() => {
                speak(currentStepData.systemMessage)
              }, 500)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }
  }, [currentStep, inputMode, isConversationActive, isSpeaking, isListening, speak])

  // Auto-start listening after system finishes speaking
  useEffect(() => {
    if (inputMode === "voice-complete" && !isSpeaking && isConversationActive && speechRecognitionSupported) {
      const timer = setTimeout(() => {
        if (!isListening && !isInitializing) {
          startListening()
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [
    isSpeaking,
    isConversationActive,
    inputMode,
    speechRecognitionSupported,
    isListening,
    isInitializing,
    startListening,
  ])

  // Save conversation answer when transcript changes
  useEffect(() => {
    if (inputMode === "voice-complete" && transcript) {
      const currentStepData = TECHNICAL_CONVERSATION_FLOW[currentStep]
      if (currentStepData) {
        setConversationAnswers((prev) => ({
          ...prev,
          [currentStepData.id]: transcript.trim(),
        }))
      }
    }
  }, [transcript, currentStep, inputMode])

  // Update text answer from speech recognition in traditional mode
  useEffect(() => {
    if (
      inputMode === "mixed" &&
      transcript &&
      (currentQuestionData?.type === "open" || currentQuestionData?.type === "scenario")
    ) {
      setTextAnswer(transcript)
    }
  }, [transcript, inputMode, currentQuestionData?.type])

  // Reset form states when question changes
  useEffect(() => {
    setTextAnswer("")
    setSliderValue([currentQuestionData?.min || 5])
    setSelectedOptions([])
    setSelectedOption("")
    setShowHelp(false)
    clearTranscript()

    // Reset ranking items when question changes
    if (currentQuestionData?.items) {
      setRankingItems(currentQuestionData.items)
    }
  }, [currentQuestion, currentQuestionData, clearTranscript, setRankingItems])

  const handleStartTest = (mode: InputMode) => {
    setInputMode(mode)
    setShowModeSelection(false)

    if (mode === "voice-complete") {
      setIsConversationActive(true)
      setCurrentStep(0)
    }
  }

  const handleNextConversationStep = () => {
    if (currentStep < TECHNICAL_CONVERSATION_FLOW.length - 1) {
      setCurrentStep((prev) => prev + 1)
      clearTranscript()
      if (isListening) {
        stopListening()
      }
      if (isSpeaking) {
        stopSpeaking()
      }
    } else {
      handleCompleteConversation()
    }
  }

  const handlePreviousConversationStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      clearTranscript()
      if (isListening) {
        stopListening()
      }
      if (isSpeaking) {
        stopSpeaking()
      }
    }
  }

  const handleRestartCurrentStep = () => {
    clearTranscript()
    if (isListening) {
      stopListening()
    }
    if (isSpeaking) {
      stopSpeaking()
    }

    // Restart the current step
    const currentStepData = TECHNICAL_CONVERSATION_FLOW[currentStep]
    if (currentStepData) {
      setTimeout(() => {
        speak(currentStepData.systemMessage)
      }, 500)
    }
  }

  const handleCompleteConversation = async () => {
    setIsCompleting(true)

    if (isListening) {
      stopListening()
    }
    if (isSpeaking) {
      stopSpeaking()
    }

    // Process conversational answers
    const results = processConversationalAnswers(conversationAnswers)

    localStorage.setItem(
      "technicalSkillsResults",
      JSON.stringify({
        scores: results,
        answers: conversationAnswers,
        completedAt: new Date().toISOString(),
        type: "technical-skills",
        inputMode,
      }),
    )

    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/technical-skills-results")
  }

  // Traditional mode handlers
  const handleNextQuestion = () => {
    // Save current answer
    let answerValue: any = null

    switch (currentQuestionData.type) {
      case "open":
      case "scenario":
      case "code":
        answerValue = textAnswer || transcript
        break
      case "multiple":
      case "binary":
        answerValue = selectedOption
        break
      case "checkbox":
        answerValue = selectedOptions
        break
      case "slider":
      case "scale":
        answerValue = sliderValue[0]
        break
      case "ranking":
        answerValue = rankingItems
        break
      default:
        answerValue = textAnswer
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionData.id]: answerValue,
    }))

    if (currentQuestion < TECHNICAL_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleCompleteTraditionalTest()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)

      // Load previous answer
      const prevQuestion = TECHNICAL_QUESTIONS[currentQuestion - 1]
      const prevAnswer = answers[prevQuestion.id]

      if (prevAnswer !== undefined) {
        switch (prevQuestion.type) {
          case "open":
          case "scenario":
          case "code":
            setTextAnswer(prevAnswer || "")
            break
          case "multiple":
          case "binary":
            setSelectedOption(prevAnswer || "")
            break
          case "checkbox":
            setSelectedOptions(prevAnswer || [])
            break
          case "slider":
          case "scale":
            setSliderValue([prevAnswer || 5])
            break
          case "ranking":
            setRankingItems(prevAnswer || prevQuestion.items || [])
            break
        }
      }
    }
  }

  const handleCompleteTraditionalTest = async () => {
    setIsCompleting(true)

    // Process traditional answers
    const results = processTraditionalAnswers(answers)

    localStorage.setItem(
      "technicalSkillsResults",
      JSON.stringify({
        scores: results,
        answers,
        completedAt: new Date().toISOString(),
        type: "technical-skills",
        inputMode,
      }),
    )

    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/technical-skills-results")
  }

  // Process conversational answers into technical skill scores
  const processConversationalAnswers = (answers: Record<string, string>) => {
    const skillScores = {
      frontend: 0,
      backend: 0,
      database: 0,
      mobile: 0,
      design: 0,
      security: 0,
    }

    // Analyze each answer for technical skill indicators
    Object.entries(answers).forEach(([stepId, answer]) => {
      const step = TECHNICAL_CONVERSATION_FLOW.find((s) => s.id === stepId)
      if (!step || !answer) return

      const text = answer.toLowerCase()
      const words = text.split(/\s+/).filter((word) => word.length > 2)
      const wordCount = words.length

      // Base score from response length and technical detail
      const baseScore = Math.min(90, Math.max(30, (wordCount / 25) * 70 + 20))

      // Technical skill-specific keyword analysis
      step.skills.forEach((skill) => {
        const keywords = getTechnicalSkillKeywords(skill)
        const keywordMatches = keywords.filter((keyword) => text.includes(keyword)).length
        const keywordBonus = Math.min(20, keywordMatches * 4)

        skillScores[skill as keyof typeof skillScores] = Math.min(100, baseScore + keywordBonus)
      })
    })

    // Ensure all skills have at least a base score
    Object.keys(skillScores).forEach((skill) => {
      if (skillScores[skill as keyof typeof skillScores] === 0) {
        skillScores[skill as keyof typeof skillScores] = 50 // Default neutral score
      }
    })

    return skillScores
  }

  // Process traditional answers into technical skill scores
  const processTraditionalAnswers = (answers: Record<number, any>) => {
    const skillScores = {
      frontend: 0,
      backend: 0,
      database: 0,
      mobile: 0,
      design: 0,
      security: 0,
    }

    const categoryScores: Record<string, number[]> = {
      frontend: [],
      backend: [],
      database: [],
      mobile: [],
      design: [],
      security: [],
    }

    // Process each answer
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = TECHNICAL_QUESTIONS.find((q) => q.id === Number.parseInt(questionId))
      if (!question || answer === undefined || answer === null) return

      const category = question.category
      let score = 0

      switch (question.type) {
        case "scale":
        case "slider":
          score = (answer / (question.max || 10)) * 100
          break
        case "multiple":
          // Score based on quality of selected option (simplified)
          score = answer ? 75 : 0
          break
        case "binary":
          score = answer === "true" || answer === "yes" ? 80 : 40
          break
        case "checkbox":
          // Score based on number of relevant selections
          const selections = Array.isArray(answer) ? answer.length : 0
          const maxSelections = question.options?.length || 1
          score = Math.min(100, (selections / maxSelections) * 120)
          break
        case "ranking":
          // Score based on logical ordering (simplified)
          score = Array.isArray(answer) && answer.length > 0 ? 70 : 0
          break
        case "open":
        case "scenario":
        case "code":
          // Score based on answer length and technical keywords
          const text = (answer || "").toLowerCase()
          const words = text.split(/\s+/).filter((w: string) => w.length > 2)
          const wordCount = words.length

          const baseScore = Math.min(90, Math.max(20, (wordCount / 30) * 70 + 20))
          const keywords = getTechnicalSkillKeywords(category)
          const keywordMatches = keywords.filter((keyword) => text.includes(keyword)).length
          const keywordBonus = Math.min(25, keywordMatches * 5)

          score = Math.min(100, baseScore + keywordBonus)
          break
        default:
          score = 50
      }

      categoryScores[category].push(score)
    })

    // Calculate average scores for each category
    Object.keys(categoryScores).forEach((category) => {
      const scores = categoryScores[category]
      if (scores.length > 0) {
        skillScores[category as keyof typeof skillScores] = Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        )
      } else {
        skillScores[category as keyof typeof skillScores] = 50 // Default score
      }
    })

    return skillScores
  }

  const getTechnicalSkillKeywords = (skill: string): string[] => {
    const keywordMap: Record<string, string[]> = {
      frontend: [
        "react",
        "vue",
        "angular",
        "javascript",
        "typescript",
        "html",
        "css",
        "sass",
        "scss",
        "webpack",
        "vite",
        "babel",
        "npm",
        "yarn",
        "component",
        "jsx",
        "dom",
        "responsive",
        "bootstrap",
        "tailwind",
        "material",
        "ui",
        "ux",
        "interface",
        "browser",
        "chrome",
        "performance",
        "optimization",
        "bundle",
        "lazy loading",
        "code splitting",
      ],
      backend: [
        "node",
        "express",
        "nestjs",
        "python",
        "django",
        "flask",
        "java",
        "spring",
        "php",
        "laravel",
        "ruby",
        "rails",
        "go",
        "rust",
        "api",
        "rest",
        "graphql",
        "microservices",
        "server",
        "endpoint",
        "middleware",
        "authentication",
        "authorization",
        "jwt",
        "oauth",
        "scaling",
        "load balancing",
        "caching",
        "redis",
        "session",
      ],
      database: [
        "mysql",
        "postgresql",
        "mongodb",
        "redis",
        "cassandra",
        "elasticsearch",
        "sql",
        "nosql",
        "query",
        "schema",
        "migration",
        "orm",
        "sequelize",
        "prisma",
        "mongoose",
        "index",
        "optimization",
        "transaction",
        "acid",
        "join",
        "aggregate",
        "backup",
        "replication",
        "sharding",
        "normalization",
        "denormalization",
      ],
      mobile: [
        "react native",
        "flutter",
        "ionic",
        "cordova",
        "swift",
        "kotlin",
        "java",
        "dart",
        "android",
        "ios",
        "mobile",
        "app",
        "responsive",
        "touch",
        "gesture",
        "native",
        "hybrid",
        "cross-platform",
        "store",
        "deployment",
        "device",
        "sensor",
        "push notifications",
        "offline",
        "sync",
        "performance",
      ],
      design: [
        "figma",
        "sketch",
        "adobe",
        "photoshop",
        "illustrator",
        "ui",
        "ux",
        "design",
        "wireframe",
        "prototype",
        "mockup",
        "user",
        "experience",
        "interface",
        "usability",
        "accessibility",
        "color",
        "typography",
        "layout",
        "grid",
        "responsive",
        "mobile",
        "user research",
        "personas",
        "user journey",
        "information architecture",
      ],
      security: [
        "security",
        "authentication",
        "authorization",
        "encryption",
        "ssl",
        "https",
        "jwt",
        "oauth",
        "cors",
        "xss",
        "csrf",
        "sql injection",
        "vulnerability",
        "penetration",
        "firewall",
        "vpn",
        "certificate",
        "hash",
        "salt",
        "bcrypt",
        "audit",
        "compliance",
        "owasp",
        "security headers",
        "input validation",
        "sanitization",
      ],
    }

    return keywordMap[skill] || []
  }

  const isAnswerValid = () => {
    switch (currentQuestionData?.type) {
      case "open":
      case "scenario":
      case "code":
        return (textAnswer || transcript).trim().length > 10
      case "multiple":
      case "binary":
        return selectedOption.length > 0
      case "checkbox":
        return selectedOptions.length > 0
      case "slider":
      case "scale":
        return true // Always valid
      case "ranking":
        return rankingItems.length > 0
      default:
        return true
    }
  }

  // Mode Selection Screen
  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test de Habilidades Técnicas</h1>
            <p className="text-xl text-gray-600 mb-8">Elige tu método de evaluación técnica preferido</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Mixed Mode */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  Cuestionario Técnico
                </CardTitle>
                <CardDescription>Preguntas estructuradas sobre tecnologías específicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {TECHNICAL_QUESTIONS.length} preguntas técnicas especializadas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Análisis de código y optimizaciones
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Ranking de tecnologías por experiencia
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Sistema de ayuda técnica contextual
                  </div>
                </div>
                <Button onClick={() => handleStartTest("mixed")} className="w-full" variant="outline">
                  <Keyboard className="w-4 h-4 mr-2" />
                  Elegir Cuestionario
                </Button>
              </CardContent>
            </Card>

            {/* Voice Complete Mode */}
            <Card
              className={`cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300 ${
                !speechRecognitionSupported || !textToSpeechSupported ? "opacity-50" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-green-600" />
                  </div>
                  Entrevista Técnica
                </CardTitle>
                <CardDescription>Conversación técnica natural con el asistente especializado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Conversación técnica natural
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Discusión sobre proyectos reales
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Evaluación de problem-solving
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Experiencia similar a entrevista real
                  </div>
                </div>
                <Button
                  onClick={() => handleStartTest("voice-complete")}
                  className="w-full"
                  disabled={!speechRecognitionSupported || !textToSpeechSupported}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Elegir Entrevista
                </Button>
                {(!speechRecognitionSupported || !textToSpeechSupported) && (
                  <p className="text-xs text-amber-600 text-center">
                    Funciones de voz no disponibles en este navegador
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={() => router.back()}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Conversational Mode Interface
  if (inputMode === "voice-complete") {
    const currentStepData = TECHNICAL_CONVERSATION_FLOW[currentStep]
    const progress = ((currentStep + 1) / TECHNICAL_CONVERSATION_FLOW.length) * 100

    if (isCompleting) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
                  <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                </div>
                <Code className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Procesando tu entrevista técnica...</h3>
                <p className="text-muted-foreground">Analizando tus respuestas y generando tu perfil técnico</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Entrevista Técnica</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Volume2 className="w-3 h-3 mr-1" />
                Conversación Técnica
              </Badge>
            </div>
            <p className="text-gray-600">
              Paso {currentStep + 1} de {TECHNICAL_CONVERSATION_FLOW.length} • {currentStepData?.category}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso de la entrevista</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Countdown */}
          {showCountdown && countdown > 0 && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-8">
                <CardContent className="text-center">
                  <div className="text-6xl font-bold text-green-600 mb-4">{countdown}</div>
                  <p className="text-lg text-gray-600">El entrevistador técnico hablará en...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Conversation Card */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{currentStepData?.category}</CardTitle>
                  <CardDescription>Entrevista técnica especializada</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isSpeaking && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                      Entrevistador
                    </Badge>
                  )}
                  {isListening && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      <Mic className="w-3 h-3 mr-1 animate-pulse" />
                      Escuchando
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* System Message */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 mb-2">Entrevistador Técnico:</h4>
                    <p className="text-green-800 leading-relaxed">{currentStepData?.systemMessage}</p>
                  </div>
                </div>
              </div>

              {/* User Response Area */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-2">Tu respuesta técnica:</h4>
                    <div className="min-h-[100px] bg-white rounded-lg p-3 border">
                      {transcript && <p className="text-gray-900 mb-2">{transcript}</p>}
                      {interimTranscript && <p className="text-gray-600 italic">{interimTranscript}</p>}
                      {!transcript && !interimTranscript && !isListening && (
                        <p className="text-gray-500 italic">
                          {isSpeaking
                            ? "Escucha la pregunta técnica y luego responde..."
                            : "Tu respuesta técnica aparecerá aquí cuando hables..."}
                        </p>
                      )}
                      {isListening && !transcript && !interimTranscript && (
                        <p className="text-blue-600 italic flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          Escuchando... Comparte tu experiencia técnica
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Speech Error */}
              {speechError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{speechError}</AlertDescription>
                </Alert>
              )}

              {/* Controls */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestartCurrentStep}
                  disabled={isInitializing}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                  Repetir pregunta
                </Button>

                {isListening && (
                  <Button variant="destructive" size="sm" onClick={stopListening} className="flex items-center gap-2">
                    <MicOff className="w-4 h-4" />
                    Detener grabación
                  </Button>
                )}

                {isSpeaking && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopSpeaking}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Pause className="w-4 h-4" />
                    Pausar entrevistador
                  </Button>
                )}

                {transcript && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearTranscript}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpiar respuesta
                  </Button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePreviousConversationStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <Button onClick={handleNextConversationStep} className="flex items-center gap-2">
                  {currentStep === TECHNICAL_CONVERSATION_FLOW.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Finalizar Entrevista
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Technical Interview Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4" />
                Consejos para la entrevista técnica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold mb-2">Durante la entrevista:</h4>
                  <ul className="space-y-1">
                    <li>• Menciona tecnologías específicas que hayas usado</li>
                    <li>• Describe proyectos reales con detalles técnicos</li>
                    <li>• Explica tu proceso de resolución de problemas</li>
                    <li>• Comparte desafíos técnicos que hayas superado</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Aspectos técnicos:</h4>
                  <ul className="space-y-1">
                    <li>• Usa terminología técnica apropiada</li>
                    <li>• Explica arquitecturas y patrones de diseño</li>
                    <li>• Menciona herramientas y frameworks específicos</li>
                    <li>• Describe tu experiencia con diferentes paradigmas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Traditional Mode Interface
  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
                <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <Code className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Procesando tu evaluación técnica...</h3>
              <p className="text-muted-foreground">Analizando tus respuestas y generando tu perfil técnico</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / TECHNICAL_QUESTIONS.length) * 100
  const CategoryIcon = SKILL_CATEGORIES[currentQuestionData.category].icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Cuestionario Técnico</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Keyboard className="w-3 h-3 mr-1" />
              Evaluación Estructurada
            </Badge>
          </div>
          <p className="text-gray-600">
            Pregunta {currentQuestion + 1} de {TECHNICAL_QUESTIONS.length} •{" "}
            {SKILL_CATEGORIES[currentQuestionData.category].name}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso del cuestionario</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Question Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 ${SKILL_CATEGORIES[currentQuestionData.category].color} rounded-full flex items-center justify-center`}
              >
                <CategoryIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{SKILL_CATEGORIES[currentQuestionData.category].name}</CardTitle>
                <CardDescription>
                  Pregunta {currentQuestion + 1} de {TECHNICAL_QUESTIONS.length}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {currentQuestionData.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center gap-1"
                >
                  <HelpCircle className="w-4 h-4" />
                  Ayuda
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold leading-relaxed">{currentQuestionData.question}</h3>

              {currentQuestionData.instruction && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">{currentQuestionData.instruction}</p>
                </div>
              )}

              {/* Code Block for Code Questions */}
              {currentQuestionData.code && (
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">
                      {currentQuestionData.language}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Código para revisar
                    </Badge>
                  </div>
                  <pre className="text-green-400 text-sm leading-relaxed">
                    <code>{currentQuestionData.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Help Section */}
            {showHelp && currentQuestionData.explanation && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-900">Ayuda Contextual</h4>
                </div>

                <p className="text-amber-800">{currentQuestionData.explanation}</p>

                {currentQuestionData.examples && (
                  <div>
                    <h5 className="font-medium text-amber-900 mb-2">Ejemplos:</h5>
                    <ul className="text-amber-800 text-sm space-y-1">
                      {currentQuestionData.examples.map((example, index) => (
                        <li key={index}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentQuestionData.tips && (
                  <div>
                    <h5 className="font-medium text-amber-900 mb-2">Consejos:</h5>
                    <ul className="text-amber-800 text-sm space-y-1">
                      {currentQuestionData.tips.map((tip, index) => (
                        <li key={index}>💡 {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Answer Input Based on Question Type */}
            <div className="space-y-4">
              {/* Open Text Questions */}
              {(currentQuestionData.type === "open" ||
                currentQuestionData.type === "scenario" ||
                currentQuestionData.type === "code") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="answer" className="text-base font-medium">
                      Tu respuesta:
                    </Label>
                    {speechRecognitionSupported && (
                      <div className="flex items-center gap-2">
                        {isListening ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={stopListening}
                            className="flex items-center gap-2"
                          >
                            <Square className="w-4 h-4" />
                            Detener
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={startListening}
                            className="flex items-center gap-2 bg-transparent"
                          >
                            <Mic className="w-4 h-4" />
                            Dictar
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <Textarea
                    id="answer"
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Escribe tu respuesta técnica detallada aquí..."
                    className="min-h-[120px] resize-none"
                  />

                  {interimTranscript && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <p className="text-blue-800 text-sm italic">Dictando: {interimTranscript}</p>
                    </div>
                  )}

                  {speechError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-800">{speechError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Multiple Choice Questions */}
              {currentQuestionData.type === "multiple" && (
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  <div className="space-y-3">
                    {currentQuestionData.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {/* Binary Questions */}
              {currentQuestionData.type === "binary" && (
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 flex-1">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="cursor-pointer">
                        Sí
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 flex-1">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              )}

              {/* Checkbox Questions */}
              {currentQuestionData.type === "checkbox" && (
                <div className="space-y-3">
                  {currentQuestionData.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={`checkbox-${index}`}
                        checked={selectedOptions.includes(option)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOptions([...selectedOptions, option])
                          } else {
                            setSelectedOptions(selectedOptions.filter((item) => item !== option))
                          }
                        }}
                      />
                      <Label htmlFor={`checkbox-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Slider Questions */}
              {(currentQuestionData.type === "slider" || currentQuestionData.type === "scale") && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">Nivel de experiencia:</Label>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {sliderValue[0]}/{currentQuestionData.max || 10}
                    </Badge>
                  </div>

                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    min={currentQuestionData.min || 1}
                    max={currentQuestionData.max || 10}
                    step={currentQuestionData.step || 1}
                    className="w-full"
                  />

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Principiante ({currentQuestionData.min || 1})</span>
                    <span>Experto ({currentQuestionData.max || 10})</span>
                  </div>
                </div>
              )}

              {/* Ranking Questions */}
              {currentQuestionData.type === "ranking" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Arrastra para ordenar (mayor experiencia arriba):</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRankingItems([...rankingItems].reverse())}
                      className="text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Invertir
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {rankingItems.map((item, index) => (
                      <div
                        key={item}
                        draggable
                        onDragStart={() => handleDragStart(item)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(item)}
                        className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-move hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="flex-1">{item}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            className="w-8 h-8 p-0"
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveItem(index, Math.min(rankingItems.length - 1, index + 1))}
                            disabled={index === rankingItems.length - 1}
                            className="w-8 h-8 p-0"
                          >
                            ↓
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-2">
                {!isAnswerValid() && (
                  <span className="text-sm text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Respuesta requerida
                  </span>
                )}

                <Button onClick={handleNextQuestion} disabled={!isAnswerValid()} className="flex items-center gap-2">
                  {currentQuestion === TECHNICAL_QUESTIONS.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Finalizar Test
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4" />
              Navegación de preguntas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {TECHNICAL_QUESTIONS.map((_, index) => {
                const isAnswered = answers[TECHNICAL_QUESTIONS[index].id] !== undefined
                const isCurrent = index === currentQuestion

                return (
                  <Button
                    key={index}
                    variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-full ${isCurrent ? "ring-2 ring-blue-500" : ""}`}
                  >
                    {index + 1}
                    {isAnswered && !isCurrent && <CheckCircle className="w-3 h-3 ml-1" />}
                  </Button>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <span>Respondida</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-gray-300 rounded"></div>
                <span>Pendiente</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
