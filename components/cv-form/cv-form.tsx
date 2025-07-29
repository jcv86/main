"use client"

import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface CVFormProps {
  data: any
  onChange: (data: any) => void
}

const personalInfoSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre completo es requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Número de teléfono inválido" }),
  location: z.string().min(3, { message: "La ubicación es requerida" }),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
})

const experienceSchema = z.object({
  title: z.string().min(3, { message: "El título es requerido" }),
  company: z.string().min(3, { message: "La empresa es requerida" }),
  location: z.string().min(3, { message: "La ubicación es requerida" }),
  startDate: z.date({ required_error: "La fecha de inicio es requerida" }),
  endDate: z.date().optional(),
  description: z.string().min(10, { message: "La descripción es requerida" }),
  current: z.boolean().default(false),
})

const educationSchema = z.object({
  degree: z.string().min(3, { message: "El título es requerido" }),
  school: z.string().min(3, { message: "La institución es requerida" }),
  location: z.string().min(3, { message: "La ubicación es requerida" }),
  startDate: z.date({ required_error: "La fecha de inicio es requerida" }),
  endDate: z.date({ required_error: "La fecha de fin es requerida" }),
  gpa: z.string().optional(),
})

const cvDataSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().min(50, { message: "El resumen debe tener al menos 50 caracteres" }),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string().min(2, { message: "Cada habilidad debe tener al menos 2 caracteres" })),
  languages: z.array(z.string().min(2, { message: "Cada idioma debe tener al menos 2 caracteres" })).optional(),
  certifications: z
    .array(z.string().min(2, { message: "Cada certificación debe tener al menos 2 caracteres" }))
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string().min(3, { message: "El nombre del proyecto es requerido" }),
        description: z.string().min(10, { message: "La descripción del proyecto es requerida" }),
        technologies: z.array(z.string()),
        url: z.string().url().optional(),
      }),
    )
    .optional(),
})

export function CVForm({ data, onChange }: CVFormProps) {
  const form = useForm<z.infer<typeof cvDataSchema>>({
    resolver: zodResolver(cvDataSchema),
    defaultValues: data,
    mode: "onChange",
  })

  useEffect(() => {
    if (form.formState.isValid) {
      onChange(form.getValues())
    }
  }, [form.formState.isValid, form.getValues, onChange])

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="personalInfo.fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez González" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="juan.perez@email.com" {...field} />
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
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+56 9 1234 5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
            <FormField
              control={form.control}
              name="personalInfo.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitio Web</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/ejemplo" {...field} />
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
                    <Input placeholder="https://github.com/ejemplo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen Profesional</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Profesional experimentado en desarrollo de software con 5+ años de experiencia..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Escribe un breve resumen de tu experiencia y habilidades. Destaca tus logros y objetivos
                    profesionales.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Experiencia Laboral</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiencia</FormLabel>
                  <FormControl>
                    <Button variant="outline" onClick={() => field.onChange([...field.value, {}])}>
                      Agregar Experiencia
                    </Button>
                  </FormControl>
                  <FormDescription>Agrega tu experiencia laboral más relevante.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle>Educación</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Educación</FormLabel>
                  <FormControl>
                    <Button variant="outline" onClick={() => field.onChange([...field.value, {}])}>
                      Agregar Educación
                    </Button>
                  </FormControl>
                  <FormDescription>Agrega tu formación académica más relevante.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Habilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habilidades</FormLabel>
                  <FormControl>
                    <Button variant="outline" onClick={() => field.onChange([...field.value, ""])}>
                      Agregar Habilidad
                    </Button>
                  </FormControl>
                  <FormDescription>Agrega tus habilidades más relevantes.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
