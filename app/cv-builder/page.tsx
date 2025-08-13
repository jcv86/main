"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Trash2,
  Download,
  Eye,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import {
  type CVData,
  type PersonalInfo,
  type Experience,
  type Education,
  type Skill,
  type Project,
  type Certification,
  type Language,
  generateId,
  chileanCities,
  chileanUniversities,
  commonSkillsChile,
  calculateCVCompletion,
  getDefaultCVData,
  validatePersonalInfo,
  validateExperience,
  validateEducation,
} from "@/lib/cv-types"

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState<CVData>(getDefaultCVData())
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load saved CV data on component mount
  useEffect(() => {
    loadCVData()
  }, [])

  const loadCVData = () => {
    try {
      const savedData = localStorage.getItem("cvData")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Ensure all arrays exist with fallbacks
        setCvData({
          personalInfo: parsedData.personalInfo || getDefaultCVData().personalInfo,
          education: Array.isArray(parsedData.education) ? parsedData.education : [],
          experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
          skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
          projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
          certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : [],
          languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
          references: Array.isArray(parsedData.references) ? parsedData.references : [],
        })
      }
    } catch (error) {
      console.error("Error loading CV data:", error)
      setCvData(getDefaultCVData())
    }
  }

  const saveCVData = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem("cvData", JSON.stringify(cvData))
      toast.success("CV guardado exitosamente")
    } catch (error) {
      console.error("Error saving CV data:", error)
      toast.error("Error al guardar el CV")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDataChange = (section: keyof CVData, data: any) => {
    setCvData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const addItem = (section: keyof CVData, item: any) => {
    setCvData((prev) => {
      const currentArray = Array.isArray(prev[section]) ? (prev[section] as any[]) : []
      return {
        ...prev,
        [section]: [...currentArray, { ...item, id: generateId() }],
      }
    })
  }

  const updateItem = (section: keyof CVData, id: string, updatedItem: any) => {
    setCvData((prev) => {
      const currentArray = Array.isArray(prev[section]) ? (prev[section] as any[]) : []
      return {
        ...prev,
        [section]: currentArray.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
      }
    })
  }

  const removeItem = (section: keyof CVData, id: string) => {
    setCvData((prev) => {
      const currentArray = Array.isArray(prev[section]) ? (prev[section] as any[]) : []
      return {
        ...prev,
        [section]: currentArray.filter((item) => item.id !== id),
      }
    })
  }

  const completion = calculateCVCompletion(cvData)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Constructor de CV</h1>
          <p className="text-muted-foreground mb-4">
            Crea tu CV profesional paso a paso con nuestro constructor intuitivo
          </p>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso del CV</span>
              <span className="text-sm text-muted-foreground">{completion}% completado</span>
            </div>
            <Progress value={completion} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={saveCVData} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Vista Previa
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Secciones</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-1">
                    <TabsTrigger value="personal" className="justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Información Personal
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="justify-start">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Experiencia
                    </TabsTrigger>
                    <TabsTrigger value="education" className="justify-start">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Educación
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="justify-start">
                      <Code className="w-4 h-4 mr-2" />
                      Habilidades
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Proyectos
                    </TabsTrigger>
                    <TabsTrigger value="certifications" className="justify-start">
                      <Award className="w-4 h-4 mr-2" />
                      Certificaciones
                    </TabsTrigger>
                    <TabsTrigger value="languages" className="justify-start">
                      <Languages className="w-4 h-4 mr-2" />
                      Idiomas
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Personal Information */}
              <TabsContent value="personal">
                <PersonalInfoSection
                  data={cvData.personalInfo}
                  onChange={(data) => handleDataChange("personalInfo", data)}
                />
              </TabsContent>

              {/* Experience */}
              <TabsContent value="experience">
                <ExperienceSection
                  data={cvData.experience || []}
                  onAdd={(item) => addItem("experience", item)}
                  onUpdate={(id, item) => updateItem("experience", id, item)}
                  onRemove={(id) => removeItem("experience", id)}
                />
              </TabsContent>

              {/* Education */}
              <TabsContent value="education">
                <EducationSection
                  data={cvData.education || []}
                  onAdd={(item) => addItem("education", item)}
                  onUpdate={(id, item) => updateItem("education", id, item)}
                  onRemove={(id) => removeItem("education", id)}
                />
              </TabsContent>

              {/* Skills */}
              <TabsContent value="skills">
                <SkillsSection
                  data={cvData.skills || []}
                  onAdd={(item) => addItem("skills", item)}
                  onUpdate={(id, item) => updateItem("skills", id, item)}
                  onRemove={(id) => removeItem("skills", id)}
                />
              </TabsContent>

              {/* Projects */}
              <TabsContent value="projects">
                <ProjectsSection
                  data={cvData.projects || []}
                  onAdd={(item) => addItem("projects", item)}
                  onUpdate={(id, item) => updateItem("projects", id, item)}
                  onRemove={(id) => removeItem("projects", id)}
                />
              </TabsContent>

              {/* Certifications */}
              <TabsContent value="certifications">
                <CertificationsSection
                  data={cvData.certifications || []}
                  onAdd={(item) => addItem("certifications", item)}
                  onUpdate={(id, item) => updateItem("certifications", id, item)}
                  onRemove={(id) => removeItem("certifications", id)}
                />
              </TabsContent>

              {/* Languages */}
              <TabsContent value="languages">
                <LanguagesSection
                  data={cvData.languages || []}
                  onAdd={(item) => addItem("languages", item)}
                  onUpdate={(id, item) => updateItem("languages", id, item)}
                  onRemove={(id) => removeItem("languages", id)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

// Personal Information Section Component
function PersonalInfoSection({ data, onChange }: { data: PersonalInfo; onChange: (data: PersonalInfo) => void }) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const errors = validatePersonalInfo(data)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>Completa tu información básica de contacto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Nombre Completo *</Label>
            <Input
              id="fullName"
              value={data.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Juan Pérez González"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="juan.perez@email.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              value={data.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+56 9 1234 5678"
            />
          </div>
          <div>
            <Label htmlFor="city">Ciudad *</Label>
            <Select value={data.city || ""} onValueChange={(value) => handleChange("city", value)}>
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
            <Label htmlFor="linkedIn">LinkedIn (opcional)</Label>
            <Input
              id="linkedIn"
              value={data.linkedIn || ""}
              onChange={(e) => handleChange("linkedIn", e.target.value)}
              placeholder="https://linkedin.com/in/tu-perfil"
            />
          </div>
          <div>
            <Label htmlFor="website">Sitio Web (opcional)</Label>
            <Input
              id="website"
              value={data.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://tu-sitio-web.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={data.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Av. Providencia 1234, Providencia"
          />
        </div>

        <div>
          <Label htmlFor="summary">Resumen Profesional</Label>
          <Textarea
            id="summary"
            value={data.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Describe brevemente tu experiencia, habilidades y objetivos profesionales..."
            rows={4}
          />
          <p className="text-sm text-muted-foreground mt-1">{(data.summary || "").length}/500 caracteres</p>
        </div>

        {errors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-sm font-medium text-destructive mb-1">Errores encontrados:</p>
            <ul className="text-sm text-destructive space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Experience Section Component
function ExperienceSection({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Experience[]
  onAdd: (item: Omit<Experience, "id">) => void
  onUpdate: (id: string, item: Partial<Experience>) => void
  onRemove: (id: string) => void
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [newExperience, setNewExperience] = useState<Omit<Experience, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: [],
  })

  const handleAdd = () => {
    const errors = validateExperience({ ...newExperience, id: "" })
    if (errors.length > 0) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    onAdd(newExperience)
    setNewExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    })
    setIsAdding(false)
    toast.success("Experiencia agregada exitosamente")
  }

  // Ensure data is always an array
  const experienceData = Array.isArray(data) ? data : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiencia Laboral</CardTitle>
        <CardDescription>Agrega tu experiencia profesional más relevante</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Experience Items */}
        {experienceData.length > 0 ? (
          experienceData.map((experience) => (
            <ExperienceItem
              key={experience.id}
              experience={experience}
              onUpdate={(updatedExp) => onUpdate(experience.id, updatedExp)}
              onRemove={() => onRemove(experience.id)}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No has agregado experiencia laboral aún. Haz clic en "Agregar Experiencia" para comenzar.
          </p>
        )}

        {/* Add New Experience Form */}
        {isAdding && (
          <Card className="border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Empresa *</Label>
                  <Input
                    value={newExperience.company}
                    onChange={(e) => setNewExperience((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Nombre de la empresa"
                  />
                </div>
                <div>
                  <Label>Cargo *</Label>
                  <Input
                    value={newExperience.position}
                    onChange={(e) => setNewExperience((prev) => ({ ...prev, position: e.target.value }))}
                    placeholder="Tu cargo o posición"
                  />
                </div>
                <div>
                  <Label>Fecha de Inicio *</Label>
                  <Input
                    type="date"
                    value={newExperience.startDate}
                    onChange={(e) => setNewExperience((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Fecha de Fin</Label>
                  <Input
                    type="date"
                    value={newExperience.endDate}
                    onChange={(e) => setNewExperience((prev) => ({ ...prev, endDate: e.target.value }))}
                    disabled={newExperience.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={newExperience.current}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : prev.endDate,
                    }))
                  }
                />
                <Label htmlFor="current">Trabajo actual</Label>
              </div>

              <div>
                <Label>Descripción *</Label>
                <Textarea
                  value={newExperience.description}
                  onChange={(e) => setNewExperience((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe tus responsabilidades y logros en este puesto..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAdd}>Agregar</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Experiencia
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Experience Item Component
function ExperienceItem({
  experience,
  onUpdate,
  onRemove,
}: {
  experience: Experience
  onUpdate: (exp: Partial<Experience>) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  if (!isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{experience.position}</h3>
            <p className="text-muted-foreground">{experience.company}</p>
            <p className="text-sm text-muted-foreground">
              {experience.startDate} - {experience.current ? "Presente" : experience.endDate}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button size="sm" variant="outline" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm">{experience.description}</p>
      </div>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Empresa *</Label>
            <Input value={experience.company} onChange={(e) => onUpdate({ company: e.target.value })} />
          </div>
          <div>
            <Label>Cargo *</Label>
            <Input value={experience.position} onChange={(e) => onUpdate({ position: e.target.value })} />
          </div>
          <div>
            <Label>Fecha de Inicio *</Label>
            <Input type="date" value={experience.startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} />
          </div>
          <div>
            <Label>Fecha de Fin</Label>
            <Input
              type="date"
              value={experience.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              disabled={experience.current}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`current-${experience.id}`}
            checked={experience.current}
            onChange={(e) =>
              onUpdate({
                current: e.target.checked,
                endDate: e.target.checked ? "" : experience.endDate,
              })
            }
          />
          <Label htmlFor={`current-${experience.id}`}>Trabajo actual</Label>
        </div>

        <div>
          <Label>Descripción *</Label>
          <Textarea
            value={experience.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(false)}>Guardar</Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Education Section Component
function EducationSection({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Education[]
  onAdd: (item: Omit<Education, "id">) => void
  onUpdate: (id: string, item: Partial<Education>) => void
  onRemove: (id: string) => void
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [newEducation, setNewEducation] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
    gpa: "",
    description: "",
  })

  const handleAdd = () => {
    const errors = validateEducation({ ...newEducation, id: "" })
    if (errors.length > 0) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    onAdd(newEducation)
    setNewEducation({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    })
    setIsAdding(false)
    toast.success("Educación agregada exitosamente")
  }

  // Ensure data is always an array
  const educationData = Array.isArray(data) ? data : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Educación</CardTitle>
        <CardDescription>Agrega tu formación académica</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Education Items */}
        {educationData.length > 0 ? (
          educationData.map((education) => (
            <EducationItem
              key={education.id}
              education={education}
              onUpdate={(updatedEd) => onUpdate(education.id, updatedEd)}
              onRemove={() => onRemove(education.id)}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No has agregado información educativa aún. Haz clic en "Agregar Educación" para comenzar.
          </p>
        )}

        {/* Add New Education Form */}
        {isAdding && (
          <Card className="border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Institución *</Label>
                  <Select
                    value={newEducation.institution}
                    onValueChange={(value) => setNewEducation((prev) => ({ ...prev, institution: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una institución" />
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
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation((prev) => ({ ...prev, degree: e.target.value }))}
                    placeholder="Ej: Ingeniería Civil Industrial"
                  />
                </div>
                <div>
                  <Label>Área de Estudio *</Label>
                  <Input
                    value={newEducation.field}
                    onChange={(e) => setNewEducation((prev) => ({ ...prev, field: e.target.value }))}
                    placeholder="Ej: Ingeniería, Administración"
                  />
                </div>
                <div>
                  <Label>Promedio (opcional)</Label>
                  <Input
                    value={newEducation.gpa || ""}
                    onChange={(e) => setNewEducation((prev) => ({ ...prev, gpa: e.target.value }))}
                    placeholder="Ej: 6.5"
                  />
                </div>
                <div>
                  <Label>Fecha de Inicio *</Label>
                  <Input
                    type="date"
                    value={newEducation.startDate}
                    onChange={(e) => setNewEducation((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Fecha de Fin</Label>
                  <Input
                    type="date"
                    value={newEducation.endDate}
                    onChange={(e) => setNewEducation((prev) => ({ ...prev, endDate: e.target.value }))}
                    disabled={newEducation.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="current-education"
                  checked={newEducation.current}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : prev.endDate,
                    }))
                  }
                />
                <Label htmlFor="current-education">Estudiando actualmente</Label>
              </div>

              <div>
                <Label>Descripción (opcional)</Label>
                <Textarea
                  value={newEducation.description || ""}
                  onChange={(e) => setNewEducation((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Menciona logros académicos, proyectos destacados, etc..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAdd}>Agregar</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Educación
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Education Item Component
function EducationItem({
  education,
  onUpdate,
  onRemove,
}: {
  education: Education
  onUpdate: (ed: Partial<Education>) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  if (!isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{education.degree}</h3>
            <p className="text-muted-foreground">{education.institution}</p>
            <p className="text-sm text-muted-foreground">
              {education.startDate} - {education.current ? "Presente" : education.endDate}
            </p>
            {education.gpa && <p className="text-sm text-muted-foreground">Promedio: {education.gpa}</p>}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button size="sm" variant="outline" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {education.description && <p className="text-sm">{education.description}</p>}
      </div>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Institución *</Label>
            <Select value={education.institution} onValueChange={(value) => onUpdate({ institution: value })}>
              <SelectTrigger>
                <SelectValue />
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
            <Input value={education.degree} onChange={(e) => onUpdate({ degree: e.target.value })} />
          </div>
          <div>
            <Label>Área de Estudio *</Label>
            <Input value={education.field} onChange={(e) => onUpdate({ field: e.target.value })} />
          </div>
          <div>
            <Label>Promedio (opcional)</Label>
            <Input value={education.gpa || ""} onChange={(e) => onUpdate({ gpa: e.target.value })} />
          </div>
          <div>
            <Label>Fecha de Inicio *</Label>
            <Input type="date" value={education.startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} />
          </div>
          <div>
            <Label>Fecha de Fin</Label>
            <Input
              type="date"
              value={education.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              disabled={education.current}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`current-education-${education.id}`}
            checked={education.current}
            onChange={(e) =>
              onUpdate({
                current: e.target.checked,
                endDate: e.target.checked ? "" : education.endDate,
              })
            }
          />
          <Label htmlFor={`current-education-${education.id}`}>Estudiando actualmente</Label>
        </div>

        <div>
          <Label>Descripción (opcional)</Label>
          <Textarea
            value={education.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(false)}>Guardar</Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Skills Section Component
function SkillsSection({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Skill[]
  onAdd: (item: Omit<Skill, "id">) => void
  onUpdate: (id: string, item: Partial<Skill>) => void
  onRemove: (id: string) => void
}) {
  const [selectedSkill, setSelectedSkill] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"Técnica" | "Blanda" | "Idioma">("Técnica")
  const [selectedLevel, setSelectedLevel] = useState<"Básico" | "Intermedio" | "Avanzado" | "Experto">("Intermedio")

  const handleAddSkill = () => {
    if (!selectedSkill.trim()) {
      toast.error("Por favor selecciona o escribe una habilidad")
      return
    }

    // Check if skill already exists
    const existingSkill = data.find((skill) => skill.name.toLowerCase() === selectedSkill.toLowerCase())

    if (existingSkill) {
      toast.error("Esta habilidad ya está agregada")
      return
    }

    onAdd({
      name: selectedSkill,
      level: selectedLevel,
      category: selectedCategory,
    })

    setSelectedSkill("")
    toast.success("Habilidad agregada exitosamente")
  }

  const getSkillsByCategory = (category: string) => {
    return Array.isArray(data) ? data.filter((skill) => skill.category === category) : []
  }

  const getAvailableSkills = () => {
    switch (selectedCategory) {
      case "Técnica":
        return commonSkillsChile.technical
      case "Blanda":
        return commonSkillsChile.soft
      case "Idioma":
        return commonSkillsChile.languages
      default:
        return []
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habilidades</CardTitle>
        <CardDescription>Agrega tus habilidades técnicas, blandas e idiomas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Skill */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Categoría</Label>
              <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Técnica">Técnica</SelectItem>
                  <SelectItem value="Blanda">Blanda</SelectItem>
                  <SelectItem value="Idioma">Idioma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Habilidad</Label>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una habilidad" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSkills().map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nivel</Label>
              <Select value={selectedLevel} onValueChange={(value: any) => setSelectedLevel(value)}>
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

          <div className="flex gap-2">
            <Input
              placeholder="O escribe una habilidad personalizada..."
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            />
            <Button onClick={handleAddSkill}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>

        <Separator />

        {/* Skills by Category */}
        <div className="space-y-6">
          {/* Technical Skills */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Habilidades Técnicas ({getSkillsByCategory("Técnica").length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {getSkillsByCategory("Técnica").map((skill) => (
                <SkillBadge
                  key={skill.id}
                  skill={skill}
                  onUpdate={(updatedSkill) => onUpdate(skill.id, updatedSkill)}
                  onRemove={() => onRemove(skill.id)}
                />
              ))}
              {getSkillsByCategory("Técnica").length === 0 && (
                <p className="text-muted-foreground text-sm">No has agregado habilidades técnicas aún</p>
              )}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Habilidades Blandas ({getSkillsByCategory("Blanda").length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {getSkillsByCategory("Blanda").map((skill) => (
                <SkillBadge
                  key={skill.id}
                  skill={skill}
                  onUpdate={(updatedSkill) => onUpdate(skill.id, updatedSkill)}
                  onRemove={() => onRemove(skill.id)}
                />
              ))}
              {getSkillsByCategory("Blanda").length === 0 && (
                <p className="text-muted-foreground text-sm">No has agregado habilidades blandas aún</p>
              )}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Languages className="w-4 h-4 mr-2" />
              Idiomas ({getSkillsByCategory("Idioma").length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {getSkillsByCategory("Idioma").map((skill) => (
                <SkillBadge
                  key={skill.id}
                  skill={skill}
                  onUpdate={(updatedSkill) => onUpdate(skill.id, updatedSkill)}
                  onRemove={() => onRemove(skill.id)}
                />
              ))}
              {getSkillsByCategory("Idioma").length === 0 && (
                <p className="text-muted-foreground text-sm">No has agregado idiomas aún</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skill Badge Component
function SkillBadge({
  skill,
  onUpdate,
  onRemove,
}: {
  skill: Skill
  onUpdate: (skill: Partial<Skill>) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Básico":
        return "bg-gray-100 text-gray-800"
      case "Intermedio":
        return "bg-blue-100 text-blue-800"
      case "Avanzado":
        return "bg-green-100 text-green-800"
      case "Experto":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isEditing) {
    return (
      <div className="group relative">
        <Badge
          variant="secondary"
          className={`${getLevelColor(skill.level)} cursor-pointer hover:opacity-80`}
          onClick={() => setIsEditing(true)}
        >
          {skill.name} - {skill.level}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={onRemove}
        >
          ×
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md">
      <Select value={skill.level} onValueChange={(value: any) => onUpdate({ level: value })}>
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
      <Button size="sm" onClick={() => setIsEditing(false)}>
        ✓
      </Button>
    </div>
  )
}

// Projects Section Component
function ProjectsSection({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Project[]
  onAdd: (item: Omit<Project, "id">) => void
  onUpdate: (id: string, item: Partial<Project>) => void
  onRemove: (id: string) => void
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    technologies: [],
    url: "",
    startDate: "",
    endDate: "",
    current: false,
  })

  const handleAdd = () => {
    if (!newProject.name.trim() || !newProject.description.trim()) {
      toast.error("Por favor completa el nombre y descripción del proyecto")
      return
    }

    onAdd(newProject)
    setNewProject({
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
      current: false,
    })
    setIsAdding(false)
    toast.success("Proyecto agregado exitosamente")
  }

  // Ensure data is always an array
  const projectsData = Array.isArray(data) ? data : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyectos</CardTitle>
        <CardDescription>Muestra tus proyectos más relevantes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Projects */}
        {projectsData.length > 0 ? (
          projectsData.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              onUpdate={(updatedProject) => onUpdate(project.id, updatedProject)}
              onRemove={() => onRemove(project.id)}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No has agregado proyectos aún. Haz clic en "Agregar Proyecto" para comenzar.
          </p>
        )}

        {/* Add New Project Form */}
        {isAdding && (
          <Card className="border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Nombre del Proyecto *</Label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Sistema de Gestión de Inventario"
                />
              </div>

              <div>
                <Label>Descripción *</Label>
                <Textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe el proyecto, tu rol y los resultados obtenidos..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>URL del Proyecto (opcional)</Label>
                  <Input
                    value={newProject.url || ""}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://mi-proyecto.com"
                  />
                </div>
                <div>
                  <Label>Tecnologías</Label>
                  <Input
                    placeholder="React, Node.js, MongoDB (separadas por comas)"
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        technologies: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Fecha de Inicio</Label>
                  <Input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Fecha de Fin</Label>
                  <Input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, endDate: e.target.value }))}
                    disabled={newProject.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="current-project"
                  checked={newProject.current}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : prev.endDate,
                    }))
                  }
                />
                <Label htmlFor="current-project">Proyecto en curso</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAdd}>Agregar</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Proyecto
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Project Item Component
function ProjectItem({
  project,
  onUpdate,
  onRemove,
}: {
  project: Project
  onUpdate: (project: Partial<Project>) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  if (!isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {project.startDate} - {project.current ? "En curso" : project.endDate}
            </p>
            <p className="text-sm mb-2">{project.description}</p>
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver proyecto →
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button size="sm" variant="outline" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label>Nombre del Proyecto *</Label>
          <Input value={project.name} onChange={(e) => onUpdate({ name: e.target.value })} />
        </div>

        <div>
          <Label>Descripción *</Label>
          <Textarea value={project.description} onChange={(e) => onUpdate({ description: e.target.value })} rows={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>URL del Proyecto (opcional)</Label>
            <Input value={project.url || ""} onChange={(e) => onUpdate({ url: e.target.value })} />
          </div>
          <div>
            <Label>Tecnologías</Label>
            <Input
              value={project.technologies?.join(", ") || ""}
              onChange={(e) =>
                onUpdate({
                  technologies: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t),
                })
              }
            />
          </div>
          <div>
            <Label>Fecha de Inicio</Label>
            <Input type="date" value={project.startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} />
          </div>
          <div>
            <Label>Fecha de Fin</Label>
            <Input
              type="date"
              value={project.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              disabled={project.current}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`current-project-${project.id}`}
            checked={project.current}
            onChange={(e) =>
              onUpdate({
                current: e.target.checked,
                endDate: e.target.checked ? "" : project.endDate,
              })
            }
          />
          <Label htmlFor={`current-project-${project.id}`}>Proyecto en curso</Label>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(false)}>Guardar</Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Certifications Section Component
function CertificationsSection({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Certification[]
  onAdd: (item: Omit<Certification, "id">) => void
  onUpdate: (id: string, item: Partial<Certification>) => void
  onRemove: (id: string) => void
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [newCertification, setNewCertification] = useState<Omit<Certification, "id">>({
    name: "",
    issuer: "",
    date: "",
    expiryDate: "",
    credentialId: "",
    url: "",
  })

  const handleAdd = () => {
    if (!newCertification.name.trim() || !newCertification.issuer.trim() || !newCertification.date) {
      toast.error("Por favor completa los campos requeridos")
      return
    }

    onAdd(newCertification)
    setNewCertification({
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: "",
    })
    setIsAdding(false)
    toast.success("Certificación agregada exitosamente")
  }

  // Ensure data is always an array
  const certificationsData = Array.isArray(data) ? data : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificaciones</CardTitle>
        <CardDescription>Agrega tus certificaciones y cursos completados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Certifications */}
        {certificationsData.length > 0 ? (
          certificationsData.map((certification) => (
            <CertificationItem
              key={certification.id}
              certification={certification}
              onUpdate={(updatedCert) => onUpdate(certification.id, updatedCert)}
              onRemove={() => onRemove(certification.id)}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No has agregado certificaciones aún. Haz clic en "Agregar Certificación" para comenzar.
          </p>
        )}

        {/* Add New Certification Form */}
        {isAdding && (
          <Card className="border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre de la Certificación *</Label>
                  <Input
                    value={newCertification.name}
                    onChange={(e) => setNewCertification((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: AWS Certified Solutions Architect"
                  />
                </div>
                <div>
                  <Label>Emisor *</Label>
                  <Input
                    value={newCertification.issuer}
                    onChange={(e) => setNewCertification((prev) => ({ ...prev, issuer: e.target.value }))}
                    placeholder="Ej: Amazon Web Services"
                  />
                </div>
                <div>
                  <Label>Fecha de Obtención *</Label>
                  <Input
                    type="date"
                    value={newCertification.date}
                    onChange={(e) => setNewCertification((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Fecha de Expiración (opcional)</Label>
                  <Input
                    type="date"
                    value={newCertification.expiryDate || ""}
                    onChange={(e) => setNewCertification((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>ID de Credencial (opcional)</Label>
                  <Input
                    value={newCertification.credentialId || ""}
                    onChange={(e) => setNewCertification((prev) => ({ ...prev, credentialId: e.target.value }))}
                    placeholder="Ej: ABC123456"
                  />
                </div>
                <div>
                  <Label>URL de Verificación (opcional)</Label>
                  <Input
                    value={newCertification.url || ""}
                    onChange={(e) => setNewCertification((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://verify.certification.com"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAdd}>Agregar</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Certificación
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Certification Item Component
function CertificationItem({
  certification,
  onUpdate,
  onRemove,
}: {
  certification: Certification
  onUpdate: (cert: Partial<Certification>) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  if (!isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold">{certification.name}</h3>
            <p className="text-muted-foreground">{certification.issuer}</p>
            <p className="text-sm text-muted-foreground">
              Obtenida: {certification.date}
              {certification.expiryDate && ` • Expira: ${certification.expiryDate}`}
            </p>
            {certification.credentialId && (
              <p className="text-sm text-muted-foreground">ID: {certification.credentialId}</p>
            )}
            {certification.url && (
              <a
                href={certification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Verificar certificación →
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button size="sm" variant="outline" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre de la Certificación *</Label>
            <Input value={certification.name} onChange={(e) => onUpdate({ name: e.target.value })} />
          </div>
          <div>
            <Label>Emisor *</Label>
            <Input value={certification.issuer} onChange={(e) => onUpdate({ issuer: e.target.value })} />
          </div>
          <div>
            <Label>Fecha de Obtención *</Label>
            <Input type="date" value={certification.date} onChange={(e) => onUpdate({ date: e.target.value })} />
          </div>
          <div>
            <Label>Fecha de Expiración (opcional)</Label>
            <Input
              type="date"
              value={certification.expiryDate || ""}
              onChange={(e) => onUpdate({ expiryDate: e.target.value })}
            />
          </div>
          <div>
            <Label>ID de Credencial (opcional)</Label>
            <Input
              value={certification.credentialId || ""}
              onChange={(e) => onUpdate({ credentialId: e.target.value })}
            />
          </div>
          <div>
            <Label>URL de Verificación (opcional)</Label>
            <Input value={certification.url || ""} onChange={(e) => onUpdate({ url: e.target.value })} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(false)}>Guardar</Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Languages Section Component
function LanguagesSection({
  data,
  onAdd,
  onUpdate,
  onRemove,
}: {
  data: Language[]
  onAdd: (item: Omit<Language, "id">) => void
  onUpdate: (id: string, item: Partial<Language>) => void
  onRemove: (id: string) => void
}) {
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<"Básico" | "Intermedio" | "Avanzado" | "Nativo">("Intermedio")

  const handleAddLanguage = () => {
    if (!selectedLanguage.trim()) {
      toast.error("Por favor selecciona un idioma")
      return
    }

    // Check if language already exists
    const existingLanguage = data.find((lang) => lang.name.toLowerCase() === selectedLanguage.toLowerCase())

    if (existingLanguage) {
      toast.error("Este idioma ya está agregado")
      return
    }

    onAdd({
      name: selectedLanguage,
      level: selectedLevel,
    })

    setSelectedLanguage("")
    toast.success("Idioma agregado exitosamente")
  }

  // Ensure data is always an array
  const languagesData = Array.isArray(data) ? data : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Idiomas</CardTitle>
        <CardDescription>Agrega los idiomas que dominas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Language */}
        <div className="flex gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecciona un idioma" />
            </SelectTrigger>
            <SelectContent>
              {commonSkillsChile.languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={(value: any) => setSelectedLevel(value)}>
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
          <Button onClick={handleAddLanguage}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Languages List */}
        <div className="space-y-2">
          {languagesData.length > 0 ? (
            languagesData.map((language) => (
              <LanguageItem
                key={language.id}
                language={language}
                onUpdate={(updatedLang) => onUpdate(language.id, updatedLang)}
                onRemove={() => onRemove(language.id)}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No has agregado idiomas aún. Selecciona un idioma arriba para comenzar.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Language Item Component
function LanguageItem({
  language,
  onUpdate,
  onRemove,
}: {
  language: Language
  onUpdate: (lang: Partial<Language>) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Básico":
        return "bg-gray-100 text-gray-800"
      case "Intermedio":
        return "bg-blue-100 text-blue-800"
      case "Avanzado":
        return "bg-green-100 text-green-800"
      case "Nativo":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center gap-3">
          <span className="font-medium">{language.name}</span>
          <Badge className={getLevelColor(language.level)}>{language.level}</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
          <Button size="sm" variant="outline" onClick={onRemove}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg">
      <span className="font-medium flex-1">{language.name}</span>
      <Select value={language.level} onValueChange={(value: any) => onUpdate({ level: value })}>
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
      <Button size="sm" onClick={() => setIsEditing(false)}>
        ✓
      </Button>
    </div>
  )
}
