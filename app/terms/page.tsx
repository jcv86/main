import type { Metadata } from "next"
import { Brain } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos de Servicio - Despega Tu Carrera",
  description: "Lee los términos y condiciones de uso de Despega Tu Carrera",
  alternates: {
    canonical: "https://www.despegatucarrera.com/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-purple/40 hover:text-purple/30 transition-colors">
            <Brain className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>
          <h1 className="text-5xl font-black text-white mb-4">Términos de Servicio</h1>
          <p className="text-xl text-muted-foreground">Última revisión: 15 de septiembre de 2026</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de términos</h2>
            <p className="text-white/85 leading-relaxed">
              Al acceder y usar Despega Tu Carrera, aceptas estos términos y condiciones. Si no estás de acuerdo con ellos, no debes usar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Licencia de uso</h2>
            <p className="text-white/85 leading-relaxed">
              Te otorgamos una licencia personal, no exclusiva y no transferible para acceder y usar nuestro sitio y servicios con fines legales. No puedes reproducir, distribuir o transmitir contenido protegido sin autorización cuando corresponda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Responsabilidades del usuario</h2>
            <div className="bg-background">
              <ul className="list-disc list-inside text-white/85 space-y-2">
                <li>Mantener la confidencialidad de tu cuenta, contraseña y códigos de verificación</li>
                <li>Proporcionar información que tengas derecho a compartir</li>
                <li>No usar la plataforma para actividades ilegales o abusivas</li>
                <li>Respetar los derechos de propiedad intelectual y de terceros</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Alcance del servicio</h2>
            <p className="text-white/85 leading-relaxed">
              Despega Tu Carrera es una herramienta de desarrollo profesional. No garantiza empleo, ascensos, aumentos de sueldo ni resultados específicos, y no sustituye servicios clínicos ni asesoría legal, financiera, médica u otra asesoría profesional regulada.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Disponibilidad y cambios</h2>
            <p className="text-white/85 leading-relaxed">
              El servicio puede cambiar a medida que evoluciona el producto. No garantizamos disponibilidad ininterrumpida ni ausencia total de errores. Cuando corresponda, podremos comunicar cambios relevantes mediante los canales disponibles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Propiedad intelectual</h2>
            <p className="text-white/85 leading-relaxed">
              El contenido propio de la plataforma, incluyendo evaluaciones, análisis, ejercicios, interfaces y recursos, pertenece a Despega Tu Carrera o a sus respectivos licenciantes cuando corresponda. No está permitido reproducirlo o distribuirlo sin autorización salvo los usos permitidos por la ley.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Cuenta y acceso</h2>
            <p className="text-white/85 leading-relaxed">
              El acceso actual puede depender del piloto, una invitación o autorización previa. Podemos restringir o terminar el acceso cuando sea necesario para proteger el servicio, cumplir obligaciones aplicables o responder a incumplimientos de estos términos.
            </p>
          </section>

          <section className="bg-background">
            <h2 className="text-2xl font-bold text-white mb-4">8. Contacto</h2>
            <p className="text-white/85 leading-relaxed">
              Para preguntas sobre estos términos, contáctanos en{" "}
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
