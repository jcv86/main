"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  User,
  GraduationCap,
  Briefcase,
  Code,
  FolderOpen,
  Award,
  Languages,
} from "lucide-react"
import {
  type CVData,
  CVDataSchema,
  getCompletionPercentage,
  CHILEAN_CITIES,
  CHILEAN_UNIVERSITIES,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  LANGUAGE_LEVELS,
  getEmptyCV,
} from "@/lib/cv-types"

interface CVFormProps {
  initialData?: Partial<CVData>
  onSave: (data: CVData) => void
  onExportPDF: (data: CVData) => void
  onPreview: (data: CVData) => void
  isLoading?: boolean
}

export function CVForm({ initialData, onSave, onExportPDF, onPreview, isLoading }: CVFormProps) {
  const [openSections, setOpenSections] = useState({
    personal: true,
    education: false,
    experience: false,
    skills: false,
    projects: false,
    certifications: false,
    languages: false,
  })

  const form = useForm<CVData>({
    resolver: zodResolver(CVDataSchema),
    defaultValues: initialData || getEmptyCV(),
    mode: "onChange",
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = form

  const watchedData = watch()
  const completionPercentage = getCompletionPercentage(watchedData)

  // Field arrays
  const educationFields = useFieldArray({ control, name: "education" })
  const experienceFields = useFieldArray({ control, name: "experience" })
  const skillsFields = useFieldArray({ control, name: "skills" })
  const projectsFields = useFieldArray({ control, name: "projects" })
  const certificationsFields = useFieldArray({ control, name: "certifications" })
  const languagesFields = useFieldArray({ control, name: "languages" })

  // Auto-save effect
  useEffect(() => {
    const subscription = watch((data) => {
      if (isValid) {
        onSave(data as CVData)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, onSave, isValid])

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const addEducation = () => {
    educationFields.append({
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    })
    setOpenSections((prev) => ({ ...prev, education: true }))
  }

  const addExperience = () => {
    experienceFields.append({
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    })
    setOpenSections((prev) => ({ ...prev, experience: true }))
  }

  const addSkill = () => {
    skillsFields.append({
      id: Date.now().toString(),
      name: "",
      category: "Programación",
      level: "Básico",
    })
    setOpenSections((prev) => ({ ...prev, skills: true }))
  }

  const addProject = () => {
    projectsFields.append({
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      github: "",
      startDate: "",
      endDate: "",
    })
    setOpenSections((prev) => ({ ...prev, projects: true }))
  }

  const addCertification = () => {
    certificationsFields.append({
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      url: "",
      description: "",
    })
    setOpenSections((prev) => ({ ...prev, certifications: true }))
  }

  const addLanguage = () => {
    languagesFields.append({
      id: Date.now().toString(),
      name: "",
      level: "Básico",
    })
    setOpenSections((prev) => ({ ...prev, languages: true }))
  }

  const onSubmit = (data: CVData) => {
    onSave(data)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Constructor de CV</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Completa tu información profesional</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
              <p className="text-xs text-muted-foreground">Completado</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-4" />
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <Collapsible open={openSections.personal} onOpenChange={() => toggleSection("personal")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <CardTitle>Información Personal</CardTitle>
                    <Badge variant="secondary">Requerido</Badge>
                  </div>
                  {openSections.personal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input
                      id="fullName"
                      {...form.register("personalInfo.fullName")}
                      placeholder="Juan Pérez González"
                    />
                    {errors.personalInfo?.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.personalInfo.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("personalInfo.email")}
                      placeholder="juan@ejemplo.com"
                    />
                    {errors.personalInfo?.email && (
                      <p className="text-sm text-destructive mt-1">{errors.personalInfo.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input id="phone" {...form.register("personalInfo.phone")} placeholder="+56 9 1234 5678" />
                    {errors.personalInfo?.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.personalInfo.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Select
                      value={watchedData.personalInfo?.city}
                      onValueChange={(value) => setValue("personalInfo.city", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una ciudad" />
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
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      {...form.register("personalInfo.address")}
                      placeholder="Av. Providencia 123, Santiago"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      {...form.register("personalInfo.linkedin")}
                      placeholder="https://linkedin.com/in/tu-perfil"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      {...form.register("personalInfo.github")}
                      placeholder="https://github.com/tu-usuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input id="website" {...form.register("personalInfo.website")} placeholder="https://tu-sitio.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="summary">Resumen Profesional</Label>
                  <Textarea
                    id="summary"
                    {...form.register("personalInfo.summary")}
                    placeholder="Breve descripción de tu perfil profesional..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {watchedData.personalInfo?.summary?.length || 0}/500 caracteres
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Education */}
        <Card>
          <Collapsible open={openSections.education} onOpenChange={() => toggleSection("education")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    <CardTitle>Educación</CardTitle>
                    <Badge variant="outline">{educationFields.fields.length} entradas</Badge>
                  </div>
                  {openSections.education ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {educationFields.fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Educación #{index + 1}</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => educationFields.remove(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Institución *</Label>
                        <Select
                          value={watchedData.education?.[index]?.institution}
                          onValueChange={(value) => setValue(`education.${index}.institution`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una institución" />
                          </SelectTrigger>
                          <SelectContent>
                            {CHILEAN_UNIVERSITIES.map((uni) => (
                              <SelectItem key={uni} value={uni}>
                                {uni}
                              </SelectItem>
                            ))}
                            <SelectItem value="Otra">Otra institución</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Título *</Label>
                        <Input
                          {...form.register(`education.${index}.degree`)}
                          placeholder="Ingeniería en Informática"
                        />
                      </div>
                      <div>
                        <Label>Campo de Estudio *</Label>
                        <Input
                          {...form.register(`education.${index}.field`)}
                          placeholder="Ciencias de la Computación"
                        />
                      </div>
                      <div>
                        <Label>Promedio (Opcional)</Label>
                        <Input {...form.register(`education.${index}.gpa`)} placeholder="6.5" />
                      </div>
                      <div>
                        <Label>Fecha de Inicio *</Label>
                        <Input type="month" {...form.register(`education.${index}.startDate`)} />
                      </div>
                      <div>
                        <Label>Fecha de Fin</Label>
                        <Input
                          type="month"
                          {...form.register(`education.${index}.endDate`)}
                          disabled={watchedData.education?.[index]?.current}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-education-${index}`}
                        checked={watchedData.education?.[index]?.current}
                        onCheckedChange={(checked) => setValue(`education.${index}.current`, !!checked)}
                      />
                      <Label htmlFor={`current-education-${index}`}>Actualmente estudiando</Label>
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        {...form.register(`education.${index}.description`)}
                        placeholder="Descripción adicional, logros académicos..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addEducation} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Educación
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Experience */}
        <Card>
          <Collapsible open={openSections.experience} onOpenChange={() => toggleSection("experience")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <CardTitle>Experiencia Laboral</CardTitle>
                    <Badge variant="outline">{experienceFields.fields.length} entradas</Badge>
                  </div>
                  {openSections.experience ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {experienceFields.fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Experiencia #{index + 1}</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => experienceFields.remove(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Empresa *</Label>
                        <Input {...form.register(`experience.${index}.company`)} placeholder="Nombre de la empresa" />
                      </div>
                      <div>
                        <Label>Cargo *</Label>
                        <Input
                          {...form.register(`experience.${index}.position`)}
                          placeholder="Desarrollador Full Stack"
                        />
                      </div>
                      <div>
                        <Label>Fecha de Inicio *</Label>
                        <Input type="month" {...form.register(`experience.${index}.startDate`)} />
                      </div>
                      <div>
                        <Label>Fecha de Fin</Label>
                        <Input
                          type="month"
                          {...form.register(`experience.${index}.endDate`)}
                          disabled={watchedData.experience?.[index]?.current}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-job-${index}`}
                        checked={watchedData.experience?.[index]?.current}
                        onCheckedChange={(checked) => setValue(`experience.${index}.current`, !!checked)}
                      />
                      <Label htmlFor={`current-job-${index}`}>Trabajo actual</Label>
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        {...form.register(`experience.${index}.description`)}
                        placeholder="Describe tus responsabilidades y logros..."
                        rows={4}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addExperience} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Experiencia
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Skills */}
        <Card>
          <Collapsible open={openSections.skills} onOpenChange={() => toggleSection("skills")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    <CardTitle>Habilidades</CardTitle>
                    <Badge variant="outline">{skillsFields.fields.length} habilidades</Badge>
                  </div>
                  {openSections.skills ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillsFields.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Habilidad #{index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => skillsFields.remove(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Nombre *</Label>
                        <Input {...form.register(`skills.${index}.name`)} placeholder="JavaScript, React, etc." />
                      </div>
                      <div>
                        <Label>Categoría</Label>
                        <Select
                          value={watchedData.skills?.[index]?.category}
                          onValueChange={(value) => setValue(`skills.${index}.category`, value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SKILL_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nivel</Label>
                        <Select
                          value={watchedData.skills?.[index]?.level}
                          onValueChange={(value) => setValue(`skills.${index}.level`, value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SKILL_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={addSkill} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Habilidad
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Projects */}
        <Card>
          <Collapsible open={openSections.projects} onOpenChange={() => toggleSection("projects")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    <CardTitle>Proyectos</CardTitle>
                    <Badge variant="outline">{projectsFields.fields.length} proyectos</Badge>
                  </div>
                  {openSections.projects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {projectsFields.fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Proyecto #{index + 1}</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => projectsFields.remove(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre del Proyecto *</Label>
                        <Input {...form.register(`projects.${index}.name`)} placeholder="Mi Aplicación Web" />
                      </div>
                      <div>
                        <Label>URL del Proyecto</Label>
                        <Input {...form.register(`projects.${index}.url`)} placeholder="https://mi-proyecto.com" />
                      </div>
                      <div>
                        <Label>GitHub</Label>
                        <Input
                          {...form.register(`projects.${index}.github`)}
                          placeholder="https://github.com/usuario/proyecto"
                        />
                      </div>
                      <div>
                        <Label>Fecha de Inicio</Label>
                        <Input type="month" {...form.register(`projects.${index}.startDate`)} />
                      </div>
                    </div>
                    <div>
                      <Label>Descripción *</Label>
                      <Textarea
                        {...form.register(`projects.${index}.description`)}
                        placeholder="Describe el proyecto, su propósito y tu rol..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addProject} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Proyecto
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Certifications */}
        <Card>
          <Collapsible open={openSections.certifications} onOpenChange={() => toggleSection("certifications")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    <CardTitle>Certificaciones</CardTitle>
                    <Badge variant="outline">{certificationsFields.fields.length} certificaciones</Badge>
                  </div>
                  {openSections.certifications ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {certificationsFields.fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Certificación #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => certificationsFields.remove(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre *</Label>
                        <Input
                          {...form.register(`certifications.${index}.name`)}
                          placeholder="AWS Certified Developer"
                        />
                      </div>
                      <div>
                        <Label>Emisor *</Label>
                        <Input {...form.register(`certifications.${index}.issuer`)} placeholder="Amazon Web Services" />
                      </div>
                      <div>
                        <Label>Fecha *</Label>
                        <Input type="month" {...form.register(`certifications.${index}.date`)} />
                      </div>
                      <div>
                        <Label>URL de Verificación</Label>
                        <Input
                          {...form.register(`certifications.${index}.url`)}
                          placeholder="https://certificado.com/verify"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        {...form.register(`certifications.${index}.description`)}
                        placeholder="Descripción de la certificación..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addCertification} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Certificación
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Languages */}
        <Card>
          <Collapsible open={openSections.languages} onOpenChange={() => toggleSection("languages")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    <CardTitle>Idiomas</CardTitle>
                    <Badge variant="outline">{languagesFields.fields.length} idiomas</Badge>
                  </div>
                  {openSections.languages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {languagesFields.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Idioma #{index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => languagesFields.remove(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Idioma *</Label>
                        <Input {...form.register(`languages.${index}.name`)} placeholder="Inglés, Francés, etc." />
                      </div>
                      <div>
                        <Label>Nivel</Label>
                        <Select
                          value={watchedData.languages?.[index]?.level}
                          onValueChange={(value) => setValue(`languages.${index}.level`, value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGE_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={addLanguage} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Idioma
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onPreview(watchedData as CVData)}
                disabled={!isValid || isLoading}
                className="flex-1"
              >
                Vista Previa
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onExportPDF(watchedData as CVData)}
                disabled={!isValid || isLoading}
                className="flex-1"
              >
                Exportar PDF
              </Button>
              <Button type="submit" disabled={!isValid || isLoading} className="flex-1">
                {isLoading ? "Guardando..." : "Guardar CV"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
