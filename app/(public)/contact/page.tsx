"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Send, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FormState = "idle" | "loading" | "success" | "error"

const CONTACT_WHATSAPP = "https://wa.me/56963160187?text=Hola!%20Tengo%20una%20consulta%20sobre%20Despega%20Tu%20Carrera"

const CONTACT_FAQS = [
  {
    question: "¿Cuándo recibiré respuesta?",
    answer: "Revisamos las consultas recibidas y respondemos tan pronto como sea posible, según disponibilidad del equipo.",
  },
  {
    question: "¿Qué debo incluir en mi consulta?",
    answer: "Incluye tu nombre, email de contacto, asunto claro y el contexto necesario para entender tu solicitud.",
  },
  {
    question: "¿Puedo consultar por un piloto institucional?",
    answer: "Sí. Indica la institución, el objetivo que quieren explorar y cualquier contexto relevante para preparar una primera conversación.",
  },
  {
    question: "¿Qué canal uso para soporte?",
    answer: "Puedes usar el formulario, email o WhatsApp. Para problemas de acceso, incluye el correo asociado a tu cuenta sin compartir contraseñas ni códigos de verificación.",
  },
]

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
        throw new Error(error.message || "No pudimos enviar el mensaje")
      }

      setFormState("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setFormState("idle"), 5000)
    } catch (error) {
      setFormState("error")
      setErrorMessage(error instanceof Error ? error.message : "No pudimos enviar el mensaje")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-purple/10">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Link href="/" className="mb-4 inline-block text-sm font-medium text-purple/40 transition-colors hover:text-purple/30">
            ← Volver al inicio
          </Link>
          <h1 className="mb-2 text-5xl font-black text-white">Ponte en contacto</h1>
          <p className="text-lg text-purple/40">Cuéntanos en qué podemos ayudarte y revisaremos tu mensaje tan pronto como sea posible.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="space-y-8">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <Mail className="h-5 w-5 text-cyan" aria-hidden />
                  <h2 className="text-lg font-semibold text-white">Email</h2>
                </div>
                <p className="mb-1 text-purple/40">Consultas generales:</p>
                <a href="mailto:contacto@despegatucarrera.com" className="font-medium text-cyan transition-colors hover:text-cyan/80">
                  contacto@despegatucarrera.com
                </a>
                <p className="mb-1 mt-3 text-purple/40">Soporte técnico:</p>
                <a href="mailto:soporte@despegatucarrera.com" className="font-medium text-cyan transition-colors hover:text-cyan/80">
                  soporte@despegatucarrera.com
                </a>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-cyan" aria-hidden />
                  <h2 className="text-lg font-semibold text-white">WhatsApp</h2>
                </div>
                <p className="mb-2 text-purple/40">Canal alternativo de contacto</p>
                <a
                  href={CONTACT_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-4 py-2 font-medium text-cyan transition-colors hover:bg-cyan/20"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Chatear por WhatsApp
                </a>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-cyan" aria-hidden />
                  <h2 className="text-lg font-semibold text-white">Ubicación</h2>
                </div>
                <p className="text-purple/40">Santiago, Chile</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-purple/10 bg-purple/5 p-8">
              {formState === "success" && (
                <div className="flex items-center gap-3 rounded-lg border border-green/30 bg-green/10 p-4">
                  <Check className="h-5 w-5 text-green" aria-hidden />
                  <p className="font-medium text-green">¡Mensaje enviado! Revisaremos tu consulta lo antes posible.</p>
                </div>
              )}

              {formState === "error" && (
                <div className="flex items-center gap-3 rounded-lg border border-red/30 bg-red/10 p-4">
                  <AlertCircle className="h-5 w-5 text-red" aria-hidden />
                  <p className="font-medium text-red">{errorMessage || "Error al enviar el mensaje"}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">Nombre completo</label>
                <Input id="name" name="name" type="text" placeholder="Tu nombre" value={formData.name} onChange={handleChange} required disabled={formState === "loading"} className="border-purple/20 bg-background text-white placeholder:text-purple/30" />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">Email</label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} required disabled={formState === "loading"} className="border-purple/20 bg-background text-white placeholder:text-purple/30" />
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white">Asunto</label>
                <Input id="subject" name="subject" type="text" placeholder="¿Sobre qué es tu consulta?" value={formData.subject} onChange={handleChange} required disabled={formState === "loading"} className="border-purple/20 bg-background text-white placeholder:text-purple/30" />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-white">Mensaje</label>
                <Textarea id="message" name="message" placeholder="Cuéntanos con el contexto necesario..." rows={5} value={formData.message} onChange={handleChange} required disabled={formState === "loading"} className="resize-none border-purple/20 bg-background text-white placeholder:text-purple/30" />
              </div>

              <Button type="submit" disabled={formState === "loading" || formState === "success"} className="h-12 w-full bg-cyan font-semibold text-black hover:bg-cyan/90">
                {formState === "loading" ? "Enviando..." : <><Send className="mr-2 h-4 w-4" aria-hidden />Enviar mensaje</>}
              </Button>

              <p className="text-center text-xs text-purple/40">
                No compartas contraseñas ni códigos de verificación. Lee nuestra{" "}
                <Link href="/privacy" className="text-cyan hover:text-cyan/80">Política de Privacidad</Link>.
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-purple/10 bg-purple/5 py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-3xl font-bold text-white">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {CONTACT_FAQS.map((faq) => (
              <details key={faq.question} className="group cursor-pointer rounded-lg border border-purple/10 bg-background p-4 transition-colors hover:border-cyan/30">
                <summary className="flex items-center justify-between font-semibold text-white transition-colors group-open:text-cyan">
                  {faq.question}
                  <span className="text-purple/40 group-open:text-cyan">+</span>
                </summary>
                <p className="mt-3 text-purple/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
