import type { CVData, CVTemplate } from "@/lib/cv-types"
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, ExternalLink, Github } from "lucide-react"

interface ClassicTemplateProps {
  data: CVData
  template: CVTemplate
}

export function ClassicTemplate({ data, template }: ClassicTemplateProps) {
  const colors = template?.colors || {
    primary: "#1F2937",
    secondary: "#374151",
    accent: "#6B7280",
    text: "#111827",
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

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg p-8" style={{ color: colors.text }}>
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: colors.primary }}>
        <h1 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>
          {data.personal.fullName || "Your Name"}
        </h1>

        <div className="flex flex-wrap justify-center gap-6 text-sm mb-4">
          {data.personal.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.city && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {data.personal.city}, {data.personal.country}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {data.personal.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{data.personal.website}</span>
            </div>
          )}
          {data.personal.linkedIn && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              <span>{data.personal.linkedIn}</span>
            </div>
          )}
        </div>

        {data.personal.summary && (
          <p className="mt-6 text-gray-700 max-w-3xl mx-auto leading-relaxed">{data.personal.summary}</p>
        )}
      </div>

      <div className="space-y-8">
        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b"
              style={{ color: colors.primary, borderColor: colors.accent }}
            >
              EXPERIENCIA PROFESIONAL
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{exp.position}</h3>
                      <p className="text-lg font-semibold" style={{ color: colors.secondary }}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(exp.startDate)} - {exp.current ? "Presente" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && <p className="text-gray-700 italic">{exp.description}</p>}
                  {exp.achievements.filter((a) => a.trim()).length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      {exp.achievements
                        .filter((a) => a.trim())
                        .map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b"
              style={{ color: colors.primary, borderColor: colors.accent }}
            >
              EDUCACIÓN
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{edu.degree}</h3>
                      <p className="text-lg font-semibold" style={{ color: colors.secondary }}>
                        {edu.institution}
                      </p>
                      {edu.field && <p className="text-gray-600 italic">{edu.field}</p>}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(edu.startDate)} - {edu.current ? "Presente" : formatDate(edu.endDate)}
                    </div>
                  </div>
                  {edu.gpa && <p className="text-gray-600">Promedio: {edu.gpa}</p>}
                  {edu.description && <p className="text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b"
              style={{ color: colors.primary, borderColor: colors.accent }}
            >
              HABILIDADES
            </h2>
            <div className="space-y-4">
              {SKILL_CATEGORIES.map((category) => {
                const categorySkills = data.skills.filter((skill) => skill.category === category)
                if (categorySkills.length === 0) return null

                return (
                  <div key={category}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: colors.secondary }}>
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-600">{skill.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b"
              style={{ color: colors.primary, borderColor: colors.accent }}
            >
              PROYECTOS
            </h2>
            <div className="space-y-6">
              {data.projects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{project.name}</h3>
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
                  <p className="text-gray-700">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div>
                      <span className="font-semibold text-gray-600">Tecnologías: </span>
                      <span className="text-gray-700">{project.technologies.join(", ")}</span>
                    </div>
                  )}
                  {(project.startDate || project.endDate) && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages and Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2
                className="text-2xl font-bold mb-6 pb-2 border-b"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                IDIOMAS
              </h2>
              <div className="space-y-3">
                {data.languages.map((language) => (
                  <div key={language.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-semibold">{language.name}</span>
                    <span className="text-gray-600">{language.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2
                className="text-2xl font-bold mb-6 pb-2 border-b"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                CERTIFICACIONES
              </h2>
              <div className="space-y-4">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="space-y-1">
                    <h3 className="font-bold">{cert.name}</h3>
                    <p className="text-gray-600 font-semibold">{cert.issuer}</p>
                    <p className="text-sm text-gray-500">{formatDate(cert.date)}</p>
                    {cert.credentialId && <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>}
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

const SKILL_CATEGORIES = ["Technical", "Soft Skills", "Languages", "Tools", "Frameworks"]
