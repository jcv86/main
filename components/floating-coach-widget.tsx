"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Sparkles, X, ArrowLeft, Minimize2, Maximize2, Send } from "lucide-react"
import { CoachSelector } from "./coach-selector"
import { FloatingCoachChat } from "./floating-coach-chat"
import { useSession } from "@/components/session-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FloatingCoachWidget() {
  const { user, isLoading } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState<"sofia" | "dani" | null>(null)
  const [hasUnread, setHasUnread] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [minimizedMessage, setMinimizedMessage] = useState("Hola, ¿en qué te puedo ayudar?")

  if (isLoading || !user?.email) {
    return null
  }

  const handleOpenChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setHasUnread(false)
    setUnreadCount(0)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
    setHasUnread(false)
  }

  const handleCloseChat = () => {
    setIsOpen(false)
    setSelectedCoach(null)
    setIsMinimized(false)
  }

  return (
    <>
      {/* Floating Button - Minimized State */}
      {(!isOpen || isMinimized) && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Minimized Mini-Panel - Shows coach status & quick preview */}
          {isMinimized && isOpen && selectedCoach && (
            <div className="bg-background border border-border rounded-lg shadow-lg p-3 w-72 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {selectedCoach === "sofia" ? "Sofía" : "Dani"} está en línea
                  </span>
                </div>
                <button
                  onClick={() => setIsMinimized(false)}
                  className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="Expandir chat"
                >
                  <Maximize2 className="h-3 w-3" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                "{minimizedMessage}"
              </p>
              {isTyping && (
                <div className="flex gap-1 mt-2">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              )}
            </div>
          )}

          {/* Main Floating Button */}
          <button
            onClick={handleOpenChat}
            className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center group hover:scale-110 relative"
            aria-label="Abrir chat con coach IA"
          >
            {/* Pulse Animation - Always visible */}
            <div className="absolute inset-0 rounded-full bg-purple-600 opacity-75 animate-pulse"></div>
            
            {/* Unread Badge */}
            {(hasUnread || unreadCount > 0) && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white animate-bounce flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount || "!"}
                </span>
              </span>
            )}

            {/* Icon */}
            <div className="relative z-10">
              {isTyping ? (
                <div className="flex gap-0.5">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              ) : (
                <MessageCircle className="h-6 w-6 text-white" />
              )}
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
          </button>
        </div>
      )}

      {/* Floating Chat Panel - Expanded State */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-background border rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {selectedCoach === "sofia"
                    ? "Sofía - Autoconocimiento"
                    : selectedCoach === "dani"
                      ? "Dani - Desarrollo"
                      : "Elige tu Coach"}
                </h3>
                <p className="text-xs text-muted-foreground">Siempre disponible</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleMinimize}
                className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                title="Minimizar (Alt + M)"
                aria-label="Minimizar chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleCloseChat}
                className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {!selectedCoach ? (
              <CoachSelector onSelect={setSelectedCoach} />
            ) : (
              <FloatingCoachChat 
                coach={selectedCoach} 
                userEmail={user.email}
                onTyping={setIsTyping}
                onMessageReceived={(msg) => setMinimizedMessage(msg)}
              />
            )}
          </div>

          {/* Footer */}
          {selectedCoach && (
            <div className="p-2 border-t bg-muted/30">
              <button
                onClick={() => setSelectedCoach(null)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Cambiar coach
              </button>
            </div>
          )}
        </div>
      )}

      {/* Keyboard Shortcut Hint */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
            Presiona <kbd className="bg-background px-1 rounded text-xs">Alt + C</kbd> para coach
          </div>
        </div>
      )}
    </>
  )
}
