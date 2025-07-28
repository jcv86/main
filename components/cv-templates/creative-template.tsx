import {
  type CVData,
  formatDateRange,
  groupSkillsByCategory,
  sortExperienceByDate,
  sortEducationByDate,
} from "@/lib/cv-types"
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, Star, Zap, Target } from "lucide-react"

interface CreativeTemplateProps {
  data: CVData
  className?: string
}

export function CreativeTemplate({ data, className = "" }: CreativeTemplateProps) {
  const sortedExperience = sortExperienceByDate(data.experience)
  const sortedEducation = sortEducationByDate(data.education)
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <div className={`bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg ${className}`}>
      {/* Header Section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">{data.personalInfo.fullName}</h1>
          {data.personalInfo.jobTitle && (
            <h2 className="text-2xl font-light mb-4 opacity-90">{data.personalInfo.jobTitle}</h2>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
              <Mail className="w-4 h-4" />
              <span>{data.personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
              <Phone className="w-4 h-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
              <MapPin className="w-4 h-4" />
              <span>{data.personalInfo.location}</span>
            </div>
            {data.personalInfo.website && (
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <Globe className="w-4 h-4" />
                <span>{data.personalInfo.website}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <Linkedin className="w-4 h-4" />
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Resumen Profesional</h3>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
              <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {sortedExperience.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Experiencia Profesional</h3>
            </div>
            <div className="space-y-6">
              {sortedExperience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{exp.jobTitle}</h4>
                        <p className="text-lg text-blue-600 font-semibold">{exp.company}</p>
                        <p className="text-gray-600">{exp.location}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{exp.description}</p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-600" />
                          Logros Principales:
                        </h5>
                        <ul className="list-none space-y-1">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {index < sortedExperience.length - 1 && (
                    <div className="flex justify-center my-4">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-transparent rounded-full"></div>
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Educación</h3>
            </div>
            <div className="space-y-4">
              {sortedEducation.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border-l-4 border-green-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{edu.degree}</h4>
                      <p className="text-lg text-green-600 font-semibold">{edu.institution}</p>
                      <p className="text-gray-600">{edu.location}</p>
                      {edu.gpa && <p className="text-gray-600">Promedio: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-500 bg-white rounded-full px-3 py-1 flex items-center gap-1">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Proyectos Destacados</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border-l-4 border-orange-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{project.name}</h4>
                      {project.role && <p className="text-orange-600 font-medium">{project.role}</p>}
                    </div>
                    <div className="flex gap-2">
                      {project.url && (
                        <a href={project.url} className="text-orange-600 hover:underline text-sm">
                          Ver
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="text-orange-600 hover:underline text-sm">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 text-sm">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-medium"
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Habilidades</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 text-center">{category}</h4>
                    <div className="space-y-3">
                      {skills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-700 font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-500">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-sm"
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Idiomas</h3>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 space-y-3">
                {data.languages.map((language) => (
                  <div
                    key={language.id}
                    className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm"
                  >
                    <span className="text-gray-700 font-semibold">{language.name}</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full text-sm font-medium">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Certificaciones</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500"
                >
                  <h4 className="font-bold text-gray-800">{cert.name}</h4>
                  <p className="text-yellow-600 font-semibold">{cert.issuer}</p>
                  <p className="text-sm text-gray-500">Emitido: {formatDateRange(cert.issueDate, cert.expiryDate)}</p>
                  {cert.credentialId && <p className="text-sm text-gray-500">ID: {cert.credentialId}</p>}
                  {cert.url && (
                    <a href={cert.url} className="text-yellow-600 hover:underline text-sm">
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
