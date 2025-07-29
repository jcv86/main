import type { CVData, CVTemplate } from "@/lib/cv-types"

interface ModernTemplateProps {
  data: CVData
  template: CVTemplate
}

export function ModernTemplate({ data, template }: ModernTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="bg-white p-8 shadow-lg min-h-full" style={{ fontFamily: template.fonts.body }}>
      {/* Header */}
      <div className="border-b-4 pb-6 mb-6" style={{ borderColor: template.colors.primary }}>
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
        >
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm" style={{ color: template.colors.text }}>
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Professional Summary */}
          {data.summary && (
            <section>
              <h2
                className="text-xl font-bold mb-3 pb-1 border-b-2"
                style={{
                  color: template.colors.primary,
                  borderColor: template.colors.accent,
                  fontFamily: template.fonts.heading,
                }}
              >
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: template.colors.text }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2
                className="text-xl font-bold mb-4 pb-1 border-b-2"
                style={{
                  color: template.colors.primary,
                  borderColor: template.colors.accent,
                  fontFamily: template.fonts.heading,
                }}
              >
                Work Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 pl-4" style={{ borderColor: template.colors.accent }}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-base" style={{ color: template.colors.primary }}>
                        {exp.title}
                      </h3>
                      <span className="text-sm" style={{ color: template.colors.secondary }}>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium" style={{ color: template.colors.secondary }}>
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span className="text-sm ml-2" style={{ color: template.colors.text }}>
                          • {exp.location}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: template.colors.text }}>
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
                className="text-xl font-bold mb-4 pb-1 border-b-2"
                style={{
                  color: template.colors.primary,
                  borderColor: template.colors.accent,
                  fontFamily: template.fonts.heading,
                }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="border-l-2 pl-4" style={{ borderColor: template.colors.accent }}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold" style={{ color: template.colors.primary }}>
                        {edu.degree}
                      </h3>
                      <span className="text-sm" style={{ color: template.colors.secondary }}>
                        {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium" style={{ color: template.colors.secondary }}>
                        {edu.school}
                      </span>
                      {edu.location && (
                        <span className="ml-2" style={{ color: template.colors.text }}>
                          • {edu.location}
                        </span>
                      )}
                      {edu.gpa && (
                        <span className="ml-2" style={{ color: template.colors.text }}>
                          • GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2
                className="text-lg font-bold mb-3 pb-1 border-b-2"
                style={{
                  color: template.colors.primary,
                  borderColor: template.colors.accent,
                  fontFamily: template.fonts.heading,
                }}
              >
                Skills
              </h2>
              <div className="space-y-1">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="text-sm py-1 px-2 rounded"
                    style={{ backgroundColor: `${template.colors.accent}20`, color: template.colors.text }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section>
              <h2
                className="text-lg font-bold mb-3 pb-1 border-b-2"
                style={{
                  color: template.colors.primary,
                  borderColor: template.colors.accent,
                  fontFamily: template.fonts.heading,
                }}
              >
                Languages
              </h2>
              <div className="space-y-1">
                {data.languages.map((language, index) => (
                  <div key={index} className="text-sm" style={{ color: template.colors.text }}>
                    {language}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2
                className="text-lg font-bold mb-3 pb-1 border-b-2"
                style={{
                  color: template.colors.primary,
                  borderColor: template.colors.accent,
                  fontFamily: template.fonts.heading,
                }}
              >
                Certifications
              </h2>
              <div className="space-y-1">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="text-sm" style={{ color: template.colors.text }}>
                    {cert}
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
