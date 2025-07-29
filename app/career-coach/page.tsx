"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  TrendingUp,
  BookOpen,
  Target,
  Briefcase,
  Star,
  Clock,
  Brain,
  Lightbulb,
} from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface MarketInsight {
  title: string
  value: string
  trend: string
  icon: React.ReactNode
}

export default function CareerCoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userId = "demo-user-id" // In real app, get from auth context

  const marketInsights: MarketInsight[] = [
    {
      title: "Salario Promedio Tech",
      value: "3.5M CLP",
      trend: "+18%",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: "Trabajos Remotos",
      value: "65%",
      trend: "+25%",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      title: "Skills Demandadas",
      value: "React, Python",
      trend: "+40%",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      title: "Tiempo Contratación",
      value: "3-4 semanas",
      trend: "-15%",
      icon: <Clock className="h-4 w-4" />,
    },
  ]

  const quickActions = [
    { label: "Evaluar Habilidades", href: "/skills-assessment", icon: <Target className="h-4 w-4" /> },
    { label: "Crear CV", href: "/cv-builder", icon: <User className="h-4 w-4" /> },
    { label: "Buscar Trabajo", href: "/job-search", icon: <Briefcase className="h-4 w-4" /> },
    { label: "Biblioteca", href: "/library", icon: <BookOpen className="h-4 w-4" /> },
  ]

  useEffect(() => {
    // Load conversation history
    loadConversationHistory()

    // Add welcome message if no messages
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "¡Hola! Soy tu Coach IA personal. Estoy aquí para ayudarte con tu desarrollo profesional. ¿En qué puedo asistirte hoy?",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversationHistory = async () => {
    try {
      const response = await fetch(`/api/career-coach?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.conversations && data.conversations.length > 0) {
          const formattedMessages = data.conversations.map((conv: any) => ({
            id: conv.id,
            content: conv.message,
            role: conv.role,
            timestamp: new Date(conv.created_at),
          }))
          setMessages(formattedMessages)
        }
      }
    } catch (error) {
      console.error("Error loading conversation history:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch("/api/career-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: userId,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Simulate typing delay
        setTimeout(() => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            role: "assistant",
            timestamp: new Date(),
          }

          setMessages((prev) => [...prev, assistantMessage])
          setIsTyping(false)
        }, 1500)
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsTyping(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-logo.png" alt="Coach IA" />
                  <AvatarFallback>
                    <Bot className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Coach IA DTC
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Experto
                    </Badge>
                  </CardTitle>
                  <CardDescription>Tu mentor personal de carrera profesional</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-2">
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
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu consulta aquí..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Insights del Mercado
              </CardTitle>
              <CardDescription>Datos actualizados del mercado laboral chileno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {insight.icon}
                    <div>
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-lg font-bold">{insight.value}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {insight.trend}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
              <CardDescription>Herramientas para potenciar tu carrera</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Button key={index} variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a href={action.href}>
                    {action.icon}
                    {action.label}
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Personalized Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Tips Personalizados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-800">Completa tu perfil</p>
                <p className="text-xs text-blue-600 mt-1">Un perfil completo aumenta tus oportunidades en un 40%</p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="text-sm font-medium text-green-800">Actualiza tu CV</p>
                <p className="text-xs text-green-600 mt-1">CVs actualizados reciben 3x más visualizaciones</p>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <p className="text-sm font-medium text-purple-800">Practica entrevistas</p>
                <p className="text-xs text-purple-600 mt-1">La práctica mejora tu confianza en un 60%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
