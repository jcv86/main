"use client"
import { useState, useEffect } from "react"
import { useCallback } from "react"

import { useRef } from "react"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Code,
  AlertCircle,
  Database,
  Globe,
  Smartphone,
  Server,
  Palette,
  Shield,
  CheckCircle,
  Target,
  Clock,
  FileSpreadsheet,
  Presentation,
  Download,
  Upload,
  Play,
  BookOpen,
  TrendingUp,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { TECHNICAL_TESTS, TECHNICAL_SKILLS } from "@/lib/technical-skills-types"

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
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")

  const [test, setTest] = useState<any>(null)
  const [skill, setSkill] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<"intro" | "test" | "results">("intro")
  const [timeLeft, setTimeLeft] = useState(0)
  const [submission, setSubmission] = useState<any>({
    type: "text",
    content: "",
    files: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [startTime, setStartTime] = useState<number>(0)

  useEffect(() => {
    if (testId) {
      const foundTest = TECHNICAL_TESTS.find((t) => t.id === testId)
      if (foundTest) {
        setTest(foundTest)
        const foundSkill = TECHNICAL_SKILLS.find((s) => s.id === foundTest.skillId)
        setSkill(foundSkill)
        setTimeLeft(foundTest.timeLimit * 60) // Convert to seconds
      }
    }
  }, [testId])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (currentStep === "test" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit() // Auto-submit when time runs out
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [currentStep, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTestIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="w-6 h-6" />
      case "excel":
        return <FileSpreadsheet className="w-6 h-6" />
      case "sql":
        return <Database className="w-6 h-6" />
      case "presentation":
        return <Presentation className="w-6 h-6" />
      default:
        return <Target className="w-6 h-6" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-orange-100 text-orange-800"
      case "expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStartTest = () => {
    setCurrentStep("test")
    setStartTime(Date.now())
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSubmission((prev) => ({
      ...prev,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file), // In real app, would upload to server
      })),
    }))
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)

      const response = await fetch("/api/technical-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: test.id,
          submission: {
            ...submission,
            timeSpent,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit test")
      }

      const data = await response.json()
      setResults(data.data.evaluation)
      setCurrentStep("results")

      toast({
        title: "Test Submitted",
        description: "Your test has been evaluated successfully!",
      })
    } catch (error) {
      console.error("Error submitting test:", error)
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!test || !skill) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Test no encontrado</h1>
          <Button onClick={() => router.push("/technical-skills")}>Volver a Habilidades Técnicas</Button>
        </div>
      </div>
    )
  }

  if (currentStep === "intro") {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
          <p className="text-xl text-muted-foreground">{skill.name}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                {getTestIcon(test.type)}
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {test.title}
                  <Badge className={getDifficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                </CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{test.timeLimit} minutos</div>
                <div className="text-sm text-muted-foreground">Tiempo límite</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{test.maxScore} puntos</div>
                <div className="text-sm text-muted-foreground">Puntuación máxima</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{test.difficulty}</div>
                <div className="text-sm text-muted-foreground">Nivel de dificultad</div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3>Instrucciones:</h3>
              <div className="whitespace-pre-line text-sm">{test.instructions}</div>
            </div>

            {test.files && test.files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Archivos necesarios:</h3>
                <div className="space-y-2">
                  {test.files.map((file: any) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">{file.description}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {test.hints && test.hints.length > 0 && (
              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Consejos:</strong>
                  <ul className="mt-2 space-y-1">
                    {test.hints.map((hint: string, index: number) => (
                      <li key={index} className="text-sm">
                        • {hint}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={handleStartTest} size="lg" className="px-8">
            <Play className="w-5 h-5 mr-2" />
            Comenzar Test
          </Button>
        </div>
      </div>
    )
  }

  if (currentStep === "test") {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        {/* Timer Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{test.title}</h1>
              <p className="text-muted-foreground">{skill.name}</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-mono font-bold ${timeLeft < 300 ? "text-red-600" : "text-primary"}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground">Tiempo restante</div>
            </div>
          </div>
          <Progress value={(timeLeft / (test.timeLimit * 60)) * 100} className="mt-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tu Solución</CardTitle>
            <CardDescription>Completa la prueba según las instrucciones proporcionadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="solution" className="w-full">
              <TabsList>
                <TabsTrigger value="solution">Solución</TabsTrigger>
                <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
                {test.files && <TabsTrigger value="files">Archivos</TabsTrigger>}
              </TabsList>

              <TabsContent value="solution" className="space-y-4">
                {test.type === "code" && (
                  <div>
                    <Label htmlFor="code">Escribe tu código aquí:</Label>
                    <Textarea
                      id="code"
                      placeholder="// Escribe tu código aquí..."
                      className="min-h-[300px] font-mono"
                      value={submission.content}
                      onChange={(e) => setSubmission((prev) => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                )}

                {test.type === "sql" && (
                  <div>
                    <Label htmlFor="sql">Escribe tus consultas SQL:</Label>
                    <Textarea
                      id="sql"
                      placeholder="-- Escribe tus consultas SQL aquí..."
                      className="min-h-[300px] font-mono"
                      value={submission.content}
                      onChange={(e) => setSubmission((prev) => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                )}

                {(test.type === "excel" || test.type === "presentation") && (
                  <div>
                    <Label htmlFor="file">Sube tu archivo completado:</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground mb-2">
                        Arrastra tu archivo aquí o haz clic para seleccionar
                      </div>
                      <Input
                        type="file"
                        accept={test.type === "excel" ? ".xlsx,.xls" : ".pptx,.ppt"}
                        onChange={handleFileUpload}
                        className="max-w-xs"
                      />
                    </div>
                    {submission.files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Archivos subidos:</h4>
                        {submission.files.map((file: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {test.type === "data_analysis" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="analysis">Tu análisis:</Label>
                      <Textarea
                        id="analysis"
                        placeholder="Escribe tu análisis de los datos aquí..."
                        className="min-h-[200px]"
                        value={submission.content}
                        onChange={(e) => setSubmission((prev) => ({ ...prev, content: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="file">Sube gráficos o archivos de soporte (opcional):</Label>
                      <Input type="file" multiple accept=".png,.jpg,.jpeg,.xlsx,.csv" onChange={handleFileUpload} />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="instructions">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-sm">{test.instructions}</div>
                </div>
              </TabsContent>

              {test.files && (
                <TabsContent value="files">
                  <div className="space-y-2">
                    {test.files.map((file: any) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-muted-foreground">{file.description}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!submission.content && submission.files.length === 0)}
            size="lg"
            className="px-8"
          >
            {isSubmitting ? "Enviando..." : "Enviar Test"}
          </Button>
        </div>
      </div>
    )
  }

  if (currentStep === "results" && results) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">¡Test Completado!</h1>
          <p className="text-xl text-muted-foreground">Resultados de {test.title}</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-6 h-6" />
              Puntuación Final
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600">
                  {results.feedback.overallScore}/{results.feedback.maxScore}
                </div>
                <div className="text-sm text-green-700">Puntuación Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 capitalize">{results.feedback.level}</div>
                <div className="text-sm text-blue-700">Nivel Alcanzado</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${results.feedback.passed ? "text-green-600" : "text-red-600"}`}>
                  {results.feedback.passed ? "APROBADO" : "NO APROBADO"}
                </div>
                <div className="text-sm text-gray-700">Estado</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Coaching Message */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Mensaje del Coach IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{results.feedback.aiCoachingMessage}</p>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Feedback Detallado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.feedback.detailedFeedback.map((item: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{item.criterion}</h4>
                    <Badge variant="outline">
                      {item.score}/{item.maxScore}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.feedback}</p>
                  {item.suggestions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Sugerencias:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {item.suggestions.map((suggestion: string, idx: number) => (
                          <li key={idx}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strengths and Improvements */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {results.feedback.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Fortalezas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.feedback.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {results.feedback.improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-700">Áreas de Mejora</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.feedback.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {results.feedback.nextSteps.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Recommended Resources */}
        {results.feedback.recommendedResources.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recursos Recomendados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {results.feedback.recommendedResources.map((resource: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>⏱️ {resource.estimatedTime}</span>
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={() => router.push("/career-coach")}>Hablar con el Coach</Button>
          <Button variant="outline" onClick={() => router.push("/technical-skills")}>
            Ver Más Tests
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Repetir Test
          </Button>
        </div>
      </div>
    )
  }

  return null
}
