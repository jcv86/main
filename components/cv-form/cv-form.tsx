"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages,
  FolderOpen,
  Plus,
  Trash2,
  Edit,
  Save,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Star,
  Link,
  Github,
} from "lucide-react"
import {
  type CVData,
  chileanCities,
  chileanUniversities,
  commonSkillsChile,
  generateId,
  type Experience,
  type Education,
  type Project,
  type Certification,
  type Skill,
  type Language,
} from "@/lib/cv-types"

interface CVFormProps {
  data: CVData
  onChange: (data: CVData) => void
}

export function CVForm({ data, onChange }: CVFormProps) {
  const [activeSection, setActiveSection] = useState<string>("personal")
  const [editingExperience, setEditingExperience] = useState<string | null>(null)
  const [editingEducation, setEditingEducation] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editingCertification, setEditingCertification] = useState<string | null>(null)

  const updateData = (section: keyof CVData, newData: any) => {
    onChange({
      ...data,
      [section]: newData,
    })
  }

  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    updateData("personalInfo", {
      ...data.personalInfo,
      [field]: value,
    })
  }

  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      location: "",
      achievements: [],
    }
    updateData("experience", [...data.experience, newExperience])
    setEditingExperience(newExperience.id)
  }

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    const updated = data.experience.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    updateData("experience", updated)
  }

  const removeExperience = (id: string) => {
    updateData(
      "experience",
      data.experience.filter((exp) => exp.id !== id),
    )
    toast.success("Experiencia eliminada")
  }

  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      honors: "",
      relevantCourses: [],
    }
    updateData("education", [...data.education, newEducation])
    setEditingEducation(newEducation.id)
  }

  const updateEducation = (id: string, updates: Partial<Education>) => {
    const updated = data.education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu))
    updateData("education", updated)
  }

  const removeEducation = (id: string) => {
    updateData(
      "education",
      data.education.filter((edu) => edu.id !== id),
    )
    toast.success("Educación eliminada")
  }

  const addSkill = (category: "technical" | "soft") => {
    const newSkill: Skill = {
      name: "",
      level: "Básico",
      category,
    }
    updateData("skills", {
      ...data.skills,
      [category]: [...data.skills[category], newSkill],
    })
  }

  const updateSkill = (category: "technical" | "soft", index: number, updates: Partial<Skill>) => {
    const updated = data.skills[category].map((skill, i) => (i === index ? { ...skill, ...updates } : skill))
    updateData("skills", {
      ...data.skills,
      [category]: updated,
    })
  }

  const removeSkill = (category: "technical" | "soft", index: number) => {
    const updated = data.skills[category].filter((_, i) => i !== index)
    updateData("skills", {
      ...data.skills,
      [category]: updated,
    })
  }

  const addLanguage = () => {
    const newLanguage: Language = {
      name: "",
      level: "Básico",
      certifications: [],
    }
    updateData("skills", {
      ...data.skills,
      languages: [...data.skills.languages, newLanguage],
    })
  }

  const updateLanguage = (index: number, updates: Partial<Language>) => {
    const updated = data.skills.languages.map((lang, i) => (i === index ? { ...lang, ...updates } : lang))
    updateData("skills", {
      ...data.skills,
      languages: updated,
    })
  }

  const removeLanguage = (index: number) => {
    updateData("skills", {
      ...data.skills,
      languages: data.skills.languages.filter((_, i) => i !== index),
    })
  }

  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      current: false,
      url: "",
      github: "",
      role: "",
      teamSize: undefined,
      achievements: [],
    }
    updateData("projects", [...data.projects, newProject])
    setEditingProject(newProject.id)
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updated = data.projects.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj))
    updateData("projects", updated)
  }

  const removeProject = (id: string) => {
    updateData(
      "projects",
      data.projects.filter((proj) => proj.id !== id),
    )
    toast.success("Proyecto eliminado")
  }

  const addCertification = () => {
    const newCertification: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: "",
      skills: [],
    }
    updateData("certifications", [...data.certifications, newCertification])
    setEditingCertification(newCertification.id)
  }

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    const updated = data.certifications.map((cert) => (cert.id === id ? { ...cert, ...updates } : cert))
    updateData("certifications", updated)
  }

  const removeCertification = (id: string) => {
    updateData(
      "certifications",
      data.certifications.filter((cert) => cert.id !== id),
    )
    toast.success("Certificación eliminada")
  }

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        {/* Personal Information */}
        <AccordionItem value="personal">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Información Personal</span>
              <Badge variant="outline">Requerido</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Nombre Completo *</span>
                      </Label>
                      <Input
                        placeholder="Ej: Juan Carlos Pérez González"
                        value={data.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>Email *</span>
                      </Label>
                      <Input
                        type="email"
                        placeholder="juan.perez@email.com"
                        value={data.personalInfo.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>Teléfono *</span>
                      </Label>
                      <Input
                        placeholder="+56 9 1234 5678"
                        value={data.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>Ubicación *</span>
                      </Label>
                      <Select
                        value={data.personalInfo.location}
                        onValueChange={(value) => updatePersonalInfo("location", value)}
                      >
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

                    <div>
                      <Label className="flex items-center space-x-1">
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </Label>
                      <Input
                        placeholder="https://linkedin.com/in/tu-perfil"
                        value={data.personalInfo.linkedIn}
                        onChange={(e) => updatePersonalInfo("linkedIn", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>Sitio Web</span>
                      </Label>
                      <Input
                        placeholder="https://tu-portafolio.com"
                        value={data.personalInfo.website}
                        onChange={(e) => updatePersonalInfo("website", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Resumen Profesional *</Label>
                    <Textarea
                      placeholder="Describe tu experiencia, habilidades clave y objetivos profesionales..."
                      rows={4}
                      value={data.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Mínimo 50 caracteres, máximo 500. Destaca tu experiencia y objetivos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Experience */}
        <AccordionItem value="experience">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Experiencia Laboral</span>
              <Badge variant="secondary">{data.experience.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <Card key={exp.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{exp.company || "Nueva Empresa"}</CardTitle>
                        <CardDescription>{exp.position || "Nuevo Cargo"}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingExperience(editingExperience === exp.id ? null : exp.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {editingExperience === exp.id && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Empresa *</Label>
                          <Input
                            placeholder="Ej: Banco de Chile"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Cargo *</Label>
                          <Input
                            placeholder="Ej: Desarrollador Full Stack"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Fecha de Inicio *</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Fecha de Término</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            disabled={exp.current}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          />
                          <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                              id={`current-${exp.id}`}
                              checked={exp.current}
                              onCheckedChange={(checked) => updateExperience(exp.id, { current: !!checked })}
                            />
                            <Label htmlFor={`current-${exp.id}`}>Trabajo actual</Label>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <Label>Ubicación</Label>
                          <Input
                            placeholder="Ej: Santiago, Chile"
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Descripción *</Label>
                        <Textarea
                          placeholder="Describe tus responsabilidades principales, logros y tecnologías utilizadas..."
                          rows={4}
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        />
                      </div>
                      <Button onClick={() => setEditingExperience(null)} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Experiencia
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
              <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Experiencia
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Educación</span>
              <Badge variant="secondary">{data.education.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <Card key={edu.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{edu.institution || "Nueva Institución"}</CardTitle>
                        <CardDescription>
                          {edu.degree || "Nuevo Título"} en {edu.field || "Campo de Estudio"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEducation(editingEducation === edu.id ? null : edu.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {editingEducation === edu.id && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Institución *</Label>
                          <Select
                            value={edu.institution}
                            onValueChange={(value) => updateEducation(edu.id, { institution: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona universidad" />
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
                        <div>
                          <Label>Título *</Label>
                          <Input
                            placeholder="Ej: Ingeniería Civil Industrial"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Campo de Estudio *</Label>
                          <Input
                            placeholder="Ej: Ingeniería y Tecnología"
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Promedio (Opcional)</Label>
                          <Input
                            placeholder="Ej: 6.2"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Fecha de Inicio *</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Fecha de Graduación</Label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            disabled={edu.current}
                            onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                          />
                          <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                              id={`current-edu-${edu.id}`}
                              checked={edu.current}
                              onCheckedChange={(checked) => updateEducation(edu.id, { current: !!checked })}
                            />
                            <Label htmlFor={`current-edu-${edu.id}`}>Estudiando actualmente</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Distinciones</Label>
                        <Input
                          placeholder="Ej: Magna Cum Laude, Mejor Alumno"
                          value={edu.honors}
                          onChange={(e) => updateEducation(edu.id, { honors: e.target.value })}
                        />
                      </div>
                      <Button onClick={() => setEditingEducation(null)} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Educación
                      </Button>
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

        {/* Skills */}
        <AccordionItem value="skills">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Habilidades</span>
              <Badge variant="secondary">{data.skills.technical.length + data.skills.soft.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              {/* Technical Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>Habilidades Técnicas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.skills.technical.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Ej: JavaScript"
                        value={skill.name}
                        onChange={(e) => updateSkill("technical", index, { name: e.target.value })}
                        className="flex-1"
                      />
                      <Select
                        value={skill.level}
                        onValueChange={(value: any) => updateSkill("technical", index, { level: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                          <SelectItem value="Experto">Experto</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => removeSkill("technical", index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => addSkill("technical")} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Habilidad Técnica
                  </Button>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">Sugerencias:</span>
                    {commonSkillsChile.slice(0, 10).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => {
                          if (!data.skills.technical.find((s) => s.name === skill)) {
                            addSkill("technical")
                            const newIndex = data.skills.technical.length
                            updateSkill("technical", newIndex, { name: skill, level: "Intermedio" })
                          }
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Soft Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Habilidades Blandas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.skills.soft.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Ej: Liderazgo"
                        value={skill.name}
                        onChange={(e) => updateSkill("soft", index, { name: e.target.value })}
                        className="flex-1"
                      />
                      <Select
                        value={skill.level}
                        onValueChange={(value: any) => updateSkill("soft", index, { level: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                          <SelectItem value="Experto">Experto</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => removeSkill("soft", index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => addSkill("soft")} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Habilidad Blanda
                  </Button>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">Sugerencias:</span>
                    {commonSkillsChile.slice(10, 20).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => {
                          if (!data.skills.soft.find((s) => s.name === skill)) {
                            addSkill("soft")
                            const newIndex = data.skills.soft.length
                            updateSkill("soft", newIndex, { name: skill, level: "Intermedio" })
                          }
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Languages className="h-5 w-5" />
                    <span>Idiomas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.skills.languages.map((language, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Ej: Inglés"
                        value={language.name}
                        onChange={(e) => updateLanguage(index, { name: e.target.value })}
                        className="flex-1"
                      />
                      <Select
                        value={language.level}
                        onValueChange={(value: any) => updateLanguage(index, { level: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                          <SelectItem value="Nativo">Nativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => removeLanguage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addLanguage} variant="outline" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Idioma
                  </Button>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <span>Proyectos</span>
              <Badge variant="secondary">{data.projects.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.name || "Nuevo Proyecto"}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description || "Descripción del proyecto"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProject(editingProject === project.id ? null : project.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {editingProject === project.id && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nombre del Proyecto *</Label>
                          <Input
                            placeholder="Ej: Sistema de Gestión Empresarial"
                            value={project.name}
                            onChange={(e) => updateProject(project.id, { name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Tu Rol</Label>
                          <Input
                            placeholder="Ej: Desarrollador Full Stack"
                            value={project.role}
                            onChange={(e) => updateProject(project.id, { role: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Fecha de Inicio *</Label>
                          <Input
                            type="month"
                            value={project.startDate}
                            onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Fecha de Finalización</Label>
                          <Input
                            type="month"
                            value={project.endDate}
                            disabled={project.current}
                            onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                          />
                          <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                              id={`current-project-${project.id}`}
                              checked={project.current}
                              onCheckedChange={(checked) => updateProject(project.id, { current: !!checked })}
                            />
                            <Label htmlFor={`current-project-${project.id}`}>En desarrollo</Label>
                          </div>
                        </div>
                        <div>
                          <Label className="flex items-center space-x-1">
                            <Link className="h-4 w-4" />
                            <span>URL del Proyecto</span>
                          </Label>
                          <Input
                            placeholder="https://mi-proyecto.com"
                            value={project.url}
                            onChange={(e) => updateProject(project.id, { url: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="flex items-center space-x-1">
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                          </Label>
                          <Input
                            placeholder="https://github.com/usuario/proyecto"
                            value={project.github}
                            onChange={(e) => updateProject(project.id, { github: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Descripción *</Label>
                        <Textarea
                          placeholder="Describe el proyecto, su propósito, tu contribución y los resultados obtenidos..."
                          rows={4}
                          value={project.description}
                          onChange={(e) => updateProject(project.id, { description: e.target.value })}
                        />
                      </div>
                      <Button onClick={() => setEditingProject(null)} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Proyecto
                      </Button>
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

        {/* Certifications */}
        <AccordionItem value="certifications">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Certificaciones</span>
              <Badge variant="secondary">{data.certifications.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {data.certifications.map((cert, index) => (
                <Card key={cert.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{cert.name || "Nueva Certificación"}</CardTitle>
                        <CardDescription>{cert.issuer || "Emisor"}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCertification(editingCertification === cert.id ? null : cert.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeCertification(cert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {editingCertification === cert.id && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nombre de la Certificación *</Label>
                          <Input
                            placeholder="Ej: AWS Certified Solutions Architect"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Emisor *</Label>
                          <Input
                            placeholder="Ej: Amazon Web Services"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Fecha de Obtención *</Label>
                          <Input
                            type="month"
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Fecha de Expiración</Label>
                          <Input
                            type="month"
                            value={cert.expiryDate}
                            onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>ID de Credencial</Label>
                          <Input
                            placeholder="Ej: ABC123456"
                            value={cert.credentialId}
                            onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>URL de Verificación</Label>
                          <Input
                            placeholder="https://verify.certification.com"
                            value={cert.url}
                            onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button onClick={() => setEditingCertification(null)} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Certificación
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
              <Button onClick={addCertification} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Certificación
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
