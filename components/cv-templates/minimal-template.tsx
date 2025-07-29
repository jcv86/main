import type { CVData, CVTemplate } from "@/lib/cv-types"
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, ExternalLink, Github } from "lucide-react"

interface MinimalTemplateProps {
  data: CVData
  template: CVTemplate
}

export function MinimalTemplate({ data, template }: MinimalTemplateProps) {
  const colors = template?.colors || {
    primary: "#059669",
    secondary: "#047857",
    accent: "#34D399",
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

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg p-12" style={{ color: colors.text }}>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-light mb-4" style={{ color: colors.primary }}>
          {data.personal.fullName || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-8 text-sm text-gray-600 mb-6">
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
          <p className="text-gray-700 leading-relaxed text-lg font-light max-w-4xl">{data.personal.summary}</p>
        )}
      </div>

      <div className="space-y-12">
        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2
              className="text-2xl font-light mb-8 pb-2 border-b"
              style={{ color: colors.primary, borderColor: colors.accent }}
            >
              Experience
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium">{exp.position}</h3>
                      <p className="text-lg text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && <p className="text-gray-700 font-light">{exp.description}</p>}
                  {exp.achievements.filter((a) => a.trim()).length > 0 && (
                    <ul className="space-y-1 text-gray-700 font-light">
                      {exp.achievements
                        .filter((a) => a.trim())
                        .map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span
                              className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                              style={{ backgroundColor: colors.accent }}
                            ></span>
                            <span>{achievement}</span>
                          </li>
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
              className="text-2xl font-light mb-8 pb-2 border-b"
              style={{ color: colors.primary, borderColor: colors.accent }}
            >
              Education
            </h2>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium">{edu.degree}</h3>
                      <p className="text-lg text-gray-600">{edu.institution}</p>
                      {edu.field && <p className="text-gray-500 font-light">{edu.field}</p>}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(edu.startDate)} — {edu.current ? "Present" : formatDate(edu.endDate)}
                    </div>
                  </div>
                  {edu.gpa && <p className="text-gray-600 font-light">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-gray-700 font-light">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <h2
              className="text-2xl font-light mb-8 pb-2 border-b"
              style={{ color: colors.primary, borderColor: colors.accent }}
            >
              Projects
            </h2>
            <div className="space-y-8">
              {data.projects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium">{project.name}</h3>
                    <div className="flex gap-3">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 font-light">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-light rounded-full"
                          style={{ backgroundColor: `${colors.accent}20`, color: colors.primary }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.startDate || project.endDate) && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(project.startDate)} — {formatDate(project.endDate)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2
              className="text-2xl font-light mb-8 pb-2 border-b"
              style={{ color: colors.primary, borderColor: colors.accent }}
            >
              Skills
            </h2>
            <div className="space-y-6">
              {SKILL_CATEGORIES.map((category) => {
                const categorySkills = data.skills.filter((skill) => skill.category === category)
                if (categorySkills.length === 0) return null

                return (
                  <div key={category}>
                    <h3 className="text-lg font-light mb-4 text-gray-600">{category}</h3>
                    <div className="flex flex-wrap gap-3">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-2">
                          <span className="font-light">{skill.name}</span>
                          <span
                            className="text-xs px-2 py-1 rounded-full font-light"
                            style={{ backgroundColor: `${colors.accent}20`, color: colors.secondary }}
                          >
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Languages and Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2
                className="text-2xl font-light mb-8 pb-2 border-b"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                Languages
              </h2>
              <div className="space-y-3">
                {data.languages.map((language) => (
                  <div key={language.id} className="flex justify-between items-center">
                    <span className="font-light">{language.name}</span>
                    <span
                      className="text-sm px-3 py-1 rounded-full font-light"
                      style={{ backgroundColor: `${colors.accent}20`, color: colors.secondary }}
                    >
                      {language.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2
                className="text-2xl font-light mb-8 pb-2 border-b"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                Certifications
              </h2>
              <div className="space-y-4">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="space-y-1">
                    <h3 className="font-medium">{cert.name}</h3>
                    <p className="text-gray-600 font-light">{cert.issuer}</p>
                    <p className="text-sm text-gray-500 font-light">{formatDate(cert.date)}</p>
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
