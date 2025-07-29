"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Download, Eye, Save } from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import { type CVData, formatDate, chileanCities, chileanUniversities } from "@/lib/cv-types"

const cvSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, "El nombre completo es requerido"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Teléfono inválido"),
    city: z.string().min(2, "Ciudad es requerida"),
    linkedIn: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
    summary: z.string().min(50, "El resumen debe tener al menos 50 caracteres"),
  }),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string().min(2, "Empresa es requerida"),
      position: z.string().min(2, "Cargo es requerido"),
      startDate: z.string().min(1, "Fecha de inicio es requerida"),
      endDate: z.string().optional(),
      current: z.boolean(),
      description: z.string().min(20, "Descripción debe tener al menos 20 caracteres"),
      achievements: z.array(z.string()),
    }),
  ),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string().min(2, "Institución es requerida"),
      degree: z.string().min(2, "Título es requerido"),
      field: z.string().min(2, "Campo de estudio es requerido"),
      startDate: z.string().min(1, "Fecha de inicio es requerida"),
      endDate: z.string().optional(),
      current: z.boolean(),
      gpa: z.string().optional(),
      honors: z.string().optional(),
    }),
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(2, "Nombre del proyecto es requerido"),
      description: z.string().min(20, "Descripción debe tener al menos 20 caracteres"),
      technologies: z.array(z.string()),
      startDate: z.string().min(1, "Fecha de inicio es requerida"),
      endDate: z.string().optional(),
      current: z.boolean(),
      url: z.string().optional(),
      github: z.string().optional(),
      achievements: z.array(z.string()),
    }),
  ),
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Nombre de habilidad es requerido"),
      level: z.enum(["Básico", "Intermedio", "Avanzado", "Experto"]),
      category: z.enum(["Técnica", "Blanda", "Idioma", "Herramienta"]),
    }),
  ),
  languages: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Nombre del idioma es requerido"),
      level: z.enum(["Básico", "Intermedio", "Avanzado", "Nativo"]),
      certification: z.string().optional(),
    }),
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(2, "Nombre de certificación es requerido"),
      issuer: z.string().min(2, "Emisor es requerido"),
      date: z.string().min(1, "Fecha es requerida"),
      expiryDate: z.string().optional(),
      credentialId: z.string().optional(),
      url: z.string().optional(),
    }),
  ),
})

