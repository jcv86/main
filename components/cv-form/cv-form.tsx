"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2, User, Briefcase, GraduationCap, Code, Award, Globe } from "lucide-react"
import type { CVData, Experience, Education } from "@/lib/cv-types"

interface CVFormProps {
  data: CVData
  onChange: (data: CVData) => void
}

export function CVForm({ data, onChange }: CVFormProps) {
  const [newSkill, setNewSkill] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newCertification, setNewCertification] = useState("")

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    })
  }

  const updateSummary = (value: string) => {
    onChange({
      ...data,
      summary: value,
    })
  }

  const addExperience = () => {
    const newExperience: Experience = {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    }
    onChange({
      ...data,
      experience: [...data.experience, newExperience],
    })
  }

  const updateExperience = (index: number, field: string, value: string | boolean) => {
    const updatedExperience = [...data.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    onChange({
      ...data,
      experience: updatedExperience,
    })
  }

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experience: data.experience.filter((_, i) => i !== index),
    })
  }

  const addEducation = () => {
    const newEducation: Education = {
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      current: false,
    }
    onChange({
      ...data,
      education: [...data.education, newEducation],
    })
  }

  const updateEducation = (index: number, field: string, value: string | boolean) => {
    const updatedEducation = [...data.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    onChange({
      ...data,
      education: updatedEducation,
    })
  }

  const removeEducation = (index: number) => {
    onChange({
      ...data,
      education: data.education.filter((_, i) => i !== index),
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      onChange({
        ...data,
        skills: [...data.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((s) => s !== skill),
    })
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !data.languages?.includes(newLanguage.trim())) {
      onChange({
        ...data,
        languages: [...(data.languages || []), newLanguage.trim()],
      })
      setNewLanguage("")
    }
  }

  const removeLanguage = (language: string) => {
    onChange({
      ...data,
      languages: data.languages?.filter((l) => l !== language) || [],
    })
  }

  const addCertification = () => {
    if (newCertification.trim() && !data.certifications?.includes(newCertification.trim())) {
      onChange({
        ...data,
        certifications: [...(data.certifications || []), newCertification.trim()],
      })
      setNewCertification("")
    }
  }

  const removeCertification = (certification: string) => {
    onChange({
      ...data,
      certifications: data.certifications?.filter((c) => c !== certification) || [],
    })
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["personal", "summary"]} className="w-full">
        {/* Personal Information */}
        <AccordionItem value="personal">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>Your basic contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={data.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                      placeholder="Juan Pérez González"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      placeholder="juan.perez@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={data.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={data.personalInfo.location}
                      onChange={(e) => updatePersonalInfo("location", e.target.value)}
                      placeholder="Santiago, Chile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={data.personalInfo.website}
                      onChange={(e) => updatePersonalInfo("website", e.target.value)}
                      placeholder="https://juanperez.dev"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={data.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/juanperez"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={data.personalInfo.github}
                    onChange={(e) => updatePersonalInfo("github", e.target.value)}
                    placeholder="github.com/juanperez"
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Professional Summary */}
        <AccordionItem value="summary">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Professional Summary
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>About You</CardTitle>
                <CardDescription>A brief overview of your professional background and goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary *</Label>
                  <Textarea
                    id="summary"
                    value={data.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder="Experienced software developer with 5+ years in full-stack development..."
                    rows={4}
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    {data.summary.length}/500 characters (minimum 50 recommended)
                  </p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience */}
        <AccordionItem value="experience">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">Experience #{index + 1}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title *</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(index, "title", e.target.value)}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company *</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                          placeholder="NotCo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location *</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(index, "location", e.target.value)}
                          placeholder="Santiago, Chile"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                          disabled={exp.current}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-${index}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(index, "current", e.target.checked)}
                        />
                        <Label htmlFor={`current-${index}`}>Currently working here</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Job Description *</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Work Experience
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">Education #{index + 1}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Degree *</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          placeholder="Ingeniería Civil en Computación"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>School *</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) => updateEducation(index, "school", e.target.value)}
                          placeholder="Universidad de Chile"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location *</Label>
                        <Input
                          value={edu.location}
                          onChange={(e) => updateEducation(index, "location", e.target.value)}
                          placeholder="Santiago, Chile"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                          placeholder="6.2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                          disabled={edu.current}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`current-edu-${index}`}
                        checked={edu.current}
                        onChange={(e) => updateEducation(index, "current", e.target.checked)}
                      />
                      <Label htmlFor={`current-edu-${index}`}>Currently studying here</Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Skills
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Technical & Professional Skills</CardTitle>
                <CardDescription>Add your relevant skills and competencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., JavaScript, React, Python"
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-600" type="button">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Languages
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Language Proficiency</CardTitle>
                <CardDescription>Languages you speak and your proficiency level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="e.g., Spanish (Native), English (Advanced)"
                    onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                  />
                  <Button onClick={addLanguage} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.languages?.map((language) => (
                    <Badge key={language} variant="secondary" className="flex items-center gap-1">
                      {language}
                      <button
                        onClick={() => removeLanguage(language)}
                        className="ml-1 hover:text-red-600"
                        type="button"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Professional Certifications</CardTitle>
                <CardDescription>Relevant certifications and professional credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="e.g., AWS Solutions Architect, Google Cloud Professional"
                    onKeyPress={(e) => e.key === "Enter" && addCertification()}
                  />
                  <Button onClick={addCertification} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.certifications?.map((certification) => (
                    <Badge key={certification} variant="secondary" className="flex items-center gap-1">
                      {certification}
                      <button
                        onClick={() => removeCertification(certification)}
                        className="ml-1 hover:text-red-600"
                        type="button"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
