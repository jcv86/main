import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with service role for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export interface CoachingMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  session_id?: string
}

export interface ConversationHistory {
  messages: CoachingMessage[]
  sessionId: string
}

export interface SearchResult {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  session_id: string
  snippet: string
  relevanceScore: number
}

export interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  query: string
}

export interface SearchSuggestion {
  text: string
  type: "keyword" | "topic" | "recent" | "popular"
  frequency: number
  category?: string
}

export interface SuggestionResponse {
  suggestions: SearchSuggestion[]
  categories: string[]
}

// Generate a proper UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Extract keywords and topics from conversation content
export function extractKeywords(content: string): string[] {
  // Remove common Spanish stop words and short words
  const stopWords = new Set([
    "el",
    "la",
    "de",
    "que",
    "y",
    "a",
    "en",
    "un",
    "es",
    "se",
    "no",
    "te",
    "lo",
    "le",
    "da",
    "su",
    "por",
    "son",
    "con",
    "para",
    "al",
    "del",
    "los",
    "las",
    "una",
    "pero",
    "sus",
    "le",
    "ya",
    "o",
    "fue",
    "este",
    "ha",
    "si",
    "porque",
    "esta",
    "son",
    "entre",
    "cuando",
    "muy",
    "sin",
    "sobre",
    "también",
    "me",
    "hasta",
    "hay",
    "donde",
    "quien",
    "desde",
    "todo",
    "nos",
    "durante",
    "todos",
    "uno",
    "les",
    "ni",
    "contra",
    "otros",
    "ese",
    "eso",
    "ante",
    "ellos",
    "e",
    "esto",
    "mí",
    "antes",
    "algunos",
    "qué",
    "unos",
    "yo",
    "otro",
    "otras",
    "otra",
    "él",
    "tanto",
    "esa",
    "estos",
    "mucho",
    "quienes",
    "nada",
    "muchos",
    "cual",
    "poco",
    "ella",
    "estar",
    "estas",
    "algunas",
    "algo",
    "nosotros",
    "mi",
    "mis",
    "tú",
    "te",
    "ti",
    "tu",
    "tus",
    "ellas",
    "nosotras",
    "vosotros",
    "vosotras",
    "os",
    "mío",
    "mía",
    "míos",
    "mías",
    "tuyo",
    "tuya",
    "tuyos",
    "tuyas",
    "suyo",
    "suya",
    "suyos",
    "suyas",
    "nuestro",
    "nuestra",
    "nuestros",
    "nuestras",
    "vuestro",
    "vuestra",
    "vuestros",
    "vuestras",
    "esos",
    "esas",
    "estoy",
    "está",
    "estamos",
    "estáis",
    "están",
    "esté",
    "estés",
    "estemos",
    "estéis",
    "estén",
    "estaré",
    "estarás",
    "estará",
    "estaremos",
    "estaréis",
    "estarán",
    "estaría",
    "estarías",
    "estaríamos",
    "estaríais",
    "estarían",
    "estaba",
    "estabas",
    "estábamos",
    "estabais",
    "estaban",
    "estuve",
    "estuviste",
    "estuvo",
    "estuvimos",
    "estuvisteis",
    "estuvieron",
  ])

  // Clean and tokenize content
  const words = content
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, " ") // Keep Spanish characters
    .split(/\s+/)
    .filter(
      (word) => word.length >= 3 && !stopWords.has(word) && !/^\d+$/.test(word), // Remove pure numbers
    )

  // Count word frequency
  const wordCount = new Map<string, number>()
  words.forEach((word) => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1)
  })

  // Return words sorted by frequency, minimum 2 occurrences
  return Array.from(wordCount.entries())
    .filter(([_, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20) // Top 20 keywords
    .map(([word]) => word)
}

// Extract career-related topics and categories
export function extractTopics(content: string): { topic: string; category: string }[] {
  const topicPatterns = [
    // Career Development
    {
      patterns: ["carrera", "desarrollo profesional", "crecimiento", "promoción", "ascenso"],
      category: "Desarrollo de Carrera",
    },
    { patterns: ["habilidades", "competencias", "skills", "capacidades", "destrezas"], category: "Habilidades" },
    { patterns: ["trabajo", "empleo", "puesto", "posición", "vacante", "oportunidad"], category: "Búsqueda de Empleo" },
    { patterns: ["entrevista", "entrevistas", "proceso de selección", "reclutamiento"], category: "Entrevistas" },
    { patterns: ["cv", "currículum", "curriculum", "hoja de vida", "perfil profesional"], category: "CV y Perfil" },
    { patterns: ["salario", "sueldo", "remuneración", "compensación", "beneficios"], category: "Compensación" },
    { patterns: ["networking", "contactos", "red profesional", "conexiones"], category: "Networking" },
    { patterns: ["liderazgo", "gestión", "management", "equipo", "liderar"], category: "Liderazgo" },
    { patterns: ["tecnología", "tech", "programación", "desarrollo", "software"], category: "Tecnología" },
    { patterns: ["startup", "emprendimiento", "innovación", "empresa"], category: "Emprendimiento" },
    { patterns: ["capacitación", "formación", "curso", "certificación", "aprendizaje"], category: "Formación" },
    { patterns: ["chile", "chileno", "santiago", "mercado laboral"], category: "Mercado Chileno" },
  ]

  const topics: { topic: string; category: string }[] = []
  const contentLower = content.toLowerCase()

  topicPatterns.forEach(({ patterns, category }) => {
    patterns.forEach((pattern) => {
      if (contentLower.includes(pattern)) {
        topics.push({ topic: pattern, category })
      }
    })
  })

  return topics
}

export async function getSearchSuggestions(userId: string, query = "", limit = 10): Promise<SuggestionResponse> {
  if (!userId || !isValidUUID(userId)) {
    return { suggestions: [], categories: [] }
  }

  try {
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return getDefaultSuggestions(query)
    }

    const suggestions: SearchSuggestion[] = []
    const categories = new Set<string>()

    // Get recent conversations to extract keywords and topics
    const { data: recentMessages, error } = await supabaseAdmin
      .from("coaching_conversations")
      .select("content, role, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100) // Analyze last 100 messages

    if (error) {
      console.error("Error fetching messages for suggestions:", error)
      return getDefaultSuggestions(query)
    }

    if (recentMessages && recentMessages.length > 0) {
      // Combine all content for analysis
      const allContent = recentMessages.map((msg) => msg.content).join(" ")

      // Extract keywords
      const keywords = extractKeywords(allContent)
      keywords.forEach((keyword) => {
        if (!query || keyword.toLowerCase().includes(query.toLowerCase())) {
          suggestions.push({
            text: keyword,
            type: "keyword",
            frequency: 1,
          })
        }
      })

      // Extract topics
      const topics = extractTopics(allContent)
      const topicCounts = new Map<string, number>()

      topics.forEach(({ topic, category }) => {
        categories.add(category)
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1)

        if (!query || topic.toLowerCase().includes(query.toLowerCase())) {
          const existingIndex = suggestions.findIndex((s) => s.text === topic)
          if (existingIndex >= 0) {
            suggestions[existingIndex].frequency += 1
          } else {
            suggestions.push({
              text: topic,
              type: "topic",
              frequency: topicCounts.get(topic) || 1,
              category,
            })
          }
        }
      })
    }

    // Add popular career-related suggestions if query is short or empty
    if (query.length < 3) {
      const popularSuggestions = getPopularCareerSuggestions()
      popularSuggestions.forEach((suggestion) => {
        if (!suggestions.some((s) => s.text === suggestion.text)) {
          suggestions.push(suggestion)
          if (suggestion.category) {
            categories.add(suggestion.category)
          }
        }
      })
    }

    // Sort by frequency and relevance
    suggestions.sort((a, b) => {
      // Prioritize exact matches
      if (query) {
        const aExact = a.text.toLowerCase() === query.toLowerCase()
        const bExact = b.text.toLowerCase() === query.toLowerCase()
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1

        // Then by starts with
        const aStarts = a.text.toLowerCase().startsWith(query.toLowerCase())
        const bStarts = b.text.toLowerCase().startsWith(query.toLowerCase())
        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1
      }

      // Then by frequency
      return b.frequency - a.frequency
    })

    return {
      suggestions: suggestions.slice(0, limit),
      categories: Array.from(categories).sort(),
    }
  } catch (error) {
    console.error("Error getting search suggestions:", error)
    return getDefaultSuggestions(query)
  }
}

