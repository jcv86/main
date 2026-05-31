"use client"

import Link from "next/link"
import { ArrowRight, Users, TrendingUp, Briefcase, BarChart3, CheckCircle2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ParaEmpresasPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-purple/10">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <Link href="/" className="text-purple/40 hover:text-purple/30 transition-colors text-sm font-medium mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-3">Para Empresas</h1>
            <p className="text-xl text-purple/40 max-w-2xl">Desarrolla el talento de tu equipo. Implementa desarrollo profesional a escala con nuestra plataforma B2B.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* The Problem */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-4">El Desafío</h2>
          <p className="text-purple/60 mb-8 text-lg">
            Las empresas modernas enfrentan un dilema: retener talento sin invertir significativamente en desarrollo profesional, o gastar fortunas en soluciones fragmentadas que no producen resultados medibles.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                title: "Rotación de Talento",
                desc: "30-50% de rotación anual en empleados clave por falta de crecimiento",
              },
              {
                icon: "💰",
                title: "Costos Prohibitivos",
                desc: "Soluciones de coaching corporativo cuestan $200-500 por empleado/mes",
              },
              {
                icon: "🎯",
                title: "Sin ROI Claro",
                desc: "Difícil medir el impacto en productividad y retención",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-purple/5 border border-purple/10 rounded-lg p-6">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-purple/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Solution */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-4">Nuestra Solución</h2>
          <p className="text-purple/60 mb-8 text-lg">
            Despega Tu Carrera Enterprise transforma el desarrollo de tu equipo en una inversión rentable, medible y escalable.
          </p>
          <div className="bg-gradient-to-r from-cyan/10 to-purple/10 border border-cyan/20 rounded-xl p-12">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Escalable",
                  desc: "De 10 a 10,000 empleados en la misma plataforma",
                },
                {
                  icon: TrendingUp,
                  title: "Medible",
                  desc: "Dashboards de progreso, retención y ROI en tiempo real",
                },
                {
                  icon: BarChart3,
                  title: "Eficiente",
                  desc: "$20-50 por empleado/mes vs $200+ de coaching tradicional",
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <Icon className="w-12 h-12 text-cyan mb-4" />
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-purple/60 text-sm">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Qué Incluye</h2>
          <div className="space-y-4">
            {[
              {
                title: "Plataforma Completa",
                items: [
                  "6 evaluaciones psicométricas validadas",
                  "120+ recursos profesionales",
                  "Sistema de coaching IA",
                  "Biblioteca de entrenamientos",
                ],
              },
              {
                title: "Administración Corporativa",
                items: [
                  "Gestión de equipos y departamentos",
                  "Asignación masiva de programas",
                  "Seguimiento de progreso por empleado",
                  "Reportes exportables",
                ],
              },
              {
                title: "Integraciones",
                items: [
                  "Integración con sistemas HR (ADP, SAP SuccessFactors)",
                  "SSO/SAML para autenticación",
                  "API para datos personalizados",
                  "White-label options",
                ],
              },
            ].map((section, idx) => (
              <div key={idx} className="bg-purple/5 border border-purple/10 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan rounded-full"></span>
                  {section.title}
                </h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-purple/60">
                      <CheckCircle2 className="w-4 h-4 text-cyan flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Pilot Program */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Programa Piloto</h2>
          <p className="text-purple/60 mb-8 text-lg">
            Comienza con nuestro programa piloto de 4-8 semanas. Sin compromiso a largo plazo. Prueba el valor real con tu equipo.
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Estructura del Piloto</h3>
              <div className="space-y-4">
                {[
                  { week: "Semana 1", title: "Setup & Onboarding", desc: "Configuración de cuenta, integración de usuarios" },
                  { week: "Semana 2-3", title: "Pruebas Psicométricas", desc: "Todos completan las 6 evaluaciones" },
                  { week: "Semana 4-6", title: "Entrenamiento", desc: "Módulos adaptativos y coaching IA" },
                  { week: "Semana 7-8", title: "Análisis & ROI", desc: "Medición de progreso y resultados" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-20 h-20 bg-cyan/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan/20">
                      <span className="text-xs font-mono text-cyan font-bold text-center">{item.week}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{item.title}</h4>
                      <p className="text-purple/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple/5 border border-purple/10 rounded-xl p-8 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-white font-bold mb-4">Lo que obtendrás</h4>
                <ul className="space-y-3 mb-8">
                  {[
                    "Acceso completo a la plataforma",
                    "Hasta 50 usuarios incluidos",
                    "Soporte dedicado",
                    "Reportes semanales",
                    "Sesión de feedback final",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-purple/60">
                      <CheckCircle2 className="w-4 h-4 text-cyan flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-background rounded-lg p-4 border border-cyan/10">
                <p className="text-sm text-purple/60 mb-2">Costo del Piloto</p>
                <p className="text-3xl font-bold text-white">$2,500</p>
                <p className="text-xs text-purple/60 mt-2">Válido para 8 semanas • No reembolsable si continúas con plan anual</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Planes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Startup",
                size: "10-50",
                price: "$2,000",
                period: "mes",
                features: [
                  "Hasta 50 usuarios",
                  "Todas las evaluaciones",
                  "Biblioteca completa",
                  "Dashboards básicos",
                  "Email support",
                ],
              },
              {
                name: "Growing",
                size: "50-500",
                price: "$5,000",
                period: "mes",
                highlighted: true,
                features: [
                  "Hasta 500 usuarios",
                  "Todas las evaluaciones",
                  "Biblioteca completa",
                  "Dashboards avanzados",
                  "Chat support 24/7",
                  "API access",
                ],
              },
              {
                name: "Enterprise",
                size: "500+",
                price: "Personalizado",
                period: "mes",
                features: [
                  "Usuarios ilimitados",
                  "Todas las features",
                  "Account manager dedicado",
                  "Soporte prioritario",
                  "White-label options",
                  "SLA garantizado",
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-8 border transition-all ${
                  plan.highlighted
                    ? "border-cyan/40 bg-cyan/5 ring-2 ring-cyan/20"
                    : "border-purple/10 bg-purple/5"
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-cyan text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MÁS POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-purple/40 text-sm mb-4">{plan.size} empleados</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-cyan">{plan.price}</span>
                  <span className="text-purple/60">/{plan.period}</span>
                </div>
                <Button
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? "bg-cyan hover:bg-cyan/90 text-black font-semibold"
                      : "border-purple/20 text-white hover:bg-purple/5"
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  Solicitar Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-purple/60 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-cyan flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Resultados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                metric: "+45%",
                label: "Reducción en rotación",
                desc: "Empresas con DTC muestran 45% menos rotación en primer año",
              },
              {
                metric: "78%",
                label: "Retención de talento",
                desc: "78% de empleados que completan el programa se quedan 2+ años",
              },
              {
                metric: "3:1",
                label: "ROI promedio",
                desc: "Cada $1 invertido en desarrollo retorna $3 en productividad",
              },
            ].map((stat, idx) => (
              <div key={idx} className="bg-purple/5 border border-purple/10 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-cyan mb-2">{stat.metric}</p>
                <h3 className="text-white font-bold mb-2">{stat.label}</h3>
                <p className="text-purple/60 text-sm">{stat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              {
                question: "¿Cómo se integra con nuestro sistema HR actual?",
                answer: "Soportamos integración con ADP, SAP SuccessFactors, Workday y otros via API. También ofrecemos SSO/SAML.",
              },
              {
                question: "¿Puedo personalizar los contenidos?",
                answer: "Sí. Los planes Enterprise incluyen white-label y personalización de contenidos según necesidad corporativa.",
              },
              {
                question: "¿Cuál es el tiempo de implementación?",
                answer: "Típicamente 2-3 semanas. Startup: 1 semana. Enterprise: personalizado.",
              },
              {
                question: "¿Incluye soporte en español?",
                answer: "Sí. Todos los planes incluyen soporte en español via chat, email y videollamada.",
              },
              {
                question: "¿Qué datos recopilan sobre nuestros empleados?",
                answer: "GDPR compliant. Solo recopilamos datos necesarios para el desarrollo. Anonimizamos para reportes agregados.",
              },
              {
                question: "¿Puedo cancelar en cualquier momento?",
                answer: "Planes anuales tienen cancelación con 30 días de aviso. Pilotos no tienen cargos si no continúas.",
              },
            ].map((faq, idx) => (
              <details key={idx} className="group bg-purple/5 border border-purple/10 rounded-lg p-4 hover:border-cyan/30 transition-colors cursor-pointer">
                <summary className="flex items-center justify-between text-white font-semibold group-open:text-cyan transition-colors">
                  {faq.question}
                  <span className="text-purple/40 group-open:text-cyan">+</span>
                </summary>
                <p className="text-purple/60 mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan/10 to-purple/10 border border-cyan/20 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Comienza tu Piloto Hoy</h2>
          <p className="text-purple/60 mb-8 max-w-2xl mx-auto">
            Prueba cómo Despega Tu Carrera transforma el desarrollo de tu equipo sin compromiso a largo plazo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-cyan hover:bg-cyan/90 text-black font-semibold">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-purple/20 text-white hover:bg-purple/5">
              Descargar Caso de Estudio
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
