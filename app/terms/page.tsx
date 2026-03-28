import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Términos de Servicio - Despega Tu Carrera',
  description: 'Términos y condiciones de uso de Despega Tu Carrera.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Términos de Servicio</h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Última actualización: 17 de marzo de 2026
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">1. Aceptación de Términos</h2>
              <p>
                Al acceder y usar Despega Tu Carrera, aceptas estar vinculado por estos términos y condiciones. 
                Si no estás de acuerdo, no debes usar la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">2. Licencia de Uso</h2>
              <p>
                Te otorgamos una licencia limitada, no exclusiva y revocable para usar la plataforma para fines personales 
                y no comerciales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">3. Responsabilidades del Usuario</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Mantener la confidencialidad de tu cuenta</li>
                <li>Proporcionar información precisa y completa</li>
                <li>No usar la plataforma para actividades ilegales</li>
                <li>Respetar los derechos de propiedad intelectual</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">4. Limitación de Responsabilidad</h2>
              <p>
                Despega Tu Carrera se proporciona "tal como está". No somos responsables por daños indirectos, incidentales 
                o consecuentes derivados del uso de la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">5. Modificaciones del Servicio</h2>
              <p>
                Nos reservamos el derecho de modificar o suspender el servicio en cualquier momento. Te notificaremos 
                sobre cambios significativos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">6. Propiedad Intelectual</h2>
              <p>
                Todo el contenido de la plataforma, incluyendo tests, análisis y recursos, es propiedad de Despega Tu Carrera 
                o de sus licenciantes. No está permitido reproducir o distribuir sin autorización.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">7. Terminación de Cuenta</h2>
              <p>
                Puedes terminar tu cuenta en cualquier momento. También nos reservamos el derecho de terminar cuentas que 
                violen estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">8. Contacto</h2>
              <p>
                Para preguntas sobre estos términos, contacta a: <a href="mailto:terminos@despegatucarrera.cl" className="text-purple-600 hover:underline">terminos@despegatucarrera.cl</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
