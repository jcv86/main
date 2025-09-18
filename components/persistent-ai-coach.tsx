"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageCircle,
  Send,
  Minimize2,
  Brain,
  Target,
  TrendingUp,
  User,
  Lightbulb,
  Star,
  Clock,
  BarChart3,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  category?: string
  suggestedActions?: string[]
  isExpanded?: boolean
}

interface UserProfile {
  email: string
  name: string
  preferences: {
    communicationStyle: string
    learningStyle: string
    careerGoals: string[]
    interests: string[]
    skillLevel: string
    timeAvailability: string
  }
  conversation_history: {
    totalMessages: number
    topics: string[]
    lastActive: string
    commonQuestions: string[]
    progressTracking: Record<string, any>
  }
  personality_insights: {
    strengths: string[]
    growthAreas: string[]
    workStyle: string
    motivators: string[]
    stressors: string[]
    communicationPreferences: string[]
  }
  career_profile: {
    experience: string
    aspirations: string[]
    skillGaps: string[]
    networkingStyle: string
  }
  learning_profile: {
    completedBooks: string[]
    currentReading: string[]
    preferredFormats: string[]
    learningPace: string
    retentionStyle: string
  }
  analytics?: {
    totalInteractions: number
    lastUpdated: string
  }
}

interface AIInsight {
  type: "strength" | "opportunity" | "recommendation" | "milestone"
  title: string
  description: string
  actionable: boolean
  priority: "high" | "medium" | "low"
}

