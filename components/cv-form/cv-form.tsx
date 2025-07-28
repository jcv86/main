"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save } from "lucide-react"
import type { CVData, Education, Experience, Project, Skill } from "@/lib/cv-types"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface CVFormProps {
  data: CVData
  onChange: (data: CVData) => void
  onSave: () => void
}

export default function CVForm({ data, onChange, onSave }: CVFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    })
  }

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    onChange({
      ...data,
      education: [...data.education, newEducation],
    })
  }

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    })
  }

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    })
  }

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      location: "",
    }
    onChange({
      ...data,
      experience: [...data.experience, newExperience],
    })
  }

  const updateExperience = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    })
  }

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      url: "",
      startDate: "",
      endDate: "",
    }
    onChange({
      ...data,
      projects: [...data.projects, newProject],
    })
  }

  const updateProject = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      projects: data.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)),
    })
  }

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((proj) => proj.id !== id),
    })
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "Intermedio",
      category: "Técnica",
    }
    onChange({
      ...data,
      skills: [...data.skills, newSkill],
    })
  }

  const updateSkill = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)),
    })
  }

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave()
      toast.success("CV guardado exitosamente")
    } catch (error) {
      toast.error("Error al guardar el CV")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Editor de CV</h2>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Guardando..." : "Guardar CV"}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="education">Educación</TabsTrigger>
          <TabsTrigger value="experience">Experiencia</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    value={data.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={data.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={data.personalInfo.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={data.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    value={data.personalInfo.website}
                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="summary">Resumen Profesional</Label>
                <Textarea
                  id="summary"
                  rows={4}
                  value={data.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Educación</h3>
            <Button onClick={addEducation} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Educación
            </Button>
          </div>
          {data.education.map((edu) => (
            <Card key={edu.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => removeEducation(edu.id)} variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Institución</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Título</Label>
                      <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} />
                    </div>
                    <div>
                      <Label>Campo de Estudio</Label>
                      <Input value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Fecha Inicio</Label>
                        <Input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Fecha Fin</Label>
                        <Input
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Experiencia Laboral</h3>
            <Button onClick={addExperience} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Experiencia
            </Button>
          </div>
          {data.experience.map((exp) => (
            <Card key={exp.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => removeExperience(exp.id)} variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Empresa</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Cargo</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Ubicación</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Fecha Inicio</Label>
                        <Input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Fecha Fin</Label>
                        <Input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      rows={3}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Proyectos</h3>
            <Button onClick={addProject} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Proyecto
            </Button>
          </div>
          {data.projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => removeProject(project.id)} variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre del Proyecto</Label>
                      <Input value={project.name} onChange={(e) => updateProject(project.id, "name", e.target.value)} />
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input value={project.url} onChange={(e) => updateProject(project.id, "url", e.target.value)} />
                    </div>
                    <div>
                      <Label>Tecnologías</Label>
                      <Input
                        value={project.technologies}
                        onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                        placeholder="React, Node.js, PostgreSQL"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Fecha Inicio</Label>
                        <Input
                          type="date"
                          value={project.startDate}
                          onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Fecha Fin</Label>
                        <Input
                          type="date"
                          value={project.endDate}
                          onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      rows={3}
                      value={project.description}
                      onChange={(e) => updateProject(project.id, "description", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Habilidades</h3>
            <Button onClick={addSkill} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Habilidad
            </Button>
          </div>
          <div className="grid gap-4">
            {data.skills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>Habilidad</Label>
                      <Input value={skill.name} onChange={(e) => updateSkill(skill.id, "name", e.target.value)} />
                    </div>
                    <div className="w-32">
                      <Label>Nivel</Label>
                      <select
                        className="w-full p-2 border rounded"
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
                      >
                        <option value="Básico">Básico</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                        <option value="Experto">Experto</option>
                      </select>
                    </div>
                    <div className="w-32">
                      <Label>Categoría</Label>
                      <select
                        className="w-full p-2 border rounded"
                        value={skill.category}
                        onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                      >
                        <option value="Técnica">Técnica</option>
                        <option value="Blanda">Blanda</option>
                        <option value="Idioma">Idioma</option>
                      </select>
                    </div>
                    <Button onClick={() => removeSkill(skill.id)} variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
