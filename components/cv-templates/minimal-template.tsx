import type { CVData } from "@/lib/cv-types"

interface MinimalTemplateProps {
  data: CVData
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  const { personalInfo, experience, education, skills, projects, languages, certifications } = data

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "short" })
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg print:shadow-none p-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-light text-gray-900 mb-2">{personalInfo.fullName}</h1>
        {personalInfo.jobTitle && <p className="text-xl text-gray-600 mb-6">{personalInfo.jobTitle}</p>}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <span>{personalInfo.email}</span>
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.location}</span>
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-12">
          <p className="text-gray-700 leading-relaxed text-lg font-light">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">Experiencia</h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-medium text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-500 font-light">
                    {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Presente"}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 font-light">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4 font-light">{exp.description}</p>

                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1 mb-4">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700 font-light">
                        • {achievement}
                      </li>
                    ))}
                  </ul>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 font-light">{exp.technologies.join(" • ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">Educación</h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-medium text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-500 font-light">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2 font-light">
                  {edu.institution}, {edu.location}
                </p>
                {edu.gpa && <p className="text-gray-600 mb-2 font-light">Promedio: {edu.gpa}</p>}
                {edu.description && <p className="text-gray-700 font-light">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">Proyectos</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{project.name}</h3>
                {project.role && <p className="text-gray-600 mb-2 font-light">{project.role}</p>}
                <p className="text-gray-700 mb-3 font-light leading-relaxed">{project.description}</p>

                {project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mb-2 font-light">{project.technologies.join(" • ")}</p>
                )}

                <div className="text-sm text-gray-600 font-light">
                  {project.url && <span className="mr-4">{project.url}</span>}
                  {project.githubUrl && <span>{project.githubUrl}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">Habilidades</h2>
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
                <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
                <p className="text-gray-700 font-light">{categorySkills.map((skill) => skill.name).join(" • ")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">Idiomas</h2>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between">
                <span className="text-gray-900 font-light">{lang.name}</span>
                <span className="text-gray-600 font-light">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">Certificaciones</h2>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <span className="text-sm text-gray-500 font-light">
                    {formatDate(cert.issueDate)}
                    {cert.expiryDate && ` — ${formatDate(cert.expiryDate)}`}
                  </span>
                </div>
                <p className="text-gray-600 font-light">{cert.issuer}</p>
                {cert.credentialId && <p className="text-sm text-gray-500 font-light">ID: {cert.credentialId}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
