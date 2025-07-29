import type { CVData, CVTemplate } from "@/lib/cv-types"

interface MinimalTemplateProps {
  data: CVData
  template: CVTemplate
}

export function MinimalTemplate({ data, template }: MinimalTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="bg-white p-12 shadow-lg min-h-full max-w-4xl mx-auto" style={{ fontFamily: template.fonts.body }}>
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-5xl font-light mb-4 tracking-wide"
          style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
        >
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-6 text-sm" style={{ color: template.colors.text }}>
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-12">
          <p className="text-base leading-relaxed font-light" style={{ color: template.colors.text }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <section className="mb-12">
          <h2
            className="text-2xl font-light mb-8 tracking-wide"
            style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
          >
            Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-2 pl-6" style={{ borderColor: template.colors.accent }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium" style={{ color: template.colors.secondary }}>
                      {exp.title}
                    </h3>
                    <div className="font-light" style={{ color: template.colors.primary }}>
                      {exp.company}
                    </div>
                  </div>
                  <div className="text-sm font-light" style={{ color: template.colors.text }}>
                    {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.location && (
                  <div className="text-sm mb-3 font-light" style={{ color: template.colors.text }}>
                    {exp.location}
                  </div>
                )}
                <p className="text-sm leading-relaxed font-light" style={{ color: template.colors.text }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-12">
          <h2
            className="text-2xl font-light mb-8 tracking-wide"
            style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
          >
            Education
          </h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="border-l-2 pl-6" style={{ borderColor: template.colors.accent }}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-lg font-medium" style={{ color: template.colors.secondary }}>
                      {edu.degree}
                    </h3>
                    <div className="font-light" style={{ color: template.colors.primary }}>
                      {edu.school}
                    </div>
                  </div>
                  <div className="text-sm font-light" style={{ color: template.colors.text }}>
                    {formatDate(edu.startDate)} — {edu.current ? "Present" : formatDate(edu.endDate)}
                  </div>
                </div>
                <div className="text-sm font-light" style={{ color: template.colors.text }}>
                  {edu.location && `${edu.location}`}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Section - Skills, Languages, Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2
              className="text-xl font-light mb-4 tracking-wide"
              style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
            >
              Skills
            </h2>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-sm font-light" style={{ color: template.colors.text }}>
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
              className="text-xl font-light mb-4 tracking-wide"
              style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
            >
              Languages
            </h2>
            <div className="space-y-2">
              {data.languages.map((language, index) => (
                <div key={index} className="text-sm font-light" style={{ color: template.colors.text }}>
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
              className="text-xl font-light mb-4 tracking-wide"
              style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, index) => (
                <div key={index} className="text-sm font-light" style={{ color: template.colors.text }}>
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
