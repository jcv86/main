import type { CVData, CVTemplate } from "@/lib/cv-types"

interface MinimalTemplateProps {
  data: CVData
  template?: CVTemplate
}

export function MinimalTemplate({ data, template }: MinimalTemplateProps) {
  // Default template if none provided
  const defaultTemplate: CVTemplate = {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple and elegant design focusing on content",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#10b981",
      text: "#1f2937",
      background: "#ffffff",
    },
    fonts: {
      heading: "Helvetica",
      body: "Helvetica",
    },
    layout: "single-column",
  }

  const currentTemplate = template || defaultTemplate

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div
      className="bg-white p-8 shadow-lg min-h-full max-w-4xl mx-auto"
      style={{ fontFamily: currentTemplate.fonts.body }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-light mb-2"
          style={{ color: currentTemplate.colors.primary, fontFamily: currentTemplate.fonts.heading }}
        >
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm" style={{ color: currentTemplate.colors.text }}>
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </div>
      </div>

      <div className="space-y-8">
        {/* Professional Summary */}
        {data.summary && (
          <section>
            <h2
              className="text-lg font-medium mb-3"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              Summary
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
              className="text-lg font-medium mb-4"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-medium" style={{ color: currentTemplate.colors.text }}>
                        {exp.title}
                      </h3>
                      <div className="text-sm" style={{ color: currentTemplate.colors.secondary }}>
                        {exp.company}
                        {exp.location && (
                          <span className="ml-2" style={{ color: currentTemplate.colors.text }}>
                            • {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm" style={{ color: currentTemplate.colors.secondary }}>
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: currentTemplate.colors.text }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2
              className="text-lg font-medium mb-4"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium" style={{ color: currentTemplate.colors.text }}>
                        {edu.degree}
                      </h3>
                      <div className="text-sm" style={{ color: currentTemplate.colors.secondary }}>
                        {edu.school}
                        {edu.location && (
                          <span className="ml-2" style={{ color: currentTemplate.colors.text }}>
                            • {edu.location}
                          </span>
                        )}
                        {edu.gpa && (
                          <span className="ml-2" style={{ color: currentTemplate.colors.text }}>
                            • GPA: {edu.gpa}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm" style={{ color: currentTemplate.colors.secondary }}>
                      {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2
                className="text-lg font-medium mb-3"
                style={{
                  color: currentTemplate.colors.primary,
                  fontFamily: currentTemplate.fonts.heading,
                }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm px-2 py-1 rounded"
                    style={{
                      backgroundColor: `${currentTemplate.colors.accent}15`,
                      color: currentTemplate.colors.text,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section>
              <h2
                className="text-lg font-medium mb-3"
                style={{
                  color: currentTemplate.colors.primary,
                  fontFamily: currentTemplate.fonts.heading,
                }}
              >
                Languages
              </h2>
              <div className="space-y-1">
                {data.languages.map((language, index) => (
                  <div key={index} className="text-sm" style={{ color: currentTemplate.colors.text }}>
                    {language}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2
              className="text-lg font-medium mb-3"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              Certifications
            </h2>
            <div className="space-y-1">
              {data.certifications.map((cert, index) => (
                <div key={index} className="text-sm" style={{ color: currentTemplate.colors.text }}>
                  {cert}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
