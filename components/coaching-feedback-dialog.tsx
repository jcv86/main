"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CoachingFeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionId: string
  messageCount: number
  coachType: "sofia" | "dani" | "hybrid"
  conversationCategory: string
  suggestedAction?: string
}

export function CoachingFeedbackDialog({
  open,
  onOpenChange,
  sessionId,
  messageCount,
  coachType,
  conversationCategory,
  suggestedAction,
}: CoachingFeedbackDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [actionCompleted, setActionCompleted] = useState(false)
  const [actionNotes, setActionNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Calificación requerida",
        description: "Por favor califica tu experiencia con estrellas",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting feedback with data:", {
        session_id: sessionId,
        message_count: messageCount,
        satisfaction_rating: rating,
        coach_type: coachType,
        conversation_category: conversationCategory,
      })

      const response = await fetch("/api/coaching-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message_count: messageCount,
          satisfaction_rating: rating,
          satisfaction_feedback: feedback,
          suggested_action: suggestedAction,
          action_completed: actionCompleted,
          action_notes: actionNotes,
          coach_type: coachType,
          conversation_category: conversationCategory,
        }),
      })

      const result = await response.json()
      console.log("[v0] API response:", result)

      if (!response.ok) {
        throw new Error(result.error || result.message || "Error al guardar feedback")
      }

      toast({
        title: "¡Gracias por tu feedback!",
        description: "Tu opinión nos ayuda a mejorar",
      })

      onOpenChange(false)

      // Reset form
      setRating(0)
      setFeedback("")
      setActionCompleted(false)
      setActionNotes("")
    } catch (error) {
      console.error("[v0] Error submitting feedback:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No pudimos guardar tu feedback. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>¿Cómo fue tu experiencia?</DialogTitle>
          <DialogDescription>Tu feedback nos ayuda a mejorar el coaching con IA</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Califica tu experiencia</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${`}
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow/40" : "text-white/85"`}
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 5 && "¡Excelente! 🎉"}
                {rating === 4 && "Muy bueno 👍"}
                {rating === 3 && "Bueno"}
                {rating === 2 && "Regular"}
                {rating === 1 && "Necesita mejorar"}
              </p>
            )}
          </div>

          {/* Feedback Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cuéntanos más (opcional)</label>
            <Textarea
              placeholder="¿Qué te gustó? ¿Qué podríamos mejorar?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Completion */}
          {suggestedAction && (
            <div className="space-y-3 rounded-[28px] border p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="action-completed"
                  checked={actionCompleted}
                  onChange={(e) => setActionCompleted(e.target.checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="action-completed" className="text-sm font-medium cursor-pointer">
                    ¿Completaste la acción sugerida?
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">{suggestedAction}</p>
                </div>
              </div>

              {actionCompleted && (
                <Textarea
                  placeholder="¿Cómo te fue? (opcional)"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={2}
                  className="mt-2"
                />
              )}
            </div>
          )}

          {/* Engagement Info */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p>
               Mensajes en esta sesión: <strong>{messageCount}</strong>
              {messageCount >= 2 && "  Meta alcanzada"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
