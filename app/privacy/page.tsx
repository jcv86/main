import type { Metadata } from "next"
import { Brain } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidad - Despega Tu Carrera",
  description: "Conoce cómo protegemos tu información personal en Despega Tu Carrera",
  alternates: {
    canonical: "https://www.despegatucarrera.com/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-purple/40 hover:text-purple/30 transition-colors">
            <Brain className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>
          <h1 className="text-5xl font-black text-white mb-4">Política de Privacidad</h1>
          <p className="text-xl text-muted-foreground">Última revisión: 15 de septiembre de 2026</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introducción</h2>
            <p className="text-white/85 leading-relaxed">
              En Despega Tu Carrera, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política explica cómo recopilamos, usamos y protegemos tu información cuando usas nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Información que recopilamos</h2>
            <div className="bg-background">
              <p className="text-white/85 leading-relaxed mb-4">Recopilamos información que nos proporciona voluntariamente o que se genera al usar el servicio:</p>
              <ul className="list-disc list-inside text-white/85 space-y-2">
                <li>Nombre, correo electrónico y datos de contacto</li>
                <li>Información de perfil y contexto profesional</li>
                <li>Respuestas, resultados y evidencia que generas dentro del recorrido</li>
                <li>Información sobre tu progreso y uso de la plataforma</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Uso de información</h2>
            <p className="text-white/85 leading-relaxed mb-4">Utilizamos tu información para:</p>
            <ul className="list-disc list-inside text-white/85 space-y-2">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Personalizar tu experiencia dentro del recorrido</li>
              <li>Comunicarnos contigo sobre el servicio y solicitudes de soporte</li>
              <li>Cumplir con obligaciones legales aplicables</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Seguridad de datos</h2>
            <p className="text-white/85 leading-relaxed">
              Implementamos medidas técnicas y organizativas para reducir el riesgo de acceso no autorizado, alteración o destrucción de la información. El servicio utiliza conexiones cifradas y controles de acceso para las áreas privadas y los datos del recorrido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Tus derechos</h2>
            <p className="text-white/85 leading-relaxed mb-4">De acuerdo con la normativa aplicable, puedes solicitar:</p>
            <ul className="list-disc list-inside text-white/85 space-y-2">
              <li>Acceso a tus datos personales</li>
              <li>Rectificación de datos inexactos</li>
              <li>Eliminación de datos cuando corresponda</li>
              <li>Revocación del consentimiento cuando sea aplicable</li>
            </ul>
          </section>

          <section className="bg-background">
            <h2 className="text-2xl font-bold text-white mb-4">6. Contacto</h2>
            <p className="text-white/85 leading-relaxed">
              Para preguntas o solicitudes relacionadas con privacidad, contáctanos en{" "}
              <a href="mailto:contacto@despegatucarrera.com" className="text-purple/40 hover:text-purple/30 transition-colors font-semibold">
                contacto@despegatucarrera.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
