"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface ContactFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactFormModal({ open, onOpenChange }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al enviar el mensaje")
      }

      setStatus("success")
      setFormData({ name: "", email: "", whatsapp: "", message: "" })

      // Auto close after 3 seconds
      setTimeout(() => {
        onOpenChange(false)
        setStatus("idle")
      }, 3000)
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Contáctanos
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Cuéntanos sobre tu consulta y nos pondremos en contacto pronto
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Nombre *
            </Label>
            <Input
              id="name"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 placeholder:text-gray-400"
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              placeholder="tu@email.com"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 placeholder:text-gray-400"
              disabled={loading}
            />
          </div>

          {/* WhatsApp Field */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-sm font-semibold text-gray-700">
              WhatsApp{" "}
              <span className="text-xs font-normal text-gray-500">(Opcional)</span>
            </Label>
            <Input
              id="whatsapp"
              placeholder="+56 9 XXXX XXXX"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 placeholder:text-gray-400"
              disabled={loading}
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
              Tu Consulta *
            </Label>
            <Textarea
              id="message"
              placeholder="Cuéntanos qué necesitas. Queremos ayudarte a acelerar tu crecimiento profesional..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="min-h-[140px] border-gray-200 focus:border-purple-500 focus:ring-purple-500 placeholder:text-gray-400 resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">Mínimo 10 caracteres</p>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900">Mensaje enviado</p>
                <p className="text-xs text-green-700 mt-1">
                  Gracias por tu consulta. Nos pondremos en contacto pronto.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">Error</p>
                <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || status === "success"}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Enviando...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Enviado
              </>
            ) : (
              "Enviar Consulta"
            )}
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 text-center">
            Nos comprometemos a responder dentro de 24 horas.{" "}
            <a href="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
              Revisa nuestra política de privacidad
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
