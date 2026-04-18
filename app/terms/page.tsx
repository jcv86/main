import type { Metadata } from "next"
import { Brain } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos de Servicio - Despega Tu Carrera",
  description: "Lee nuestros términos y condiciones de uso de Despega Tu Carrera",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-muted/90 to-slate-950">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-purple-400 hover:text-purple-300 transition-colors">
            <Brain className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>
          <h1 className="text-5xl font-black text-white mb-4">Términos de Servicio</h1>
          <p className="text-xl text-muted/40">Última actualización: 5 de abril de 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de Términos</h2>
            <p className="text-muted/30 leading-relaxed">
              Al acceder y usar Despega Tu Carrera, aceptas estar vinculado por estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Licencia de Uso</h2>
            <p className="text-muted/30 leading-relaxed">
              Te otorgamos una licencia personal, no exclusiva y no transferible para acceder y usar nuestro sitio y servicios para propósitos legales. No puedes reproducir, distribuir o transmitir el contenido sin nuestro consentimiento previo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Responsabilidades del Usuario</h2>
            <div className="bg-gradient-to-r from-purple/10 to-blue/10 border border-purple/50/20 rounded-lg p-6">
              <ul className="list-disc list-inside text-muted/30 space-y-2">
                <li>Mantener la confidencialidad de tu cuenta</li>
                <li>Proporcionar información precisa y completa</li>
                <li>No usar la plataforma para actividades ilegales</li>
                <li>Respetar los derechos de propiedad intelectual</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitación de Responsabilidad</h2>
            <p className="text-muted/30 leading-relaxed">
              Despega Tu Carrera se proporciona "tal cual". No garantizamos que los servicios sean ininterrumpidos o libres de errores. No somos responsables por daños indirectos, incidentales o consecuentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Modificaciones del Servicio</h2>
            <p className="text-muted/30 leading-relaxed">
              Nos reservamos el derecho de modificar o suspender el servicio en cualquier momento. Te notificaremos sobre cambios significativos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Propiedad Intelectual</h2>
            <p className="text-muted/30 leading-relaxed">
              Todo el contenido de la plataforma, incluyendo tests, análisis y recursos, es propiedad de Despega Tu Carrera o de sus licenciantes. No está permitido reproducir o distribuir sin autorización.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Terminación de Cuenta</h2>
            <p className="text-muted/30 leading-relaxed">
              Puedes terminar tu cuenta en cualquier momento. También nos reservamos el derecho de terminar cuentas que violen estos términos.
            </p>
          </section>

          <section className="bg-gradient-to-r from-blue/10 to-blue/10 border border-blue/50/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">8. Contacto</h2>
            <p className="text-muted/30 leading-relaxed">
              Para preguntas sobre estos términos, contáctanos en{" "}
              <a href="mailto:contacto@despegatucarrera.cl" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                contacto@despegatucarrera.cl
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
