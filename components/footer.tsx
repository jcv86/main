'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Mail, MessageCircle, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  // Contact information
  const contactEmail = 'info@despegatucarrera.com'
  const contactPhone = '56963160187'
  const whatsappUrl = `https://wa.me/${contactPhone}?text=Hola%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20Despega%20Tu%20Carrera`

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 mt-20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4">Despega Tu Carrera</h3>
            <p className="text-sm text-foreground/60">Tu siguiente versión empieza aquí. Transformación en 4 fases.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/despega/conozcamonos-1" className="text-foreground/60 hover:text-foreground transition">El Ritual</Link></li>
              <li><Link href="/despega/a2-routes" className="text-foreground/60 hover:text-foreground transition">Exploración</Link></li>
              <li><Link href="/despega/a3" className="text-foreground/60 hover:text-foreground transition">Entrenamiento</Link></li>
              <li><Link href="/despega/a4" className="text-foreground/60 hover:text-foreground transition">La Realidad</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-foreground/60 hover:text-foreground transition">Privacidad</Link></li>
              <li><Link href="/terms" className="text-foreground/60 hover:text-foreground transition">Términos</Link></li>
              <li><Link href="/contact" className="text-foreground/60 hover:text-foreground transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact & Community */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Contacto & Comunidad</h4>
            <ul className="space-y-3 text-sm">
              {/* Email */}
              <li>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="text-foreground/60 hover:text-foreground transition flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {contactEmail}
                </a>
              </li>
              {/* WhatsApp */}
              <li>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-foreground transition flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  +56 9 6316 0187
                </a>
              </li>
              {/* LinkedIn */}
              <li>
                <a 
                  href="https://linkedin.com/company/despega-tu-carrera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-foreground transition flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
              {/* Twitter */}
              <li>
                <a 
                  href="https://twitter.com/despegaturcarrera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-foreground transition flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
            <p>&copy; {currentYear} Despega Tu Carrera. Todos los derechos reservados.</p>
            <p>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
