'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, Download, Copy, Eye, Edit2 } from 'lucide-react'

export default function CVATSPage() {
  const [view, setView] = useState('preview')
  const [format, setFormat] = useState('ats')

  // Sample CV data - en producción vendría de la base de datos
  const cvData = {
    personalInfo: {
      name: 'Juan Pérez García',
      email: 'juan@example.com',
      phone: '+34 912 345 678',
      location: 'Madrid, España',
      title: 'Senior Software Engineer',
      summary: 'Ingeniero de software con 7 años de experiencia en desarrollo full-stack, especializado en arquitectura de microservicios y liderazgo técnico. Demostrado éxito en transformación digital y gestión de equipos multidisciplinarios.'
    },
    experience: [
      {
        id: 1,
        position: 'Tech Lead - Backend Architecture',
        company: 'TechCorp Spain',
        duration: '2022 - Present',
        description: 'Liderazgo arquitectónico de infraestructura cloud, mejora de performance 40%, mentoreo de 5 desarrolladores junior',
        skills: ['AWS', 'Kubernetes', 'Node.js', 'Microservicios']
      },
      {
        id: 2,
        position: 'Senior Software Engineer',
        company: 'StartupXYZ',
        duration: '2019 - 2022',
        description: 'Desarrollo full-stack, escalado de aplicación de 100k a 10M usuarios, implementación de CI/CD pipeline',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Docker']
      }
    ],
    education: [
      { degree: 'Máster en Ingeniería Informática', school: 'Universidad Autónoma de Madrid', year: '2019' },
      { degree: 'Grado en Ingeniería Técnica en Informática', school: 'Universidad Politécnica de Madrid', year: '2017' }
    ],
    skills: ['JavaScript', 'Python', 'AWS', 'Docker', 'Kubernetes', 'React', 'Node.js', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs', 'Liderazgo Técnico'],
    certifications: [
      { name: 'AWS Solutions Architect Associate', issuer: 'Amazon', year: '2023' },
      { name: 'Kubernetes Application Developer', issuer: 'Linux Foundation', year: '2022' }
    ]
  }

  const renderATSFormat = () => (
    <div className="bg-white dark:bg-slate-900 p-8 text-black dark:text-white font-mono text-sm space-y-4">
      <div>
        <p className="font-bold text-lg">{cvData.personalInfo.name}</p>
        <p>{cvData.personalInfo.title}</p>
        <p>{cvData.personalInfo.email} | {cvData.personalInfo.phone} | {cvData.personalInfo.location}</p>
      </div>

      <div>
        <p className="font-bold">PROFESSIONAL SUMMARY</p>
        <p>{cvData.personalInfo.summary}</p>
      </div>

      <div>
        <p className="font-bold">EXPERIENCE</p>
        {cvData.experience.map((exp) => (
          <div key={exp.id} className="mt-2">
            <p className="font-bold">{exp.position} | {exp.company}</p>
            <p>{exp.duration}</p>
            <p>{exp.description}</p>
            <p>Skills: {exp.skills.join(', ')}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="font-bold">EDUCATION</p>
        {cvData.education.map((edu, idx) => (
          <p key={idx}>{edu.degree} - {edu.school} ({edu.year})</p>
        ))}
      </div>

      <div>
        <p className="font-bold">TECHNICAL SKILLS</p>
        <p>{cvData.skills.join(', ')}</p>
      </div>

      <div>
        <p className="font-bold">CERTIFICATIONS</p>
        {cvData.certifications.map((cert, idx) => (
          <p key={idx}>{cert.name} - {cert.issuer} ({cert.year})</p>
        ))}
      </div>
    </div>
  )

  const renderStandardFormat = () => (
    <div className="space-y-8 bg-white dark:bg-slate-900 p-8 text-slate-900 dark:text-white">
      <div className="border-b-2 border-slate-300 dark:border-slate-700 pb-4">
        <h1 className="text-3xl font-bold">{cvData.personalInfo.name}</h1>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">{cvData.personalInfo.title}</p>
        <p className="text-sm">{cvData.personalInfo.email} • {cvData.personalInfo.phone} • {cvData.personalInfo.location}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Professional Summary</h2>
        <p className="text-slate-700 dark:text-slate-300">{cvData.personalInfo.summary}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Experience</h2>
        {cvData.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{exp.position}</p>
                <p className="text-slate-600 dark:text-slate-400">{exp.company}</p>
              </div>
              <p className="text-slate-600 dark:text-slate-400">{exp.duration}</p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{exp.description}</p>
            <p className="text-xs text-slate-500 mt-1">Skills: {exp.skills.join(', ')}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Education</h2>
        {cvData.education.map((edu, idx) => (
          <p key={idx} className="text-sm">
            <strong>{edu.degree}</strong> - {edu.school} ({edu.year})
          </p>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Technical Skills</h2>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <span key={skill} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Certifications</h2>
        {cvData.certifications.map((cert, idx) => (
          <p key={idx} className="text-sm">
            <strong>{cert.name}</strong> - {cert.issuer} ({cert.year})
          </p>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mi CV ATS</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Tu CV optimizado para sistemas de seguimiento de candidatos (ATS). Generado automáticamente desde tu perfil DTC.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex gap-2">
          <Button
            onClick={() => setFormat('ats')}
            variant={format === 'ats' ? 'default' : 'outline'}
            className={format === 'ats' ? 'bg-blue-600' : ''}
          >
            Formato ATS (Optimizado)
          </Button>
          <Button
            onClick={() => setFormat('standard')}
            variant={format === 'standard' ? 'default' : 'outline'}
            className={format === 'standard' ? 'bg-blue-600' : ''}
          >
            Formato Estándar (Hermoso)
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Vista Previa
            </TabsTrigger>
            <TabsTrigger value="edit">
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <Card className="overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                {format === 'ats' ? renderATS Format() : renderStandardFormat()}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Descargar DOCX
              </Button>
              <Button variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copiar a Portapapeles
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="edit">
            <Card className="p-6">
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>Edición avanzada del CV próximamente.</p>
                <p>Por ahora, tu CV se genera automáticamente desde:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Tus datos de A1 (DISC, Fortalezas)</li>
                  <li>Tu experiencia registrada</li>
                  <li>Tus habilidades documentadas</li>
                  <li>Tu educación y certificaciones</li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base">Optimización ATS</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
            <p>Tu CV está optimizado para pasar filtros ATS. Incluye:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keywords de industria</li>
              <li>Formato limpio sin gráficos</li>
              <li>Estructura predecible</li>
              <li>Verbos de acción comprobados</li>
              <li>Números cuantificables</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