function getDefaultSuggestions(query = ""): SuggestionResponse {
  const defaultSuggestions: SearchSuggestion[] = [
    { text: "desarrollo profesional", type: "popular", frequency: 10, category: "Desarrollo de Carrera" },
    { text: "búsqueda de empleo", type: "popular", frequency: 9, category: "Búsqueda de Empleo" },
    { text: "habilidades técnicas", type: "popular", frequency: 8, category: "Habilidades" },
    { text: "entrevista de trabajo", type: "popular", frequency: 7, category: "Entrevistas" },
    { text: "cv curriculum", type: "popular", frequency: 6, category: "CV y Perfil" },
    { text: "salario negociación", type: "popular", frequency: 5, category: "Compensación" },
    { text: "networking profesional", type: "popular", frequency: 4, category: "Networking" },
    { text: "liderazgo equipos", type: "popular", frequency: 3, category: "Liderazgo" },
    { text: "tecnología programación", type: "popular", frequency: 2, category: "Tecnología" },
    { text: "mercado laboral chile", type: "popular", frequency: 1, category: "Mercado Chileno" },
  ]

  const filtered = query
    ? defaultSuggestions.filter((s) => s.text.toLowerCase().includes(query.toLowerCase()))
    : defaultSuggestions

  return {
    suggestions: filtered,
    categories: [
      "Desarrollo de Carrera",
      "Búsqueda de Empleo",
      "Habilidades",
      "Entrevistas",
      "CV y Perfil",
      "Compensación",
      "Networking",
      "Liderazgo",
      "Tecnología",
      "Mercado Chileno",
    ],
  }
}

