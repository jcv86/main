import type { CVData } from "@/lib/cv-types"

interface ClassicTemplateProps {
  data: CVData
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { personalInfo, experience, education, skills, projects, languages, certifications } = data

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long" })
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none p-8">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{personalInfo.fullName}</h1>
        {personalInfo.jobTitle && <p className="text-xl text-gray-600 mb-4">{personalInfo.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.location}</span>
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Resumen Profesional</h2>
          <p className="text-gray-700 leading-relaxed text-justify">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Experiencia Profesional</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{exp.jobTitle}</h3>
                    <p className="text-gray-600">
                      {exp.company}, {exp.location}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Presente"}
                  </span>
                </div>
                <p className="text-gray-700 mb-3 text-justify">{exp.description}</p>

                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-gray-800">Tecnologías: </span>
                    <span className="text-sm text-gray-700">{exp.technologies.join(", ")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Educación</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600">
                      {edu.institution}, {edu.location}
                    </p>
                    {edu.gpa && <p className="text-sm text-gray-600">Promedio: {edu.gpa}</p>}
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && <p className="text-gray-700 text-justify">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Habilidades Técnicas</h2>
          <div className="space-y-3">
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
                <h3 className="font-semibold text-gray-800 mb-2">{category}:</h3>
                <p className="text-gray-700">{categorySkills.map((skill) => skill.name).join(", ")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Idiomas</h2>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between">
                <span className="text-gray-700 font-medium">{lang.name}</span>
                <span className="text-gray-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Proyectos Relevantes</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                {project.role && <p className="text-gray-600 mb-1">{project.role}</p>}
                <p className="text-gray-700 mb-2 text-justify">{project.description}</p>

                {project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Tecnologías: </span>
                    {project.technologies.join(", ")}
                  </p>
                )}

                <div className="text-sm text-gray-600">
                  {project.url && <span className="mr-4">URL: {project.url}</span>}
                  {project.githubUrl && <span>GitHub: {project.githubUrl}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Certificaciones</h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                    <p className="text-gray-600">{cert.issuer}</p>
                    {cert.credentialId && <p className="text-sm text-gray-600">ID: {cert.credentialId}</p>}
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(cert.issueDate)}
                    {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
