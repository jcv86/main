"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, TrendingUp, Shield, Zap, Calendar } from "lucide-react"

export function ExecutiveSummary() {
  return (
    <div className="space-y-6">
      {/* Qué es */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            ¿Qué es DespegarTuCarrera?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Ecosistema IA (Sofia/Dani) + RAG + Contenido local (Chile) + QA continuo</p>
        </CardContent>
      </Card>

      {/* Para quién */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            ¿Para quién?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-lg">
              <strong>B2C:</strong> Estudiantes, egresados y profesionales jóvenes (20-35 años)
            </p>
            <p className="text-lg">
              <strong>B2B:</strong> Universidades y empresas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Por qué */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            ¿Por qué?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Brecha de orientación profesional en Latinoamérica</li>
            <li>IA personalizada según perfil y etapa</li>
            <li>Guías/FAQ profundizadas con contenido local</li>
            <li>KPIs medibles y mejora continua</li>
            <li>Métrica bimestral de prompts</li>
          </ul>
        </CardContent>
      </Card>

      {/* Resultados 2025 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resultados Objetivo 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple">4.7★</div>
              <div className="text-sm text-muted-foreground">Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple">68%</div>
              <div className="text-sm text-muted-foreground">Acción Completada</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple">72%</div>
              <div className="text-sm text-muted-foreground">Retención 30d</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple">20k</div>
              <div className="text-sm text-muted-foreground">MAU</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              8 Clientes B2B
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad & Ley 19.628 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad & Ley 19.628 (Chile)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Consentimiento granular del usuario</li>
            <li>Retención de datos definida y auditable</li>
            <li>DSAR (Data Subject Access Request) ≤ 10 días hábiles</li>
            <li>Cifrado en tránsito y en reposo</li>
            <li>Auditorías trimestrales de seguridad</li>
          </ul>
        </CardContent>
      </Card>

      {/* Arquitectura */}
      <Card>
        <CardHeader>
          <CardTitle>Arquitectura Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Frontend:</strong> Next.js (React) + Vercel
            </p>
            <p>
              <strong>Backend:</strong> API Routes + Supabase (PostgreSQL)
            </p>
            <p>
              <strong>IA:</strong> OpenAI GPT-4 + RAG (Vector DB)
            </p>
            <p>
              <strong>Storage:</strong> Vercel Blob + Supabase Storage
            </p>
            <p>
              <strong>Monitoring:</strong> Vercel Analytics + Custom Dashboards
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap 2025-2026 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Roadmap 2025-2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Expansión de contenidos (50+ guías profesionales)</li>
            <li>Blueprint adaptativo (personalización avanzada)</li>
            <li>Expansión LATAM: 50k+ usuarios en Perú, Colombia, México</li>
            <li>Alianzas universitarias (10+ instituciones)</li>
            <li>Módulos B2B avanzados (analytics grupales, reportes institucionales)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