function getPopularCareerSuggestions(): SearchSuggestion[] {
  return [
    { text: "cambio de carrera", type: "popular", frequency: 8, category: "Desarrollo de Carrera" },
    { text: "trabajo remoto", type: "popular", frequency: 7, category: "Búsqueda de Empleo" },
    { text: "soft skills", type: "popular", frequency: 6, category: "Habilidades" },
    { text: "preguntas entrevista", type: "popular", frequency: 5, category: "Entrevistas" },
    { text: "linkedin perfil", type: "popular", frequency: 4, category: "CV y Perfil" },
    { text: "aumento sueldo", type: "popular", frequency: 3, category: "Compensación" },
    { text: "eventos networking", type: "popular", frequency: 2, category: "Networking" },
    { text: "gestión tiempo", type: "popular", frequency: 1, category: "Liderazgo" },
  ]
}

export async function searchConversations(
  userId: string,
  query: string,
  limit = 20,
  sessionId?: string,
): Promise<SearchResponse> {
  if (!userId || !isValidUUID(userId) || !query.trim()) {
    return {
      results: [],
      totalCount: 0,
      query: query.trim(),
    }
  }

  try {
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("Supabase credentials not available for search")
      return {
        results: [],
        totalCount: 0,
        query: query.trim(),
      }
    }

    // Build the query
    let searchQuery = supabaseAdmin
      .from("coaching_conversations")
      .select("*")
      .eq("user_id", userId)
      .ilike("content", `%${query.trim()}%`)
      .order("created_at", { ascending: false })
      .limit(limit)

    // Filter by session if provided and it's a valid UUID
    if (sessionId && isValidUUID(sessionId)) {
      searchQuery = searchQuery.eq("session_id", sessionId)
    }

    const { data, error } = await searchQuery

    if (error) {
      console.error("Error searching conversations:", error)
      return {
        results: [],
        totalCount: 0,
        query: query.trim(),
      }
    }

    // Process results and create snippets
    const results: SearchResult[] = data.map((msg) => {
      const content = msg.content
      const queryLower = query.toLowerCase()
      const contentLower = content.toLowerCase()

      // Find the position of the search term
      const matchIndex = contentLower.indexOf(queryLower)

      // Create a snippet around the match
      let snippet = content
      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - 50)
        const end = Math.min(content.length, matchIndex + query.length + 50)
        snippet = content.substring(start, end)

        if (start > 0) snippet = "..." + snippet
        if (end < content.length) snippet = snippet + "..."

        // Highlight the search term
        const regex = new RegExp(`(${query})`, "gi")
        snippet = snippet.replace(regex, "**$1**")
      }

      // Calculate relevance score (simple implementation)
      const relevanceScore = calculateRelevanceScore(content, query)

      return {
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        session_id: msg.session_id,
        snippet,
        relevanceScore,
      }
    })

    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore)

    return {
      results,
      totalCount: results.length,
      query: query.trim(),
    }
  } catch (error) {
    console.error("Error searching conversations:", error)
    return {
      results: [],
      totalCount: 0,
      query: query.trim(),
    }
  }
}

