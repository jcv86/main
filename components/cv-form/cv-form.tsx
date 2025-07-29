"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Globe,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  MapPin,
  Mail,
  Phone,
} from "lucide-react"
import {
  type CVData,
  type Experience,
  type Education,
  type Skill,
  type Project,
  type Certification,
  type Language,
  CHILEAN_CITIES,
  CHILEAN_UNIVERSITIES,
  COMMON_SKILLS,
  LANGUAGES,
} from "@/lib/cv-types"
import { toast } from "sonner"

interface CVFormProps {
  cvData: CVData
  onDataChange: (data: CVData) => void
}

export function CVForm({ cvData, onDataChange }: CVFormProps) {
  const [editingExperience, setEditingExperience] = useState<string | null>(null)
  const [editingEducation, setEditingEducation] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)

  // Función para actualizar información personal
  const updatePersonalInfo = (field: string, value: string) => {
    onDataChange({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    })
  }

  // Función para agregar experiencia
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
      location: "",
    }
    onDataChange({
      ...cvData,
      experiences: [...cvData.experiences, newExperience],
    })
    setEditingExperience(newExperience.id)
  }

  // Función para actualizar experiencia
  const updateExperience = (id: string, field: string, value: any) => {
    onDataChange({
      ...cvData,
      experiences: cvData.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  // Función para eliminar experiencia
  const removeExperience = (id: string) => {
    onDataChange({
      ...cvData,
      experiences: cvData.experiences.filter((exp) => exp.id !== id),
    })
    toast.success("Experiencia eliminada")
  }

  // Función para agregar educación
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
    }
    onDataChange({
      ...cvData,
      education: [...cvData.education, newEducation],
    })
    setEditingEducation(newEducation.id)
  }

  // Función para actualizar educación
  const updateEducation = (id: string, field: string, value: any) => {
    onDataChange({
      ...cvData,
      education: cvData.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    })
  }

  // Función para eliminar educación
  const removeEducation = (id: string) => {
    onDataChange({
      ...cvData,
      education: cvData.education.filter((edu) => edu.id !== id),
    })
    toast.success("Educación eliminada")
  }

  // Función para agregar habilidad
  const addSkill = (skillName: string) => {
    if (cvData.skills.find((s) => s.name === skillName)) {
      toast.error("Esta habilidad ya está agregada")
      return
    }

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: skillName,
      level: "Intermedio",
      category: "Técnica",
    }
    onDataChange({
      ...cvData,
      skills: [...cvData.skills, newSkill],
    })
    toast.success("Habilidad agregada")
  }

  // Función para actualizar habilidad
  const updateSkill = (id: string, field: string, value: any) => {
    onDataChange({
      ...cvData,
      skills: cvData.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)),
    })
  }

  // Función para eliminar habilidad
  const removeSkill = (id: string) => {
    onDataChange({
      ...cvData,
      skills: cvData.skills.filter((skill) => skill.id !== id),
    })
    toast.success("Habilidad eliminada")
  }

  // Función para agregar proyecto
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      current: false,
      achievements: [],
    }
    onDataChange({
      ...cvData,
      projects: [...cvData.projects, newProject],
    })
    setEditingProject(newProject.id)
  }

  // Función para actualizar proyecto
  const updateProject = (id: string, field: string, value: any) => {
    onDataChange({
      ...cvData,
      projects: cvData.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)),
    })
  }

  // Función para eliminar proyecto
  const removeProject = (id: string) => {
    onDataChange({
      ...cvData,
      projects: cvData.projects.filter((project) => project.id !== id),
    })
    toast.success("Proyecto eliminado")
  }

  // Función para agregar certificación
  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
    }
    onDataChange({
      ...cvData,
      certifications: [...cvData.certifications, newCertification],
    })
  }

  // Función para actualizar certificación
  const updateCertification = (id: string, field: string, value: any) => {
    onDataChange({
      ...cvData,
      certifications: cvData.certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)),
    })
  }

  // Función para eliminar certificación
  const removeCertification = (id: string) => {
    onDataChange({
      ...cvData,
      certifications: cvData.certifications.filter((cert) => cert.id !== id),
    })
    toast.success("Certificación eliminada")
  }

  // Función para agregar idioma
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: "",
      level: "Intermedio",
    }
    onDataChange({
      ...cvData,
      languages: [...cvData.languages, newLanguage],
    })
  }

  // Función para actualizar idioma
  const updateLanguage = (id: string, field: string, value: any) => {
    onDataChange({
      ...cvData,
      languages: cvData.languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)),
    })
  }

  // Función para eliminar idioma
  const removeLanguage = (id: string) => {
    onDataChange({
      ...cvData,
      languages: cvData.languages.filter((lang) => lang.id !== id),
    })
    toast.success("Idioma eliminado")
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["personal", "experience"]} className="space-y-4">
        {/* Información Personal */}
        <AccordionItem value="personal">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Datos Básicos</CardTitle>
                <CardDescription>Información fundamental que aparecerá en tu CV</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      placeholder="Ej: Juan Carlos"
                      value={cvData.personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellidos *</Label>
                    <Input
                      id="lastName"
                      placeholder="Ej: González Pérez"
                      value={cvData.personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan.gonzalez@email.com"
                        className="pl-10"
                        value={cvData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+56 9 1234 5678"
                        className="pl-10"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Select value={cvData.personalInfo.city} onValueChange={(value) => updatePersonalInfo("city", value)}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Selecciona tu ciudad" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {CHILEAN_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Resumen Profesional</Label>
                  <Textarea
                    id="summary"
                    placeholder="Describe brevemente tu experiencia, habilidades clave y objetivos profesionales. Mínimo 50 caracteres para un resumen efectivo."
                    rows={4}
                    value={cvData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground">
                    {cvData.personalInfo.summary.length}/50 caracteres mínimos
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Enlaces Profesionales (Opcional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        placeholder="linkedin.com/in/tu-perfil"
                        value={cvData.personalInfo.linkedin || ""}
                        onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        placeholder="www.tu-sitio.com"
                        value={cvData.personalInfo.website || ""}
                        onChange={(e) => updatePersonalInfo("website", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        placeholder="github.com/tu-usuario"
                        value={cvData.personalInfo.github || ""}
                        onChange={(e) => updatePersonalInfo("github", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Experiencia Laboral */}
        <AccordionItem value="experience">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experiencia Laboral ({cvData.experiences.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.experiences.map((experience, index) => (
                <Card key={experience.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{experience.company || `Experiencia ${index + 1}`}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setEditingExperience(editingExperience === experience.id ? null : experience.id)
                          }
                        >
                          {editingExperience === experience.id ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeExperience(experience.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {editingExperience === experience.id && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Empresa *</Label>
                          <Input
                            placeholder="Ej: Banco de Chile"
                            value={experience.company}
                            onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cargo *</Label>
                          <Input
                            placeholder="Ej: Desarrollador Full Stack"
                            value={experience.position}
                            onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Fecha de Inicio</Label>
                          <Input
                            type="month"
                            value={experience.startDate}
                            onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha de Fin</Label>
                          <Input
                            type="month"
                            disabled={experience.current}
                            value={experience.endDate}
                            onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            id={`current-${experience.id}`}
                            checked={experience.current}
                            onCheckedChange={(checked) => updateExperience(experience.id, "current", checked)}
                          />
                          <Label htmlFor={`current-${experience.id}`}>Trabajo actual</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Ubicación</Label>
                        <Input
                          placeholder="Ej: Santiago, Chile"
                          value={experience.location}
                          onChange={(e) => updateExperience(experience.id, "location", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción del Trabajo</Label>
                        <Textarea
                          placeholder="Describe tus responsabilidades principales, proyectos destacados y logros cuantificables..."
                          rows={3}
                          value={experience.description}
                          onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={() => setEditingExperience(null)} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Guardar
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Experiencia Laboral
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Educación */}
        <AccordionItem value="education">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Educación ({cvData.education.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.education.map((education, index) => (
                <Card key={education.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{education.institution || `Educación ${index + 1}`}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEducation(editingEducation === education.id ? null : education.id)}
                        >
                          {editingEducation === education.id ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(education.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {editingEducation === education.id && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Institución *</Label>
                          <Select
                            value={education.institution}
                            onValueChange={(value) => updateEducation(education.id, "institution", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu institución" />
                            </SelectTrigger>
                            <SelectContent>
                              {CHILEAN_UNIVERSITIES.map((university) => (
                                <SelectItem key={university} value={university}>
                                  {university}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Título/Grado *</Label>
                          <Input
                            placeholder="Ej: Ingeniería en Informática"
                            value={education.degree}
                            onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Área de Estudio</Label>
                        <Input
                          placeholder="Ej: Ciencias de la Computación"
                          value={education.field}
                          onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Fecha de Inicio</Label>
                          <Input
                            type="month"
                            value={education.startDate}
                            onChange={(e) => updateEducation(education.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha de Fin</Label>
                          <Input
                            type="month"
                            disabled={education.current}
                            value={education.endDate}
                            onChange={(e) => updateEducation(education.id, "endDate", e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            id={`current-edu-${education.id}`}
                            checked={education.current}
                            onCheckedChange={(checked) => updateEducation(education.id, "current", checked)}
                          />
                          <Label htmlFor={`current-edu-${education.id}`}>En curso</Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Promedio (Opcional)</Label>
                          <Input
                            placeholder="Ej: 6.5"
                            value={education.gpa || ""}
                            onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción Adicional</Label>
                        <Textarea
                          placeholder="Menciona proyectos destacados, reconocimientos, actividades extracurriculares..."
                          rows={2}
                          value={education.description || ""}
                          onChange={(e) => updateEducation(education.id, "description", e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={() => setEditingEducation(null)} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Guardar
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Educación
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Habilidades */}
        <AccordionItem value="skills">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Habilidades ({cvData.skills.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Habilidades Existentes */}
              {cvData.skills.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cvData.skills.map((skill) => (
                    <Card key={skill.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeSkill(skill.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Select value={skill.level} onValueChange={(value) => updateSkill(skill.id, "level", value)}>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Agregar Habilidades Sugeridas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Habilidades Sugeridas</CardTitle>
                  <CardDescription>Haz clic en las habilidades que dominas para agregarlas a tu CV</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_SKILLS.filter((skill) => !cvData.skills.find((s) => s.name === skill)).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addSkill(skill)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Proyectos */}
        <AccordionItem value="projects">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Proyectos ({cvData.projects.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.projects.map((project, index) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{project.name || `Proyecto ${index + 1}`}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProject(editingProject === project.id ? null : project.id)}
                        >
                          {editingProject === project.id ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {editingProject === project.id && (
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nombre del Proyecto *</Label>
                        <Input
                          placeholder="Ej: Sistema de Gestión de Inventarios"
                          value={project.name}
                          onChange={(e) => updateProject(project.id, "name", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea
                          placeholder="Describe el proyecto, su propósito y tu rol..."
                          rows={3}
                          value={project.description}
                          onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Fecha de Inicio</Label>
                          <Input
                            type="month"
                            value={project.startDate}
                            onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha de Fin</Label>
                          <Input
                            type="month"
                            disabled={project.current}
                            value={project.endDate}
                            onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            id={`current-project-${project.id}`}
                            checked={project.current}
                            onCheckedChange={(checked) => updateProject(project.id, "current", checked)}
                          />
                          <Label htmlFor={`current-project-${project.id}`}>En desarrollo</Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>URL del Proyecto</Label>
                          <Input
                            placeholder="https://mi-proyecto.com"
                            value={project.url || ""}
                            onChange={(e) => updateProject(project.id, "url", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>GitHub</Label>
                          <Input
                            placeholder="https://github.com/usuario/proyecto"
                            value={project.github || ""}
                            onChange={(e) => updateProject(project.id, "github", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={() => setEditingProject(null)} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Guardar
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              <Button onClick={addProject} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Proyecto
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Certificaciones */}
        <AccordionItem value="certifications">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificaciones ({cvData.certifications.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.certifications.map((certification, index) => (
                <Card key={certification.id}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre de la Certificación</Label>
                        <Input
                          placeholder="Ej: AWS Certified Solutions Architect"
                          value={certification.name}
                          onChange={(e) => updateCertification(certification.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Emisor</Label>
                        <Input
                          placeholder="Ej: Amazon Web Services"
                          value={certification.issuer}
                          onChange={(e) => updateCertification(certification.id, "issuer", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>Fecha de Obtención</Label>
                        <Input
                          type="date"
                          value={certification.date}
                          onChange={(e) => updateCertification(certification.id, "date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha de Expiración</Label>
                        <Input
                          type="date"
                          value={certification.expiryDate || ""}
                          onChange={(e) => updateCertification(certification.id, "expiryDate", e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button variant="ghost" size="sm" onClick={() => removeCertification(certification.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>ID de Credencial</Label>
                        <Input
                          placeholder="Ej: ABC123456"
                          value={certification.credentialId || ""}
                          onChange={(e) => updateCertification(certification.id, "credentialId", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL de Verificación</Label>
                        <Input
                          placeholder="https://verify.example.com"
                          value={certification.url || ""}
                          onChange={(e) => updateCertification(certification.id, "url", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addCertification} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Certificación
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Idiomas */}
        <AccordionItem value="languages">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Idiomas ({cvData.languages.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.languages.map((language, index) => (
                <Card key={language.id}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Idioma</Label>
                        <Select
                          value={language.name}
                          onValueChange={(value) => updateLanguage(language.id, "name", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Nivel</Label>
                        <Select
                          value={language.level}
                          onValueChange={(value) => updateLanguage(language.id, "level", value)}
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
                      <div className="flex items-end">
                        <Button variant="ghost" size="sm" onClick={() => removeLanguage(language.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label>Certificación (Opcional)</Label>
                      <Input
                        placeholder="Ej: TOEFL 95, DELE B2"
                        value={language.certification || ""}
                        onChange={(e) => updateLanguage(language.id, "certification", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addLanguage} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Idioma
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
