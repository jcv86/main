"use client"

import { useState } from "react"
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
import {
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Save,
  Eye,
  Download,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Languages,
} from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import {
  CVDataSchema,
  type CVData,
  DEFAULT_CV_DATA,
  CHILEAN_CITIES,
  CHILEAN_UNIVERSITIES,
  SKILL_CATEGORIES,
  generateId,
  getCompletionPercentage,
} from "@/lib/cv-types"

interface CVFormProps {
  initialData?: CVData
  onSave?: (data: CVData) => void
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
    resolver: zodResolver(CVDataSchema),
    defaultValues: initialData || DEFAULT_CV_DATA,
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
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  })

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
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

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: "languages",
  })

  const watchedData = form.watch()
  const completionPercentage = getCompletionPercentage(watchedData)

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSave = async (data: CVData) => {
    setIsLoading(true)
    try {
      // Intentar guardar en Supabase si está disponible
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from("cv_data").upsert({
          user_id: user.id,
          title: `CV - ${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          template: "modern",
          content: data,
          is_active: true,
          updated_at: new Date().toISOString(),
        })

        if (error) throw error
        toast.success("CV guardado exitosamente")
      } else {
        // Modo demo - guardar en localStorage
        localStorage.setItem("cv-data", JSON.stringify(data))
        toast.success("CV guardado localmente (modo demo)")
      }

      onSave?.(data)
    } catch (error) {
      console.error("Error saving CV:", error)
      toast.error("Error al guardar el CV")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (data: CVData) => {
    handleSave(data)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header con progreso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Constructor de CV
          </CardTitle>
          <CardDescription>Completa tu información profesional para generar un CV impactante</CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso de completitud</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Personal */}
          <Collapsible open={openSections.personal} onOpenChange={() => toggleSection("personal")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información Personal
                    </div>
                    {openSections.personal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
                      name="personalInfo.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona tu ciudad" />
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
                      control={form.control}
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="personalInfo.linkedIn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/usuario" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalInfo.github"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/usuario" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalInfo.portfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portafolio</FormLabel>
                          <FormControl>
                            <Input placeholder="https://miportafolio.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="personalInfo.summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumen Profesional *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe tu experiencia, habilidades y objetivos profesionales en 2-3 párrafos..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Mínimo 50 caracteres. Este será el primer impacto en tu CV.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Experiencia Laboral */}
          <Collapsible open={openSections.experience} onOpenChange={() => toggleSection("experience")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Experiencia Laboral
                      <Badge variant="secondary">{experienceFields.length}</Badge>
                    </div>
                    {openSections.experience ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {experienceFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Experiencia {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeExperience(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`experience.${index}.company`}
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
                          control={form.control}
                          name={`experience.${index}.position`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cargo *</FormLabel>
                              <FormControl>
                                <Input placeholder="Desarrollador Full Stack" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`experience.${index}.startDate`}
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
                          control={form.control}
                          name={`experience.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Fin</FormLabel>
                              <FormControl>
                                <Input type="month" disabled={form.watch(`experience.${index}.current`)} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`experience.${index}.current`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Trabajo actual</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`experience.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe tus responsabilidades y logros en este puesto..."
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
                        location: "",
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Experiencia
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Educación */}
          <Collapsible open={openSections.education} onOpenChange={() => toggleSection("education")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Educación
                      <Badge variant="secondary">{educationFields.length}</Badge>
                    </div>
                    {openSections.education ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {educationFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Educación {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeEducation(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institución *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona la institución" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CHILEAN_UNIVERSITIES.map((university) => (
                                    <SelectItem key={university} value={university}>
                                      {university}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="other">Otra institución</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ingeniería en Informática" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.field`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campo de Estudio *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ciencias de la Computación" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Año de Inicio *</FormLabel>
                              <FormControl>
                                <Input type="month" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Año de Fin</FormLabel>
                              <FormControl>
                                <Input type="month" disabled={form.watch(`education.${index}.current`)} {...field} />
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
                        institution: "",
                        degree: "",
                        field: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                        gpa: "",
                        honors: "",
                        description: "",
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Educación
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Habilidades */}
          <Collapsible open={openSections.skills} onOpenChange={() => toggleSection("skills")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Habilidades
                      <Badge variant="secondary">{skillFields.length}</Badge>
                    </div>
                    {openSections.skills ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {skillFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Habilidad {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeSkill(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`skills.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Habilidad *</FormLabel>
                              <FormControl>
                                <Input placeholder="React, Python, Liderazgo..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`skills.${index}.level`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nivel *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el nivel" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Básico">Básico</SelectItem>
                                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                                  <SelectItem value="Experto">Experto</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`skills.${index}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoría *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona la categoría" />
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
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendSkill({
                        id: generateId(),
                        name: "",
                        level: "Básico",
                        category: "",
                        yearsOfExperience: 0,
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Habilidad
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Proyectos */}
          <Collapsible open={openSections.projects} onOpenChange={() => toggleSection("projects")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      Proyectos
                      <Badge variant="secondary">{projectFields.length}</Badge>
                    </div>
                    {openSections.projects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {projectFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Proyecto {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeProject(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre del Proyecto *</FormLabel>
                              <FormControl>
                                <Input placeholder="E-commerce Platform" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`projects.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL del Proyecto</FormLabel>
                              <FormControl>
                                <Input placeholder="https://miproyecto.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`projects.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe el proyecto, tu rol y los resultados obtenidos..."
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
                      appendProject({
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
                        teamSize: 1,
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Proyecto
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Certificaciones */}
          <Collapsible open={openSections.certifications} onOpenChange={() => toggleSection("certifications")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Certificaciones
                      <Badge variant="secondary">{certificationFields.length}</Badge>
                    </div>
                    {openSections.certifications ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {certificationFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Certificación {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeCertification(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`certifications.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de la Certificación *</FormLabel>
                              <FormControl>
                                <Input placeholder="AWS Solutions Architect" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`certifications.${index}.issuer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emisor *</FormLabel>
                              <FormControl>
                                <Input placeholder="Amazon Web Services" {...field} />
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
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Certificación
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Idiomas */}
          <Collapsible open={openSections.languages} onOpenChange={() => toggleSection("languages")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Languages className="h-5 w-5" />
                      Idiomas
                      <Badge variant="secondary">{languageFields.length}</Badge>
                    </div>
                    {openSections.languages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {languageFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Idioma {index + 1}</h4>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeLanguage(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`languages.${index}.language`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Idioma *</FormLabel>
                              <FormControl>
                                <Input placeholder="Inglés, Francés, Alemán..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`languages.${index}.level`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nivel *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el nivel" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Básico">Básico</SelectItem>
                                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                                  <SelectItem value="Nativo">Nativo</SelectItem>
                                  <SelectItem value="Bilingüe">Bilingüe</SelectItem>
                                </SelectContent>
                              </Select>
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
                        language: "",
                        level: "Básico",
                        certification: "",
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Idioma
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Botones de acción */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Guardando..." : "Guardar CV"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onPreview?.(form.getValues())}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Vista Previa
                </Button>
                <Button type="button" variant="outline" onClick={() => onExport?.(form.getValues())} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