function calculateRelevanceScore(content: string, query: string): number {
  const contentLower = content.toLowerCase()
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/)

  let score = 0

  // Exact phrase match gets highest score
  if (contentLower.includes(queryLower)) {
    score += 100
  }

  // Individual word matches
  queryWords.forEach((word) => {
    if (word.length > 2) {
      // Ignore very short words
      const wordCount = (contentLower.match(new RegExp(word, "g")) || []).length
      score += wordCount * 10
    }
  })

  // Bonus for matches at the beginning of content
  if (contentLower.startsWith(queryLower)) {
    score += 50
  }

  // Penalty for very long content (less relevant)
  if (content.length > 500) {
    score *= 0.8
  }

  return score
}

export async function getConversationHistory(userId?: string, sessionId?: string): Promise<ConversationHistory> {
  // If no userId provided or invalid format, return demo conversation
  if (!userId || !isValidUUID(userId)) {
    console.warn("Invalid or missing userId, returning demo conversation")
    return getDemoConversation()
  }

  try {
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("Supabase credentials not available, using demo data")
      return getDemoConversation()
    }

    let finalSessionId = sessionId

    // If sessionId provided, validate it's a UUID
    if (finalSessionId && !isValidUUID(finalSessionId)) {
      console.warn("Invalid sessionId format, creating new session")
      finalSessionId = undefined
    }

    // If no sessionId provided, get the most recent session for this user
    if (!finalSessionId) {
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from("coaching_conversations")
        .select("session_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)

      if (sessionError) {
        console.error("Error fetching session:", sessionError)
        return getDemoConversation()
      }

      if (sessionData && sessionData.length > 0) {
        finalSessionId = sessionData[0].session_id
      } else {
        // Create new session ID if none exists
        finalSessionId = generateUUID()
      }
    }

    // Fetch conversation history for the session
    const { data, error } = await supabaseAdmin
      .from("coaching_conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("session_id", finalSessionId)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Error fetching conversation history:", error)
      return getDemoConversation()
    }

    if (!data || data.length === 0) {
      // Return initial greeting for new users and save it
      const welcomeMessage = {
        id: "1",
        role: "assistant" as const,
        content:
          "¡Hola! Soy tu AI Career Coach personalizado para el mercado laboral chileno. Estoy aquí para ayudarte con tu desarrollo profesional, búsqueda de empleo, y crecimiento de carrera. ¿En qué puedo asistirte hoy?",
        timestamp: new Date(),
        session_id: finalSessionId,
      }

      // Save welcome message to database
      await saveMessage(userId, "assistant", welcomeMessage.content, finalSessionId)

      return {
        sessionId: finalSessionId,
        messages: [welcomeMessage],
      }
    }

    const messages: CoachingMessage[] = data.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      session_id: msg.session_id,
    }))

    return {
      sessionId: finalSessionId,
      messages,
    }
  } catch (error) {
    console.error("Error getting conversation history:", error)
    return getDemoConversation()
  }
}

function getDemoConversation(): ConversationHistory {
  return {
    sessionId: generateUUID(),
    messages: [
      {
        id: "1",
        role: "assistant",
        content:
          "¡Hola! Soy tu AI Career Coach. Estoy aquí para ayudarte con tu desarrollo profesional en el mercado chileno. ¿En qué puedo asistirte hoy?",
        timestamp: new Date(Date.now() - 60000),
      },
    ],
  }
}

