import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad - Despega Tu Carrera',
  description: 'Nuestra política de privacidad explica cómo protegemos tus datos personales.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Política de Privacidad</h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Última actualización: 17 de marzo de 2026
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">1. Introducción</h2>
              <p>
                En Despega Tu Carrera ("la Plataforma"), nos comprometemos a proteger tu privacidad. Esta Política de Privacidad 
                explica cómo recopilamos, usamos y protegemos tu información personal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">2. Información que Recopilamos</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Información de registro: nombre, email, contraseña</li>
                <li>Datos de tests psicométricos y evaluaciones</li>
                <li>Información de perfil y preferencias</li>
                <li>Historial de uso y actividad en la plataforma</li>
                <li>Datos de coaching y retroalimentación personalizada</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">3. Cómo Usamos tu Información</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Para proporcionar y mejorar nuestros servicios</li>
                <li>Para personalizar tu experiencia de coaching</li>
                <li>Para analizar patrones de uso y tendencias</li>
                <li>Para comunicarnos sobre actualizaciones importantes</li>
                <li>Para cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">4. Protección de Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información contra 
                acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">5. Derechos del Usuario</h2>
              <p>
                Tienes derecho a acceder, corregir, actualizar y solicitar la eliminación de tu información personal. 
                Para ejercer estos derechos, contacta a <a href="mailto:privacidad@despegatucarrera.cl" className="text-purple-600 hover:underline">privacidad@despegatucarrera.cl</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">6. Cookies</h2>
              <p>
                Usamos cookies para mejorar tu experiencia. Puedes controlar las preferencias de cookies en tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">7. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta política, contacta a: <a href="mailto:privacidad@despegatucarrera.cl" className="text-purple-600 hover:underline">privacidad@despegatucarrera.cl</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
