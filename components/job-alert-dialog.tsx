"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Bell, GraduationCap, X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JobAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// UDD Career-specific data
const UDD_CAREERS = {
  bachillerato: {
    name: "Bachillerato en Ciencias y Humanidades",
    keywords: ["investigación", "análisis", "ciencias", "humanidades", "interdisciplinario"],
    skills: ["Pensamiento crítico", "Investigación", "Análisis", "Comunicación", "Metodología científica"],
    jobTitles: ["Analista de investigación", "Coordinador académico", "Asistente de investigación"],
  },
  diseno: {
    name: "Diseño",
    keywords: ["diseño gráfico", "UX/UI", "creatividad", "branding", "digital", "visual"],
    skills: ["Adobe Creative Suite", "Figma", "Creatividad", "UX/UI", "Branding", "Diseño web"],
    jobTitles: ["Diseñador gráfico", "UX/UI Designer", "Director de arte", "Diseñador web"],
  },
  periodismo: {
    name: "Periodismo",
    keywords: ["comunicaciones", "redacción", "medios", "digital", "contenido", "marketing"],
    skills: ["Redacción", "Comunicación", "Marketing digital", "Redes sociales", "Investigación periodística"],
    jobTitles: ["Periodista", "Community manager", "Content manager", "Comunicador corporativo"],
  },
  ingenieria_comercial: {
    name: "Ingeniería Comercial",
    keywords: ["negocios", "finanzas", "marketing", "gestión", "análisis", "estrategia"],
    skills: ["Análisis financiero", "Marketing", "Gestión de proyectos", "Excel avanzado", "Estrategia"],
    jobTitles: ["Analista financiero", "Product manager", "Consultor", "Analista de negocios"],
  },
  psicologia: {
    name: "Psicología",
    keywords: ["recursos humanos", "bienestar", "salud mental", "desarrollo organizacional"],
    skills: ["Evaluación psicológica", "RRHH", "Coaching", "Desarrollo organizacional", "Bienestar laboral"],
    jobTitles: ["Psicólogo organizacional", "HR Business Partner", "Consultor en bienestar"],
  },
}

const CHILEAN_CITIES = [
  "Santiago",
  "Valparaíso",
  "Concepción",
  "La Serena",
  "Antofagasta",
  "Temuco",
  "Rancagua",
  "Talca",
  "Arica",
  "Iquique",
  "Puerto Montt",
  "Punta Arenas",
]

const JOB_TYPES = [
  { value: "full-time", label: "Tiempo completo" },
  { value: "part-time", label: "Medio tiempo" },
  { value: "internship", label: "Práctica profesional" },
  { value: "contract", label: "Por contrato" },
  { value: "freelance", label: "Freelance" },
]

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Sin experiencia / Recién egresado" },
  { value: "junior", label: "1-2 años de experiencia" },
  { value: "mid", label: "3-5 años de experiencia" },
  { value: "senior", label: "5+ años de experiencia" },
]

export function JobAlertDialog({ open, onOpenChange }: JobAlertDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    alertName: "",
    career: "",
    keywords: [] as string[],
    locations: [] as string[],
    jobTypes: [] as string[],
    experienceLevel: "",
    salaryRange: [800000, 3000000], // CLP
    remoteWork: false,
    description: "",
    frequency: "daily",
  })
  const [newKeyword, setNewKeyword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCareerChange = (career: string) => {
    const careerData = UDD_CAREERS[career as keyof typeof UDD_CAREERS]
    if (careerData) {
      setFormData((prev) => ({
        ...prev,
        career,
        keywords: [...careerData.keywords],
        alertName: `Alertas ${careerData.name}`,
      }))
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }))
  }

  const toggleLocation = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter((l) => l !== location)
        : [...prev.locations, location],
    }))
  }

  const toggleJobType = (jobType: string) => {
    setFormData((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(jobType)
        ? prev.jobTypes.filter((t) => t !== jobType)
        : [...prev.jobTypes, jobType],
    }))
  }

  const handleSubmit = async () => {
    if (!formData.alertName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre para la alerta",
        variant: "destructive",
      })
      return
    }

    if (!formData.career) {
      toast({
        title: "Error",
        description: "Por favor selecciona tu carrera UDD",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Save alert to localStorage (in a real app, this would be an API call)
      const alerts = JSON.parse(localStorage.getItem("udd_job_alerts") || "[]")
      const newAlert = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        active: true,
      }

      alerts.push(newAlert)
      localStorage.setItem("udd_job_alerts", JSON.stringify(alerts))

      toast({
        title: "¡Alerta creada exitosamente!",
        description: `Recibirás notificaciones sobre oportunidades que coincidan con tu perfil de ${UDD_CAREERS[formData.career as keyof typeof UDD_CAREERS]?.name}`,
      })

      // Reset form
      setFormData({
        alertName: "",
        career: "",
        keywords: [],
        locations: [],
        jobTypes: [],
        experienceLevel: "",
        salaryRange: [800000, 3000000],
        remoteWork: false,
        description: "",
        frequency: "daily",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la alerta. Inténtalo nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Crear Alerta de Empleo UDD
          </DialogTitle>
          <DialogDescription>
            Configura alertas personalizadas para recibir notificaciones sobre oportunidades laborales que coincidan con
            tu perfil de estudiante/egresado UDD.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Name */}
          <div className="space-y-2">
            <Label htmlFor="alertName">Nombre de la Alerta</Label>
            <Input
              id="alertName"
              placeholder="Ej: Oportunidades Ingeniería Comercial Santiago"
              value={formData.alertName}
              onChange={(e) => setFormData((prev) => ({ ...prev, alertName: e.target.value }))}
            />
          </div>

          {/* Career Selection */}
          <div className="space-y-2">
            <Label>Carrera UDD</Label>
            <Select value={formData.career} onValueChange={handleCareerChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu carrera" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(UDD_CAREERS).map(([key, career]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {career.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label>Palabras Clave</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Agregar palabra clave..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
              />
              <Button type="button" onClick={addKeyword} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-2">
            <Label>Ubicaciones en Chile</Label>
            <div className="grid grid-cols-3 gap-2">
              {CHILEAN_CITIES.map((city) => (
                <div key={city} className="flex items-center space-x-2">
                  <Checkbox
                    id={city}
                    checked={formData.locations.includes(city)}
                    onCheckedChange={() => toggleLocation(city)}
                  />
                  <Label htmlFor={city} className="text-sm">
                    {city}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Job Types */}
          <div className="space-y-2">
            <Label>Tipos de Empleo</Label>
            <div className="grid grid-cols-2 gap-2">
              {JOB_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={formData.jobTypes.includes(type.value)}
                    onCheckedChange={() => toggleJobType(type.value)}
                  />
                  <Label htmlFor={type.value} className="text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label>Nivel de Experiencia</Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, experienceLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu nivel de experiencia" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <Label>Rango Salarial (CLP)</Label>
            <div className="px-3">
              <Slider
                value={formData.salaryRange}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, salaryRange: value }))}
                min={500000}
                max={8000000}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{formatSalary(formData.salaryRange[0])}</span>
                <span>{formatSalary(formData.salaryRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Remote Work */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remoteWork"
              checked={formData.remoteWork}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, remoteWork: !!checked }))}
            />
            <Label htmlFor="remoteWork">Incluir trabajos remotos</Label>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Frecuencia de Notificaciones</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Inmediata</SelectItem>
                <SelectItem value="daily">Diaria</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción Adicional (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Describe cualquier preferencia adicional o requisitos específicos..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creando..." : "Crear Alerta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
