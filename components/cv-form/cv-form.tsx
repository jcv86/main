"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Save,
  Eye,
  Download,
} from "lucide-react"
import {
  type CVData,
  cvSchema,
  chileanCities,
  chileanUniversities,
  commonTechnicalSkills,
  calculateCompletionPercentage,
} from "@/lib/cv-types"

interface CVFormProps {
  initialData?: Partial<CVData>
  onSave?: (data: CVData) => Promise<void>
  onPreview?: (data: CVData) => void
  onExport?: (data: CVData) => void
}

export function CVForm({ initialData, onSave, onPreview, onExport }: CVFormProps) {
  const [openSections, setOpenSections] = useState({
    personal: true,
    education: false,
    experience: false,
    skills: false,
    projects: false,
    certifications: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const form = useForm<CVData>({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "Chile",
        linkedIn: "",
        website: "",
        summary: "",
      },
      education: [],
      experience: [],
      skills: {
        technical: [],
        soft: [],
        languages: [],
      },
      projects: [],
      certifications: [],
      ...initialData,
    },
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  })

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  })

  const {
    fields: technicalSkillsFields,
    append: appendTechnicalSkill,
    remove: removeTechnicalSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills.technical",
  })

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: "skills.languages",
  })

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  })

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: "certifications",
  })

  // Watch form data for completion percentage
  const watchedData = form.watch()

  useEffect(() => {
    const percentage = calculateCompletionPercentage(watchedData)
    setCompletionPercentage(percentage)
  }, [watchedData])

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSave = async (data: CVData) => {
    if (!onSave) return

    setIsSaving(true)
    try {
      await onSave(data)
      toast.success("CV guardado exitosamente")
    } catch (error) {
      toast.error("Error al guardar el CV")
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    const data = form.getValues()
    onPreview?.(data)
  }

  const handleExport = () => {
    const data = form.getValues()
    onExport?.(data)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Constructor de CV</h1>
            <p className="text-muted-foreground">Crea tu currículum profesional paso a paso</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Vista Previa
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button onClick={form.handleSubmit(handleSave)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progreso del CV</span>
            <span>{completionPercentage}% completado</span>
          </div>
          <Progress value={completionPercentage} className="w-full" />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <Collapsible open={openSections.personal} onOpenChange={() => toggleSection("personal")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <CardTitle>Información Personal</CardTitle>
                  </div>
                  {openSections.personal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
                <CardDescription>Información básica y de contacto</CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input id="firstName" {...form.register("personalInfo.firstName")} placeholder="Tu nombre" />
                    {form.formState.errors.personalInfo?.firstName && (
                      <p className="text-sm text-destructive">{form.formState.errors.personalInfo.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input id="lastName" {...form.register("personalInfo.lastName")} placeholder="Tu apellido" />
                    {form.formState.errors.personalInfo?.lastName && (
                      <p className="text-sm text-destructive">{form.formState.errors.personalInfo.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("personalInfo.email")}
                      placeholder="tu@email.com"
                    />
                    {form.formState.errors.personalInfo?.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.personalInfo.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input id="phone" {...form.register("personalInfo.phone")} placeholder="+56 9 1234 5678" />
                    {form.formState.errors.personalInfo?.phone && (
                      <p className="text-sm text-destructive">{form.formState.errors.personalInfo.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input id="address" {...form.register("personalInfo.address")} placeholder="Tu dirección completa" />
                  {form.formState.errors.personalInfo?.address && (
                    <p className="text-sm text-destructive">{form.formState.errors.personalInfo.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Select onValueChange={(value) => form.setValue("personalInfo.city", value)}>
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
                    {form.formState.errors.personalInfo?.city && (
                      <p className="text-sm text-destructive">{form.formState.errors.personalInfo.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input id="country" {...form.register("personalInfo.country")} disabled />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn">LinkedIn</Label>
                    <Input
                      id="linkedIn"
                      {...form.register("personalInfo.linkedIn")}
                      placeholder="https://linkedin.com/in/tu-perfil"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      {...form.register("personalInfo.website")}
                      placeholder="https://tu-sitio-web.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Resumen Profesional *</Label>
                  <Textarea
                    id="summary"
                    {...form.register("personalInfo.summary")}
                    placeholder="Describe brevemente tu experiencia, habilidades y objetivos profesionales..."
                    rows={4}
                  />
                  {form.formState.errors.personalInfo?.summary && (
                    <p className="text-sm text-destructive">{form.formState.errors.personalInfo.summary.message}</p>
                  )}
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
                    <GraduationCap className="w-5 h-5" />
                    <CardTitle>Educación</CardTitle>
                    {educationFields.length > 0 && <Badge variant="secondary">{educationFields.length}</Badge>}
                  </div>
                  {openSections.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
                <CardDescription>Tu formación académica</CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {educationFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Educación {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Institución *</Label>
                        <Select onValueChange={(value) => form.setValue(`education.${index}.institution`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona institución" />
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

                      <div className="space-y-2">
                        <Label>Título *</Label>
                        <Input
                          {...form.register(`education.${index}.degree`)}
                          placeholder="Ej: Ingeniería en Informática"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Campo de Estudio *</Label>
                      <Input
                        {...form.register(`education.${index}.field`)}
                        placeholder="Ej: Ciencias de la Computación"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha de Inicio *</Label>
                        <Input type="month" {...form.register(`education.${index}.startDate`)} />
                      </div>

                      <div className="space-y-2">
                        <Label>Fecha de Fin</Label>
                        <Input
                          type="month"
                          {...form.register(`education.${index}.endDate`)}
                          disabled={form.watch(`education.${index}.current`)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`education-current-${index}`}
                        checked={form.watch(`education.${index}.current`)}
                        onCheckedChange={(checked) => form.setValue(`education.${index}.current`, checked as boolean)}
                      />
                      <Label htmlFor={`education-current-${index}`}>Actualmente estudiando</Label>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendEducation({
                      id: Math.random().toString(36).substr(2, 9),
                      institution: "",
                      degree: "",
                      field: "",
                      startDate: "",
                      endDate: "",
                      current: false,
                    })
                  }
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
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
                    <Briefcase className="w-5 h-5" />
                    <CardTitle>Experiencia Laboral</CardTitle>
                    {experienceFields.length > 0 && <Badge variant="secondary">{experienceFields.length}</Badge>}
                  </div>
                  {openSections.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
                <CardDescription>Tu experiencia profesional</CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Experiencia {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Empresa *</Label>
                        <Input {...form.register(`experience.${index}.company`)} placeholder="Nombre de la empresa" />
                      </div>

                      <div className="space-y-2">
                        <Label>Cargo *</Label>
                        <Input {...form.register(`experience.${index}.position`)} placeholder="Tu cargo o posición" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ubicación *</Label>
                      <Input {...form.register(`experience.${index}.location`)} placeholder="Ciudad, País" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha de Inicio *</Label>
                        <Input type="month" {...form.register(`experience.${index}.startDate`)} />
                      </div>

                      <div className="space-y-2">
                        <Label>Fecha de Fin</Label>
                        <Input
                          type="month"
                          {...form.register(`experience.${index}.endDate`)}
                          disabled={form.watch(`experience.${index}.current`)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`experience-current-${index}`}
                        checked={form.watch(`experience.${index}.current`)}
                        onCheckedChange={(checked) => form.setValue(`experience.${index}.current`, checked as boolean)}
                      />
                      <Label htmlFor={`experience-current-${index}`}>Trabajo actual</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Descripción *</Label>
                      <Textarea
                        {...form.register(`experience.${index}.description`)}
                        placeholder="Describe tus responsabilidades y logros en este puesto..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendExperience({
                      id: Math.random().toString(36).substr(2, 9),
                      company: "",
                      position: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      current: false,
                      description: "",
                      achievements: [],
                    })
                  }
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
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
                    <Code className="w-5 h-5" />
                    <CardTitle>Habilidades</CardTitle>
                  </div>
                  {openSections.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
                <CardDescription>Tus habilidades técnicas y blandas</CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Technical Skills */}
                <div className="space-y-4">
                  <h4 className="font-medium">Habilidades Técnicas</h4>
                  {technicalSkillsFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Habilidad</Label>
                        <Select onValueChange={(value) => form.setValue(`skills.technical.${index}.name`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona habilidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonTechnicalSkills.map((skill) => (
                              <SelectItem key={skill} value={skill}>
                                {skill}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32 space-y-2">
                        <Label>Nivel</Label>
                        <Select
                          onValueChange={(value) => form.setValue(`skills.technical.${index}.level`, value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Básico">Básico</SelectItem>
                            <SelectItem value="Intermedio">Intermedio</SelectItem>
                            <SelectItem value="Avanzado">Avanzado</SelectItem>
                            <SelectItem value="Experto">Experto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeTechnicalSkill(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendTechnicalSkill({ name: "", level: "Básico" })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Habilidad Técnica
                  </Button>
                </div>

                <Separator />

                {/* Languages */}
                <div className="space-y-4">
                  <h4 className="font-medium">Idiomas</h4>
                  {languageFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Idioma</Label>
                        <Input {...form.register(`skills.languages.${index}.name`)} placeholder="Ej: Inglés" />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label>Nivel</Label>
                        <Select
                          onValueChange={(value) => form.setValue(`skills.languages.${index}.level`, value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Básico">Básico</SelectItem>
                            <SelectItem value="Intermedio">Intermedio</SelectItem>
                            <SelectItem value="Avanzado">Avanzado</SelectItem>
                            <SelectItem value="Nativo">Nativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeLanguage(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendLanguage({ name: "", level: "Básico" })}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Idioma
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button type="button" variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Guardando..." : "Guardar CV"}
          </Button>
        </div>
      </form>
    </div>
  )
}
