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

  const renderCreativeFormat = () => (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-12 text-slate-900 dark:text-white space-y-6">
      {/* Header with gradient accent */}
      <div className="border-l-4 border-purple-600 pl-6">
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple to-blue-600">{cvData.personalInfo.name}</h1>
        <p className="text-xl font-bold text-purple dark:text-purple-400 mt-1">{cvData.personalInfo.title}</p>
        <div className="flex gap-4 text-sm mt-2 flex-wrap">
          <span>{cvData.personalInfo.email}</span>
          <span>•</span>
          <span>{cvData.personalInfo.phone}</span>
          <span>•</span>
          <span>{cvData.personalInfo.location}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-slate-700 rounded-[28px] p-6 border-l-4 border-purple-600">
        <h2 className="text-sm font-bold text-purple dark:text-purple-400 uppercase tracking-wide mb-2">Resumen Profesional</h2>
        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{cvData.personalInfo.summary}</p>
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Experiencia</h2>
        <div className="space-y-4">
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="bg-white dark:bg-slate-700 rounded-[28px] p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-lg text-slate-900 dark:text-white">{exp.position}</p>
                  <p className="text-blue dark:text-blue-400 font-semibold">{exp.company}</p>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 px-3 py-1 rounded">{exp.duration}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill) => (
                  <span key={skill} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-700 rounded-[28px] p-6">
          <h3 className="text-sm font-bold text-purple dark:text-purple-400 uppercase tracking-wide mb-4">Educación</h3>
          <div className="space-y-3">
            {cvData.education.map((edu, idx) => (
              <div key={idx}>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{edu.degree}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{edu.school}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-700 rounded-[28px] p-6">
          <h3 className="text-sm font-bold text-purple dark:text-purple-400 uppercase tracking-wide mb-4">Certificaciones</h3>
          <div className="space-y-3">
            {cvData.certifications.map((cert, idx) => (
              <div key={idx}>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{cert.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{cert.issuer} • {cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Cloud */}
      <div className="bg-white dark:bg-slate-700 rounded-[28px] p-6">
        <h3 className="text-sm font-bold text-purple dark:text-purple-400 uppercase tracking-wide mb-4">Competencias Técnicas</h3>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <span key={skill} className="bg-gradient-to-r from-purple-500 to-blue text-white px-4 py-2 rounded-[20px] text-sm font-medium">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  )

  const renderModernFormat = () => (
    <div className="bg-white dark:bg-slate-900 p-10 text-slate-900 dark:text-white space-y-8">
      {/* Header */}
      <div className="flex gap-6 items-start">
        <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-purple to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
          {cvData.personalInfo.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-4xl font-bold">{cvData.personalInfo.name}</h1>
          <p className="text-2xl text-purple dark:text-purple-400 font-semibold">{cvData.personalInfo.title}</p>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{cvData.personalInfo.email} • {cvData.personalInfo.phone}</p>
          <p className="text-slate-600 dark:text-slate-400">{cvData.personalInfo.location}</p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-[28px] p-6 border-l-4 border-purple-600">
        <p className="text-slate-800 dark:text-slate-100 leading-relaxed">{cvData.personalInfo.summary}</p>
      </div>

      {/* Timeline Experience */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Trayectoria Profesional</h2>
        <div className="space-y-6">
          {cvData.experience.map((exp, idx) => (
            <div key={exp.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-[20px] bg-purple-600 mt-1"></div>
                {idx < cvData.experience.length - 1 && <div className="w-0.5 h-20 bg-purple-200 dark:bg-purple-900 my-2"></div>}
              </div>
              <div className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{exp.position}</p>
                    <p className="text-purple dark:text-purple-400 font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{exp.duration}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mt-2 text-sm">{exp.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three Column Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Education */}
        <div>
          <h3 className="text-lg font-bold mb-4">Formación</h3>
          <div className="space-y-3">
            {cvData.education.map((edu, idx) => (
              <div key={idx}>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">{edu.degree}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{edu.school}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-bold mb-4">Competencias</h3>
          <div className="flex flex-wrap gap-1">
            {cvData.skills.map((skill) => (
              <span key={skill} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">{skill}</span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-lg font-bold mb-4">Certificaciones</h3>
          <div className="space-y-3">
            {cvData.certifications.map((cert, idx) => (
              <div key={idx}>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">{cert.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{cert.issuer} • {cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderLinkedInFormat = () => (
    <div className="bg-white dark:bg-slate-900 p-8 text-slate-900 dark:text-white space-y-6">
      {/* LinkedIn Header */}
      <div className="bg-gradient-to-r from-blue to-blue-700 text-white p-8 rounded-[28px] -mx-8 -mt-8 mb-4">
        <h1 className="text-3xl font-bold">{cvData.personalInfo.name}</h1>
        <p className="text-lg mt-1">{cvData.personalInfo.title}</p>
        <p className="text-blue-100 mt-2">{cvData.personalInfo.location}</p>
      </div>

      {/* Contact Info */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-[28px]">
        <h3 className="font-bold text-blue dark:text-blue-400 mb-2">Información de Contacto</h3>
        <p className="text-sm">📧 {cvData.personalInfo.email}</p>
        <p className="text-sm">📱 {cvData.personalInfo.phone}</p>
        <p className="text-sm">📍 {cvData.personalInfo.location}</p>
      </div>

      {/* About */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Acerca de mí</h3>
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{cvData.personalInfo.summary}</p>
      </div>

      {/* Experience */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Experiencia Laboral</h3>
        <div className="space-y-4">
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="border-l-4 border-blue pl-4">
              <p className="font-bold text-slate-900 dark:text-white">{exp.position}</p>
              <p className="text-blue dark:text-blue-400 text-sm font-semibold">{exp.company}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{exp.duration}</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm mt-2">{exp.description}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Competencias: {exp.skills.join(' • ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Educación</h3>
        <div className="space-y-3">
          {cvData.education.map((edu, idx) => (
            <div key={idx} className="border-l-4 border-slate-300 dark:border-slate-600 pl-4">
              <p className="font-bold text-slate-900 dark:text-white text-sm">{edu.degree}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{edu.school}</p>
              <p className="text-slate-500 dark:text-slate-500 text-xs">{edu.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Competencias</h3>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <span key={skill} className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Certificaciones</h3>
        <div className="space-y-2">
          {cvData.certifications.map((cert, idx) => (
            <div key={idx} className="text-sm">
              <p className="font-semibold text-slate-900 dark:text-white">🏆 {cert.name}</p>
              <p className="text-slate-600 dark:text-slate-400 text-xs">{cert.issuer} • {cert.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderExecutiveFormat = () => (
    <div className="bg-white dark:bg-slate-900 p-10 text-slate-900 dark:text-white space-y-6">
      {/* Minimal Header */}
      <div className="border-b-2 border-slate-300 dark:border-slate-700 pb-6">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{cvData.personalInfo.location}</p>
        <h1 className="text-4xl font-bold mt-2">{cvData.personalInfo.name}</h1>
        <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-1">{cvData.personalInfo.title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{cvData.personalInfo.email} | {cvData.personalInfo.phone}</p>
      </div>

      {/* Executive Summary */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Propuesta de Valor</h2>
        <p className="text-slate-800 dark:text-slate-100 leading-relaxed text-sm">{cvData.personalInfo.summary}</p>
      </div>

      {/* Key Achievements */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Logros Principales</h2>
        <ul className="space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">• Liderazgo en arquitectura de infraestructura con mejora de performance del 40%</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">• Escalado de aplicación de 100K a 10M usuarios con 99.9% uptime</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">• Mentoría de 5+ desarrolladores junior con promoción a senior</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">• Implementación de CI/CD pipeline reduciendo deployment time 70%</li>
        </ul>
      </div>

      {/* Experience - Simplified */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Experiencia Profesional</h2>
        {cvData.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{exp.position}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{exp.company}</p>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{exp.duration}</p>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm mt-2">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Skills Matrix */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">Backend</h3>
          <p className="text-slate-700 dark:text-slate-300 text-sm">Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, Kubernetes</p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">Frontend</h3>
          <p className="text-slate-700 dark:text-slate-300 text-sm">React, GraphQL, REST APIs, TypeScript, JavaScript</p>
        </div>
      </div>

      {/* Education & Certs */}
      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-300 dark:border-slate-700">
        <div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Educación</h3>
          {cvData.education.map((edu, idx) => (
            <p key={idx} className="text-sm text-slate-700 dark:text-slate-300">{edu.degree}</p>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Certificaciones</h3>
          {cvData.certifications.map((cert, idx) => (
            <p key={idx} className="text-sm text-slate-700 dark:text-slate-300">{cert.name}</p>
          ))}
        </div>
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
            <span key={skill} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-[20px] text-sm">
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
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setFormat('ats')}
            variant={format === 'ats' ? 'default' : 'outline'}
            className={format === 'ats' ? 'bg-primary' : ''}
          >
            Formato ATS
          </Button>
          <Button
            onClick={() => setFormat('standard')}
            variant={format === 'standard' ? 'default' : 'outline'}
            className={format === 'standard' ? 'bg-primary' : ''}
          >
            Estándar
          </Button>
          <Button
            onClick={() => setFormat('creative')}
            variant={format === 'creative' ? 'default' : 'outline'}
            className={format === 'creative' ? 'bg-primary' : ''}
          >
            Creativo
          </Button>
          <Button
            onClick={() => setFormat('modern')}
            variant={format === 'modern' ? 'default' : 'outline'}
            className={format === 'modern' ? 'bg-primary' : ''}
          >
            Moderno
          </Button>
          <Button
            onClick={() => setFormat('linkedin')}
            variant={format === 'linkedin' ? 'default' : 'outline'}
            className={format === 'linkedin' ? 'bg-primary' : ''}
          >
            LinkedIn
          </Button>
          <Button
            onClick={() => setFormat('executive')}
            variant={format === 'executive' ? 'default' : 'outline'}
            className={format === 'executive' ? 'bg-primary' : ''}
          >
            Ejecutivo
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
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-[28px]">
                {format === 'ats' && renderATSFormat()}
                {format === 'standard' && renderStandardFormat()}
                {format === 'creative' && renderCreativeFormat()}
                {format === 'modern' && renderModernFormat()}
                {format === 'linkedin' && renderLinkedInFormat()}
                {format === 'executive' && renderExecutiveFormat()}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Button className="bg-primary hover:bg-primary/90">
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

        {/* Info Card - Dynamic based on format */}
        {format === 'ats' && (
          <Card className="bg-blue/5 dark:bg-blue-900/20 border-blue/30 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-base">📋 Formato ATS (Optimizado)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <p>Optimizado para pasar filtros de sistemas ATS. Ideal para grandes empresas con procesos automatizados.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Formato monoespaciado limpio</li>
                <li>Sin gráficos ni elementos visuales</li>
                <li>Keywords de industria destacadas</li>
                <li>Estructura predecible</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {format === 'standard' && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-base">✨ Formato Estándar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <p>Formato profesional tradicional con buen balance entre diseño y legibilidad.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Estructura clara y profesional</li>
                <li>Fácil de leer y escanear</li>
                <li>Compatible con impresoras</li>
                <li>Perfecto para envíos por email</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {format === 'creative' && (
          <Card className="bg-purple/5 dark:bg-purple-900/20 border-purple/30 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-base">🎨 Formato Creativo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <p>Diseño moderno y atractivo. Perfecto para industrias creativas, startups y posiciones innovadoras.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Diseño visual atractivo</li>
                <li>Colores y gradientes</li>
                <li>Ideal para roles creativos</li>
                <li>Destaca la personalidad</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {format === 'modern' && (
          <Card className="bg-yellow/5 dark:bg-amber-900/20 border-yellow/30 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-base">⚡ Formato Moderno</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <p>Diseño contemporáneo con timeline visual. Perfecto para tech companies y roles dinámicos.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Timeline visual de experiencia</li>
                <li>Avatar personalizado</li>
                <li>Layout minimalista</li>
                <li>Muy impactante en digital</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {format === 'linkedin' && (
          <Card className="bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800">
            <CardHeader>
              <CardTitle className="text-base">💼 Formato LinkedIn</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <p>Optimizado para compartir como documento PDF en LinkedIn. Mantiene el look profesional de LinkedIn.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Header con color LinkedIn blue</li>
                <li>Estructura de LinkedIn adoptada</li>
                <li>Emojis profesionales</li>
                <li>Perfecto para descargar y compartir</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {format === 'executive' && (
          <Card className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">👔 Formato Ejecutivo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <p>Minimalista y sofisticado. Ideal para posiciones de liderazgo y directivas en empresas grandes.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Diseño minimalista sofisticado</li>
                <li>Énfasis en logros y resultados</li>
                <li>Muy profesional y serio</li>
                <li>Perfecto para C-suite</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
