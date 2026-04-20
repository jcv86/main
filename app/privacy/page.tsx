import type { Metadata } from "next"
import { Brain } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidad - Despega Tu Carrera",
  description: "Conoce cómo protegemos tu información personal en Despega Tu Carrera",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-purple/40 hover:text-purple/30 transition-colors">
            <Brain className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>
          <h1 className="text-5xl font-black text-white mb-4">Política de Privacidad</h1>
          <p className="text-xl text-muted-foreground">Última actualización: 5 de abril de 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introducción</h2>
            <p className="text-muted/30 leading-relaxed">
              En Despega Tu Carrera, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política explica cómo recopilamos, usamos y protegemos tu información cuando usas nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Información que Recopilamos</h2>
            <div className="bg-background">
              <p className="text-muted/30 leading-relaxed mb-4">Recopilamos información que nos proporciona voluntariamente:</p>
              <ul className="list-disc list-inside text-muted/30 space-y-2">
                <li>Nombre, correo electrónico y datos de contacto</li>
                <li>Información de perfil profesional</li>
                <li>Resultados de evaluaciones psicométricas</li>
                <li>Información sobre tu progreso en la plataforma</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Uso de Información</h2>
            <p className="text-muted/30 leading-relaxed mb-4">Utilizamos tu información para:</p>
            <ul className="list-disc list-inside text-muted/30 space-y-2">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Personalizar tu experiencia</li>
              <li>Comunicarnos contigo sobre actualizaciones y recursos</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Seguridad de Datos</h2>
            <p className="text-muted/30 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, alteración y destrucción. Usamos encriptación SSL/TLS y almacenamiento seguro en servidores protegidos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Tus Derechos</h2>
            <p className="text-muted/30 leading-relaxed mb-4">Tienes derecho a:</p>
            <ul className="list-disc list-inside text-muted/30 space-y-2">
              <li>Acceder a tus datos personales</li>
              <li>Solicitar la rectificación de datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Revocar tu consentimiento</li>
            </ul>
          </section>

          <section className="bg-background">
            <h2 className="text-2xl font-bold text-white mb-4">6. Contacto</h2>
            <p className="text-muted/30 leading-relaxed">
              Para preguntas sobre esta política, contáctanos en{" "}
              <a href="mailto:contacto@despegatucarrera.cl" className="text-purple/40 hover:text-purple/30 transition-colors font-semibold">
                contacto@despegatucarrera.cl
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
