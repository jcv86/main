import type { CVData } from "@/lib/cv-types"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Star } from "lucide-react"

interface CreativeTemplateProps {
  data: CVData
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const { personalInfo, experience, education, skills, projects, languages, certifications } = data

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "short" })
  }

  const getSkillStars = (level: number) => {
    const stars = Math.round((level / 100) * 5)
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
      <div className="grid md:grid-cols-3 gap-0">
        {/* Sidebar */}
        <div className="bg-gradient-to-b from-purple-600 to-purple-800 text-white p-6">
          {/* Profile */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold">
                {personalInfo.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{personalInfo.fullName}</h1>
            {personalInfo.jobTitle && <p className="text-purple-200">{personalInfo.jobTitle}</p>}
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 border-b border-purple-400 pb-2">Contacto</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="break-all">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span className="break-all">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span className="break-all">{personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 border-b border-purple-400 pb-2">Habilidades</h2>
              <div className="space-y-4">
                {Object.entries(
                  skills.reduce(
                    (acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = []
                      acc[skill.category].push(skill)
                      return acc
                    },
                    {} as Record<string, typeof skills>,
                  ),
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-purple-200 mb-2 text-sm">{category}</h3>
                    <div className="space-y-2">
                      {categorySkills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{skill.name}</span>
                          </div>
                          <div className="flex gap-1">{getSkillStars(skill.level)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 border-b border-purple-400 pb-2">Idiomas</h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <Badge variant="secondary" className="bg-purple-500 text-white text-xs">
                      {lang.proficiency}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 p-6">
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Resumen Profesional
                </span>
                <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Experiencia
                </span>
                <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                    <div className="ml-8">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h3>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Presente"}
                        </span>
                      </div>
                      <p className="text-lg text-purple-600 mb-2">
                        {exp.company} • {exp.location}
                      </p>
                      <p className="text-gray-700 mb-3">{exp.description}</p>

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-semibold text-gray-800 mb-2">Logros destacados:</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {index < experience.length - 1 && (
                      <div className="absolute left-2 top-6 w-0.5 h-full bg-gradient-to-b from-purple-300 to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Educación
                </span>
                <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="relative">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                    <div className="ml-8">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      <p className="text-lg text-purple-600 mb-2">
                        {edu.institution} • {edu.location}
                      </p>
                      {edu.gpa && <p className="text-gray-700 mb-2">Promedio: {edu.gpa}</p>}
                      {edu.description && <p className="text-gray-700">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Proyectos
                </span>
                <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              </h2>
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                    {project.role && <p className="text-purple-600 mb-2">{project.role}</p>}
                    <p className="text-gray-700 mb-3">{project.description}</p>

                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="border-purple-300 text-purple-700 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 text-sm">
                      {project.url && (
                        <a href={project.url} className="text-purple-600 hover:underline font-medium">
                          Ver proyecto →
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="text-purple-600 hover:underline font-medium">
                          GitHub →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Certificaciones
                </span>
                <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              </h2>
              <div className="grid gap-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex justify-between items-start p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                      <p className="text-purple-600">{cert.issuer}</p>
                      {cert.credentialId && <p className="text-xs text-gray-500 mt-1">ID: {cert.credentialId}</p>}
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(cert.issueDate)}
                      {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
