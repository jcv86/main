import type { CVData, CVTemplate } from "@/lib/cv-types"

interface CreativeTemplateProps {
  data: CVData
  template?: CVTemplate
}

export function CreativeTemplate({ data, template }: CreativeTemplateProps) {
  // Default template if none provided
  const defaultTemplate: CVTemplate = {
    id: "creative",
    name: "Creative Bold",
    description: "Eye-catching design for creative professionals",
    colors: {
      primary: "#7c3aed",
      secondary: "#5b21b6",
      accent: "#8b5cf6",
      text: "#1f2937",
      background: "#ffffff",
    },
    fonts: {
      heading: "Poppins",
      body: "Open Sans",
    },
    layout: "sidebar",
  }

  const currentTemplate = template || defaultTemplate

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="bg-white shadow-lg min-h-full flex" style={{ fontFamily: currentTemplate.fonts.body }}>
      {/* Sidebar */}
      <div className="w-1/3 p-6 text-white" style={{ backgroundColor: currentTemplate.colors.primary }}>
        <div className="space-y-6">
          {/* Profile */}
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: currentTemplate.colors.accent }}
            >
              {data.personalInfo.fullName ? data.personalInfo.fullName.charAt(0) : "Y"}
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ fontFamily: currentTemplate.fonts.heading }}>
              {data.personalInfo.fullName || "Your Name"}
            </h1>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: currentTemplate.fonts.heading }}>
              CONTACT
            </h2>
            <div className="space-y-2 text-sm">
              {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
              {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
              {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
              {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
              {data.personalInfo.website && <div>{data.personalInfo.website}</div>}
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ fontFamily: currentTemplate.fonts.heading }}>
                SKILLS
              </h2>
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="text-sm py-1 px-2 rounded"
                    style={{ backgroundColor: currentTemplate.colors.accent }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ fontFamily: currentTemplate.fonts.heading }}>
                LANGUAGES
              </h2>
              <div className="space-y-1">
                {data.languages.map((language, index) => (
                  <div key={index} className="text-sm">
                    {language}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ fontFamily: currentTemplate.fonts.heading }}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-1">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="text-sm">
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="space-y-8">
          {/* Professional Summary */}
          {data.summary && (
            <section>
              <h2
                className="text-2xl font-bold mb-4 pb-2 border-b-2"
                style={{
                  color: currentTemplate.colors.primary,
                  borderColor: currentTemplate.colors.accent,
                  fontFamily: currentTemplate.fonts.heading,
                }}
              >
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: currentTemplate.colors.text }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2
                className="text-2xl font-bold mb-6 pb-2 border-b-2"
                style={{
                  color: currentTemplate.colors.primary,
                  borderColor: currentTemplate.colors.accent,
                  fontFamily: currentTemplate.fonts.heading,
                }}
              >
                Work Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6">
                    <div
                      className="absolute left-0 top-2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentTemplate.colors.accent }}
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg" style={{ color: currentTemplate.colors.primary }}>
                            {exp.title}
                          </h3>
                          <div className="font-semibold" style={{ color: currentTemplate.colors.secondary }}>
                            {exp.company}
                            {exp.location && (
                              <span className="font-normal ml-2" style={{ color: currentTemplate.colors.text }}>
                                • {exp.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className="text-sm font-medium px-2 py-1 rounded"
                          style={{
                            backgroundColor: `${currentTemplate.colors.accent}20`,
                            color: currentTemplate.colors.secondary,
                          }}
                        >
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: currentTemplate.colors.text }}>
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2
                className="text-2xl font-bold mb-6 pb-2 border-b-2"
                style={{
                  color: currentTemplate.colors.primary,
                  borderColor: currentTemplate.colors.accent,
                  fontFamily: currentTemplate.fonts.heading,
                }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="relative pl-6">
                    <div
                      className="absolute left-0 top-2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentTemplate.colors.accent }}
                    />
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-base" style={{ color: currentTemplate.colors.primary }}>
                            {edu.degree}
                          </h3>
                          <div className="font-semibold" style={{ color: currentTemplate.colors.secondary }}>
                            {edu.school}
                            {edu.location && (
                              <span className="font-normal ml-2" style={{ color: currentTemplate.colors.text }}>
                                • {edu.location}
                              </span>
                            )}
                            {edu.gpa && (
                              <span className="font-normal ml-2" style={{ color: currentTemplate.colors.text }}>
                                • GPA: {edu.gpa}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className="text-sm font-medium px-2 py-1 rounded"
                          style={{
                            backgroundColor: `${currentTemplate.colors.accent}20`,
                            color: currentTemplate.colors.secondary,
                          }}
                        >
                          {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
