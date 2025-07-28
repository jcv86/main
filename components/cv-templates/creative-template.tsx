import type { CVData } from "@/lib/cv-types"

interface CreativeTemplateProps {
  data: CVData
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  return (
    <div className="bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg overflow-hidden">
      {/* Colorful Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white p-8 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3 animate-pulse">{data.personalInfo.fullName}</h1>
          <div className="flex flex-wrap gap-4 text-purple-100">
            {data.personalInfo.email && (
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">✉️ {data.personalInfo.email}</span>
            )}
            {data.personalInfo.phone && (
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                📞 {data.personalInfo.phone}
              </span>
            )}
            {data.personalInfo.location && (
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                🌍 {data.personalInfo.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Creative Summary */}
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
              ✨ Sobre Mí
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-l-4 border-purple-500">
              <p className="text-gray-700 leading-relaxed italic">{data.personalInfo.summary}</p>
            </div>
          </section>
        )}

        {/* Creative Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
              🚀 Mi Trayectoria
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  <div
                    className={`p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-purple-100 to-pink-100 ml-0 mr-8"
                        : "bg-gradient-to-r from-orange-100 to-yellow-100 ml-8 mr-0"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${index % 2 === 0 ? "bg-purple-500" : "bg-orange-500"}`}
                      ></div>
                      <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                    </div>
                    <p className="text-purple-600 font-semibold text-lg">{exp.company}</p>
                    <p className="text-gray-600 text-sm mb-3">
                      📅 {exp.startDate} - {exp.endDate} • 📍 {exp.location}
                    </p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Creative Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
              🎓 Formación Académica
            </h2>
            <div className="grid gap-4">
              {data.education.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-l-4 border-blue-500 shadow-md"
                >
                  <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                  <p className="text-blue-600 font-semibold">{edu.institution}</p>
                  <p className="text-gray-600 text-sm">
                    📚 {edu.field} • 📅 {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Creative Projects */}
        {data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
              💡 Proyectos Creativos
            </h2>
            <div className="grid gap-6">
              {data.projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`p-6 rounded-2xl shadow-lg ${
                    index % 3 === 0
                      ? "bg-gradient-to-br from-pink-100 to-rose-100"
                      : index % 3 === 1
                        ? "bg-gradient-to-br from-purple-100 to-indigo-100"
                        : "bg-gradient-to-br from-orange-100 to-amber-100"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🎨</span>
                    <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                  </div>
                  {project.url && <p className="text-blue-600 text-sm mb-2">🔗 {project.url}</p>}
                  <p className="text-gray-600 text-sm mb-3">
                    🛠️ {project.technologies} • 📅 {project.startDate} - {project.endDate}
                  </p>
                  <p className="text-gray-700">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Creative Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
              ⭐ Superpoderes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Técnica", "Blanda", "Idioma"].map((category, categoryIndex) => {
                const categorySkills = data.skills.filter((skill) => skill.category === category)
                if (categorySkills.length === 0) return null

                const gradients = [
                  "from-purple-200 to-pink-200",
                  "from-blue-200 to-indigo-200",
                  "from-orange-200 to-yellow-200",
                ]

                return (
                  <div
                    key={category}
                    className={`bg-gradient-to-br ${gradients[categoryIndex]} p-6 rounded-2xl shadow-lg`}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                      {category === "Técnica" ? "💻" : category === "Blanda" ? "🤝" : "🌐"} {category}s
                    </h3>
                    <div className="space-y-3">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="bg-white bg-opacity-60 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{skill.name}</span>
                            <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                              {skill.level}
                            </span>
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

export function generateCreativePDF(data: CVData): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
          .header { background: linear-gradient(135deg, #9333ea, #ec4899, #f97316); color: white; padding: 2rem; }
          .header h1 { font-size: 2.5rem; margin: 0 0 1rem 0; }
          .content { padding: 2rem; }
          .section { margin-bottom: 2rem; }
          .section h2 { background: linear-gradient(135deg, #9333ea, #ec4899); -webkit-background-clip: text; color: transparent; }
          .creative-box { background: linear-gradient(135deg, #f3e8ff, #fce7f3); padding: 1.5rem; border-radius: 1rem; margin: 1rem 0; }
          .skills-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${data.personalInfo.fullName}</h1>
          <div>
            ${data.personalInfo.email ? `<span>✉️ ${data.personalInfo.email}</span>` : ""}
            ${data.personalInfo.phone ? `<span>📞 ${data.personalInfo.phone}</span>` : ""}
          </div>
        </div>
        <div class="content">
          ${
            data.personalInfo.summary
              ? `
            <div class="section">
              <h2>✨ Sobre Mí</h2>
              <div class="creative-box">
                <p>${data.personalInfo.summary}</p>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </body>
    </html>
  `
}

export default CreativeTemplate
