"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Award, Code, Languages, GraduationCap, Briefcase, FolderOpen, User } from "lucide-react"
import {
  type CVData,
  type WorkExperience,
  type Education,
  type Project,
  type Skill,
  type Language,
  type Certification,
  generateId,
  SKILL_LEVELS,
  LANGUAGE_LEVELS,
  SKILL_CATEGORIES,
  CHILEAN_CITIES,
  COMMON_SKILLS,
} from "@/lib/cv-types"

interface CVFormProps {
  data: CVData
  onChange: (data: CVData) => void
}

export function CVForm({ data, onChange }: CVFormProps) {
  const [activeTab, setActiveTab] = useState("personal")

  const updateData = useCallback(
    (section: keyof CVData, value: any) => {
      const newData = { ...data, [section]: value }
      onChange(newData)
    },
    [data, onChange],
  )

  const updatePersonal = useCallback(
    (field: string, value: string) => {
      const newPersonal = { ...data.personal, [field]: value }
      updateData("personal", newPersonal)
    },
    [data.personal, updateData],
  )

  const addExperience = useCallback(() => {
    const newExperience: WorkExperience = {
      id: generateId(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [""],
    }
    updateData("experience", [...data.experience, newExperience])
  }, [data.experience, updateData])

  const updateExperience = useCallback(
    (id: string, field: string, value: any) => {
      const newExperience = data.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
      updateData("experience", newExperience)
    },
    [data.experience, updateData],
  )

  const removeExperience = useCallback(
    (id: string) => {
      const newExperience = data.experience.filter((exp) => exp.id !== id)
      updateData("experience", newExperience)
    },
    [data.experience, updateData],
  )

  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: generateId(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    }
    updateData("education", [...data.education, newEducation])
  }, [data.education, updateData])

  const updateEducation = useCallback(
    (id: string, field: string, value: any) => {
      const newEducation = data.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
      updateData("education", newEducation)
    },
    [data.education, updateData],
  )

  const removeEducation = useCallback(
    (id: string) => {
      const newEducation = data.education.filter((edu) => edu.id !== id)
      updateData("education", newEducation)
    },
    [data.education, updateData],
  )

  const addProject = useCallback(() => {
    const newProject: Project = {
      id: generateId(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      url: "",
      github: "",
    }
    updateData("projects", [...data.projects, newProject])
  }, [data.projects, updateData])

  const updateProject = useCallback(
    (id: string, field: string, value: any) => {
      const newProjects = data.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj))
      updateData("projects", newProjects)
    },
    [data.projects, updateData],
  )

  const removeProject = useCallback(
    (id: string) => {
      const newProjects = data.projects.filter((proj) => proj.id !== id)
      updateData("projects", newProjects)
    },
    [data.projects, updateData],
  )

  const addSkill = useCallback(() => {
    const newSkill: Skill = {
      id: generateId(),
      name: "",
      level: "Intermediate",
      category: "Technical",
    }
    updateData("skills", [...data.skills, newSkill])
  }, [data.skills, updateData])

  const updateSkill = useCallback(
    (id: string, field: string, value: any) => {
      const newSkills = data.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill))
      updateData("skills", newSkills)
    },
    [data.skills, updateData],
  )

  const removeSkill = useCallback(
    (id: string) => {
      const newSkills = data.skills.filter((skill) => skill.id !== id)
      updateData("skills", newSkills)
    },
    [data.skills, updateData],
  )

  const addLanguage = useCallback(() => {
    const newLanguage: Language = {
      id: generateId(),
      name: "",
      level: "Conversational",
    }
    updateData("languages", [...data.languages, newLanguage])
  }, [data.languages, updateData])

  const updateLanguage = useCallback(
    (id: string, field: string, value: any) => {
      const newLanguages = data.languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang))
      updateData("languages", newLanguages)
    },
    [data.languages, updateData],
  )

  const removeLanguage = useCallback(
    (id: string) => {
      const newLanguages = data.languages.filter((lang) => lang.id !== id)
      updateData("languages", newLanguages)
    },
    [data.languages, updateData],
  )

  const addCertification = useCallback(() => {
    const newCertification: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: "",
    }
    updateData("certifications", [...data.certifications, newCertification])
  }, [data.certifications, updateData])

  const updateCertification = useCallback(
    (id: string, field: string, value: any) => {
      const newCertifications = data.certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
      updateData("certifications", newCertifications)
    },
    [data.certifications, updateData],
  )

  const removeCertification = useCallback(
    (id: string) => {
      const newCertifications = data.certifications.filter((cert) => cert.id !== id)
      updateData("certifications", newCertifications)
    },
    [data.certifications, updateData],
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="personal" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1">
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-1">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Languages</span>
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Certs</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Basic information that will appear at the top of your CV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={data.personal.fullName || ""}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                    placeholder="Juan Pérez González"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.personal.email || ""}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                    placeholder="juan.perez@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={data.personal.phone || ""}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select value={data.personal.city || ""} onValueChange={(value) => updatePersonal("city", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
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
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={data.personal.address || ""}
                    onChange={(e) => updatePersonal("address", e.target.value)}
                    placeholder="Av. Providencia 1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={data.personal.country || ""}
                    onChange={(e) => updatePersonal("country", e.target.value)}
                    placeholder="Chile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    id="linkedIn"
                    value={data.personal.linkedIn || ""}
                    onChange={(e) => updatePersonal("linkedIn", e.target.value)}
                    placeholder="linkedin.com/in/juanperez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={data.personal.website || ""}
                    onChange={(e) => updatePersonal("website", e.target.value)}
                    placeholder="juanperez.dev"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={data.personal.summary || ""}
                  onChange={(e) => updatePersonal("summary", e.target.value)}
                  placeholder="Brief description of your professional background and career objectives..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <p className="text-sm text-muted-foreground">Add your professional experience</p>
            </div>
            <Button onClick={addExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {data.experience.map((exp, index) => (
            <Card key={exp.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Experience #{index + 1}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => removeExperience(exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company *</Label>
                    <Input
                      value={exp.company || ""}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position *</Label>
                    <Input
                      value={exp.position || ""}
                      onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                      placeholder="Job title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="month"
                      value={exp.startDate || ""}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate || ""}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      disabled={exp.current}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.current || false}
                    onCheckedChange={(checked) => updateExperience(exp.id, "current", checked)}
                  />
                  <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description || ""}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    placeholder="Describe your role and responsibilities..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Key Achievements</Label>
                  {(exp.achievements || [""]).map((achievement, achIndex) => (
                    <div key={achIndex} className="flex gap-2">
                      <Input
                        value={achievement || ""}
                        onChange={(e) => {
                          const newAchievements = [...(exp.achievements || [])]
                          newAchievements[achIndex] = e.target.value
                          updateExperience(exp.id, "achievements", newAchievements)
                        }}
                        placeholder="Key achievement or accomplishment..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newAchievements = (exp.achievements || []).filter((_, i) => i !== achIndex)
                          updateExperience(exp.id, "achievements", newAchievements)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAchievements = [...(exp.achievements || []), ""]
                      updateExperience(exp.id, "achievements", newAchievements)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {data.experience.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No work experience added yet</p>
                <Button onClick={addExperience}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Experience
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Education</h3>
              <p className="text-sm text-muted-foreground">Add your educational background</p>
            </div>
            <Button onClick={addEducation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>

          {data.education.map((edu, index) => (
            <Card key={edu.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => removeEducation(edu.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Institution *</Label>
                    <Input
                      value={edu.institution || ""}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      placeholder="University or school name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree *</Label>
                    <Input
                      value={edu.degree || ""}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Input
                      value={edu.field || ""}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                      placeholder="Computer Science, Business, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GPA</Label>
                    <Input
                      value={edu.gpa || ""}
                      onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                      placeholder="6.5 (Chilean scale)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={edu.startDate || ""}
                      onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={edu.endDate || ""}
                      onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                      disabled={edu.current}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-edu-${edu.id}`}
                    checked={edu.current || false}
                    onCheckedChange={(checked) => updateEducation(edu.id, "current", checked)}
                  />
                  <Label htmlFor={`current-edu-${edu.id}`}>Currently studying</Label>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={edu.description || ""}
                    onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                    placeholder="Relevant coursework, thesis, achievements..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {data.education.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No education added yet</p>
                <Button onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your Education
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Projects</h3>
              <p className="text-sm text-muted-foreground">Showcase your personal or professional projects</p>
            </div>
            <Button onClick={addProject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          {data.projects.map((project, index) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Project #{index + 1}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => removeProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Name *</Label>
                    <Input
                      value={project.name || ""}
                      onChange={(e) => updateProject(project.id, "name", e.target.value)}
                      placeholder="Project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Technologies</Label>
                    <Input
                      value={(project.technologies || []).join(", ")}
                      onChange={(e) =>
                        updateProject(
                          project.id,
                          "technologies",
                          e.target.value.split(", ").filter((t) => t.trim()),
                        )
                      }
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={project.startDate || ""}
                      onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={project.endDate || ""}
                      onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Project URL</Label>
                    <Input
                      value={project.url || ""}
                      onChange={(e) => updateProject(project.id, "url", e.target.value)}
                      placeholder="https://project-demo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input
                      value={project.github || ""}
                      onChange={(e) => updateProject(project.id, "github", e.target.value)}
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={project.description || ""}
                    onChange={(e) => updateProject(project.id, "description", e.target.value)}
                    placeholder="Describe the project, your role, and key features..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {data.projects.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No projects added yet</p>
                <Button onClick={addProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Skills</h3>
              <p className="text-sm text-muted-foreground">Add your technical and soft skills</p>
            </div>
            <Button onClick={addSkill}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.skills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{skill.category}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeSkill(skill.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Skill Name</Label>
                    <Input
                      value={skill.name || ""}
                      onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                      placeholder="JavaScript, Leadership, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Level</Label>
                    <Select
                      value={skill.level || "Intermediate"}
                      onValueChange={(value) => updateSkill(skill.id, "level", value)}
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
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={skill.category || "Technical"}
                      onValueChange={(value) => updateSkill(skill.id, "category", value)}
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
                </CardContent>
              </Card>
            ))}
          </div>

          {data.skills.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No skills added yet</p>
                <Button onClick={addSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Skill
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Add Common Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Add Common Skills</CardTitle>
              <CardDescription>Click to quickly add popular skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.slice(0, 20).map((skillName) => (
                  <Badge
                    key={skillName}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      const newSkill: Skill = {
                        id: generateId(),
                        name: skillName,
                        level: "Intermediate",
                        category:
                          skillName.includes("JavaScript") ||
                          skillName.includes("Python") ||
                          skillName.includes("React")
                            ? "Technical"
                            : "Technical",
                      }
                      updateData("skills", [...data.skills, newSkill])
                    }}
                  >
                    {skillName}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Languages</h3>
              <p className="text-sm text-muted-foreground">Add languages you speak</p>
            </div>
            <Button onClick={addLanguage}>
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.languages.map((language) => (
              <Card key={language.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => removeLanguage(language.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Input
                      value={language.name || ""}
                      onChange={(e) => updateLanguage(language.id, "name", e.target.value)}
                      placeholder="Spanish, English, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Proficiency Level</Label>
                    <Select
                      value={language.level || "Conversational"}
                      onValueChange={(value) => updateLanguage(language.id, "level", value)}
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
                </CardContent>
              </Card>
            ))}
          </div>

          {data.languages.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Languages className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No languages added yet</p>
                <Button onClick={addLanguage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Language
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Certifications</h3>
              <p className="text-sm text-muted-foreground">Add your professional certifications and licenses</p>
            </div>
            <Button onClick={addCertification}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>

          {data.certifications.map((cert, index) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Certification #{index + 1}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => removeCertification(cert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Certification Name *</Label>
                    <Input
                      value={cert.name || ""}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization *</Label>
                    <Input
                      value={cert.issuer || ""}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issue Date *</Label>
                    <Input
                      type="month"
                      value={cert.date || ""}
                      onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="month"
                      value={cert.expiryDate || ""}
                      onChange={(e) => updateCertification(cert.id, "expiryDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Credential ID</Label>
                    <Input
                      value={cert.credentialId || ""}
                      onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                      placeholder="ABC123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Credential URL</Label>
                    <Input
                      value={cert.url || ""}
                      onChange={(e) => updateCertification(cert.id, "url", e.target.value)}
                      placeholder="https://verify.certification.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {data.certifications.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No certifications added yet</p>
                <Button onClick={addCertification}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Certification
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
