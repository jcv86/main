"use client"

import { useState } from "react"
import { MessageCircle, Sparkles, X, ArrowLeft, Minimize2 } from "lucide-react"
import { CoachSelector } from "./coach-selector"
import { FloatingCoachChat } from "./floating-coach-chat"
import { useSession } from "@/components/session-wrapper"
import type { PromptCategoryId } from "@/lib/ai/prompt-categories"

export function FloatingCoachWidget() {
  const { user, isLoading } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<PromptCategoryId | null>(null)
  const [hasUnread, setHasUnread] = useState(false)

  if (isLoading || !user?.email) {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      {(!isOpen || isMinimized) && (
        <button
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
            setHasUnread(false)
          }}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-[20px] bg-background"
          aria-label="Abrir chat con coach IA"
        >
          {hasUnread && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red/50 rounded-full border-2 border-white animate-pulse" />
          )}
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-background border rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple" />
              <h3 className="font-semibold text-sm">
                {selectedCategory ? "Chat con Coach" : "Elige tu Coach"}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Minimizar chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSelectedCategory(null)
                }}
                className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {!selectedCategory ? (
              <CoachSelector 
                onSelect={(categoryId) => {
                  setSelectedCategory(categoryId)
                }} 
              />
            ) : (
              <FloatingCoachChat 
                categoryId={selectedCategory}
                userEmail={user.email}
                onBack={() => setSelectedCategory(null)}
              />
            )}
          </div>

          {/* Footer */}
          {selectedCategory && (
            <div className="p-2 border-t bg-muted/30">
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-full flex items-center gap-2 justify-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
