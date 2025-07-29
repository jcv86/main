import type { CVData, CVTemplate } from "@/lib/cv-types"

interface ClassicTemplateProps {
  data: CVData
  template?: CVTemplate
}

export function ClassicTemplate({ data, template }: ClassicTemplateProps) {
  // Default template if none provided
  const defaultTemplate: CVTemplate = {
    id: "classic",
    name: "Classic Traditional",
    description: "Timeless design suitable for traditional industries",
    colors: {
      primary: "#1f2937",
      secondary: "#374151",
      accent: "#6b7280",
      text: "#111827",
      background: "#ffffff",
    },
    fonts: {
      heading: "Times New Roman",
      body: "Times New Roman",
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
    <div className="bg-white p-8 shadow-lg min-h-full" style={{ fontFamily: currentTemplate.fonts.body }}>
      {/* Header */}
      <div className="text-center border-b-2 pb-6 mb-8" style={{ borderColor: currentTemplate.colors.primary }}>
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: currentTemplate.colors.primary, fontFamily: currentTemplate.fonts.heading }}
        >
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="space-y-1 text-sm" style={{ color: currentTemplate.colors.text }}>
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
          {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
          {data.personalInfo.website && <div>{data.personalInfo.website}</div>}
        </div>
      </div>

      <div className="space-y-8">
        {/* Professional Summary */}
        {data.summary && (
          <section>
            <h2
              className="text-xl font-bold mb-4 text-center"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-sm leading-relaxed text-justify" style={{ color: currentTemplate.colors.text }}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2
              className="text-xl font-bold mb-6 text-center"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              WORK EXPERIENCE
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base" style={{ color: currentTemplate.colors.primary }}>
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
                    <span className="text-sm font-medium" style={{ color: currentTemplate.colors.secondary }}>
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-justify" style={{ color: currentTemplate.colors.text }}>
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
              className="text-xl font-bold mb-6 text-center"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              EDUCATION
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ color: currentTemplate.colors.primary }}>
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
                    <span className="text-sm font-medium" style={{ color: currentTemplate.colors.secondary }}>
                      {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2
              className="text-xl font-bold mb-4 text-center"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              SKILLS
            </h2>
            <div className="text-center">
              <p className="text-sm leading-relaxed" style={{ color: currentTemplate.colors.text }}>
                {data.skills.join(" • ")}
              </p>
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <section>
            <h2
              className="text-xl font-bold mb-4 text-center"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              LANGUAGES
            </h2>
            <div className="text-center">
              <p className="text-sm leading-relaxed" style={{ color: currentTemplate.colors.text }}>
                {data.languages.join(" • ")}
              </p>
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2
              className="text-xl font-bold mb-4 text-center"
              style={{
                color: currentTemplate.colors.primary,
                fontFamily: currentTemplate.fonts.heading,
              }}
            >
              CERTIFICATIONS
            </h2>
            <div className="space-y-1">
              {data.certifications.map((cert, index) => (
                <div key={index} className="text-sm text-center" style={{ color: currentTemplate.colors.text }}>
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
