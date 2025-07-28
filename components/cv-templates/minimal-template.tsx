import {
  type CVData,
  formatDateRange,
  groupSkillsByCategory,
  sortExperienceByDate,
  sortEducationByDate,
} from "@/lib/cv-types"

interface MinimalTemplateProps {
  data: CVData
  className?: string
}

export function MinimalTemplate({ data, className = "" }: MinimalTemplateProps) {
  const sortedExperience = sortExperienceByDate(data.experience)
  const sortedEducation = sortEducationByDate(data.education)
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <div className={`bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg font-light ${className}`}>
      {/* Header Section */}
      <div className="p-12 border-b border-gray-200">
        <div className="text-center">
          <h1 className="text-5xl font-thin text-gray-900 mb-3 tracking-wide">{data.personalInfo.fullName}</h1>
          {data.personalInfo.jobTitle && (
            <h2 className="text-xl text-gray-600 mb-6 font-light tracking-wide">{data.personalInfo.jobTitle}</h2>
          )}

          <div className="flex justify-center flex-wrap gap-8 text-sm text-gray-600">
            <span>{data.personalInfo.email}</span>
            <span>{data.personalInfo.phone}</span>
            <span>{data.personalInfo.location}</span>
            {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
          </div>
        </div>
      </div>

      <div className="p-12">
        {/* Summary Section */}
        {data.personalInfo.summary && (
          <section className="mb-12">
            <h3 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">Resumen</h3>
            <p className="text-gray-700 leading-relaxed text-justify max-w-4xl">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {sortedExperience.length > 0 && (
          <section className="mb-12">
            <h3 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">Experiencia</h3>
            <div className="space-y-8">
              {sortedExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <h4 className="text-xl font-light text-gray-900">{exp.jobTitle}</h4>
                      <p className="text-gray-600">
                        {exp.company} • {exp.location}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 font-light">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4 text-justify">{exp.description}</p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-4">
                      <ul className="text-gray-700 space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gray-400 mr-3">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="text-sm text-gray-500">{exp.technologies.join(" • ")}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {sortedEducation.length > 0 && (
          <section className="mb-12">
            <h3 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">Educación</h3>
            <div className="space-y-6">
              {sortedEducation.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <h4 className="text-xl font-light text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-600">
                        {edu.institution} • {edu.location}
                      </p>
                      {edu.gpa && <p className="text-gray-500 text-sm">Promedio: {edu.gpa}</p>}
                    </div>
                    <div className="text-sm text-gray-500 font-light">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-700 leading-relaxed text-justify">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <section className="mb-12">
            <h3 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">Proyectos</h3>
            <div className="space-y-6">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <h4 className="text-xl font-light text-gray-900">{project.name}</h4>
                      {project.role && <p className="text-gray-600">{project.role}</p>}
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      {project.url && (
                        <a href={project.url} className="hover:text-gray-700">
                          Ver Proyecto
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="hover:text-gray-700">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3 text-justify">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="text-sm text-gray-500">{project.technologies.join(" • ")}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Skills Section */}
          {data.skills.length > 0 && (
            <section className="mb-12">
              <h3 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">Habilidades</h3>
              <div className="space-y-6">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="font-light text-gray-800 mb-3 text-sm tracking-wide uppercase">{category}</h4>
                    <div className="space-y-3">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-gray-700">{skill.name}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div className="bg-gray-900 h-1 rounded-full" style={{ width: `${skill.level}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 w-8">{skill.level}%</span>
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
            <section className="mb-12">
              <h3 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">Idiomas</h3>
              <div className="space-y-4">
                {data.languages.map((language) => (
                  <div key={language.id} className="flex justify-between items-center">
                    <span className="text-gray-700">{language.name}</span>
                    <span className="text-gray-500 text-sm">{language.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Certifications Section */}
        {data.certifications.length > 0 && (
          <section className="mb-12">
            <h3 className="text-lg font-light text-gray-900 mb-6 tracking-widest uppercase">Certificaciones</h3>
            <div className="space-y-6">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <h4 className="text-lg font-light text-gray-900">{cert.name}</h4>
                      <p className="text-gray-600">{cert.issuer}</p>
                    </div>
                    <div className="text-sm text-gray-500 font-light">
                      {formatDateRange(cert.issueDate, cert.expiryDate)}
                    </div>
                  </div>
                  {cert.credentialId && <p className="text-sm text-gray-500">ID: {cert.credentialId}</p>}
                  {cert.url && (
                    <a href={cert.url} className="text-gray-600 hover:text-gray-800 text-sm">
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
