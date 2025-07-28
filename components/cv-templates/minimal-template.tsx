import type { CVData } from "@/lib/cv-types"

interface MinimalTemplateProps {
  data: CVData
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  return (
    <div className="bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg font-light">
      {/* Minimal Header */}
      <div className="border-b border-gray-200 pb-8 mb-12 p-12">
        <h1 className="text-6xl font-thin text-gray-900 mb-6 tracking-wide">{data.personalInfo.fullName}</h1>
        <div className="text-gray-600 space-y-2 text-lg">
          {data.personalInfo.email && (
            <div className="flex items-center">
              <span className="w-20 text-gray-400">Email</span>
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center">
              <span className="w-20 text-gray-400">Phone</span>
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center">
              <span className="w-20 text-gray-400">Location</span>
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center">
              <span className="w-20 text-gray-400">LinkedIn</span>
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-12 pb-12">
        {/* Minimal Summary */}
        {data.personalInfo.summary && (
          <section className="mb-16">
            <h2 className="text-2xl font-thin text-gray-900 mb-8 tracking-widest uppercase">About</h2>
            <p className="text-gray-700 leading-loose text-lg max-w-4xl">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Minimal Experience */}
        {data.experience.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-thin text-gray-900 mb-8 tracking-widest uppercase">Experience</h2>
            <div className="space-y-12">
              {data.experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-8">
                  <div className="col-span-1">
                    <p className="text-gray-500 text-sm uppercase tracking-wide">
                      {exp.startDate} — {exp.endDate}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">{exp.location}</p>
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-xl font-normal text-gray-900 mb-2">{exp.position}</h3>
                    <p className="text-gray-600 mb-4 font-medium">{exp.company}</p>
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Minimal Education */}
        {data.education.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-thin text-gray-900 mb-8 tracking-widest uppercase">Education</h2>
            <div className="space-y-8">
              {data.education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-4 gap-8">
                  <div className="col-span-1">
                    <p className="text-gray-500 text-sm uppercase tracking-wide">
                      {edu.startDate} — {edu.endDate}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-xl font-normal text-gray-900 mb-2">{edu.degree}</h3>
                    <p className="text-gray-600 mb-2 font-medium">{edu.institution}</p>
                    <p className="text-gray-500 text-sm mb-3">{edu.field}</p>
                    {edu.description && <p className="text-gray-700 leading-relaxed">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Minimal Projects */}
        {data.projects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-thin text-gray-900 mb-8 tracking-widest uppercase">Projects</h2>
            <div className="space-y-8">
              {data.projects.map((project) => (
                <div key={project.id} className="grid grid-cols-4 gap-8">
                  <div className="col-span-1">
                    <p className="text-gray-500 text-sm uppercase tracking-wide">
                      {project.startDate} — {project.endDate}
                    </p>
                    {project.url && <p className="text-gray-500 text-sm mt-2 break-all">{project.url}</p>}
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-xl font-normal text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 uppercase tracking-wide">{project.technologies}</p>
                    <p className="text-gray-700 leading-relaxed">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Minimal Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-thin text-gray-900 mb-8 tracking-widest uppercase">Skills</h2>
            <div className="grid grid-cols-3 gap-12">
              {["Técnica", "Blanda", "Idioma"].map((category) => {
                const categorySkills = data.skills.filter((skill) => skill.category === category)
                if (categorySkills.length === 0) return null

                return (
                  <div key={category}>
                    <h3 className="text-lg font-normal text-gray-900 mb-6 uppercase tracking-wide">{category}s</h3>
                    <div className="space-y-4">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="border-b border-gray-100 pb-3">
                          <div className="flex justify-between items-baseline">
                            <span className="text-gray-700 font-medium">{skill.name}</span>
                            <span className="text-gray-400 text-sm uppercase tracking-wider">{skill.level}</span>
                          </div>
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

export function generateMinimalPDF(data: CVData): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', sans-serif; font-weight: 300; margin: 0; padding: 0; }
          .header { border-bottom: 1px solid #e5e7eb; padding: 3rem; }
          .header h1 { font-size: 4rem; font-weight: 100; margin: 0 0 2rem 0; letter-spacing: 2px; }
          .content { padding: 3rem; }
          .section { margin-bottom: 4rem; }
          .section h2 { font-size: 1.5rem; font-weight: 100; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 2rem; }
          .experience-grid { display: grid; grid-template-columns: 1fr 3fr; gap: 2rem; margin: 3rem 0; }
          .skills-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${data.personalInfo.fullName}</h1>
          <div>
            ${data.personalInfo.email ? `<div>Email: ${data.personalInfo.email}</div>` : ""}
            ${data.personalInfo.phone ? `<div>Phone: ${data.personalInfo.phone}</div>` : ""}
            ${data.personalInfo.location ? `<div>Location: ${data.personalInfo.location}</div>` : ""}
          </div>
        </div>
        <div class="content">
          ${
            data.personalInfo.summary
              ? `
            <div class="section">
              <h2>About</h2>
              <p>${data.personalInfo.summary}</p>
            </div>
          `
              : ""
          }
          
          ${
            data.experience.length > 0
              ? `
            <div class="section">
              <h2>Experience</h2>
              ${data.experience
                .map(
                  (exp) => `
                <div class="experience-grid">
                  <div>
                    <p>${exp.startDate} — ${exp.endDate}</p>
                    <p>${exp.location}</p>
                  </div>
                  <div>
                    <h3>${exp.position}</h3>
                    <p><strong>${exp.company}</strong></p>
                    <p>${exp.description}</p>
                  </div>
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

export default MinimalTemplate