export default function PersistentAICoach() {
  const [isMinimized, setIsMinimized] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Initialize component and load user data
  useEffect(() => {
    initializeCoach()
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeCoach = async () => {
    try {
      setIsLoading(true)

      // Load user profile
      const profileResponse = await fetch("/api/user-profile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (profileResponse.ok) {
        const profile = await profileResponse.json()
        setUserProfile(profile)

        // Generate initial insights
        await generateInsights(profile)

        // Load recent conversation history
        await loadConversationHistory()
      }
    } catch (error) {
      console.error("Error initializing AI Coach:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadConversationHistory = async () => {
    try {
      const response = await fetch("/api/ai-coach-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "load_history",
          limit: 10,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.messages) {
          setMessages(
            data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
              isExpanded: false,
            })),
          )
        }
      }
    } catch (error) {
      console.error("Error loading conversation history:", error)
    }
  }

  const generateInsights = async (profile: UserProfile) => {
    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile: profile,
          analysisType: "comprehensive",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights || [])
      }
    } catch (error) {
      console.error("Error generating insights:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
      isExpanded: false,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/ai-coach-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage.trim(),
          userProfile,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
        }),
      })

      if (response.ok) {
        const data = await response.json()

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.response,
          timestamp: new Date(),
          category: data.category,
          suggestedActions: data.suggestedActions,
          isExpanded: false,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Update user profile if provided
        if (data.updatedProfile) {
          setUserProfile(data.updatedProfile)
        }

        // Update insights if provided
        if (data.newInsights) {
          setInsights((prev) => [...prev, ...data.newInsights])
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.",
        timestamp: new Date(),
        isExpanded: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestedAction = async (action: string) => {
    setInputMessage(action)
    await handleSendMessage()
  }

  const toggleMessageExpansion = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isExpanded: !msg.isExpanded } : msg)))
  }

  const truncateContent = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const renderMessage = (message: Message) => {
    const isLongMessage = message.content.length > 200
    const shouldTruncate = isLongMessage && !message.isExpanded

    return (
      <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
        {message.type === "assistant" && (
          <Avatar className="w-8 h-8 bg-blue-100">
            <AvatarFallback>
              <Brain className="w-4 h-4 text-blue-600" />
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
          <div
            className={`p-3 rounded-lg ${
              message.type === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 text-gray-900"
            }`}
          >
            <div className="text-sm">{shouldTruncate ? truncateContent(message.content) : message.content}</div>

            {isLongMessage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleMessageExpansion(message.id)}
                className={`mt-2 p-1 h-auto ${
                  message.type === "user" ? "text-blue-100 hover:text-white" : "text-gray-600"
                }`}
              >
                {message.isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Mostrar más
                  </>
                )}
              </Button>
            )}
          </div>

          {message.category && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {message.category}
            </Badge>
          )}

          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {message.suggestedActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedAction(action)}
                  className="text-xs h-7"
                >
                  {action}
                </Button>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString()}</div>
        </div>

        {message.type === "user" && (
          <Avatar className="w-8 h-8 bg-green-100">
            <AvatarFallback>
              <User className="w-4 h-4 text-green-600" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }

  const renderInsights = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold">Insights Personalizados</h3>
      </div>

      {insights.map((insight, index) => (
        <Card key={index} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {insight.type === "strength" && <Star className="w-4 h-4 text-yellow-500" />}
                {insight.type === "opportunity" && <Target className="w-4 h-4 text-blue-500" />}
                {insight.type === "recommendation" && <Lightbulb className="w-4 h-4 text-green-500" />}
                {insight.type === "milestone" && <TrendingUp className="w-4 h-4 text-purple-500" />}
                <h4 className="font-medium text-sm">{insight.title}</h4>
              </div>
              <Badge
                variant={
                  insight.priority === "high" ? "destructive" : insight.priority === "medium" ? "default" : "secondary"
                }
              >
                {insight.priority}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
            {insight.actionable && (
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Tomar Acción
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      {userProfile && (
        <>
          <div className="text-center">
            <Avatar className="w-16 h-16 mx-auto mb-3 bg-blue-100">
              <AvatarFallback className="text-lg font-semibold text-blue-600">
                {userProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{userProfile.name}</h3>
            <p className="text-sm text-gray-600">{userProfile.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Nivel de Habilidad</span>
                </div>
                <Badge variant="secondary">{userProfile.preferences.skillLevel}</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Disponibilidad</span>
                </div>
                <Badge variant="secondary">{userProfile.preferences.timeAvailability}</Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Objetivos de Carrera
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {userProfile.preferences.careerGoals.map((goal, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {goal}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Fortalezas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {userProfile.personality_insights.strengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {strength}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {userProfile.analytics && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mensajes Totales:</span>
                  <span className="font-medium">{userProfile.conversation_history.totalMessages}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interacciones:</span>
                  <span className="font-medium">{userProfile.analytics.totalInteractions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Temas Explorados:</span>
                  <span className="font-medium">{userProfile.conversation_history.topics.length}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Brain className="w-8 h-8 text-blue-500 animate-pulse mx-auto mb-2" />
            <p className="text-sm text-gray-600">Inicializando AI Coach...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`fixed bottom-4 right-4 transition-all duration-300 ${
        isMinimized ? "w-16 h-16" : "w-96 h-[600px]"
      } shadow-lg border-2 border-blue-200`}
    >
      {isMinimized ? (
        <CardContent className="p-0 h-full flex items-center justify-center">
          <Button
            onClick={() => setIsMinimized(false)}
            className="w-full h-full rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </CardContent>
      ) : (
        <>
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-sm">AI Career Coach</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-8 w-8 p-0">
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="chat" className="text-xs">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-xs">
                  Insights
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-xs">
                  Perfil
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col m-0">
                <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">¡Hola! Soy tu AI Career Coach.</p>
                        <p className="text-xs mt-1">¿En qué puedo ayudarte hoy?</p>
                      </div>
                    ) : (
                      messages.map(renderMessage)
                    )}
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8 bg-blue-100">
                          <AvatarFallback>
                            <Brain className="w-4 h-4 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isTyping}
                      className="text-sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      size="sm"
                      className="px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="flex-1 m-0">
                <ScrollArea className="h-full p-4">{renderInsights()}</ScrollArea>
              </TabsContent>

              <TabsContent value="profile" className="flex-1 m-0">
                <ScrollArea className="h-full p-4">{renderProfile()}</ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </>
      )}
    </Card>
  )
}
