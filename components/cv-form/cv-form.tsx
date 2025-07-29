"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Trash2,
  Download,
  Eye,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Languages,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import {
  type CVData,
  type PersonalInfo,
  type Experience,
  type Education,
  type Project,
  type Skill,
  type Language,
  type Certification,
  chileanCities,
  chileanUniversities,
  formatDate,
} from "@/lib/cv-types"

const initialCVData: CVData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    linkedIn: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  certifications: [],
}

export default function CVForm() {
  const [cvData, setCVData] = useState<CVData>(initialCVData)
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("cv-draft")
    if (savedData) {
      try {
        setCVData(JSON.parse(savedData))
      } catch (error) {
        console.error("Error loading saved CV data:", error)
      }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("cv-draft", JSON.stringify(cvData))
    }, 2000)

    return () => clearTimeout(timer)
  }, [cvData])

  const updatePersonal = (field: keyof PersonalInfo, value: string) => {
    setCVData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }))
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      location: "",
    }
    setCVData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    }
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      current: false,
      url: "",
      github: "",
    }
    setCVData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setCVData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)),
    }))
  }

  const removeProject = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }))
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "Intermedio",
      category: "Técnica",
    }
    setCVData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }))
  }

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)),
    }))
  }

  const removeSkill = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }))
  }

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      name: "",
      level: "Intermedio",
      certification: "",
    }
    setCVData((prev) => ({
      ...prev,
      languages: [...prev.languages, newLang],
    }))
  }

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)),
    }))
  }

  const removeLanguage = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang.id !== id),
    }))
  }

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: "",
    }
    setCVData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }))
  }

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setCVData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)),
    }))
  }

  const removeCertification = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }))
  }

  const generatePDF = () => {
    setIsLoading(true)
    try {
      const doc = new jsPDF()
      let yPosition = 20

      // Header
      doc.setFontSize(20)
      doc.text(cvData.personal.fullName || "Nombre Completo", 20, yPosition)
      yPosition += 10

      doc.setFontSize(12)
      if (cvData.personal.email) {
        doc.text(`Email: ${cvData.personal.email}`, 20, yPosition)
        yPosition += 7
      }
      if (cvData.personal.phone) {
        doc.text(`Teléfono: ${cvData.personal.phone}`, 20, yPosition)
        yPosition += 7
      }
      if (cvData.personal.address) {
        doc.text(`Dirección: ${cvData.personal.address}, ${cvData.personal.city}`, 20, yPosition)
        yPosition += 7
      }

      yPosition += 10

      // Summary
      if (cvData.personal.summary) {
        doc.setFontSize(16)
        doc.text("Resumen Profesional", 20, yPosition)
        yPosition += 10
        doc.setFontSize(11)
        const summaryLines = doc.splitTextToSize(cvData.personal.summary, 170)
        doc.text(summaryLines, 20, yPosition)
        yPosition += summaryLines.length * 5 + 10
      }

      // Experience
      if (cvData.experience.length > 0) {
        doc.setFontSize(16)
        doc.text("Experiencia Laboral", 20, yPosition)
        yPosition += 10

        cvData.experience.forEach((exp) => {
          if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
          }

          doc.setFontSize(12)
          doc.text(`${exp.position} - ${exp.company}`, 20, yPosition)
          yPosition += 7
          doc.setFontSize(10)
          doc.text(
            `${formatDate(exp.startDate)} - ${exp.current ? "Presente" : formatDate(exp.endDate)}`,
            20,
            yPosition,
          )
          yPosition += 7
          if (exp.description) {
            const descLines = doc.splitTextToSize(exp.description, 170)
            doc.text(descLines, 20, yPosition)
            yPosition += descLines.length * 4 + 5
          }
          yPosition += 5
        })
      }

      // Education
      if (cvData.education.length > 0) {
        if (yPosition > 200) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(16)
        doc.text("Educación", 20, yPosition)
        yPosition += 10

        cvData.education.forEach((edu) => {
          doc.setFontSize(12)
          doc.text(`${edu.degree} en ${edu.field}`, 20, yPosition)
          yPosition += 7
          doc.setFontSize(10)
          doc.text(`${edu.institution}`, 20, yPosition)
          yPosition += 5
          doc.text(
            `${formatDate(edu.startDate)} - ${edu.current ? "Presente" : formatDate(edu.endDate)}`,
            20,
            yPosition,
          )
          yPosition += 10
        })
      }

      // Skills
      if (cvData.skills.length > 0) {
        if (yPosition > 220) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(16)
        doc.text("Habilidades", 20, yPosition)
        yPosition += 10

        const skillsByCategory = cvData.skills.reduce(
          (acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = []
            acc[skill.category].push(skill)
            return acc
          },
          {} as Record<string, Skill[]>,
        )

        Object.entries(skillsByCategory).forEach(([category, skills]) => {
          doc.setFontSize(12)
          doc.text(category, 20, yPosition)
          yPosition += 7
          doc.setFontSize(10)
          const skillsText = skills.map((s) => `${s.name} (${s.level})`).join(", ")
          const skillsLines = doc.splitTextToSize(skillsText, 170)
          doc.text(skillsLines, 20, yPosition)
          yPosition += skillsLines.length * 4 + 5
        })
      }

      doc.save(`CV_${cvData.personal.fullName.replace(/\s+/g, "_")}.pdf`)
      toast.success("CV descargado exitosamente")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Error al generar el PDF")
    } finally {
      setIsLoading(false)
    }
  }

  const previewCV = () => {
    const previewWindow = window.open("", "_blank")
    if (!previewWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vista Previa CV - ${cvData.personal.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
            .item { margin-bottom: 15px; }
            .item-title { font-weight: bold; }
            .item-subtitle { color: #666; font-style: italic; }
            .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${cvData.personal.fullName}</h1>
            <p>${cvData.personal.email} | ${cvData.personal.phone}</p>
            <p>${cvData.personal.address}, ${cvData.personal.city}</p>
            ${cvData.personal.linkedIn ? `<p>LinkedIn: ${cvData.personal.linkedIn}</p>` : ""}
          </div>
          
          ${
            cvData.personal.summary
              ? `
            <div class="section">
              <h2 class="section-title">Resumen Profesional</h2>
              <p>${cvData.personal.summary}</p>
            </div>
          `
              : ""
          }
          
          ${
            cvData.experience.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">Experiencia Laboral</h2>
              ${cvData.experience
                .map(
                  (exp) => `
                <div class="item">
                  <div class="item-title">${exp.position} - ${exp.company}</div>
                  <div class="item-subtitle">${formatDate(exp.startDate)} - ${exp.current ? "Presente" : formatDate(exp.endDate)} | ${exp.location}</div>
                  <p>${exp.description}</p>
                </div>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            cvData.education.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">Educación</h2>
              ${cvData.education
                .map(
                  (edu) => `
                <div class="item">
                  <div class="item-title">${edu.degree} en ${edu.field}</div>
                  <div class="item-subtitle">${edu.institution}</div>
                  <div class="item-subtitle">${formatDate(edu.startDate)} - ${edu.current ? "Presente" : formatDate(edu.endDate)}</div>
                  ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ""}
                </div>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            cvData.skills.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">Habilidades</h2>
              <div class="skills-grid">
                ${Object.entries(
                  cvData.skills.reduce(
                    (acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = []
                      acc[skill.category].push(skill)
                      return acc
                    },
                    {} as Record<string, Skill[]>,
                  ),
                )
                  .map(
                    ([category, skills]) => `
                  <div>
                    <h4>${category}</h4>
                    <ul>
                      ${skills.map((skill) => `<li>${skill.name} (${skill.level})</li>`).join("")}
                    </ul>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </body>
      </html>
    `

    previewWindow.document.write(html)
    previewWindow.document.close()
  }

  const saveDraft = () => {
    localStorage.setItem("cv-draft", JSON.stringify(cvData))
    toast.success("Borrador guardado")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Constructor de CV</h1>
        <p className="text-muted-foreground">Crea tu currículum vitae profesional paso a paso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experiencia
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Educación
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Proyectos
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Habilidades
              </TabsTrigger>
              <TabsTrigger value="languages" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Idiomas
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Certificaciones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Completa tu información básica y resumen profesional</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nombre Completo *</Label>
                      <Input
                        id="fullName"
                        value={cvData.personal.fullName}
                        onChange={(e) => updatePersonal("fullName", e.target.value)}
                        placeholder="Juan Pérez González"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={cvData.personal.email}
                        onChange={(e) => updatePersonal("email", e.target.value)}
                        placeholder="juan.perez@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        value={cvData.personal.phone}
                        onChange={(e) => updatePersonal("phone", e.target.value)}
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ciudad *</Label>
                      <Select value={cvData.personal.city} onValueChange={(value) => updatePersonal("city", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu ciudad" />
                        </SelectTrigger>
                        <SelectContent>
                          {chileanCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={cvData.personal.address}
                      onChange={(e) => updatePersonal("address", e.target.value)}
                      placeholder="Av. Providencia 1234, Providencia"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedIn">LinkedIn</Label>
                      <Input
                        id="linkedIn"
                        value={cvData.personal.linkedIn}
                        onChange={(e) => updatePersonal("linkedIn", e.target.value)}
                        placeholder="linkedin.com/in/tu-perfil"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        value={cvData.personal.website}
                        onChange={(e) => updatePersonal("website", e.target.value)}
                        placeholder="www.tu-sitio.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="summary">Resumen Profesional *</Label>
                    <Textarea
                      id="summary"
                      value={cvData.personal.summary}
                      onChange={(e) => updatePersonal("summary", e.target.value)}
                      placeholder="Describe brevemente tu experiencia, habilidades y objetivos profesionales..."
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Tip: Mantén el resumen entre 3-4 líneas, enfócate en tus fortalezas principales
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Experiencia Laboral</CardTitle>
                  <CardDescription>Agrega tu experiencia profesional, comenzando por la más reciente</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addExperience} className="mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Experiencia
                  </Button>

                  <div className="space-y-6">
                    {cvData.experience.map((exp, index) => (
                      <Card key={exp.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Experiencia {index + 1}</h4>
                          <Button variant="outline" size="sm" onClick={() => removeExperience(exp.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Empresa *</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              placeholder="Nombre de la empresa"
                            />
                          </div>
                          <div>
                            <Label>Cargo *</Label>
                            <Input
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                              placeholder="Tu posición en la empresa"
                            />
                          </div>
                          <div>
                            <Label>Fecha de Inicio *</Label>
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Fecha de Término</Label>
                            <Input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                              disabled={exp.current}
                            />
                          </div>
                          <div>
                            <Label>Ubicación</Label>
                            <Input
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                              placeholder="Santiago, Chile"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`current-${exp.id}`}
                              checked={exp.current}
                              onCheckedChange={(checked) => updateExperience(exp.id, "current", checked)}
                            />
                            <Label htmlFor={`current-${exp.id}`}>Trabajo actual</Label>
                          </div>
                        </div>

                        <div>
                          <Label>Descripción de Responsabilidades *</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            placeholder="Describe tus principales responsabilidades y logros..."
                            rows={3}
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Tip: Usa viñetas y cuantifica tus logros cuando sea posible
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Educación</CardTitle>
                  <CardDescription>Agrega tu formación académica, comenzando por la más reciente</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addEducation} className="mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Educación
                  </Button>

                  <div className="space-y-6">
                    {cvData.education.map((edu, index) => (
                      <Card key={edu.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Educación {index + 1}</h4>
                          <Button variant="outline" size="sm" onClick={() => removeEducation(edu.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Institución *</Label>
                            <Select
                              value={edu.institution}
                              onValueChange={(value) => updateEducation(edu.id, "institution", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la institución" />
                              </SelectTrigger>
                              <SelectContent>
                                {chileanUniversities.map((uni) => (
                                  <SelectItem key={uni} value={uni}>
                                    {uni}
                                  </SelectItem>
                                ))}
                                <SelectItem value="other">Otra institución</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Título/Grado *</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              placeholder="Ej: Ingeniería Civil Industrial"
                            />
                          </div>
                          <div>
                            <Label>Campo de Estudio *</Label>
                            <Input
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                              placeholder="Ej: Ingeniería, Administración"
                            />
                          </div>
                          <div>
                            <Label>Promedio (Opcional)</Label>
                            <Input
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                              placeholder="Ej: 6.5"
                            />
                          </div>
                          <div>
                            <Label>Fecha de Inicio *</Label>
                            <Input
                              type="month"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Fecha de Graduación</Label>
                            <Input
                              type="month"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                              disabled={edu.current}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <Checkbox
                            id={`current-edu-${edu.id}`}
                            checked={edu.current}
                            onCheckedChange={(checked) => updateEducation(edu.id, "current", checked)}
                          />
                          <Label htmlFor={`current-edu-${edu.id}`}>Estudiando actualmente</Label>
                        </div>

                        <div>
                          <Label>Descripción (Opcional)</Label>
                          <Textarea
                            value={edu.description}
                            onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                            placeholder="Menciona logros académicos, proyectos destacados, etc."
                            rows={2}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Proyectos</CardTitle>
                  <CardDescription>Muestra tus proyectos más relevantes y destacados</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addProject} className="mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Proyecto
                  </Button>

                  <div className="space-y-6">
                    {cvData.projects.map((project, index) => (
                      <Card key={project.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Proyecto {index + 1}</h4>
                          <Button variant="outline" size="sm" onClick={() => removeProject(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Nombre del Proyecto *</Label>
                            <Input
                              value={project.name}
                              onChange={(e) => updateProject(project.id, "name", e.target.value)}
                              placeholder="Nombre del proyecto"
                            />
                          </div>
                          <div>
                            <Label>URL del Proyecto</Label>
                            <Input
                              value={project.url}
                              onChange={(e) => updateProject(project.id, "url", e.target.value)}
                              placeholder="https://mi-proyecto.com"
                            />
                          </div>
                          <div>
                            <Label>Fecha de Inicio *</Label>
                            <Input
                              type="month"
                              value={project.startDate}
                              onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Fecha de Finalización</Label>
                            <Input
                              type="month"
                              value={project.endDate}
                              onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                              disabled={project.current}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <Checkbox
                            id={`current-project-${project.id}`}
                            checked={project.current}
                            onCheckedChange={(checked) => updateProject(project.id, "current", checked)}
                          />
                          <Label htmlFor={`current-project-${project.id}`}>Proyecto en curso</Label>
                        </div>

                        <div className="mb-4">
                          <Label>GitHub Repository</Label>
                          <Input
                            value={project.github}
                            onChange={(e) => updateProject(project.id, "github", e.target.value)}
                            placeholder="https://github.com/usuario/proyecto"
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Tecnologías Utilizadas</Label>
                          <Input
                            value={project.technologies.join(", ")}
                            onChange={(e) =>
                              updateProject(
                                project.id,
                                "technologies",
                                e.target.value.split(", ").filter((t) => t.trim()),
                              )
                            }
                            placeholder="React, Node.js, PostgreSQL, etc."
                          />
                          <p className="text-sm text-muted-foreground mt-1">Separa las tecnologías con comas</p>
                        </div>

                        <div>
                          <Label>Descripción del Proyecto *</Label>
                          <Textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, "description", e.target.value)}
                            placeholder="Describe el proyecto, su propósito y tus contribuciones..."
                            rows={3}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Habilidades</CardTitle>
                  <CardDescription>Agrega tus habilidades técnicas y blandas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addSkill} className="mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Habilidad
                  </Button>

                  <div className="space-y-4">
                    {cvData.skills.map((skill, index) => (
                      <Card key={skill.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Habilidad {index + 1}</h4>
                          <Button variant="outline" size="sm" onClick={() => removeSkill(skill.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Nombre de la Habilidad *</Label>
                            <Input
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                              placeholder="Ej: JavaScript, Liderazgo"
                            />
                          </div>
                          <div>
                            <Label>Categoría *</Label>
                            <Select
                              value={skill.category}
                              onValueChange={(value) => updateSkill(skill.id, "category", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Técnica">Técnica</SelectItem>
                                <SelectItem value="Blanda">Blanda</SelectItem>
                                <SelectItem value="Idioma">Idioma</SelectItem>
                                <SelectItem value="Herramienta">Herramienta</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Nivel *</Label>
                            <Select
                              value={skill.level}
                              onValueChange={(value) => updateSkill(skill.id, "level", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Básico">Básico</SelectItem>
                                <SelectItem value="Intermedio">Intermedio</SelectItem>
                                <SelectItem value="Avanzado">Avanzado</SelectItem>
                                <SelectItem value="Experto">Experto</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="languages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Idiomas</CardTitle>
                  <CardDescription>Especifica los idiomas que dominas y tu nivel</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addLanguage} className="mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Idioma
                  </Button>

                  <div className="space-y-4">
                    {cvData.languages.map((lang, index) => (
                      <Card key={lang.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Idioma {index + 1}</h4>
                          <Button variant="outline" size="sm" onClick={() => removeLanguage(lang.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Idioma *</Label>
                            <Input
                              value={lang.name}
                              onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                              placeholder="Ej: Inglés, Francés"
                            />
                          </div>
                          <div>
                            <Label>Nivel *</Label>
                            <Select
                              value={lang.level}
                              onValueChange={(value) => updateLanguage(lang.id, "level", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Básico">Básico</SelectItem>
                                <SelectItem value="Intermedio">Intermedio</SelectItem>
                                <SelectItem value="Avanzado">Avanzado</SelectItem>
                                <SelectItem value="Nativo">Nativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Certificación (Opcional)</Label>
                            <Input
                              value={lang.certification}
                              onChange={(e) => updateLanguage(lang.id, "certification", e.target.value)}
                              placeholder="Ej: TOEFL, IELTS"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certificaciones</CardTitle>
                  <CardDescription>Agrega tus certificaciones profesionales y cursos relevantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addCertification} className="mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Certificación
                  </Button>

                  <div className="space-y-6">
                    {cvData.certifications.map((cert, index) => (
                      <Card key={cert.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold">Certificación {index + 1}</h4>
                          <Button variant="outline" size="sm" onClick={() => removeCertification(cert.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Nombre de la Certificación *</Label>
                            <Input
                              value={cert.name}
                              onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                              placeholder="Ej: AWS Solutions Architect"
                            />
                          </div>
                          <div>
                            <Label>Organización Emisora *</Label>
                            <Input
                              value={cert.issuer}
                              onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                              placeholder="Ej: Amazon Web Services"
                            />
                          </div>
                          <div>
                            <Label>Fecha de Obtención *</Label>
                            <Input
                              type="month"
                              value={cert.date}
                              onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Fecha de Expiración</Label>
                            <Input
                              type="month"
                              value={cert.expiryDate}
                              onChange={(e) => updateCertification(cert.id, "expiryDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>ID de Credencial</Label>
                            <Input
                              value={cert.credentialId}
                              onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                              placeholder="ID único de la certificación"
                            />
                          </div>
                          <div>
                            <Label>URL de Verificación</Label>
                            <Input
                              value={cert.url}
                              onChange={(e) => updateCertification(cert.id, "url", e.target.value)}
                              placeholder="https://verify.certification.com"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={saveDraft} variant="outline" className="w-full bg-transparent">
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button onClick={previewCV} variant="outline" className="w-full bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>
              <Button onClick={generatePDF} className="w-full" disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? "Generando..." : "Descargar PDF"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progreso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Personal</span>
                  <Badge variant={cvData.personal.fullName && cvData.personal.email ? "default" : "secondary"}>
                    {cvData.personal.fullName && cvData.personal.email ? "Completo" : "Pendiente"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Experiencia</span>
                  <Badge variant={cvData.experience.length > 0 ? "default" : "secondary"}>
                    {cvData.experience.length} items
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Educación</span>
                  <Badge variant={cvData.education.length > 0 ? "default" : "secondary"}>
                    {cvData.education.length} items
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Habilidades</span>
                  <Badge variant={cvData.skills.length > 0 ? "default" : "secondary"}>
                    {cvData.skills.length} items
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consejos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p>• Mantén tu CV en máximo 2 páginas</p>
                <p>• Usa verbos de acción para describir logros</p>
                <p>• Cuantifica tus resultados cuando sea posible</p>
                <p>• Adapta tu CV para cada aplicación</p>
                <p>• Revisa la ortografía antes de enviar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
