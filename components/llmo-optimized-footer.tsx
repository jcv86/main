"use client"

import { useState } from "react"
import Link from "next/link"
import { Brain, Mail, Linkedin, Twitter, Facebook, Instagram, Youtube, MapPin, Phone, MessageCircle } from "lucide-react"
import NewsletterSignup from "./newsletter-signup"
import { ContactFormModal } from "./contact-form-modal"

function LLMOOptimizedFooter() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <ContactFormModal open={contactOpen} onOpenChange={setContactOpen} />
      <footer className="bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="bg-background">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Mantente actualizado con nuestros recursos</h3>
            <p className="text-purple/10 mb-6">
              Recibe tips de desarrollo profesional, nuevos libros y recursos exclusivos cada semana
            </p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* About Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-background">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Despega Tu Carrera</span>
            </div>
            <p className="text-sm mb-6 text-muted-foreground leading-relaxed">
              La plataforma en Chile para desarrollo profesional. Combina tests psicométricos científicos, recursos curados de aprendizaje y coaching personalizado con IA para transformar tu carrera.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-purple/40" />
                <button 
                  onClick={() => setContactOpen(true)}
                  className="hover:text-purple/40 transition-colors cursor-pointer"
                >
                  info@despegatucarrera.com
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="h-4 w-4 text-green/40" />
                <a 
                  href="https://wa.me/56963160187?text=Hola%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20Despega%20Tu%20Carrera" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-green/40 transition-colors"
                >
                  +56 9 6316 0187
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-purple/40" />
                <span>Santiago, Chile</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/company/despegatucarrera"
                aria-label="LinkedIn"
                className="w-10 h-10 bg-gray-800 hover:bg-purple rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/despegatucarrera"
                aria-label="Twitter"
                className="w-10 h-10 bg-gray-800 hover:bg-purple rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/despegatucarrera"
                aria-label="Facebook"
                className="w-10 h-10 bg-gray-800 hover:bg-purple rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/despegatucarrera"
                aria-label="Instagram"
                className="w-10 h-10 bg-gray-800 hover:bg-purple rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@despegatucarrera"
                aria-label="YouTube"
                className="w-10 h-10 bg-gray-800 hover:bg-purple rounded-lg flex items-center justify-center transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Tests Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Tests Psicométricos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/test/disc" className="hover:text-purple/40 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple/40 rounded-full"></span>
                  Despega Cerebral™
                </Link>
              </li>
              <li>
                <Link href="/test/mbti" className="hover:text-purple/40 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple/40 rounded-full"></span>
                  Mapa de Personalidad
                </Link>
              </li>
              <li>
                <Link href="/test/big-five" className="hover:text-purple/40 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple/40 rounded-full"></span>5 Dimensiones
                </Link>
              </li>
              <li>
                <Link href="/test/riasec" className="hover:text-purple/40 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple/40 rounded-full"></span>
                  Brújula Vocacional
                </Link>
              </li>
              <li>
                <Link
                  href="/test/emotional-intelligence"
                  className="hover:text-purple/40 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-purple/40 rounded-full"></span>
                  Inteligencia Emocional
                </Link>
              </li>
              <li>
                <Link
                  href="/test/soft-skills"
                  className="hover:text-purple/40 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-purple/40 rounded-full"></span>
                  Competencias Profesionales
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Recursos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/biblioteca" className="hover:text-purple/40 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue/40 rounded-full"></span>
                  Biblioteca
                </Link>
              </li>
              <li>
                <Link href="/cerebro" className="hover:text-purple/40 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue/40 rounded-full"></span>
                  Coach con IA
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-purple/40 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue/40 rounded-full"></span>
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-purple/40 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan/40 rounded-full"></span>
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-purple/40 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan/40 rounded-full"></span>
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => setContactOpen(true)}
                  className="hover:text-purple/40 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 bg-cyan/40 rounded-full"></span>
                  Contacto
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[rgb(80,160,170)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Despega Tu Carrera. Todos los derechos reservados.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green/50 rounded-full animate-pulse"></span>
                Sistema Operativo
              </span>
              <span>
                powered IA first by{" "}
                <a
                  href="https://www.n3uralia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple/40 hover:text-purple/30 transition-colors font-medium"
                >
                  n3uralia
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Despega Tu Carrera",
            url: "https://despegatucarrera.cl",
            logo: "https://despegatucarrera.cl/logo.png",
            description:
              "Plataforma en Chile para desarrollo profesional con tests psicométricos, recursos de aprendizaje y coaching con IA",
            contactPoint: {
              "@type": "ContactPoint",
              email: "info@despegatucarrera.com",
              telephone: "+56-9-6316-0187",
              contactType: "Customer Service",
              areaServed: "CL",
              availableLanguage: ["Spanish"],
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Santiago",
              addressCountry: "CL",
            },
            sameAs: [
              "https://www.linkedin.com/company/despegatucarrera",
              "https://twitter.com/despegatucarrera",
              "https://www.facebook.com/despegatucarrera",
              "https://www.instagram.com/despegatucarrera",
              "https://www.youtube.com/@despegatucarrera",
            ],
          }),
        }}
      />
      </footer>
    </>
  )
}

export default LLMOOptimizedFooter
