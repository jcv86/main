"use client"

import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, User, Briefcase, GraduationCap, Award, Code, Languages, FolderOpen } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Zod schemas for form validation
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "Apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono debe tener al menos 8 dígitos"),
  location: z.string().min(2, "Ubicación requerida"),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  linkedin: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
})

const experienceSchema = z.object({
  company: z.string().min(2, "Nombre de empresa requerido"),
  position: z.string().min(2, "Cargo requerido"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(10, "Descripción debe tener al menos 10 caracteres"),
  location: z.string().min(2, "Ubicación requerida"),
})

const educationSchema = z.object({
  institution: z.string().min(2, "Institución requerida"),
  degree: z.string().min(2, "Título requerido"),
  field: z.string().min(2, "Campo de estudio requerido"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  description: z.string().optional(),
})

const skillSchema = z.object({
  name: z.string().min(1, "Nombre de habilidad requerido"),
  level: z.enum(["Básico", "Intermedio", "Avanzado", "Experto"]),
})

const languageSchema = z.object({
  name: z.string().min(1, "Idioma requerido"),
  level: z.enum(["Básico", "Intermedio", "Avanzado", "Nativo"]),
})

const certificationSchema = z.object({
  name: z.string().min(2, "Nombre de certificación requerido"),
  issuer: z.string().min(2, "Emisor requerido"),
  date: z.string().min(1, "Fecha requerida"),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
})

const projectSchema = z.object({
  name: z.string().min(2, "Nombre del proyecto requerido"),
  description: z.string().min(10, "Descripción debe tener al menos 10 caracteres"),
  technologies: z.string().min(2, "Tecnologías requeridas"),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
})

const cvFormSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().min(50, "Resumen profesional debe tener al menos 50 caracteres"),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  languages: z.array(languageSchema),
  certifications: z.array(certificationSchema),
  projects: z.array(projectSchema),
})

export type CVFormData = z.infer<typeof cvFormSchema>

interface CVFormProps {
  initialData?: Partial<CVFormData>
  onDataChange?: (data: CVFormData) => void
}

export function CVForm({ initialData, onDataChange }: CVFormProps) {
  const form = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
      ...initialData,
    },
  })

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = form

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
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
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
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
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  })

  // Watch for form changes and notify parent
  const watchedData = watch()
  useEffect(() => {
    if (onDataChange) {
      onDataChange(watchedData)
    }
  }, [watchedData, onDataChange])

  const onSubmit = (data: CVFormData) => {
    console.log("CV Form Data:", data)
    if (onDataChange) {
      onDataChange(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="personalInfo.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
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
                    <FormLabel>Apellido</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+56 9 1234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="personalInfo.location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Santiago, Chile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="personalInfo.website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sitio Web (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://miportfolio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="personalInfo.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="personalInfo.github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen Profesional</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu experiencia profesional, habilidades clave y objetivos de carrera..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experiencia Laboral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Experiencia {index + 1}</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => removeExperience(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`experience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre de la empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`experience.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <FormControl>
                          <Input placeholder="Desarrollador Full Stack" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={control}
                    name={`experience.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Inicio</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`experience.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Fin</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} disabled={watch(`experience.${index}.current`)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`experience.${index}.current`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Trabajo Actual</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={control}
                  name={`experience.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <FormControl>
                        <Input placeholder="Santiago, Chile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe tus responsabilidades y logros en este puesto..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendExperience({
                  company: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                  description: "",
                  location: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Experiencia
            </Button>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Educación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {educationFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Educación {index + 1}</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => removeEducation(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institución</FormLabel>
                        <FormControl>
                          <Input placeholder="Universidad de Chile" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingeniería en Informática" {...field} />
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
                    <FormItem>
                      <FormLabel>Campo de Estudio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ciencias de la Computación" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={control}
                    name={`education.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Inicio</FormLabel>
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
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Estudiando Actualmente</FormLabel>
                        </div>
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
                        <FormLabel>Promedio (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="6.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={control}
                  name={`education.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Menciona logros académicos, proyectos destacados, etc..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendEducation({
                  institution: "",
                  degree: "",
                  field: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                  gpa: "",
                  description: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Educación
            </Button>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Habilidades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4">
                <FormField
                  control={control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Habilidad</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Python, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`skills.${index}.level`}
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Nivel</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nivel" />
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
                <Button type="button" variant="outline" size="sm" onClick={() => removeSkill(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendSkill({ name: "", level: "Básico" })}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Habilidad
            </Button>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Idiomas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {languageFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4">
                <FormField
                  control={control}
                  name={`languages.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Idioma</FormLabel>
                      <FormControl>
                        <Input placeholder="Español, Inglés, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`languages.${index}.level`}
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Nivel</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                          <SelectItem value="Nativo">Nativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => removeLanguage(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendLanguage({ name: "", level: "Básico" })}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Idioma
            </Button>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certificationFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Certificación {index + 1}</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => removeCertification(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`certifications.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="AWS Certified Developer" {...field} />
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
                        <FormLabel>Emisor</FormLabel>
                        <FormControl>
                          <Input placeholder="Amazon Web Services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`certifications.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} />
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
                        <FormLabel>URL (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://certificacion.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendCertification({
                  name: "",
                  issuer: "",
                  date: "",
                  url: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Certificación
            </Button>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Proyectos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Proyecto {index + 1}</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => removeProject(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormField
                  control={control}
                  name={`projects.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Proyecto</FormLabel>
                      <FormControl>
                        <Input placeholder="Mi Aplicación Web" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`projects.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe el proyecto, su propósito y tus contribuciones..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`projects.${index}.technologies`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tecnologías</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Node.js, MongoDB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`projects.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL del Proyecto (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://miproyecto.com" {...field} />
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
                        <FormLabel>GitHub (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/usuario/proyecto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendProject({
                  name: "",
                  description: "",
                  technologies: "",
                  url: "",
                  github: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Proyecto
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Guardar CV
          </Button>
        </div>
      </form>
    </Form>
  )
}
