"use client"

import { useState } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Phone, MapPin, Send, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type FormState = "idle" | "loading" | "success" | "error"

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error sending message")
      }

      setFormState("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
      
      // Reset success state after 5 seconds
      setTimeout(() => setFormState("idle"), 5000)
    } catch (error) {
      setFormState("error")
      setErrorMessage(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-purple/10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Link href="/" className="text-purple/40 hover:text-purple/30 transition-colors text-sm font-medium mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <div>
            <h1 className="text-5xl font-black text-white mb-2">Ponte en Contacto</h1>
            <p className="text-lg text-purple/40">Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="md:col-span-1">
            <div className="space-y-8">
              {/* Email */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-cyan" />
                  <h3 className="text-lg font-semibold text-white">Email</h3>
                </div>
                <p className="text-purple/40 mb-1">Consultas generales:</p>
                <a href="mailto:contacto@despegatucarrera.com" className="text-cyan hover:text-cyan/80 transition-colors font-medium">
                  contacto@despegatucarrera.com
                </a>
                <p className="text-purple/40 mt-3 mb-1">Soporte técnico:</p>
                <a href="mailto:soporte@despegatucarrera.com" className="text-cyan hover:text-cyan/80 transition-colors font-medium">
                  soporte@despegatucarrera.com
                </a>
              </div>

              {/* WhatsApp */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-cyan" />
                  <h3 className="text-lg font-semibold text-white">WhatsApp</h3>
                </div>
                <p className="text-purple/40 mb-2">Para consultas urgentes</p>
                <a 
                  href="https://wa.me/56912345678?text=Hola!%20Tengo%20una%20consulta%20sobre%20Despega%20Tu%20Carrera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyan/10 border border-cyan/30 rounded-lg hover:bg-cyan/20 transition-colors text-cyan font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Chatear por WhatsApp
                </a>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-cyan" />
                  <h3 className="text-lg font-semibold text-white">Ubicación</h3>
                </div>
                <p className="text-purple/40">Santiago, Chile</p>
              </div>

              {/* Response Time */}
              <div className="bg-purple/5 border border-purple/10 rounded-lg p-4">
                <p className="text-sm text-purple/60">
                  <span className="font-semibold text-white">Tiempo de respuesta:</span> Respondemos en menos de 24 horas hábiles
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 bg-purple/5 border border-purple/10 rounded-xl p-8">
              {/* Success Message */}
              {formState === "success" && (
                <div className="flex items-center gap-3 p-4 bg-green/10 border border-green/30 rounded-lg">
                  <Check className="w-5 h-5 text-green" />
                  <p className="text-green font-medium">¡Mensaje enviado exitosamente! Te responderemos pronto.</p>
                </div>
              )}

              {/* Error Message */}
              {formState === "error" && (
                <div className="flex items-center gap-3 p-4 bg-red/10 border border-red/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red" />
                  <p className="text-red font-medium">{errorMessage || "Error al enviar el mensaje"}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Nombre Completo
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={formState === "loading"}
                  className="bg-background border-purple/20 text-white placeholder:text-purple/30"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={formState === "loading"}
                  className="bg-background border-purple/20 text-white placeholder:text-purple/30"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                  Asunto
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="¿Sobre qué es tu consulta?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={formState === "loading"}
                  className="bg-background border-purple/20 text-white placeholder:text-purple/30"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Cuéntanos con detalle..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={formState === "loading"}
                  className="bg-background border-purple/20 text-white placeholder:text-purple/30 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={formState === "loading" || formState === "success"}
                className="w-full bg-cyan hover:bg-cyan/90 text-black font-semibold h-12"
              >
                {formState === "loading" ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensaje
                  </>
                )}
              </Button>

              {/* Privacy Notice */}
              <p className="text-xs text-purple/40 text-center">
                Respetamos tu privacidad. Lee nuestra{" "}
                <Link href="/privacy" className="text-cyan hover:text-cyan/80">
                  Política de Privacidad
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-purple/5 border-t border-purple/10 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              {
                question: "¿Cuánto tiempo tarda la respuesta?",
                answer: "Respondemos todas las consultas dentro de 24 horas hábiles. Para urgencias, usa WhatsApp.",
              },
              {
                question: "¿Qué debo incluir en mi consulta?",
                answer: "Incluye tu nombre, email de contacto, asunto claro y una descripción detallada del problema o pregunta.",
              },
              {
                question: "¿Puedo agendar una llamada?",
                answer: "Por ahora atendemos consultas vía email y WhatsApp. Pronto habilitaremos agendamiento de llamadas.",
              },
              {
                question: "¿Para qué sirve el WhatsApp?",
                answer: "WhatsApp es para consultas urgentes o tiempo-sensibles. Email es ideal para preguntas generales.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-background border border-purple/10 rounded-lg p-4 hover:border-cyan/30 transition-colors cursor-pointer"
              >
                <summary className="flex items-center justify-between text-white font-semibold group-open:text-cyan transition-colors">
                  {faq.question}
                  <span className="text-purple/40 group-open:text-cyan">+</span>
                </summary>
                <p className="text-purple/60 mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
