import type { CVData, CVTemplate } from "@/lib/cv-types"

interface ClassicTemplateProps {
  data: CVData
  template: CVTemplate
}

export function ClassicTemplate({ data, template }: ClassicTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  return (
    <div className="bg-white p-8 shadow-lg min-h-full" style={{ fontFamily: template.fonts.body }}>
      {/* Header */}
      <div className="text-center border-b-2 pb-6 mb-8" style={{ borderColor: template.colors.primary }}>
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
        >
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="space-y-1 text-sm" style={{ color: template.colors.text }}>
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
          {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
          {data.personalInfo.website && <div>{data.personalInfo.website}</div>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2
            className="text-lg font-bold mb-3 uppercase tracking-wide"
            style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
          >
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-justify" style={{ color: template.colors.text }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-lg font-bold mb-4 uppercase tracking-wide"
            style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
          >
            Work Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-base" style={{ color: template.colors.secondary }}>
                      {exp.title}
                    </h3>
                    <div className="font-semibold" style={{ color: template.colors.text }}>
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </div>
                  </div>
                  <div className="text-sm font-medium" style={{ color: template.colors.secondary }}>
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-justify" style={{ color: template.colors.text }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-lg font-bold mb-4 uppercase tracking-wide"
            style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold" style={{ color: template.colors.secondary }}>
                      {edu.degree}
                    </h3>
                    <div className="font-semibold" style={{ color: template.colors.text }}>
                      {edu.school} {edu.location && `• ${edu.location}`}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </div>
                  </div>
                  <div className="text-sm font-medium" style={{ color: template.colors.secondary }}>
                    {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills, Languages, and Certifications in columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold mb-3 uppercase tracking-wide"
              style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
            >
              Skills
            </h2>
            <div className="space-y-1">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-sm" style={{ color: template.colors.text }}>
                  • {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold mb-3 uppercase tracking-wide"
              style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
            >
              Languages
            </h2>
            <div className="space-y-1">
              {data.languages.map((language, index) => (
                <div key={index} className="text-sm" style={{ color: template.colors.text }}>
                  • {language}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold mb-3 uppercase tracking-wide"
              style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
            >
              Certifications
            </h2>
            <div className="space-y-1">
              {data.certifications.map((cert, index) => (
                <div key={index} className="text-sm" style={{ color: template.colors.text }}>
                  • {cert}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
