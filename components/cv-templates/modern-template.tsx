import type { CVData } from "@/lib/cv-types"

interface ModernTemplateProps {
  data: CVData
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">{data.personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-4 text-blue-100">
          {data.personalInfo.email && <span>📧 {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>📍 {data.personalInfo.location}</span>}
        </div>
        {data.personalInfo.linkedin && (
          <div className="mt-2">
            <span>🔗 {data.personalInfo.linkedin}</span>
          </div>
        )}
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2">
              Resumen Profesional
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2">
              Experiencia Laboral
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="absolute left-1.5 top-5 w-0.5 h-full bg-blue-200"></div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    <p className="text-gray-600 text-sm mb-2">
                      {exp.startDate} - {exp.endDate} | {exp.location}
                    </p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2">Educación</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                  <p className="text-blue-600 font-medium">{edu.institution}</p>
                  <p className="text-gray-600 text-sm">
                    {edu.field} | {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2">Proyectos</h2>
            <div className="grid gap-4">
              {data.projects.map((project) => (
                <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  {project.url && <p className="text-blue-600 text-sm">{project.url}</p>}
                  <p className="text-gray-600 text-sm mb-2">
                    {project.technologies} | {project.startDate} - {project.endDate}
                  </p>
                  <p className="text-gray-700">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2">Habilidades</h2>
            <div className="grid grid-cols-2 gap-6">
              {["Técnica", "Blanda", "Idioma"].map((category) => {
                const categorySkills = data.skills.filter((skill) => skill.category === category)
                if (categorySkills.length === 0) return null

                return (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}s</h3>
                    <div className="space-y-2">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-gray-700">{skill.name}</span>
                          <span className="text-blue-600 text-sm font-medium">{skill.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export function generateModernPDF(data: CVData): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
          .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 2rem; }
          .header h1 { font-size: 2.5rem; margin: 0 0 0.5rem 0; }
          .header .contact { display: flex; gap: 1rem; flex-wrap: wrap; opacity: 0.9; }
          .content { padding: 2rem; }
          .section { margin-bottom: 2rem; }
          .section h2 { color: #1d4ed8; border-bottom: 2px solid #dbeafe; padding-bottom: 0.5rem; }
          .experience-item { background: #f8fafc; padding: 1rem; margin: 1rem 0; border-radius: 0.5rem; }
          .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${data.personalInfo.fullName}</h1>
          <div class="contact">
            ${data.personalInfo.email ? `<span>📧 ${data.personalInfo.email}</span>` : ""}
            ${data.personalInfo.phone ? `<span>📱 ${data.personalInfo.phone}</span>` : ""}
            ${data.personalInfo.location ? `<span>📍 ${data.personalInfo.location}</span>` : ""}
          </div>
        </div>
        <div class="content">
          ${
            data.personalInfo.summary
              ? `
            <div class="section">
              <h2>Resumen Profesional</h2>
              <p>${data.personalInfo.summary}</p>
            </div>
          `
              : ""
          }
          
          ${
            data.experience.length > 0
              ? `
            <div class="section">
              <h2>Experiencia Laboral</h2>
              ${data.experience
                .map(
                  (exp) => `
                <div class="experience-item">
                  <h3>${exp.position}</h3>
                  <p><strong>${exp.company}</strong> | ${exp.startDate} - ${exp.endDate}</p>
                  <p>${exp.description}</p>
                </div>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            data.education.length > 0
              ? `
            <div class="section">
              <h2>Educación</h2>
              ${data.education
                .map(
                  (edu) => `
                <div class="experience-item">
                  <h3>${edu.degree}</h3>
                  <p><strong>${edu.institution}</strong> | ${edu.startDate} - ${edu.endDate}</p>
                  ${edu.description ? `<p>${edu.description}</p>` : ""}
                </div>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      </body>
    </html>
  `
}

export default ModernTemplate
