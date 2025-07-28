import {
  type CVData,
  formatDateRange,
  groupSkillsByCategory,
  sortExperienceByDate,
  sortEducationByDate,
} from "@/lib/cv-types"
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Calendar,
  Award,
  Code,
  Languages,
  GraduationCap,
  Briefcase,
} from "lucide-react"

interface ModernTemplateProps {
  data: CVData
  className?: string
}

export function ModernTemplate({ data, className = "" }: ModernTemplateProps) {
  const sortedExperience = sortExperienceByDate(data.experience)
  const sortedEducation = sortEducationByDate(data.education)
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <div className={`bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg ${className}`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{data.personalInfo.fullName}</h1>
          {data.personalInfo.jobTitle && (
            <h2 className="text-xl font-light mb-4 opacity-90">{data.personalInfo.jobTitle}</h2>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{data.personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{data.personalInfo.location}</span>
            </div>
            {data.personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{data.personalInfo.website}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>{data.personalInfo.github}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        {/* Summary Section */}
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Resumen Profesional
            </h3>
            <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {sortedExperience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Experiencia Profesional
            </h3>
            <div className="space-y-6">
              {sortedExperience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-600 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h4>
                      <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-gray-600">{exp.location}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{exp.description}</p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-semibold text-gray-800 mb-2">Logros Principales:</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {sortedEducation.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Educación
            </h3>
            <div className="space-y-4">
              {sortedEducation.map((edu) => (
                <div key={edu.id} className="border-l-4 border-blue-600 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{edu.degree}</h4>
                      <p className="text-lg text-blue-600 font-medium">{edu.institution}</p>
                      <p className="text-gray-600">{edu.location}</p>
                      {edu.gpa && <p className="text-gray-600">Promedio: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Proyectos Destacados
            </h3>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="border-l-4 border-blue-600 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{project.name}</h4>
                      {project.role && <p className="text-blue-600 font-medium">{project.role}</p>}
                    </div>
                    <div className="flex gap-2">
                      {project.url && (
                        <a href={project.url} className="text-blue-600 hover:underline text-sm">
                          Ver Proyecto
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="text-blue-600 hover:underline text-sm">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills Section */}
          {data.skills.length > 0 && (
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Habilidades
              </h3>
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-800 mb-2">{category}</h4>
                    <div className="space-y-2">
                      {skills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-700">{skill.name}</span>
                            <span className="text-sm text-gray-500">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages Section */}
          {data.languages.length > 0 && (
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2 flex items-center gap-2">
                <Languages className="w-6 h-6" />
                Idiomas
              </h3>
              <div className="space-y-3">
                {data.languages.map((language) => (
                  <div key={language.id} className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{language.name}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {language.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Certifications Section */}
        {data.certifications.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Certificaciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                  <p className="text-blue-600 font-medium">{cert.issuer}</p>
                  <p className="text-sm text-gray-500">Emitido: {formatDateRange(cert.issueDate, cert.expiryDate)}</p>
                  {cert.credentialId && <p className="text-sm text-gray-500">ID: {cert.credentialId}</p>}
                  {cert.url && (
                    <a href={cert.url} className="text-blue-600 hover:underline text-sm">
                      Verificar Certificación
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
