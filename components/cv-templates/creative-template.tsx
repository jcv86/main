import type { CVData, CVTemplate } from "@/lib/cv-types"

interface CreativeTemplateProps {
  data: CVData
  template: CVTemplate
}

export function CreativeTemplate({ data, template }: CreativeTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="bg-white shadow-lg min-h-full flex" style={{ fontFamily: template.fonts.body }}>
      {/* Sidebar */}
      <div
        className="w-1/3 p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` }}
      >
        {/* Profile Section */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold">
              {data.personalInfo.fullName
                ? data.personalInfo.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                : "YN"}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: template.fonts.heading }}>
            {data.personalInfo.fullName || "Your Name"}
          </h1>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3" style={{ fontFamily: template.fonts.heading }}>
            Contact
          </h2>
          <div className="space-y-2 text-sm">
            {data.personalInfo.email && <div className="break-all">{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            {data.personalInfo.linkedin && <div className="break-all">{data.personalInfo.linkedin}</div>}
            {data.personalInfo.website && <div className="break-all">{data.personalInfo.website}</div>}
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: template.fonts.heading }}>
              Skills
            </h2>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="bg-white/20 rounded-full px-3 py-1 text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: template.fonts.heading }}>
              Languages
            </h2>
            <div className="space-y-1 text-sm">
              {data.languages.map((language, index) => (
                <div key={index}>{language}</div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: template.fonts.heading }}>
              Certifications
            </h2>
            <div className="space-y-1 text-sm">
              {data.certifications.map((cert, index) => (
                <div key={index}>{cert}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Professional Summary */}
        {data.summary && (
          <section className="mb-8">
            <h2
              className="text-2xl font-bold mb-4 relative"
              style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
            >
              About Me
              <div
                className="absolute bottom-0 left-0 w-12 h-1 rounded"
                style={{ backgroundColor: template.colors.accent }}
              />
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: template.colors.text }}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-2xl font-bold mb-6 relative"
              style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
            >
              Experience
              <div
                className="absolute bottom-0 left-0 w-12 h-1 rounded"
                style={{ backgroundColor: template.colors.accent }}
              />
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-6">
                  <div
                    className="absolute left-0 top-2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                  {index < data.experience.length - 1 && (
                    <div
                      className="absolute left-1.5 top-5 w-0.5 h-full"
                      style={{ backgroundColor: `${template.colors.accent}40` }}
                    />
                  )}
                  <div className="mb-2">
                    <h3 className="font-bold text-lg" style={{ color: template.colors.secondary }}>
                      {exp.title}
                    </h3>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold" style={{ color: template.colors.primary }}>
                        {exp.company}
                      </span>
                      <span className="text-sm" style={{ color: template.colors.secondary }}>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="text-sm mb-2" style={{ color: template.colors.text }}>
                        📍 {exp.location}
                      </div>
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
              className="text-2xl font-bold mb-6 relative"
              style={{ color: template.colors.primary, fontFamily: template.fonts.heading }}
            >
              Education
              <div
                className="absolute bottom-0 left-0 w-12 h-1 rounded"
                style={{ backgroundColor: template.colors.accent }}
              />
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="relative pl-6">
                  <div
                    className="absolute left-0 top-2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                  {index < data.education.length - 1 && (
                    <div
                      className="absolute left-1.5 top-5 w-0.5 h-full"
                      style={{ backgroundColor: `${template.colors.accent}40` }}
                    />
                  )}
                  <div>
                    <h3 className="font-bold" style={{ color: template.colors.secondary }}>
                      {edu.degree}
                    </h3>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold" style={{ color: template.colors.primary }}>
                        {edu.school}
                      </span>
                      <span className="text-sm" style={{ color: template.colors.secondary }}>
                        {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: template.colors.text }}>
                      {edu.location && `📍 ${edu.location}`}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
