"use client"

import Link from "next/link"
import { Brain, Mail, Linkedin, Twitter, Facebook } from "lucide-react"

export function LLMOOptimizedFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-purple-400" />
              <span className="text-white font-bold text-lg">TuCarrera.cl</span>
            </div>
            <p className="text-sm mb-4">
              Plataforma líder en Chile para desarrollo profesional. Tests psicométricos científicos, 120+ libros
              profesionales y coaching con IA.
            </p>
            <div className="flex gap-3">
              <a href="https://linkedin.com/company/tucarrera" aria-label="LinkedIn" className="hover:text-purple-400">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/tucarreracl" aria-label="Twitter" className="hover:text-purple-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://facebook.com/tucarreracl" aria-label="Facebook" className="hover:text-purple-400">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Tests */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tests Psicométricos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/test/disc" className="hover:text-purple-400">
                  Test DISC
                </Link>
              </li>
              <li>
                <Link href="/test/mbti" className="hover:text-purple-400">
                  Test MBTI
                </Link>
              </li>
              <li>
                <Link href="/test/big-five" className="hover:text-purple-400">
                  Big Five Personalidad
                </Link>
              </li>
              <li>
                <Link href="/test/riasec" className="hover:text-purple-400">
                  Test RIASEC
                </Link>
              </li>
              <li>
                <Link href="/test/emotional-intelligence" className="hover:text-purple-400">
                  Inteligencia Emocional
                </Link>
              </li>
              <li>
                <Link href="/test/soft-skills" className="hover:text-purple-400">
                  Soft Skills
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/biblioteca" className="hover:text-purple-400">
                  Biblioteca (120+ libros)
                </Link>
              </li>
              <li>
                <Link href="/cerebro" className="hover:text-purple-400">
                  Coach con IA
                </Link>
              </li>
              <li>
                <Link href="/learning-paths" className="hover:text-purple-400">
                  Rutas de Aprendizaje
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-purple-400">
                  Oportunidades Laborales
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-purple-400">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contacto@tucarrera.cl" className="hover:text-purple-400">
                  contacto@tucarrera.cl
                </a>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-400">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-purple-400">
                  Términos de Uso
                </Link>
              </li>
              <li>
                <Link href="/empresas" className="hover:text-purple-400">
                  Soluciones para Empresas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>© 2025 TuCarrera.cl. Todos los derechos reservados.</p>
          <p className="mt-2">Plataforma de desarrollo profesional con IA | Santiago, Chile</p>
        </div>
      </div>

      {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "TuCarrera.cl",
            url: "https://tucarrera.cl",
            logo: "https://tucarrera.cl/logo.png",
            contactPoint: {
              "@type": "ContactPoint",
              email: "contacto@tucarrera.cl",
              contactType: "Customer Service",
              areaServed: "CL",
              availableLanguage: "Spanish",
            },
            sameAs: [
              "https://www.linkedin.com/company/tucarrera",
              "https://twitter.com/tucarreracl",
              "https://www.facebook.com/tucarreracl",
            ],
          }),
        }}
      />
    </footer>
  )
}