export default function CVForm() {
  const [activeTab, setActiveTab] = useState("personal")
  const [progress, setProgress] = useState(0)

  const form = useForm<CVData>({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        city: "",
        linkedIn: "",
        github: "",
        website: "",
        summary: "",
      },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      languages: [],
      certifications: [],
    },
  })

  const { watch, setValue, getValues } = form
  const watchedData = watch()

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const currentData = getValues()
      localStorage.setItem("cv-draft", JSON.stringify(currentData))
    }, 2000)

    return () => clearInterval(interval)
  }, [getValues])

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("cv-draft")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        Object.keys(parsedData).forEach((key) => {
          setValue(key as keyof CVData, parsedData[key])
        })
        toast.success("Borrador cargado automáticamente")
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
  }, [setValue])

  // Calculate progress
  useEffect(() => {
    const data = watchedData
    let completedSections = 0
    const totalSections = 7

    if (data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone) {
      completedSections++
    }
    if (data.experience.length > 0) completedSections++
    if (data.education.length > 0) completedSections++
    if (data.projects.length > 0) completedSections++
    if (data.skills.length > 0) completedSections++
    if (data.languages.length > 0) completedSections++
    if (data.certifications.length > 0) completedSections++

    setProgress((completedSections / totalSections) * 100)
  }, [watchedData])

  const addExperience = () => {
    const currentExperience = getValues("experience")
    setValue("experience", [
      ...currentExperience,
      {
        id: Date.now().toString(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        achievements: [],
      },
    ])
  }

  const removeExperience = (id: string) => {
    const currentExperience = getValues("experience")
    setValue(
      "experience",
      currentExperience.filter((exp) => exp.id !== id),
    )
  }

  const addEducation = () => {
    const currentEducation = getValues("education")
    setValue("education", [
      ...currentEducation,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
        gpa: "",
        honors: "",
      },
    ])
  }

  const removeEducation = (id: string) => {
    const currentEducation = getValues("education")
    setValue(
      "education",
      currentEducation.filter((edu) => edu.id !== id),
    )
  }

  const addProject = () => {
    const currentProjects = getValues("projects")
    setValue("projects", [
      ...currentProjects,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        technologies: [],
        startDate: "",
        endDate: "",
        current: false,
        url: "",
        github: "",
        achievements: [],
      },
    ])
  }

  const removeProject = (id: string) => {
    const currentProjects = getValues("projects")
    setValue(
      "projects",
      currentProjects.filter((proj) => proj.id !== id),
    )
  }

  const addSkill = () => {
    const currentSkills = getValues("skills")
    setValue("skills", [
      ...currentSkills,
      {
        id: Date.now().toString(),
        name: "",
        level: "Básico",
        category: "Técnica",
      },
    ])
  }

  const removeSkill = (id: string) => {
    const currentSkills = getValues("skills")
    setValue(
      "skills",
      currentSkills.filter((skill) => skill.id !== id),
    )
  }

  const addLanguage = () => {
    const currentLanguages = getValues("languages")
    setValue("languages", [
      ...currentLanguages,
      {
        id: Date.now().toString(),
        name: "",
        level: "Básico",
        certification: "",
      },
    ])
  }

  const removeLanguage = (id: string) => {
    const currentLanguages = getValues("languages")
    setValue(
      "languages",
      currentLanguages.filter((lang) => lang.id !== id),
    )
  }

  const addCertification = () => {
    const currentCertifications = getValues("certifications")
    setValue("certifications", [
      ...currentCertifications,
      {
        id: Date.now().toString(),
        name: "",
        issuer: "",
        date: "",
        expiryDate: "",
        credentialId: "",
        url: "",
      },
    ])
  }

  const removeCertification = (id: string) => {
    const currentCertifications = getValues("certifications")
    setValue(
      "certifications",
      currentCertifications.filter((cert) => cert.id !== id),
    )
  }

  const generatePDF = () => {
    const data = getValues()
    const pdf = new jsPDF()

    // Header
    pdf.setFontSize(20)
    pdf.text(data.personalInfo.fullName, 20, 30)

    pdf.setFontSize(12)
    let yPosition = 45

    // Contact info
    pdf.text(`Email: ${data.personalInfo.email}`, 20, yPosition)
    yPosition += 7
    pdf.text(`Teléfono: ${data.personalInfo.phone}`, 20, yPosition)
    yPosition += 7
    pdf.text(`Ciudad: ${data.personalInfo.city}`, 20, yPosition)
    yPosition += 15

    // Summary
    if (data.personalInfo.summary) {
      pdf.setFontSize(14)
      pdf.text("Resumen Profesional", 20, yPosition)
      yPosition += 10
      pdf.setFontSize(10)
      const summaryLines = pdf.splitTextToSize(data.personalInfo.summary, 170)
      pdf.text(summaryLines, 20, yPosition)
      yPosition += summaryLines.length * 5 + 10
    }

    // Experience
    if (data.experience.length > 0) {
      pdf.setFontSize(14)
      pdf.text("Experiencia Laboral", 20, yPosition)
      yPosition += 10

      data.experience.forEach((exp) => {
        pdf.setFontSize(12)
        pdf.text(`${exp.position} - ${exp.company}`, 20, yPosition)
        yPosition += 7
        pdf.setFontSize(10)
        pdf.text(`${formatDate(exp.startDate)} - ${exp.current ? "Presente" : formatDate(exp.endDate)}`, 20, yPosition)
        yPosition += 7
        const descLines = pdf.splitTextToSize(exp.description, 170)
        pdf.text(descLines, 20, yPosition)
        yPosition += descLines.length * 5 + 10
      })
    }

    pdf.save(`CV_${data.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`)
    toast.success("PDF generado exitosamente")
  }

  const previewHTML = () => {
    const data = getValues()
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CV - ${data.personalInfo.fullName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .contact { color: #666; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
          .item { margin-bottom: 20px; }
          .item-title { font-weight: bold; }
          .item-subtitle { color: #666; font-style: italic; }
          .item-date { color: #888; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${data.personalInfo.fullName}</div>
          <div class="contact">
            ${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.city}
          </div>
        </div>
        
        ${
          data.personalInfo.summary
            ? `
        <div class="section">
          <div class="section-title">Resumen Profesional</div>
          <p>${data.personalInfo.summary}</p>
        </div>
        `
            : ""
        }
        
        ${
          data.experience.length > 0
            ? `
        <div class="section">
          <div class="section-title">Experiencia Laboral</div>
          ${data.experience
            .map(
              (exp) => `
            <div class="item">
              <div class="item-title">${exp.position}</div>
              <div class="item-subtitle">${exp.company}</div>
              <div class="item-date">${formatDate(exp.startDate)} - ${exp.current ? "Presente" : formatDate(exp.endDate)}</div>
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
          data.education.length > 0
            ? `
        <div class="section">
          <div class="section-title">Educación</div>
          ${data.education
            .map(
              (edu) => `
            <div class="item">
              <div class="item-title">${edu.degree} en ${edu.field}</div>
              <div class="item-subtitle">${edu.institution}</div>
              <div class="item-date">${formatDate(edu.startDate)} - ${edu.current ? "Presente" : formatDate(edu.endDate)}</div>
            </div>
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }
      </body>
      </html>
    `

    const newWindow = window.open("", "_blank")
    if (newWindow) {
      newWindow.document.write(htmlContent)
      newWindow.document.close()
    }
  }

  const onSubmit = (data: CVData) => {
    console.log("CV Data:", data)
    toast.success("CV guardado exitosamente")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Constructor de CV Profesional</CardTitle>
          <CardDescription>Crea tu CV profesional paso a paso. El progreso se guarda automáticamente.</CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso del CV</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experiencia</TabsTrigger>
            <TabsTrigger value="education">Educación</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="languages">Idiomas</TabsTrigger>
            <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Información básica y resumen profesional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input
                      id="fullName"
                      {...form.register("personalInfo.fullName")}
                      placeholder="Juan Pérez González"
                    />
                    {form.formState.errors.personalInfo?.fullName && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.personalInfo.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("personalInfo.email")}
                      placeholder="juan.perez@email.com"
                    />
                    {form.formState.errors.personalInfo?.email && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.personalInfo.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input id="phone" {...form.register("personalInfo.phone")} placeholder="+56 9 1234 5678" />
                    {form.formState.errors.personalInfo?.phone && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.personalInfo.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Select onValueChange={(value) => setValue("personalInfo.city", value)}>
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="linkedIn">LinkedIn</Label>
                    <Input
                      id="linkedIn"
                      {...form.register("personalInfo.linkedIn")}
                      placeholder="linkedin.com/in/usuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input id="github" {...form.register("personalInfo.github")} placeholder="github.com/usuario" />
                  </div>
                  <div>
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input id="website" {...form.register("personalInfo.website")} placeholder="www.misitioweb.com" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="summary">Resumen Profesional *</Label>
                  <Textarea
                    id="summary"
                    {...form.register("personalInfo.summary")}
                    placeholder="Describe tu experiencia, habilidades y objetivos profesionales..."
                    rows={4}
                  />
                  {form.formState.errors.personalInfo?.summary && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.personalInfo.summary.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experiencia Laboral</CardTitle>
                <CardDescription>Agrega tu experiencia profesional más relevante</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {watchedData.experience.map((exp, index) => (
                    <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Experiencia {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeExperience(exp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Empresa *</Label>
                          <Input {...form.register(`experience.${index}.company`)} placeholder="Nombre de la empresa" />
                        </div>
                        <div>
                          <Label>Cargo *</Label>
                          <Input {...form.register(`experience.${index}.position`)} placeholder="Tu cargo o posición" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Fecha de Inicio *</Label>
                          <Input type="month" {...form.register(`experience.${index}.startDate`)} />
                        </div>
                        <div>
                          <Label>Fecha de Fin</Label>
                          <Input
                            type="month"
                            {...form.register(`experience.${index}.endDate`)}
                            disabled={watchedData.experience[index]?.current}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            id={`current-${exp.id}`}
                            checked={watchedData.experience[index]?.current}
                            onCheckedChange={(checked) => setValue(`experience.${index}.current`, checked as boolean)}
                          />
                          <Label htmlFor={`current-${exp.id}`}>Trabajo actual</Label>
                        </div>
                      </div>

                      <div>
                        <Label>Descripción *</Label>
                        <Textarea
                          {...form.register(`experience.${index}.description`)}
                          placeholder="Describe tus responsabilidades y logros..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}

                  <Button type="button" onClick={addExperience} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Experiencia
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Educación</CardTitle>
                <CardDescription>Agrega tu formación académica</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {watchedData.education.map((edu, index) => (
                    <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Educación {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeEducation(edu.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <Label>Institución *</Label>
                        <Select onValueChange={(value) => setValue(`education.${index}.institution`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la institución" />
                          </SelectTrigger>
                          <SelectContent>
                            {chileanUniversities.map((uni) => (
                              <SelectItem key={uni} value={uni}>
                                {uni}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Título *</Label>
                          <Input
                            {...form.register(`education.${index}.degree`)}
                            placeholder="Ej: Ingeniería Civil Industrial"
                          />
                        </div>
                        <div>
                          <Label>Campo de Estudio *</Label>
                          <Input
                            {...form.register(`education.${index}.field`)}
                            placeholder="Ej: Ingeniería Industrial"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Fecha de Inicio *</Label>
                          <Input type="month" {...form.register(`education.${index}.startDate`)} />
                        </div>
                        <div>
                          <Label>Fecha de Fin</Label>
                          <Input
                            type="month"
                            {...form.register(`education.${index}.endDate`)}
                            disabled={watchedData.education[index]?.current}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            id={`current-edu-${edu.id}`}
                            checked={watchedData.education[index]?.current}
                            onCheckedChange={(checked) => setValue(`education.${index}.current`, checked as boolean)}
                          />
                          <Label htmlFor={`current-edu-${edu.id}`}>En curso</Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Promedio (opcional)</Label>
                          <Input {...form.register(`education.${index}.gpa`)} placeholder="Ej: 6.5" />
                        </div>
                        <div>
                          <Label>Honores (opcional)</Label>
                          <Input {...form.register(`education.${index}.honors`)} placeholder="Ej: Magna Cum Laude" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" onClick={addEducation} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Educación
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Proyectos</CardTitle>
                <CardDescription>Muestra tus proyectos más relevantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {watchedData.projects.map((project, index) => (
                    <div key={project.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Proyecto {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeProject(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <Label>Nombre del Proyecto *</Label>
                        <Input {...form.register(`projects.${index}.name`)} placeholder="Nombre del proyecto" />
                      </div>

                      <div>
                        <Label>Descripción *</Label>
                        <Textarea
                          {...form.register(`projects.${index}.description`)}
                          placeholder="Describe el proyecto, tu rol y los resultados..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Fecha de Inicio *</Label>
                          <Input type="month" {...form.register(`projects.${index}.startDate`)} />
                        </div>
                        <div>
                          <Label>Fecha de Fin</Label>
                          <Input
                            type="month"
                            {...form.register(`projects.${index}.endDate`)}
                            disabled={watchedData.projects[index]?.current}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            id={`current-project-${project.id}`}
                            checked={watchedData.projects[index]?.current}
                            onCheckedChange={(checked) => setValue(`projects.${index}.current`, checked as boolean)}
                          />
                          <Label htmlFor={`current-project-${project.id}`}>En desarrollo</Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>URL del Proyecto</Label>
                          <Input {...form.register(`projects.${index}.url`)} placeholder="https://miproyecto.com" />
                        </div>
                        <div>
                          <Label>GitHub</Label>
                          <Input
                            {...form.register(`projects.${index}.github`)}
                            placeholder="https://github.com/usuario/proyecto"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" onClick={addProject} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Proyecto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
                <CardDescription>Agrega tus habilidades técnicas y blandas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {watchedData.skills.map((skill, index) => (
                    <div key={skill.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Habilidad {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeSkill(skill.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Nombre *</Label>
                          <Input {...form.register(`skills.${index}.name`)} placeholder="Ej: JavaScript" />
                        </div>
                        <div>
                          <Label>Nivel *</Label>
                          <Select onValueChange={(value) => setValue(`skills.${index}.level`, value as any)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona nivel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Básico">Básico</SelectItem>
                              <SelectItem value="Intermedio">Intermedio</SelectItem>
                              <SelectItem value="Avanzado">Avanzado</SelectItem>
                              <SelectItem value="Experto">Experto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Categoría *</Label>
                          <Select onValueChange={(value) => setValue(`skills.${index}.category`, value as any)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Técnica">Técnica</SelectItem>
                              <SelectItem value="Blanda">Blanda</SelectItem>
                              <SelectItem value="Idioma">Idioma</SelectItem>
                              <SelectItem value="Herramienta">Herramienta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" onClick={addSkill} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Habilidad
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="languages">
            <Card>
              <CardHeader>
                <CardTitle>Idiomas</CardTitle>
                <CardDescription>Agrega los idiomas que dominas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {watchedData.languages.map((language, index) => (
                    <div key={language.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Idioma {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeLanguage(language.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Idioma *</Label>
                          <Input {...form.register(`languages.${index}.name`)} placeholder="Ej: Inglés" />
                        </div>
                        <div>
                          <Label>Nivel *</Label>
                          <Select onValueChange={(value) => setValue(`languages.${index}.level`, value as any)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona nivel" />
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
                          <Label>Certificación</Label>
                          <Input
                            {...form.register(`languages.${index}.certification`)}
                            placeholder="Ej: TOEFL, IELTS"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" onClick={addLanguage} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Idioma
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <CardTitle>Certificaciones</CardTitle>
                <CardDescription>Agrega tus certificaciones profesionales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {watchedData.certifications.map((cert, index) => (
                    <div key={cert.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Certificación {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeCertification(cert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Nombre *</Label>
                          <Input
                            {...form.register(`certifications.${index}.name`)}
                            placeholder="Nombre de la certificación"
                          />
                        </div>
                        <div>
                          <Label>Emisor *</Label>
                          <Input
                            {...form.register(`certifications.${index}.issuer`)}
                            placeholder="Organización que emite"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Fecha de Obtención *</Label>
                          <Input type="month" {...form.register(`certifications.${index}.date`)} />
                        </div>
                        <div>
                          <Label>Fecha de Expiración</Label>
                          <Input type="month" {...form.register(`certifications.${index}.expiryDate`)} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>ID de Credencial</Label>
                          <Input
                            {...form.register(`certifications.${index}.credentialId`)}
                            placeholder="ID o número de credencial"
                          />
                        </div>
                        <div>
                          <Label>URL de Verificación</Label>
                          <Input
                            {...form.register(`certifications.${index}.url`)}
                            placeholder="URL para verificar la certificación"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" onClick={addCertification} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Certificación
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-8">
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={previewHTML}>
              <Eye className="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
            <Button type="button" variant="outline" onClick={generatePDF}>
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Guardar CV
          </Button>
        </div>
      </form>
    </div>
  )
}
