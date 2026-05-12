'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, Download, Copy, Eye, Edit2 } from 'lucide-react'
import { ModuleCompletionScreen } from '@/components/module-completion-screen'

export default function CVATSPage() {
  const [view, setView] = useState('preview')
  const [format, setFormat] = useState('ats')
  const [isCompleted, setIsCompleted] = useState(false)

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
    <div className="bg-white dark:bg-background p-8 text-black dark:text-white font-mono text-sm space-y-4">
      {/* Header */}
      <div className="bg-muted/5 dark:bg-muted/10 p-4 rounded-lg border-l-4 border-training">
        <p className="font-bold text-lg text-training">{cvData.personalInfo.name}</p>
        <p className="text-white/90">{cvData.personalInfo.title}</p>
        <p className="text-white/80 text-xs">{cvData.personalInfo.email} | {cvData.personalInfo.phone} | {cvData.personalInfo.location}</p>
      </div>

      {/* Professional Summary */}
      <div className="bg-muted/8 dark:bg-muted/20 p-4 rounded-lg">
        <p className="font-bold text-training uppercase text-xs tracking-wide mb-2">PROFESSIONAL SUMMARY</p>
        <p className="text-white/85 leading-relaxed">{cvData.personalInfo.summary}</p>
      </div>

      {/* Experience */}
      <div className="space-y-3">
        <p className="font-bold text-training uppercase text-xs tracking-wide">EXPERIENCE</p>
        {cvData.experience.map((exp) => (
          <div key={exp.id} className="bg-muted/8 dark:bg-muted/20 p-3 rounded-lg border-l-2 border-training/50">
            <p className="font-bold text-white">{exp.position} | <span className="text-training">{exp.company}</span></p>
            <p className="text-white/70 text-xs">{exp.duration}</p>
            <p className="text-white/80 mt-1">{exp.description}</p>
            <p className="text-training text-xs mt-1">Skills: {exp.skills.join(', ')}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="bg-muted/8 dark:bg-muted/20 p-4 rounded-lg">
        <p className="font-bold text-training uppercase text-xs tracking-wide mb-2">EDUCATION</p>
        {cvData.education.map((edu, idx) => (
          <p key={idx} className="text-white/85">{edu.degree} - {edu.school} ({edu.year})</p>
        ))}
      </div>

      {/* Technical Skills */}
      <div className="bg-muted/8 dark:bg-muted/20 p-4 rounded-lg">
        <p className="font-bold text-training uppercase text-xs tracking-wide mb-2">TECHNICAL SKILLS</p>
        <p className="text-white/85">{cvData.skills.join(', ')}</p>
      </div>

      {/* Certifications */}
      <div className="bg-muted/8 dark:bg-muted/20 p-4 rounded-lg">
        <p className="font-bold text-training uppercase text-xs tracking-wide mb-2">CERTIFICATIONS</p>
        {cvData.certifications.map((cert, idx) => (
          <p key={idx} className="text-white/85">{cert.name} - {cert.issuer} ({cert.year})</p>
        ))}
      </div>
    </div>
  )

  const renderCreativeFormat = () => (
    <div className="bg-background/80/90 p-12 text-muted/90 dark:text-white space-y-6">
      {/* Header with gradient accent */}
      <div className="border-l-4 border-training pl-6">
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-training">{cvData.personalInfo.name}</h1>
        <p className="text-xl font-bold text-training dark:text-training mt-1">{cvData.personalInfo.title}</p>
        <div className="flex gap-4 text-sm mt-2 flex-wrap">
          <span>{cvData.personalInfo.email}</span>
          <span>•</span>
          <span>{cvData.personalInfo.phone}</span>
          <span>•</span>
          <span>{cvData.personalInfo.location}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-muted/70 rounded-[28px] p-6 border-l-4 border-training">
        <h2 className="text-sm font-bold text-training dark:text-training uppercase tracking-wide mb-2">Resumen Profesional</h2>
        <p className="text-muted-foreground dark:text-white/80 leading-relaxed">{cvData.personalInfo.summary}</p>
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-muted/90 dark:text-white">Experiencia</h2>
        <div className="space-y-4">
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="bg-white dark:bg-muted/70 rounded-[28px] p-6 border-l-4 border-training/50 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-lg text-muted/90 dark:text-white">{exp.position}</p>
                  <p className="text-training dark:text-training font-semibold">{exp.company}</p>
                </div>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground bg-muted/10 dark:bg-muted/60 px-3 py-1 rounded">{exp.duration}</span>
              </div>
              <p className="text-muted-foreground dark:text-white/85 text-sm mb-3">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill) => (
                  <span key={skill} className="text-xs bg-training/10 dark:bg-training/30 text-training dark:text-training/20 px-2 py-1 rounded">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 dark:bg-muted/40 rounded-[28px] p-6">
          <h3 className="text-sm font-bold text-training dark:text-training uppercase tracking-wide mb-4">Educación</h3>
          <div className="space-y-3">
            {cvData.education.map((edu, idx) => (
              <div key={idx}>
                <p className="font-bold text-sm text-muted/90 dark:text-white">{edu.degree}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">{edu.school}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/30 dark:bg-muted/40 rounded-[28px] p-6">
          <h3 className="text-sm font-bold text-training dark:text-training uppercase tracking-wide mb-4">Certificaciones</h3>
          <div className="space-y-3">
            {cvData.certifications.map((cert, idx) => (
              <div key={idx}>
                <p className="font-bold text-sm text-muted/90 dark:text-white">{cert.name}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">{cert.issuer} • {cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Cloud */}
      <div className="bg-muted/30 dark:bg-muted/40 rounded-[28px] p-6">
        <h3 className="text-sm font-bold text-training dark:text-training uppercase tracking-wide mb-4">Competencias Técnicas</h3>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <span key={skill} className="bg-background">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  )

  const renderModernFormat = () => (
    <div className="bg-white dark:bg-background p-10 text-muted/90 dark:text-white space-y-8">
      {/* Header */}
      <div className="flex gap-6 items-start">
        <div className="w-20 h-20 rounded-[20px] bg-background">
          {cvData.personalInfo.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-4xl font-bold">{cvData.personalInfo.name}</h1>
          <p className="text-2xl text-training dark:text-training font-semibold">{cvData.personalInfo.title}</p>
          <p className="text-muted-foreground dark:text-muted-foreground mt-1">{cvData.personalInfo.email} • {cvData.personalInfo.phone}</p>
          <p className="text-muted-foreground dark:text-muted-foreground">{cvData.personalInfo.location}</p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-muted/30 dark:bg-muted/40 rounded-[28px] p-6 border-l-4 border-training">
        <h2 className="text-sm font-bold text-training uppercase mb-2">Resumen</h2>
        <p className="text-white/85 dark:text-white/85 leading-relaxed">{cvData.personalInfo.summary}</p>
      </div>

      {/* Timeline Experience */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Trayectoria Profesional</h2>
        <div className="space-y-6">
          {cvData.experience.map((exp, idx) => (
            <div key={exp.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-[20px] bg-training mt-1"></div>
                {idx < cvData.experience.length - 1 && <div className="w-0.5 h-20 bg-training/20 dark:bg-training my-2"></div>}
              </div>
              <div className="pb-4 bg-muted/30 dark:bg-muted/40 rounded-lg p-4 w-full">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-lg font-bold text-white">{exp.position}</p>
                    <p className="text-training dark:text-training font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-sm text-white/70 bg-training/20 px-2 py-1 rounded">{exp.duration}</span>
                </div>
                <p className="text-white/85 mt-2 text-sm">{exp.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-training/30 text-training px-2 py-1 rounded">{skill}</span>
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
                <p className="font-semibold text-sm text-muted/90 dark:text-white">{edu.degree}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">{edu.school}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-bold mb-4">Competencias</h3>
          <div className="flex flex-wrap gap-1">
            {cvData.skills.map((skill) => (
              <span key={skill} className="text-xs bg-muted/20 dark:bg-muted/70 text-secondary dark:text-white/80 px-2 py-1 rounded">{skill}</span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-lg font-bold mb-4">Certificaciones</h3>
          <div className="space-y-3">
            {cvData.certifications.map((cert, idx) => (
              <div key={idx}>
                <p className="font-semibold text-sm text-muted/90 dark:text-white">{cert.name}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">{cert.issuer} • {cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderLinkedInFormat = () => (
    <div className="bg-white dark:bg-background p-8 text-muted/90 dark:text-white space-y-6">
      {/* LinkedIn Header */}
      <div className="rounded-[20px] bg-training text-white p-8 rounded-[28px] -mx-8 -mt-8 mb-4">
        <h1 className="text-3xl font-bold">{cvData.personalInfo.name}</h1>
        <p className="text-lg mt-1">{cvData.personalInfo.title}</p>
        <p className="text-training/10 mt-2">{cvData.personalInfo.location}</p>
      </div>

      {/* Contact Info */}
      <div className="bg-muted/5 dark:bg-card p-4 rounded-[28px]">
        <h3 className="font-bold text-training dark:text-training mb-2">Información de Contacto</h3>
        <p className="text-sm">📧 {cvData.personalInfo.email}</p>
        <p className="text-sm"> {cvData.personalInfo.phone}</p>
        <p className="text-sm">📍 {cvData.personalInfo.location}</p>
      </div>

      {/* About */}
      <div>
        <h3 className="text-lg font-bold text-muted/90 dark:text-white mb-2">Acerca de mí</h3>
        <p className="text-muted-foreground dark:text-white/85 text-sm leading-relaxed">{cvData.personalInfo.summary}</p>
      </div>

      {/* Experience */}
      <div>
        <h3 className="text-lg font-bold text-muted/90 dark:text-white mb-3">Experiencia Laboral</h3>
        <div className="space-y-4">
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="border-l-4 border-training pl-4">
              <p className="font-bold text-muted/90 dark:text-white">{exp.position}</p>
              <p className="text-training dark:text-training text-sm font-semibold">{exp.company}</p>
              <p className="text-muted-foreground dark:text-muted-foreground text-sm">{exp.duration}</p>
              <p className="text-muted-foreground dark:text-white/85 text-sm mt-2">{exp.description}</p>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">
                Competencias: {exp.skills.join(' • ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-lg font-bold text-muted/90 dark:text-white mb-3">Educación</h3>
        <div className="space-y-3">
          {cvData.education.map((edu, idx) => (
            <div key={idx} className="border-l-4 border-muted/30 dark:border-muted/60 pl-4">
              <p className="font-bold text-muted/90 dark:text-white text-sm">{edu.degree}</p>
              <p className="text-muted-foreground dark:text-muted-foreground text-sm">{edu.school}</p>
              <p className="text-muted-foreground dark:text-muted-foreground text-xs">{edu.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-bold text-muted/90 dark:text-white mb-3">Competencias</h3>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <span key={skill} className="text-sm bg-training/10 dark:bg-training/30 text-training dark:text-training-200 px-3 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-lg font-bold text-muted/90 dark:text-white mb-3">Certificaciones</h3>
        <div className="space-y-2">
          {cvData.certifications.map((cert, idx) => (
            <div key={idx} className="text-sm">
              <p className="font-semibold text-muted/90 dark:text-white">🏆 {cert.name}</p>
              <p className="text-muted-foreground dark:text-muted-foreground text-xs">{cert.issuer} • {cert.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderExecutiveFormat = () => (
    <div className="bg-white dark:bg-background p-10 text-muted/90 dark:text-white space-y-6">
      {/* Minimal Header */}
      <div className="border-b-2 border-muted/30 dark:border-card pb-6">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{cvData.personalInfo.location}</p>
        <h1 className="text-4xl font-bold mt-2">{cvData.personalInfo.name}</h1>
        <p className="text-xl font-semibold text-muted-foreground dark:text-white/80 mt-1">{cvData.personalInfo.title}</p>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-3">{cvData.personalInfo.email} | {cvData.personalInfo.phone}</p>
      </div>

      {/* Executive Summary */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground dark:text-white/85 uppercase tracking-wider mb-3">Propuesta de Valor</h2>
        <p className="text-secondary dark:text-muted/10 leading-relaxed text-sm">{cvData.personalInfo.summary}</p>
      </div>

      {/* Key Achievements */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground dark:text-white/85 uppercase tracking-wider mb-3">Logros Principales</h2>
        <ul className="space-y-2">
          <li className="text-sm text-muted-foreground dark:text-white/85">• Liderazgo en arquitectura de infraestructura con mejora de performance del 40%</li>
          <li className="text-sm text-muted-foreground dark:text-white/85">• Escalado de aplicación de 100K a 10M usuarios con 99.9% uptime</li>
          <li className="text-sm text-muted-foreground dark:text-white/85">• Mentoría de 5+ desarrolladores junior con promoción a senior</li>
          <li className="text-sm text-muted-foreground dark:text-white/85">• Implementación de CI/CD pipeline reduciendo deployment time 70%</li>
        </ul>
      </div>

      {/* Experience - Simplified */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground dark:text-white/85 uppercase tracking-wider mb-3">Experiencia Profesional</h2>
        {cvData.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-muted/90 dark:text-white">{exp.position}</p>
                <p className="text-muted-foreground dark:text-muted-foreground text-sm">{exp.company}</p>
              </div>
              <p className="text-muted-foreground dark:text-muted-foreground text-sm">{exp.duration}</p>
            </div>
            <p className="text-muted-foreground dark:text-white/85 text-sm mt-2">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Skills Matrix */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-muted/90 dark:text-white mb-2 text-sm">Backend</h3>
          <p className="text-muted-foreground dark:text-white/85 text-sm">Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, Kubernetes</p>
        </div>
        <div>
          <h3 className="font-semibold text-muted/90 dark:text-white mb-2 text-sm">Frontend</h3>
          <p className="text-muted-foreground dark:text-white/85 text-sm">React, GraphQL, REST APIs, TypeScript, JavaScript</p>
        </div>
      </div>

      {/* Education & Certs */}
      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-muted/30 dark:border-card">
        <div>
          <h3 className="text-sm font-bold text-muted-foreground dark:text-white/85 uppercase tracking-wider mb-2">Educación</h3>
          {cvData.education.map((edu, idx) => (
            <p key={idx} className="text-sm text-muted-foreground dark:text-white/85">{edu.degree}</p>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-bold text-muted-foreground dark:text-white/85 uppercase tracking-wider mb-2">Certificaciones</h3>
          {cvData.certifications.map((cert, idx) => (
            <p key={idx} className="text-sm text-muted-foreground dark:text-white/85">{cert.name}</p>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStandardFormat = () => (
    <div className="space-y-8 bg-white dark:bg-background p-8 text-muted/90 dark:text-white">
      {/* Header */}
      <div className="bg-muted/5 dark:bg-muted/10 p-6 rounded-lg border-l-4 border-training">
        <h1 className="text-3xl font-bold text-training">{cvData.personalInfo.name}</h1>
        <p className="text-lg font-semibold text-white/80">{cvData.personalInfo.title}</p>
        <p className="text-sm text-white/70">{cvData.personalInfo.email} • {cvData.personalInfo.phone} • {cvData.personalInfo.location}</p>
      </div>

      {/* Professional Summary */}
      <div className="bg-muted/8 dark:bg-muted/20 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-training mb-3">Professional Summary</h2>
        <p className="text-white/85 leading-relaxed">{cvData.personalInfo.summary}</p>
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-xl font-bold text-training mb-4">Experience</h2>
        <div className="space-y-4">
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="bg-muted/8 dark:bg-muted/20 p-4 rounded-lg border-l-2 border-training/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-white">{exp.position}</p>
                  <p className="text-training font-semibold">{exp.company}</p>
                </div>
                <p className="text-sm text-white/70">{exp.duration}</p>
              </div>
              <p className="text-sm text-white/85 mb-2">{exp.description}</p>
              <p className="text-xs text-training">Skills: {exp.skills.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-muted/8 dark:bg-muted/20 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-training mb-3">Education</h2>
        {cvData.education.map((edu, idx) => (
          <p key={idx} className="text-white/85 mb-1">
            <strong>{edu.degree}</strong> - {edu.school} ({edu.year})
          </p>
        ))}
      </div>

      {/* Technical Skills */}
      <div className="bg-muted/8 dark:bg-muted/20 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-training mb-3">Technical Skills</h2>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <span key={skill} className="rounded-[20px] bg-training/20 text-training px-3 py-1 rounded-[20px] text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-muted/8 dark:bg-muted/20 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-training mb-3">Certifications</h2>
        {cvData.certifications.map((cert, idx) => (
          <p key={idx} className="text-white/85 mb-1">
            <strong>{cert.name}</strong> - {cert.issuer} ({cert.year})
          </p>
        ))}
      </div>
    </div>
  )

  if (isCompleted) {
    return <ModuleCompletionScreen moduleId="cv-inteligente" moduleName="CV Inteligente" xpEarned={120} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-muted/90 dark:text-white">Mi CV ATS</h1>
          <p className="text-muted-foreground dark:text-muted-foreground">
            Tu CV optimizado para sistemas de seguimiento de candidatos (ATS). Generado automáticamente desde tu perfil DTC.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setFormat('ats')}
            variant={format === 'ats' ? 'default' : 'outline'}
            className={format === 'ats' ? 'bg-training hover:bg-training/90' : 'border-training/40 text-training'}
          >
            Formato ATS
          </Button>
          <Button
            onClick={() => setFormat('standard')}
            variant={format === 'standard' ? 'default' : 'outline'}
            className={format === 'standard' ? 'bg-training hover:bg-training/90' : 'border-training/40 text-training'}
          >
            Estándar
          </Button>
          <Button
            onClick={() => setFormat('creative')}
            variant={format === 'creative' ? 'default' : 'outline'}
            className={format === 'creative' ? 'bg-training hover:bg-training/90' : 'border-training/40 text-training'}
          >
            Creativo
          </Button>
          <Button
            onClick={() => setFormat('modern')}
            variant={format === 'modern' ? 'default' : 'outline'}
            className={format === 'modern' ? 'bg-training hover:bg-training/90' : 'border-training/40 text-training'}
          >
            Moderno
          </Button>
          <Button
            onClick={() => setFormat('linkedin')}
            variant={format === 'linkedin' ? 'default' : 'outline'}
            className={format === 'linkedin' ? 'bg-training hover:bg-training/90' : 'border-training/40 text-training'}
          >
            LinkedIn
          </Button>
          <Button
            onClick={() => setFormat('executive')}
            variant={format === 'executive' ? 'default' : 'outline'}
            className={format === 'executive' ? 'bg-training hover:bg-training/90' : 'border-training/40 text-training'}
          >
            Ejecutivo
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="border-2 border-training/40">
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
            <Card className="rounded-[2px] overflow-hidden border-2 border-training/40">
              <div className="bg-muted/10 dark:bg-card p-6 rounded-[28px]">
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
              <Button className="bg-purple/80 hover:bg-purple/70/90">
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
            <Card className="rounded-[2px] p-6">
              <div className="space-y-4 text-muted-foreground dark:text-muted-foreground">
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
          <Card className="rounded-[2px] bg-blue/5 dark:bg-blue/20 border-blue/30 dark:border-blue/10">
            <CardHeader>
              <CardTitle className="text-base">📋 Formato ATS (Optimizado)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground dark:text-white/85 space-y-2">
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
          <Card className="rounded-[2px] bg-green/5 dark:bg-green/20 border-green/20 dark:border-green">
            <CardHeader>
              <CardTitle className="text-base"> Formato Estándar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground dark:text-white/85 space-y-2">
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
          <Card className="rounded-[2px] bg-purple/5 dark:bg-purple/20 border-purple/30 dark:border-purple">
            <CardHeader>
              <CardTitle className="text-base"> Formato Creativo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground dark:text-white/85 space-y-2">
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
          <Card className="rounded-[2px] bg-yellow/5 dark:bg-amber-900/20 border-yellow/30 dark:border-yellow">
            <CardHeader>
              <CardTitle className="text-base"> Formato Moderno</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground dark:text-white/85 space-y-2">
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
          <Card className="rounded-[2px] bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800">
            <CardHeader>
              <CardTitle className="text-base"> Formato LinkedIn</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground dark:text-white/85 space-y-2">
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
          <Card className="rounded-[2px] bg-muted/10 dark:bg-card border-muted/30 dark:border-card">
            <CardHeader>
              <CardTitle className="text-base">👔 Formato Ejecutivo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground dark:text-white/85 space-y-2">
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