export async function saveMessage(
  userId: string,
  role: "user" | "assistant",
  content: string,
  sessionId?: string,
): Promise<void> {
  // Validate UUID format
  if (!isValidUUID(userId)) {
    console.warn("Invalid UUID format, skipping save:", userId)
    return
  }

  try {
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("Supabase credentials not available, skipping message save")
      return
    }

    let finalSessionId = sessionId || generateUUID()

    // Validate session ID is a UUID
    if (!isValidUUID(finalSessionId)) {
      finalSessionId = generateUUID()
    }

    const { error } = await supabaseAdmin.from("coaching_conversations").insert({
      user_id: userId,
      session_id: finalSessionId,
      role,
      content,
      metadata: {
        timestamp: new Date().toISOString(),
        user_agent: "server",
      },
    })

    if (error) {
      console.error("Error saving message:", error)
    }
  } catch (error) {
    console.error("Error saving message:", error)
  }
}

export async function generateCoachResponse(
  userMessage: string,
  conversationHistory: CoachingMessage[],
): Promise<string> {
  try {
    // Since we removed AI SDK, return demo responses
    return getDemoResponse(userMessage)
  } catch (error) {
    console.error("Error generating coach response:", error)
    return getDemoResponse(userMessage)
  }
}

export async function generateCareerAdvice(userMessage: string, userId?: string): Promise<string> {
  try {
    // Since we removed AI SDK, return demo responses
    return getDemoResponse(userMessage)
  } catch (error) {
    console.error("Error generating career advice:", error)
    return getDemoResponse(userMessage)
  }
}

export async function startNewSession(userId: string): Promise<string> {
  const newSessionId = generateUUID()

  // Save a session start marker
  await saveMessage(userId, "assistant", "Nueva sesión iniciada", newSessionId)

  return newSessionId
}

export async function getUserSessions(
  userId: string,
): Promise<{ sessionId: string; lastMessage: Date; messageCount: number }[]> {
  if (!isValidUUID(userId)) {
    return []
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("coaching_conversations")
      .select("session_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error || !data) {
      return []
    }

    // Group by session and get stats
    const sessionStats = data.reduce(
      (acc, msg) => {
        const sessionId = msg.session_id
        if (!acc[sessionId]) {
          acc[sessionId] = {
            sessionId,
            lastMessage: new Date(msg.created_at),
            messageCount: 0,
          }
        }
        acc[sessionId].messageCount++
        const msgDate = new Date(msg.created_at)
        if (msgDate > acc[sessionId].lastMessage) {
          acc[sessionId].lastMessage = msgDate
        }
        return acc
      },
      {} as Record<string, { sessionId: string; lastMessage: Date; messageCount: number }>,
    )

    return Object.values(sessionStats).sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime())
  } catch (error) {
    console.error("Error getting user sessions:", error)
    return []
  }
}

function getDemoResponse(userMessage: string): string {
  const demoResponses = [
    "Entiendo tu consulta. En el mercado chileno, es importante enfocarse en desarrollar habilidades técnicas demandadas como JavaScript, Python o AWS. Te recomiendo explorar oportunidades en empresas como NotCo, Fintual o Cornershop que están creciendo rápidamente.",
    "Excelente pregunta. Para el mercado laboral chileno, sugiero que actualices tu CV destacando proyectos relevantes y considera obtener certificaciones reconocidas. Las empresas tech en Santiago valoran mucho la experiencia práctica.",
    "Te puedo ayudar con eso. En Chile, el networking es clave. Te recomiendo asistir a eventos como 9punto5, conectar con profesionales en LinkedIn, y considerar trabajar en startups chilenas para ganar experiencia rápidamente.",
    "Buena consulta. Los salarios en tech en Chile van desde $2.000.000 para junior hasta $5.000.000+ para senior. Te sugiero prepararte bien para entrevistas técnicas y destacar tu capacidad de adaptación al mercado local.",
    "Para el mercado chileno, te recomiendo enfocarte en empresas como Buk, Betterfly o Chiper que están en expansión. También considera portales como GetOnBoard que se especializan en tech jobs.",
  ]

  return demoResponses[Math.floor(Math.random() * demoResponses.length)]
}
