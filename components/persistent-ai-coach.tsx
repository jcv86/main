"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Send, Bot, User, Lightbulb, TrendingUp, Target, MessageSquare, Sparkles, Brain, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "suggestion" | "insight" | "question"
}

interface Suggestion {
  id: string
  text: string
  category: "career" | "skills" | "development"
  priority: "high" | "medium" | "low"
}

interface Insight {
  id: string
  title: string
  description: string
  category: "personality" | "career" | "skills"
  confidence: number
  actionable: boolean
}

export function PersistentAICoach() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with welcome message and sample data
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "1",
      content:
        "Hello! I'm your AI Career Coach. I'm here to help you with career guidance, skill development, and professional growth. I can analyze your assessment results, provide personalized recommendations, and help you create action plans. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "question",
    }
    setMessages([welcomeMessage])

    // Sample suggestions based on user profile
    setSuggestions([
      {
        id: "1",
        text: "Consider developing your leadership skills through online courses or mentorship programs",
        category: "skills",
        priority: "high",
      },
      {
        id: "2",
        text: "Explore networking opportunities in your industry to expand your professional connections",
        category: "career",
        priority: "medium",
      },
      {
        id: "3",
        text: "Set up regular one-on-ones with your manager to discuss career progression",
        category: "development",
        priority: "high",
      },
      {
        id: "4",
        text: "Update your LinkedIn profile to reflect your recent achievements and skills",
        category: "career",
        priority: "medium",
      },
      {
        id: "5",
        text: "Consider pursuing a professional certification in your field",
        category: "development",
        priority: "low",
      },
    ])

    // Sample insights based on assessment results
    setInsights([
      {
        id: "1",
        title: "Strong Analytical Thinking",
        description:
          "Based on your assessment results, you demonstrate excellent analytical and problem-solving capabilities. This is a valuable asset in leadership roles and strategic positions.",
        category: "personality",
        confidence: 92,
        actionable: true,
      },
      {
        id: "2",
        title: "Leadership Potential",
        description:
          "Your communication style and decision-making approach suggest strong leadership potential. Consider seeking opportunities to lead projects or mentor junior colleagues.",
        category: "career",
        confidence: 87,
        actionable: true,
      },
      {
        id: "3",
        title: "Collaborative Work Style",
        description:
          "You show a preference for collaborative environments and team-based problem solving. This makes you well-suited for cross-functional roles and team leadership positions.",
        category: "skills",
        confidence: 89,
        actionable: true,
      },
      {
        id: "4",
        title: "Growth Mindset",
        description:
          "Your responses indicate a strong growth mindset and willingness to learn. This is crucial for career advancement and adapting to changing industry demands.",
        category: "personality",
        confidence: 94,
        actionable: false,
      },
    ])
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response with more realistic delay
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(inputMessage),
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      },
      1500 + Math.random() * 1000,
    ) // 1.5-2.5 second delay
  }

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()

    // Career-related responses
    if (lowerInput.includes("career") || lowerInput.includes("job") || lowerInput.includes("promotion")) {
      return "Great question about career development! Based on your profile, I'd recommend focusing on three key areas: 1) Building your leadership skills through stretch assignments, 2) Expanding your network within and outside your organization, and 3) Developing expertise in emerging technologies relevant to your field. Would you like me to elaborate on any of these areas?"
    }

    // Skills development responses
    if (lowerInput.includes("skill") || lowerInput.includes("learn") || lowerInput.includes("develop")) {
      return "Skill development is crucial for career growth! Your assessment results show strong analytical abilities, which is excellent. I'd suggest focusing on complementary skills like communication, project management, and strategic thinking. Consider online courses, workshops, or finding a mentor in these areas. What specific skills are you most interested in developing?"
    }

    // Assessment-related responses
    if (lowerInput.includes("test") || lowerInput.includes("assessment") || lowerInput.includes("result")) {
      return "Your assessment results provide valuable insights into your work style and preferences. They show you have strong problem-solving abilities and work well in collaborative environments. These strengths position you well for leadership roles. I can help you understand how to leverage these insights for career planning. Which aspect of your results would you like to explore further?"
    }

    // Leadership responses
    if (lowerInput.includes("leader") || lowerInput.includes("manage") || lowerInput.includes("team")) {
      return "Leadership is a key area where you show great potential! Your communication style and collaborative approach are strong foundations. To develop further, consider: 1) Seeking feedback from team members, 2) Taking on cross-functional projects, 3) Finding a leadership mentor, and 4) Practicing active listening and delegation skills. What leadership challenges are you currently facing?"
    }

    // Networking responses
    if (lowerInput.includes("network") || lowerInput.includes("connect") || lowerInput.includes("relationship")) {
      return "Networking is essential for career growth! Here are some strategies tailored to your profile: 1) Attend industry conferences and meetups, 2) Engage actively on LinkedIn with thoughtful comments and posts, 3) Reach out to alumni from your school, 4) Join professional associations in your field. Quality connections are more valuable than quantity. What networking goals would you like to set?"
    }

    // Default responses
    const defaultResponses = [
      "That's an excellent question! Based on your assessment results and career profile, I can see several opportunities for growth. Your analytical strengths and collaborative nature are valuable assets. Let me help you create a specific action plan. What's your primary career goal right now?",
      "I understand your concern, and it's something many professionals face. Your assessment shows you have the capabilities to overcome this challenge. Let's break it down into manageable steps and create a development plan that leverages your strengths.",
      "This is a great area to focus on! Your personality profile suggests you'd excel in this direction. I recommend starting with small, achievable goals and building momentum. What specific outcome are you hoping to achieve?",
      "Based on your results, you have strong potential in this area. I'd suggest combining your natural strengths with targeted skill development. Let's explore some specific strategies that align with your work style and career aspirations.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const message: Message = {
      id: Date.now().toString(),
      content: `Tell me more about: ${suggestion.text}`,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
    setActiveTab("chat")

    // Auto-generate AI response for the suggestion
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateSuggestionResponse(suggestion),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const generateSuggestionResponse = (suggestion: Suggestion): string => {
    switch (suggestion.category) {
      case "skills":
        return "Excellent choice! Leadership skills are crucial for career advancement. I recommend starting with these specific actions: 1) Volunteer to lead a small project or initiative, 2) Take an online leadership course (I can recommend some), 3) Find a mentor who exemplifies the leadership style you admire, 4) Practice giving presentations to build confidence. Would you like me to help you create a 90-day leadership development plan?"

      case "career":
        return "Networking is one of the most effective career strategies! Here's a practical approach: 1) Set a goal to make 2-3 new professional connections per month, 2) Attend industry events or virtual meetups, 3) Engage meaningfully on LinkedIn by commenting on posts in your field, 4) Reach out to colleagues for informational interviews. Your collaborative nature will be a huge asset in networking. What industry events or groups interest you most?"

      case "development":
        return "Regular check-ins with your manager are incredibly valuable for career growth! Here's how to make them most effective: 1) Prepare an agenda with your goals and challenges, 2) Ask for specific feedback on your performance, 3) Discuss your career aspirations and get their input, 4) Request stretch assignments or new responsibilities. Your analytical skills will help you prepare well for these conversations. When was your last meaningful career conversation with your manager?"

      default:
        return "That's a great area to focus on! Based on your profile, you have the right foundation to succeed in this. Let me help you create a specific action plan with measurable goals and timelines. What's your biggest challenge in this area right now?"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "medium":
        return "bg-muted text-mutedForeground border-border"
      case "low":
        return "bg-secondary text-secondaryForeground border-border"
      default:
        return "bg-muted text-mutedForeground border-border"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "career":
        return Target
      case "skills":
        return TrendingUp
      case "development":
        return Lightbulb
      case "personality":
        return Brain
      default:
        return MessageSquare
    }
  }

  const quickStartQuestions = [
    "How can I advance in my current role?",
    "What skills should I develop next?",
    "Help me understand my assessment results",
    "How can I improve my leadership abilities?",
    "What career paths suit my personality?",
    "How do I build a professional network?",
  ]

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => router.push("/")} className="border-border hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Badge variant="secondary" className="bg-muted text-mutedForeground">
            <Bot className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Career Coach</h1>
        <p className="text-mutedForeground">
          Get personalized career guidance, insights, and actionable recommendations based on your unique profile and
          assessment results.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="chat" className="data-[state=active]:bg-background">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-background">
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggestions ({suggestions.length})
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-background">
            <Sparkles className="h-4 w-4 mr-2" />
            Insights ({insights.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Bot className="h-5 w-5 mr-2" />
                Career Coaching Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 mb-4 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.sender === "user"
                            ? "bg-foreground text-background"
                            : "bg-muted text-foreground border border-border"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.sender === "ai" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          {message.sender === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p
                              className={`text-xs mt-2 ${
                                message.sender === "user" ? "text-background/70" : "text-mutedForeground"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted border border-border rounded-lg p-4 max-w-[80%]">
                        <div className="flex items-center space-x-3">
                          <Bot className="h-4 w-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-mutedForeground rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-mutedForeground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-mutedForeground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-mutedForeground">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Quick Start Questions */}
              {messages.length <= 1 && (
                <div className="mb-4">
                  <p className="text-sm text-mutedForeground mb-3">Quick start questions:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {quickStartQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputMessage(question)}
                        className="text-left justify-start h-auto p-3 border-border hover:bg-muted"
                      >
                        <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="text-xs">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about your career, skills, or professional development..."
                  className="flex-1 min-h-[60px] resize-none border-border focus:border-foreground"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Lightbulb className="h-5 w-5 mr-2" />
                Personalized Suggestions
              </CardTitle>
              <p className="text-sm text-mutedForeground mt-2">
                AI-generated recommendations based on your assessment results and career profile
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => {
                  const IconComponent = getCategoryIcon(suggestion.category)
                  return (
                    <div
                      key={suggestion.id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <IconComponent className="h-5 w-5 text-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-foreground font-medium mb-2">{suggestion.text}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-muted text-mutedForeground">
                                {suggestion.category}
                              </Badge>
                              <Badge className={getPriorityColor(suggestion.priority)}>
                                {suggestion.priority} priority
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border hover:bg-muted ml-4 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSuggestionClick(suggestion)
                          }}
                        >
                          Discuss
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Sparkles className="h-5 w-5 mr-2" />
                AI-Generated Insights
              </CardTitle>
              <p className="text-sm text-mutedForeground mt-2">
                Deep analysis of your assessment results and professional profile
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {insights.map((insight) => {
                  const IconComponent = getCategoryIcon(insight.category)
                  return (
                    <div
                      key={insight.id}
                      className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-foreground text-lg">{insight.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-muted text-mutedForeground">
                                {insight.category}
                              </Badge>
                              {insight.actionable && (
                                <Badge className="bg-foreground/10 text-foreground border-foreground/20">
                                  Actionable
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-mutedForeground mb-4 leading-relaxed">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-mutedForeground">Confidence:</span>
                              <Progress value={insight.confidence} className="w-24 h-2" />
                              <span className="text-sm font-medium text-foreground">{insight.confidence}%</span>
                            </div>
                            {insight.actionable && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  const message = `How can I leverage my ${insight.title.toLowerCase()} for career growth?`
                                  setInputMessage(message)
                                  setActiveTab("chat")
                                }}
                                className="bg-foreground text-background hover:bg-foreground/90"
                              >
                                Create Action Plan
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PersistentAICoach
