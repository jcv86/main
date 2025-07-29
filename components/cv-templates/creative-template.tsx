import type { CVData, CVTemplate } from "@/lib/cv-types"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, ExternalLink, Github, User } from "lucide-react"

interface CreativeTemplateProps {
  data: CVData
  template: CVTemplate
}

export function CreativeTemplate({ data, template }: CreativeTemplateProps) {
  const colors = template?.colors || {
    primary: "#7C3AED",
    secondary: "#5B21B6",
    accent: "#A78BFA",
    text: "#1F2937",
    background: "#FFFFFF",
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString + "-01")
      return date.toLocaleDateString("es-CL", { year: "numeric", month: "long" })
    } catch {
      return dateString
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg flex" style={{ color: colors.text }}>
      {/* Sidebar */}
      <div className="w-1/3 p-8 text-white" style={{ backgroundColor: colors.primary }}>
        {/* Profile */}
        <div className="text-center mb-8">
          <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white">
            <AvatarFallback className="text-2xl font-bold" style={{ backgroundColor: colors.secondary }}>
              {data.personal.fullName ? getInitials(data.personal.fullName) : <User className="h-12 w-12" />}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mb-2">{data.personal.fullName || "Your Name"}</h1>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-white/30">CONTACTO</h2>
          <div className="space-y-3 text-sm">
            {data.personal.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">{data.personal.email}</span>
              </div>
            )}
            {data.personal.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{data.personal.phone}</span>
              </div>
            )}
            {data.personal.city && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>
                  {data.personal.city}, {data.personal.country}
                </span>
              </div>
            )}
            {data.personal.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">{data.personal.website}</span>
              </div>
            )}
            {data.personal.linkedIn && (
              <div className="flex items-center gap-3">
                <Linkedin className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">{data.personal.linkedIn}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-white/30">HABILIDADES</h2>
            <div className="space-y-4">
              {SKILL_CATEGORIES.map((category) => {
                const categorySkills = data.skills.filter((skill) => skill.category === category)
                if (categorySkills.length === 0) return null

                return (
                  <div key={category}>
                    <h3 className="font-semibold mb-2 text-sm opacity-90">{category}</h3>
                    <div className="space-y-2">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{skill.name}</span>
                            <span className="opacity-75">{skill.level}</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-1">
                            <div
                              className="bg-white rounded-full h-1 transition-all"
                              style={{
                                width:
                                  skill.level === "Expert"
                                    ? "100%"
                                    : skill.level === "Advanced"
                                      ? "80%"
                                      : skill.level === "Intermediate"
                                        ? "60%"
                                        : "40%",
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-white/30">IDIOMAS</h2>
            <div className="space-y-3">
              {data.languages.map((language) => (
                <div key={language.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{language.name}</span>
                    <span className="opacity-75 text-xs">{language.level}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-white rounded-full h-1 transition-all"
                      style={{
                        width:
                          language.level === "Native"
                            ? "100%"
                            : language.level === "Fluent"
                              ? "85%"
                              : language.level === "Conversational"
                                ? "65%"
                                : "40%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8">
        {/* Summary */}
        {data.personal.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
              PERFIL PROFESIONAL
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
              EXPERIENCIA
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2" style={{ borderColor: colors.accent }}>
                  <div
                    className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold">{exp.position}</h3>
                        <p className="font-semibold" style={{ color: colors.secondary }}>
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(exp.startDate)} - {exp.current ? "Presente" : formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.description && <p className="text-gray-700 text-sm">{exp.description}</p>}
                    {exp.achievements.filter((a) => a.trim()).length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                        {exp.achievements
                          .filter((a) => a.trim())
                          .map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
              EDUCACIÓN
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{edu.degree}</h3>
                      <p className="font-semibold" style={{ color: colors.secondary }}>
                        {edu.institution}
                      </p>
                      {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(edu.startDate)} - {edu.current ? "Presente" : formatDate(edu.endDate)}
                    </div>
                  </div>
                  {edu.gpa && <p className="text-gray-600 text-sm">Promedio: {edu.gpa}</p>}
                  {edu.description && <p className="text-gray-700 text-sm">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
              PROYECTOS
            </h2>
            <div className="space-y-6">
              {data.projects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{project.name}</h3>
                    <div className="flex gap-2">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs px-2 py-1"
                          style={{ borderColor: colors.accent, color: colors.primary }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {(project.startDate || project.endDate) && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
              CERTIFICACIONES
            </h2>
            <div className="space-y-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="space-y-1">
                  <h3 className="font-bold">{cert.name}</h3>
                  <p className="text-gray-600 font-semibold text-sm">{cert.issuer}</p>
                  <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
                  {cert.credentialId && <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

const SKILL_CATEGORIES = ["Technical", "Soft Skills", "Languages", "Tools", "Frameworks"]
