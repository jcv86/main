import type { CVData } from "@/lib/cv-types"

interface ClassicTemplateProps {
  data: CVData
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  return (
    <div className="bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg font-serif">
      {/* Header */}
      <div className="text-center border-b-4 border-gray-800 pb-6 mb-8 p-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">{data.personalInfo.fullName}</h1>
        <div className="text-gray-600 space-y-1">
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
          {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center uppercase tracking-wide">
              Resumen Profesional
            </h2>
            <div className="border-t border-b border-gray-300 py-4">
              <p className="text-gray-700 leading-relaxed text-justify italic">{data.personalInfo.summary}</p>
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center uppercase tracking-wide">
              Experiencia Laboral
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-gray-400 pl-6">
                  <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                  <p className="text-lg text-gray-600 font-semibold">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-3">
                    {exp.startDate} - {exp.endDate} • {exp.location}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-justify">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center uppercase tracking-wide">Educación</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-gray-400 pl-6">
                  <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-600 font-semibold">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">
                    {edu.field} • {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.description && <p className="text-gray-700 mt-2 text-justify">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center uppercase tracking-wide">
              Proyectos Destacados
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="border-l-4 border-gray-400 pl-6">
                  <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                  {project.url && <p className="text-gray-600 text-sm">{project.url}</p>}
                  <p className="text-gray-500 text-sm mb-2">
                    {project.technologies} • {project.startDate} - {project.endDate}
                  </p>
                  <p className="text-gray-700 text-justify">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center uppercase tracking-wide">Competencias</h2>
            <div className="grid grid-cols-3 gap-6">
              {["Técnica", "Blanda", "Idioma"].map((category) => {
                const categorySkills = data.skills.filter((skill) => skill.category === category)
                if (categorySkills.length === 0) return null

                return (
                  <div key={category} className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 uppercase tracking-wide">{category}s</h3>
                    <div className="space-y-2">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="border-b border-gray-200 pb-1">
                          <div className="font-semibold text-gray-700">{skill.name}</div>
                          <div className="text-gray-500 text-sm">{skill.level}</div>
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

export function generateClassicPDF(data: CVData): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Times New Roman', serif; margin: 0; padding: 0; }
          .header { text-align: center; border-bottom: 4px solid #1f2937; padding: 2rem; }
          .header h1 { font-size: 3rem; margin: 0 0 1rem 0; }
          .content { padding: 2rem; }
          .section { margin-bottom: 2rem; }
          .section h2 { text-align: center; text-transform: uppercase; letter-spacing: 2px; }
          .experience-item { border-left: 4px solid #9ca3af; padding-left: 1.5rem; margin: 1.5rem 0; }
          .skills-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${data.personalInfo.fullName}</h1>
          <div>
            ${data.personalInfo.email ? `<div>${data.personalInfo.email}</div>` : ""}
            ${data.personalInfo.phone ? `<div>${data.personalInfo.phone}</div>` : ""}
            ${data.personalInfo.location ? `<div>${data.personalInfo.location}</div>` : ""}
          </div>
        </div>
        <div class="content">
          ${
            data.personalInfo.summary
              ? `
            <div class="section">
              <h2>Resumen Profesional</h2>
              <p style="font-style: italic; text-align: justify;">${data.personalInfo.summary}</p>
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
        </div>
      </body>
    </html>
  `
}

export default ClassicTemplate
