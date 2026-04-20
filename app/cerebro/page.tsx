import type { Metadata } from "next"
import { BrainChatInterface } from "@/components/brain-chat-interface"
import { Brain } from "lucide-react"

export const metadata: Metadata = {
  title: "Cerebro - Chat Inteligente | Desarrollo Profesional",
  description:
    "Chatea con nuestro asistente inteligente impulsado por IA. Accede a más de 120 libros de desarrollo profesional, liderazgo, productividad y emprendimiento.",
}

export default function CerebroPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-background">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-background">
              Cerebro Inteligente
            </h1>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground max-w-2xl mx-auto">
            Conversa con nuestro asistente inteligente. Hace preguntas sobre desarrollo profesional, liderazgo,
            productividad, comunicación, y más. Respuestas basadas en más de 120 libros especializados.
          </p>
        </div>

        <BrainChatInterface />
      </div>
    </div>
  )
}
