"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Languages,
  BadgeIcon as Certificate,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import type {
  CVData,
  PersonalInfo,
  Education,
  Experience,
  Project,
  Skill,
  Language,
  Certification,
} from "@/lib/cv-types"
import { generateId, calculateCompletionPercentage, validateCVData } from "@/lib/cv-types"

interface CVFormProps {
  initialData: CVData
  onSave: (data: CVData) => Promise<void>
  onDataChange: (data: CVData) => void
}

export function CVForm({ initialData, onSave, onDataChange }: CVFormProps) {
  const [cvData, setCVData] = useState<CVData>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    setCVData(initialData)
  }, [initialData])

  useEffect(() => {
    const percentage = calculateCompletionPercentage(cvData)
    setCompletionPercentage(percentage)

    const validation = validateCVData(cvData)
    setValidationErrors(validation.errors)

    onDataChange(cvData)
  }, [cvData, onDataChange])

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }))
  }

  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string | string[]) => {
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

  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      achievements: [],
      technologies: [],
    }
    setCVData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | string[]) => {
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

  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      githubUrl: "",
      role: "",
    }
    setCVData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: string | string[] | number) => {
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
      id: generateId(),
      name: "",
      level: 50,
      category: "Técnica",
      yearsOfExperience: 1,
    }
    setCVData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }))
  }

  const updateSkill = (id: string, field: keyof Skill, value: string | number | boolean) => {
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
    const newLanguage: Language = {
      id: generateId(),
      name: "",
      proficiency: "Intermedio",
    }
    setCVData((prev) => ({
      ...prev,
      languages: [...prev.languages, newLanguage],
    }))
  }

  const updateLanguage = (id: string, field: keyof Language, value: string | boolean) => {
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
    const newCertification: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      issueDate: "",
    }
    setCVData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCertification],
    }))
  }

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(cvData)
    } catch (error) {
      console.error("Error saving CV:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const addArrayItem = (field: string, value: string, id: string, arrayField: string) => {
    if (!value.trim()) return

    setCVData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof CVData] as any[]).map((item: any) =>
        item.id === id ? { ...item, [arrayField]: [...(item[arrayField] || []), value.trim()] } : item,
      ),
    }))
  }

  const removeArrayItem = (field: string, id: string, arrayField: string, index: number) => {
    setCVData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof CVData] as any[]).map((item: any) =>
        item.id === id
          ? {
              ...item,
              [arrayField]: (item[arrayField] || []).filter((_: any, i: number) => i !== index),
            }
          : item,
      ),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Progreso del CV
            </CardTitle>
            <Badge variant={completionPercentage >= 80 ? "default" : "secondary"}>
              {completionPercentage}% Completo
            </Badge>
          </div>
          <Progress value={completionPercentage} className="w-full" />
          {validationErrors.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {validationErrors.length} campo(s) requerido(s)
            </div>
          )}
        </CardHeader>
      </Card>

      {/* CV Form Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="personal" className="flex items-center gap-1">
            <User className="w-4 h-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4" />
            Educación
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            Experiencia
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            Proyectos
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            Habilidades
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-1">
            <Languages className="w-4 h-4" />
            Idiomas
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-1">
            <Certificate className="w-4 h-4" />
            Certificaciones
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo *</Label>
                  <Input
                    id="fullName"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                    placeholder="Juan Pérez González"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    placeholder="juan.perez@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input
                    id="location"
                    value={cvData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                    placeholder="Santiago, Chile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Título Profesional</Label>
                  <Input
                    id="jobTitle"
                    value={cvData.personalInfo.jobTitle || ""}
                    onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
                    placeholder="Desarrollador Full Stack Senior"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={cvData.personalInfo.linkedin || ""}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/juanperez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={cvData.personalInfo.github || ""}
                    onChange={(e) => updatePersonalInfo("github", e.target.value)}
                    placeholder="github.com/juanperez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    value={cvData.personalInfo.website || ""}
                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                    placeholder="juanperez.dev"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Resumen Profesional</Label>
                <Textarea
                  id="summary"
                  value={cvData.personalInfo.summary || ""}
                  onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                  placeholder="Describe tu experiencia profesional, habilidades clave y objetivos de carrera..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Educación</CardTitle>
                <Button onClick={addEducation} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Educación
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {cvData.education.map((edu, index) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Educación #{index + 1}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Título/Grado</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Ingeniería Civil en Computación"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institución</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        placeholder="Universidad de Chile"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ubicación</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                        placeholder="Santiago, Chile"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Promedio (opcional)</Label>
                      <Input
                        value={edu.gpa || ""}
                        onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                        placeholder="6.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Inicio</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Fin</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={edu.description || ""}
                      onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                      placeholder="Describe tu formación académica, especialización, tesis, etc."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              {cvData.education.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No has agregado información educativa aún.</p>
                  <p className="text-sm">Haz clic en "Agregar Educación" para comenzar.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Experiencia Laboral</CardTitle>
                <Button onClick={addExperience} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Experiencia
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {cvData.experience.map((exp, index) => (
                <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Experiencia #{index + 1}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cargo</Label>
                      <Input
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(exp.id, "jobTitle", e.target.value)}
                        placeholder="Ingeniero de Software Senior"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Empresa</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="NotCo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ubicación</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                        placeholder="Santiago, Chile"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Inicio</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Fin</Label>
                      <Input
                        type="month"
                        value={exp.endDate || ""}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        placeholder="Dejar vacío si es trabajo actual"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción del Trabajo</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="Describe tus responsabilidades principales y el impacto de tu trabajo..."
                      rows={4}
                    />
                  </div>

                  {/* Achievements */}
                  <div className="space-y-2">
                    <Label>Logros Principales</Label>
                    <div className="space-y-2">
                      {(exp.achievements || []).map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-center gap-2">
                          <Input value={achievement} readOnly className="flex-1" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("experience", exp.id, "achievements", achIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Ej: Reducción de latencia del sistema en 40%"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const target = e.target as HTMLInputElement
                              addArrayItem("experience", target.value, exp.id, "achievements")
                              target.value = ""
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = (e.target as HTMLElement).parentElement?.querySelector(
                              "input",
                            ) as HTMLInputElement
                            if (input) {
                              addArrayItem("experience", input.value, exp.id, "achievements")
                              input.value = ""
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <Label>Tecnologías Utilizadas</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {(exp.technologies || []).map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="flex items-center gap-1">
                            {tech}
                            <button
                              onClick={() => removeArrayItem("experience", exp.id, "technologies", techIndex)}
                              className="ml-1 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Ej: React, Node.js, AWS"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const target = e.target as HTMLInputElement
                              addArrayItem("experience", target.value, exp.id, "technologies")
                              target.value = ""
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = (e.target as HTMLElement).parentElement?.querySelector(
                              "input",
                            ) as HTMLInputElement
                            if (input) {
                              addArrayItem("experience", input.value, exp.id, "technologies")
                              input.value = ""
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {cvData.experience.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No has agregado experiencia laboral aún.</p>
                  <p className="text-sm">Haz clic en "Agregar Experiencia" para comenzar.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Proyectos</CardTitle>
                <Button onClick={addProject} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Proyecto
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {cvData.projects.map((project, index) => (
                <div key={project.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Proyecto #{index + 1}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre del Proyecto</Label>
                      <Input
                        value={project.name}
                        onChange={(e) => updateProject(project.id, "name", e.target.value)}
                        placeholder="E-commerce Platform Chile"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tu Rol</Label>
                      <Input
                        value={project.role || ""}
                        onChange={(e) => updateProject(project.id, "role", e.target.value)}
                        placeholder="Full Stack Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL del Proyecto</Label>
                      <Input
                        value={project.url || ""}
                        onChange={(e) => updateProject(project.id, "url", e.target.value)}
                        placeholder="https://proyecto.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub URL</Label>
                      <Input
                        value={project.githubUrl || ""}
                        onChange={(e) => updateProject(project.id, "githubUrl", e.target.value)}
                        placeholder="https://github.com/usuario/proyecto"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, "description", e.target.value)}
                      placeholder="Describe el proyecto, su propósito, tu contribución y el impacto..."
                      rows={3}
                    />
                  </div>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <Label>Tecnologías</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="flex items-center gap-1">
                            {tech}
                            <button
                              onClick={() => removeArrayItem("projects", project.id, "technologies", techIndex)}
                              className="ml-1 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Ej: React, Node.js, PostgreSQL"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const target = e.target as HTMLInputElement
                              addArrayItem("projects", target.value, project.id, "technologies")
                              target.value = ""
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = (e.target as HTMLElement).parentElement?.querySelector(
                              "input",
                            ) as HTMLInputElement
                            if (input) {
                              addArrayItem("projects", input.value, project.id, "technologies")
                              input.value = ""
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {cvData.projects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No has agregado proyectos aún.</p>
                  <p className="text-sm">Haz clic en "Agregar Proyecto" para comenzar.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Habilidades</CardTitle>
                <Button onClick={addSkill} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Habilidad
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {cvData.skills.map((skill, index) => (
                <div key={skill.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Habilidad #{index + 1}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de la Habilidad</Label>
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                        placeholder="JavaScript"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select
                        value={skill.category}
                        onValueChange={(value) => updateSkill(skill.id, "category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Frontend">Frontend</SelectItem>
                          <SelectItem value="Backend">Backend</SelectItem>
                          <SelectItem value="Database">Base de Datos</SelectItem>
                          <SelectItem value="Cloud">Cloud</SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                          <SelectItem value="Mobile">Móvil</SelectItem>
                          <SelectItem value="Blanda">Habilidad Blanda</SelectItem>
                          <SelectItem value="Técnica">Técnica</SelectItem>
                          <SelectItem value="Otras">Otras</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Años de Experiencia</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={skill.yearsOfExperience || 1}
                        onChange={(e) => updateSkill(skill.id, "yearsOfExperience", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nivel de Competencia: {skill.level}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, "level", Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Principiante</span>
                      <span>Intermedio</span>
                      <span>Avanzado</span>
                      <span>Experto</span>
                    </div>
                  </div>
                </div>
              ))}
              {cvData.skills.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No has agregado habilidades aún.</p>
                  <p className="text-sm">Haz clic en "Agregar Habilidad" para comenzar.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Idiomas</CardTitle>
                <Button onClick={addLanguage} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Idioma
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {cvData.languages.map((language, index) => (
                <div key={language.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Idioma #{index + 1}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeLanguage(language.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Idioma</Label>
                      <Input
                        value={language.name}
                        onChange={(e) => updateLanguage(language.id, "name", e.target.value)}
                        placeholder="Español"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nivel de Competencia</Label>
                      <Select
                        value={language.proficiency}
                        onValueChange={(value) => updateLanguage(language.id, "proficiency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                          <SelectItem value="Profesional">Profesional</SelectItem>
                          <SelectItem value="Nativo">Nativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              {cvData.languages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Languages className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No has agregado idiomas aún.</p>
                  <p className="text-sm">Haz clic en "Agregar Idioma" para comenzar.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Certificaciones</CardTitle>
                <Button onClick={addCertification} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Certificación
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {cvData.certifications.map((cert, index) => (
                <div key={cert.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Certificación #{index + 1}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCertification(cert.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de la Certificación</Label>
                      <Input
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                        placeholder="AWS Solutions Architect Associate"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Emisor</Label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                        placeholder="Amazon Web Services"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Emisión</Label>
                      <Input
                        type="month"
                        value={cert.issueDate}
                        onChange={(e) => updateCertification(cert.id, "issueDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Expiración (opcional)</Label>
                      <Input
                        type="month"
                        value={cert.expiryDate || ""}
                        onChange={(e) => updateCertification(cert.id, "expiryDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ID de Credencial (opcional)</Label>
                      <Input
                        value={cert.credentialId || ""}
                        onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                        placeholder="AWS-SAA-2023-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL de Verificación (opcional)</Label>
                      <Input
                        value={cert.url || ""}
                        onChange={(e) => updateCertification(cert.id, "url", e.target.value)}
                        placeholder="https://aws.amazon.com/certification/"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {cvData.certifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Certificate className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No has agregado certificaciones aún.</p>
                  <p className="text-sm">Haz clic en "Agregar Certificación" para comenzar.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar CV
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
