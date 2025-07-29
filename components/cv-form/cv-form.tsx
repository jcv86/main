"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "sonner"
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Languages,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Download,
  Eye,
} from "lucide-react"
import {
  cvSchema,
  type CVData,
  CHILEAN_CITIES,
  CHILEAN_UNIVERSITIES,
  SKILL_CATEGORIES,
  LANGUAGE_LEVELS,
  generateId,
  calculateCompletionPercentage,
  getEmptyCVData,
  getSkillLevelText,
} from "@/lib/cv-types"

interface CVFormProps {
  initialData?: Partial<CVData>
  onSave?: (data: CVData) => Promise<void>
  onPreview?: (data: CVData) => void
  onExport?: (data: CVData) => void
}

export function CVForm({ initialData, onSave, onPreview, onExport }: CVFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [openSections, setOpenSections] = useState({
    personal: true,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
    languages: false,
  })

  const form = useForm<CVData>({
    resolver: zodResolver(cvSchema),
    defaultValues: initialData || getEmptyCVData(),
    mode: "onChange",
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form

  // Field arrays for dynamic sections
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "workExperience",
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  })

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  })

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  })

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: "certifications",
  })

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  })

  // Watch form data for completion percentage
  const watchedData = watch()
  const completionPercentage = calculateCompletionPercentage(watchedData)

  // Auto-save functionality
  useEffect(() => {
    const subscription = watch((data) => {
      // Save to localStorage as backup
      localStorage.setItem("cv-draft", JSON.stringify(data))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const onSubmit = async (data: CVData) => {
    setIsLoading(true)
    try {
      if (onSave) {
        await onSave(data)
        toast.success("CV guardado exitosamente")
      }
    } catch (error) {
      toast.error("Error al guardar el CV")
      console.error("Error saving CV:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    const data = form.getValues()
    if (onPreview) {
      onPreview(data)
    }
  }

  const handleExport = () => {
    const data = form.getValues()
    if (onExport) {
      onExport(data)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with progress and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Constructor de CV</h1>
          <div className="flex items-center gap-2">
            <Progress value={completionPercentage} className="w-32" />
            <span className="text-sm text-muted-foreground">{completionPercentage}% completado</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <Collapsible open={openSections.personal} onOpenChange={() => toggleSection("personal")}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <CardTitle>Información Personal</CardTitle>
                      {errors.personalInfo && <Badge variant="destructive">Errores</Badge>}
                    </div>
                    {openSections.personal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                  <CardDescription>Información básica y datos de contacto</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="personalInfo.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre *</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="personalInfo.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido *</FormLabel>
                          <FormControl>
                            <Input placeholder="Pérez" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="personalInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="juan.perez@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="personalInfo.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono *</FormLabel>
                          <FormControl>
                            <Input placeholder="+56 9 1234 5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="personalInfo.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una ciudad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CHILEAN_CITIES.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="personalInfo.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input placeholder="Av. Providencia 123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="personalInfo.linkedIn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/tu-perfil" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="personalInfo.website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sitio Web</FormLabel>
                          <FormControl>
                            <Input placeholder="https://tu-sitio.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="personalInfo.summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumen Profesional *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe tu experiencia, habilidades y objetivos profesionales..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mínimo 50 caracteres, máximo 500. Actual: {field.value?.length || 0}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Work Experience */}
          <Card>
            <Collapsible open={openSections.experience} onOpenChange={() => toggleSection("experience")}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      <CardTitle>Experiencia Laboral</CardTitle>
                      <Badge variant="secondary">{experienceFields.length}</Badge>
                    </div>
                    {openSections.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                  <CardDescription>Historial profesional y logros</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {experienceFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">Experiencia {index + 1}</h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={control}
                          name={`workExperience.${index}.company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Empresa *</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre de la empresa" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`workExperience.${index}.position`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cargo *</FormLabel>
                              <FormControl>
                                <Input placeholder="Tu posición" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <FormField
                          control={control}
                          name={`workExperience.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Inicio *</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`workExperience.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Fin</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} disabled={watch(`workExperience.${index}.current`)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`workExperience.${index}.current`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel>Trabajo actual</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={control}
                        name={`workExperience.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe tus responsabilidades y logros..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendExperience({
                        id: generateId(),
                        company: "",
                        position: "",
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

          {/* Education */}
          <Card>
            <Collapsible open={openSections.education} onOpenChange={() => toggleSection("education")}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      <CardTitle>Educación</CardTitle>
                      <Badge variant="secondary">{educationFields.length}</Badge>
                    </div>
                    {openSections.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                  <CardDescription>Formación académica y títulos</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {educationFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">Educación {index + 1}</h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={control}
                          name={`education.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institución *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una institución" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CHILEAN_UNIVERSITIES.map((university) => (
                                    <SelectItem key={university} value={university}>
                                      {university}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: Ingeniería Civil" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={control}
                        name={`education.${index}.field`}
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Área de Estudio *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Informática" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <FormField
                          control={control}
                          name={`education.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Inicio *</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`education.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Fin</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} disabled={watch(`education.${index}.current`)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`education.${index}.current`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel>En curso</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name={`education.${index}.gpa`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Promedio</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: 6.5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`education.${index}.honors`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Distinciones</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: Magna Cum Laude" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendEducation({
                        id: generateId(),
                        institution: "Universidad de Chile" as const,
                        degree: "",
                        field: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                        gpa: "",
                        honors: "",
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

          {/* Skills */}
          <Card>
            <Collapsible open={openSections.skills} onOpenChange={() => toggleSection("skills")}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      <CardTitle>Habilidades</CardTitle>
                      <Badge variant="secondary">{skillFields.length}</Badge>
                    </div>
                    {openSections.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                  <CardDescription>Competencias técnicas y blandas</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {skillFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">Habilidad {index + 1}</h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeSkill(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={control}
                          name={`skills.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: JavaScript" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`skills.${index}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoría *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {SKILL_CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name={`skills.${index}.level`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nivel (1-5) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="5"
                                  placeholder="3"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value ? getSkillLevelText(field.value) : "Selecciona un nivel"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`skills.${index}.years`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Años de Experiencia</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="50"
                                  placeholder="2"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendSkill({
                        id: generateId(),
                        name: "",
                        category: "Programación" as const,
                        level: 3,
                        years: 1,
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
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
                      <FolderOpen className="w-5 h-5" />
                      <CardTitle>Proyectos</CardTitle>
                      <Badge variant="secondary">{projectFields.length}</Badge>
                    </div>
                    {openSections.projects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                  <CardDescription>Proyectos personales y profesionales</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {projectFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">Proyecto {index + 1}</h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeProject(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <FormField
                        control={control}
                        name={`projects.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Nombre del Proyecto *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: E-commerce App" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`projects.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Descripción *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe el proyecto, su propósito y tu rol..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={control}
                          name={`projects.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL del Proyecto</FormLabel>
                              <FormControl>
                                <Input placeholder="https://mi-proyecto.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`projects.${index}.github`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub</FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/usuario/proyecto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={control}
                          name={`projects.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Inicio *</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`projects.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Fin</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} disabled={watch(`projects.${index}.current`)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`projects.${index}.current`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel>En desarrollo</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendProject({
                        id: generateId(),
                        name: "",
                        description: "",
                        technologies: [],
                        url: "",
                        github: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
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
                      <Award className="w-5 h-5" />
                      <CardTitle>Certificaciones</CardTitle>
                      <Badge variant="secondary">{certificationFields.length}</Badge>
                    </div>
                    {openSections.certifications ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                  <CardDescription>Certificaciones y cursos completados</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {certificationFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">Certificación {index + 1}</h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeCertification(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={control}
                          name={`certifications.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: AWS Solutions Architect" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`certifications.${index}.issuer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emisor *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: Amazon Web Services" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={control}
                          name={`certifications.${index}.date`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Emisión *</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`certifications.${index}.expiryDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Expiración</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name={`certifications.${index}.credentialId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID de Credencial</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: ABC123456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`certifications.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL de Verificación</FormLabel>
                              <FormControl>
                                <Input placeholder="https://verify.example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendCertification({
                        id: generateId(),
                        name: "",
                        issuer: "",
                        date: "",
                        expiryDate: "",
                        credentialId: "",
                        url: "",
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
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
                      <Languages className="w-5 h-5" />
                      <CardTitle>Idiomas</CardTitle>
                      <Badge variant="secondary">{languageFields.length}</Badge>
                    </div>
                    {openSections.languages ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                  <CardDescription>Competencias lingüísticas</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {languageFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">Idioma {index + 1}</h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeLanguage(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={control}
                          name={`languages.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Idioma *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: Inglés" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`languages.${index}.level`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nivel *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un nivel" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {LANGUAGE_LEVELS.map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {level}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name={`languages.${index}.certified`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel>Certificado</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`languages.${index}.certification`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certificación</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: TOEFL, IELTS"
                                  {...field}
                                  disabled={!watch(`languages.${index}.certified`)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendLanguage({
                        id: generateId(),
                        name: "",
                        level: "Intermedio" as const,
                        certified: false,
                        certification: "",
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Idioma
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button type="submit" size="lg" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Guardando..." : "Guardar CV"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
