'use client'

import fs from 'fs'
import path from 'path'

interface Document {
  name: string
  title: string
  description: string
  category: string
  date: string
}

export default function DocumentsPage() {
  // Documentos principales que se mostrarán primero
  const mainDocuments: Document[] = [
    {
      name: 'INFO.md',
      title: 'Información Completa del Proyecto',
      description: 'Visión general, pilares, stack técnico y status',
      category: 'General',
      date: '22 de Mayo 2026'
    },
    {
      name: 'RESUMEN_INVERSOR.md',
      title: 'Resumen Inversor - Presentación Ejecutiva',
      description: 'Executive summary para CORFO, StartUp Chile e inversores',
      category: 'Ejecutivo',
      date: '22 de Mayo 2026'
    },
    {
      name: 'LEEME.md',
      title: 'Introducción General',
      description: 'Descripción general del proyecto y estructura',
      category: 'General',
      date: '22 de Mayo 2026'
    },
    {
      name: 'ARQUITECTURA_TECNICA.md',
      title: 'Arquitectura Técnica',
      description: 'Stack, diseño del sistema, seguridad y escalabilidad',
      category: 'Técnico',
      date: '22 de Mayo 2026'
    },
    {
      name: 'LEEME_TECNICO.md',
      title: 'Guía Técnica Completa',
      description: 'Setup, instalación, configuración y dependencias',
      category: 'Técnico',
      date: '22 de Mayo 2026'
    },
    {
      name: 'LISTA_PROGRESO_MVP.md',
      title: 'Lista de Progreso MVP',
      description: 'Status 100%, completitud por módulo y features',
      category: 'Progreso',
      date: '22 de Mayo 2026'
    },
    {
      name: 'ESTADO_GIT_Y_DEPLOY.md',
      title: 'Estado de Git y Deploy',
      description: '3,020+ commits, deployment info y performance',
      category: 'DevOps',
      date: '22 de Mayo 2026'
    },
    {
      name: 'DESCARGA_Y_USO.md',
      title: 'Descarga y Uso',
      description: 'Instrucciones paso a paso para setup',
      category: 'Primeros Pasos',
      date: '22 de Mayo 2026'
    },
    {
      name: 'DOCUMENTACION_COMPLETA_2026-05-22.md',
      title: 'Documentación Completa',
      description: 'Changelog completo de mayo y todas las actualizaciones',
      category: 'Referencia',
      date: '22 de Mayo 2026'
    },
    {
      name: 'AUDIT_EXECUTIVE_SUMMARY.md',
      title: 'Resumen de Auditoría',
      description: 'Resumen ejecutivo de auditoría y validación',
      category: 'Auditoría',
      date: '22 de Mayo 2026'
    },
    {
      name: 'A4_TECHNICAL_VALIDATION.md',
      title: 'Validación Técnica A4',
      description: 'Dashboard IA Coach y módulos funcionales',
      category: 'Validación',
      date: '22 de Mayo 2026'
    },
    {
      name: 'DEPLOYMENT_READINESS.md',
      title: 'Readiness para Producción',
      description: 'Pre-deployment checklist y pipeline',
      category: 'DevOps',
      date: '22 de Mayo 2026'
    }
  ]

  const getBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'General': 'bg-blue-100 text-blue-700',
      'Ejecutivo': 'bg-green-100 text-green-700',
      'Técnico': 'bg-orange-100 text-orange-700',
      'Progreso': 'bg-purple-100 text-purple-700',
      'DevOps': 'bg-red-100 text-red-700',
      'Primeros Pasos': 'bg-indigo-100 text-indigo-700',
      'Referencia': 'bg-cyan-100 text-cyan-700',
      'Auditoría': 'bg-yellow-100 text-yellow-700',
      'Validación': 'bg-pink-100 text-pink-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Centro de Descargas</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Paquete técnico completo para StartUp Chile, CORFO e inversores
          </p>
          <p className="text-sm text-muted-foreground">
            Fecha: 22 de Mayo 2026 | Status: 100% Production Ready | Versión: 6.0.0
          </p>
        </div>

        {/* Bundles TAR.GZ */}
        <div className="bg-card border-2 border-primary rounded-lg p-8 mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">📦 Paquetes Descargables Completos</h2>
              <p className="text-muted-foreground">
                Descarga todo el código, documentación y configuración
              </p>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              ACTUAL - 22 Mayo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bundle 1 */}
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="font-bold text-sm mb-2">Paquete Técnico Completo</p>
              <p className="text-xs text-muted-foreground mb-3">Código + documentación</p>
              <a
                href="/api/documentos/download?file=DTC_Tech_Evidence_Pack_2026-05-22.tar.gz"
                className="block w-full bg-primary text-primary-foreground text-sm font-semibold py-2 px-3 rounded text-center hover:bg-primary/90 transition"
              >
                📥 Descargar (2.7 MB)
              </a>
            </div>

            {/* Bundle 2 */}
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="font-bold text-sm mb-2">Solo Documentación</p>
              <p className="text-xs text-muted-foreground mb-3">15+ docs en español</p>
              <a
                href="/api/documentos/download?file=Paquete_Documentacion_Completo_2026-05-22.tar.gz"
                className="block w-full bg-primary text-primary-foreground text-sm font-semibold py-2 px-3 rounded text-center hover:bg-primary/90 transition"
              >
                📥 Descargar (781 KB)
              </a>
            </div>

            {/* Bundle 3 */}
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="font-bold text-sm mb-2">Referencia Inglés</p>
              <p className="text-xs text-muted-foreground mb-3">Documentos en English</p>
              <a
                href="/api/documentos/download?file=Complete_Documentation_Bundle_2026-05-22.tar.gz"
                className="block w-full bg-primary text-primary-foreground text-sm font-semibold py-2 px-3 rounded text-center hover:bg-primary/90 transition"
              >
                📥 Descargar (781 KB)
              </a>
            </div>
          </div>
        </div>

        {/* Main Documents */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">📄 Documentos Principales (Descarga Individual)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainDocuments.map((doc) => (
              <div key={doc.name} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{doc.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ml-2 whitespace-nowrap ${getBadgeColor(doc.category)}`}>
                    {doc.category}
                  </span>
                </div>
                
                <div className="flex gap-3 mt-4 flex-wrap">
                  <a
                    href={`/api/documentos/download?file=${doc.name}`}
                    download
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    📥 Markdown
                  </a>
                  
                  {/* HTML version if exists */}
                  {doc.name.endsWith('.md') && (
                    <>
                      <span className="text-muted-foreground">|</span>
                      <a
                        href={`/api/documentos/download?file=${doc.name.replace('.md', '.html')}`}
                        download
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        🌐 HTML (PDF)
                      </a>
                    </>
                  )}

                  {/* View in browser */}
                  <span className="text-muted-foreground">|</span>
                  <a
                    href={`/documentos/${doc.name.replace('.md', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    👁️ Ver online
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Available Documents */}
        <div className="mb-12 bg-muted p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">📚 Todos los Documentos Disponibles</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Se encuentran disponibles <strong>297+ documentos en Markdown</strong> y <strong>7+ documentos en HTML</strong>, incluyendo:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <li>✓ Documentación técnica completa</li>
            <li>✓ Reportes de auditoría</li>
            <li>✓ Especificaciones de módulos</li>
            <li>✓ Guías de implementación</li>
            <li>✓ Changelog y versioning</li>
            <li>✓ Configuración y setup</li>
            <li>✓ Validaciones y testing</li>
            <li>✓ Deployment readiness</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4">
            Todos los documentos están en español y actualizados al 22 de mayo 2026.
            Accesibles públicamente en /documentos sin autenticación.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-muted p-8 rounded-lg mb-12">
          <h3 className="text-xl font-bold mb-4">🚀 Inicio Rápido (3 pasos)</h3>
          <div className="space-y-4 font-mono text-sm">
            <div>
              <p className="text-muted-foreground mb-2">1. Extrae el paquete:</p>
              <pre className="bg-background p-3 rounded overflow-x-auto">tar -xzf DTC_Tech_Evidence_Pack_2026-05-22.tar.gz</pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">2. Instala dependencias:</p>
              <pre className="bg-background p-3 rounded overflow-x-auto">cd DTC_Tech_Evidence_Pack_2026-05-22 && pnpm install</pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">3. Ejecuta el servidor:</p>
              <pre className="bg-background p-3 rounded overflow-x-auto">cp .env.ejemplo .env.local && pnpm dev</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
          <p className="font-semibold mb-2">Centro de Descargas - 22 de Mayo 2026</p>
          <p>Paquete técnico completo | MVP: 100% Production Ready | Go-Live: 23 Mayo Aprobado</p>
          <p className="mt-4">Todos los documentos están en español | Acceso público sin autenticación</p>
        </div>
      </div>
    </div>
  )
}
