import {
  type CVData,
  formatDateRange,
  groupSkillsByCategory,
  sortExperienceByDate,
  sortEducationByDate,
} from "@/lib/cv-types"
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar } from "lucide-react"

interface ClassicTemplateProps {
  data: CVData
  className?: string
}

export function ClassicTemplate({ data, className = "" }: ClassicTemplateProps) {
  const sortedExperience = sortExperienceByDate(data.experience)
  const sortedEducation = sortEducationByDate(data.education)
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <div className={`bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg font-serif ${className}`}>
      {/* Header Section */}
      <div className="border-b-4 border-gray-800 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{data.personalInfo.fullName}</h1>
          {data.personalInfo.jobTitle && <h2 className="text-xl text-gray-600 mb-4">{data.personalInfo.jobTitle}</h2>}

          <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-600">
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

      <div className="p-8">
        {/* Summary Section */}
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Resumen Profesional</h3>
            <div className="border-l-4 border-gray-800 pl-4">
              <p className="text-gray-700 leading-relaxed italic">{data.personalInfo.summary}</p>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {sortedExperience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Experiencia Profesional</h3>
            <div className="space-y-6">
              {sortedExperience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-gray-800 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{exp.jobTitle}</h4>
                      <p className="text-lg text-gray-600 font-semibold">{exp.company}</p>
                      <p className="text-gray-600 italic">{exp.location}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">{exp.description}</p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-bold text-gray-800 mb-2">Logros Principales:</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-800">Tecnologías: </span>
                      <span className="text-gray-700">{exp.technologies.join(", ")}</span>
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
            <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Educación</h3>
            <div className="space-y-4">
              {sortedEducation.map((edu) => (
                <div key={edu.id} className="border-l-4 border-gray-800 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{edu.degree}</h4>
                      <p className="text-lg text-gray-600 font-semibold">{edu.institution}</p>
                      <p className="text-gray-600 italic">{edu.location}</p>
                      {edu.gpa && <p className="text-gray-600">Promedio: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-700 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Proyectos Destacados</h3>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="border-l-4 border-gray-800 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{project.name}</h4>
                      {project.role && <p className="text-gray-600 font-semibold">{project.role}</p>}
                    </div>
                    <div className="flex gap-4 text-sm">
                      {project.url && (
                        <a href={project.url} className="text-gray-600 hover:underline">
                          Ver Proyecto
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="text-gray-600 hover:underline">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-800">Tecnologías: </span>
                      <span className="text-gray-700">{project.technologies.join(", ")}</span>
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
              <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Habilidades</h3>
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="font-bold text-gray-800 mb-2 uppercase text-sm">{category}</h4>
                    <div className="space-y-2">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-gray-700">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-gray-800 h-2 rounded-full" style={{ width: `${skill.level}%` }} />
                            </div>
                            <span className="text-sm text-gray-500 w-8">{skill.level}%</span>
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
              <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Idiomas</h3>
              <div className="space-y-3">
                {data.languages.map((language) => (
                  <div key={language.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-700 font-semibold">{language.name}</span>
                    <span className="text-gray-600 italic">{language.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Certifications Section */}
        {data.certifications.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Certificaciones</h3>
            <div className="space-y-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-bold text-gray-800">{cert.name}</h4>
                  <p className="text-gray-600 font-semibold">{cert.issuer}</p>
                  <p className="text-sm text-gray-500">Emitido: {formatDateRange(cert.issueDate, cert.expiryDate)}</p>
                  {cert.credentialId && <p className="text-sm text-gray-500">ID: {cert.credentialId}</p>}
                  {cert.url && (
                    <a href={cert.url} className="text-gray-600 hover:underline text-sm">
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
