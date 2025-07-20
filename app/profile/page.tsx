"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Briefcase, Award, Edit, Save, Camera, Plus, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  location?: string
  bio?: string
  current_position?: string
  company?: string
  experience_years?: number
  education_level?: string
  skills: string[]
  languages: Array<{
    language: string
    proficiency: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
  }>
  avatar_url?: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState("")
  const [newLanguage, setNewLanguage] = useState({ language: "", proficiency: "" })
  const [newCertification, setNewCertification] = useState({ name: "", issuer: "", date: "" })

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockProfile: UserProfile = {
      id: user?.id || "1",
      email: user?.email || "usuario@ejemplo.com",
      full_name: "María González Silva",
      phone: "+56 9 1234 5678",
      location: "Santiago, Chile",
      bio: "Desarrolladora Full Stack con 5 años de experiencia en tecnologías web modernas. Apasionada por crear soluciones innovadoras y liderar equipos de desarrollo.",
      current_position: "Senior Full Stack Developer",
      company: "TechCorp Chile",
      experience_years: 5,
      education_level: "Ingeniería en Informática",
      skills: ["JavaScript", "React", "Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
      languages: [
        { language: "Español", proficiency: "Nativo" },
        { language: "Inglés", proficiency: "Avanzado" },
        { language: "Portugués", proficiency: "Intermedio" },
      ],
      certifications: [
        { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2023-06" },
        { name: "React Developer Certification", issuer: "Meta", date: "2023-03" },
      ],
      avatar_url: "/placeholder-user.jpg",
    }

    setTimeout(() => {
      setProfile(mockProfile)
      setLoading(false)
    }, 1000)
  }, [user])

  const handleSave = async () => {
    // In real app, save to API
    setIsEditing(false)
    // Show success message
  }

  const addSkill = () => {
    if (newSkill.trim() && profile) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: profile.skills.filter((skill) => skill !== skillToRemove),
      })
    }
  }

  const addLanguage = () => {
    if (newLanguage.language.trim() && newLanguage.proficiency && profile) {
      setProfile({
        ...profile,
        languages: [...profile.languages, newLanguage],
      })
      setNewLanguage({ language: "", proficiency: "" })
    }
  }

  const removeLanguage = (index: number) => {
    if (profile) {
      setProfile({
        ...profile,
        languages: profile.languages.filter((_, i) => i !== index),
      })
    }
  }

  const addCertification = () => {
    if (newCertification.name.trim() && newCertification.issuer.trim() && profile) {
      setProfile({
        ...profile,
        certifications: [...profile.certifications, newCertification],
      })
      setNewCertification({ name: "", issuer: "", date: "" })
    }
  }

  const removeCertification = (index: number) => {
    if (profile) {
      setProfile({
        ...profile,
        certifications: profile.certifications.filter((_, i) => i !== index),
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p>Error al cargar el perfil.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground">Gestiona tu información personal y profesional</p>
          </div>
          <Button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="flex items-center gap-2">
            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {isEditing ? "Guardar" : "Editar"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Profesional</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="education">Educación</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name} />
                    <AvatarFallback className="text-2xl">
                      {profile.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{profile.full_name}</h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                  {profile.current_position && (
                    <p className="text-sm text-muted-foreground">
                      {profile.current_position} en {profile.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Personal Information Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre Completo</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={profile.location || ""}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Santiago, Chile"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Cuéntanos sobre ti..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Información Profesional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="current_position">Posición Actual</Label>
                  <Input
                    id="current_position"
                    value={profile.current_position || ""}
                    onChange={(e) => setProfile({ ...profile, current_position: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Senior Developer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={profile.company || ""}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    disabled={!isEditing}
                    placeholder="TechCorp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Años de Experiencia</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={profile.experience_years || ""}
                    onChange={(e) => setProfile({ ...profile, experience_years: Number.parseInt(e.target.value) })}
                    disabled={!isEditing}
                    placeholder="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education_level">Nivel de Educación</Label>
                  <Input
                    id="education_level"
                    value={profile.education_level || ""}
                    onChange={(e) => setProfile({ ...profile, education_level: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Ingeniería en Informática"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Habilidades Técnicas</CardTitle>
              <CardDescription>Gestiona tus habilidades y competencias técnicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Nueva habilidad"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Idiomas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {profile.languages.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{lang.language}</span>
                      <Badge variant="outline" className="ml-2">
                        {lang.proficiency}
                      </Badge>
                    </div>
                    {isEditing && (
                      <Button size="sm" variant="ghost" onClick={() => removeLanguage(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Idioma"
                    value={newLanguage.language}
                    onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
                  />
                  <Select
                    value={newLanguage.proficiency}
                    onValueChange={(value) => setNewLanguage({ ...newLanguage, proficiency: value })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Básico">Básico</SelectItem>
                      <SelectItem value="Intermedio">Intermedio</SelectItem>
                      <SelectItem value="Avanzado">Avanzado</SelectItem>
                      <SelectItem value="Nativo">Nativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addLanguage}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground">{cert.date}</p>
                    </div>
                    {isEditing && (
                      <Button size="sm" variant="ghost" onClick={() => removeCertification(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <div className="grid md:grid-cols-2 gap-2">
                    <Input
                      placeholder="Nombre de la certificación"
                      value={newCertification.name}
                      onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                    />
                    <Input
                      placeholder="Emisor"
                      value={newCertification.issuer}
                      onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="month"
                      value={newCertification.date}
                      onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
                    />
                    <Button onClick={addCertification}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
