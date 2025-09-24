"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Alert, AlertDescription } from "@radix-ui/react-alert-dialog"
import { CheckCircle } from "lucide-react"

const CareersPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
    linkedin: "",
    portfolio: "",
    experience: "",
    currentCompany: "",
    currentPosition: "",
    salary: "",
    availability: "",
  })
  const [selectedJob, setSelectedJob] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [applicationId, setApplicationId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: selectedJob?.title,
          department: selectedJob?.department,
          candidateName: formData.name,
          candidateEmail: formData.email,
          candidatePhone: formData.phone,
          resumeUrl: formData.resume,
          coverLetter: formData.coverLetter,
          linkedinProfile: formData.linkedin,
          portfolioUrl: formData.portfolio,
          yearsExperience: Number.parseInt(formData.experience),
          currentCompany: formData.currentCompany,
          currentPosition: formData.currentPosition,
          salaryExpectation: Number.parseInt(formData.salary),
          availabilityDate: formData.availability,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar la aplicación")
      }

      setApplicationId(result.applicationId)
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        resume: "",
        coverLetter: "",
        linkedin: "",
        portfolio: "",
        experience: "",
        currentCompany: "",
        currentPosition: "",
        salary: "",
        availability: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la aplicación")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        {/* Existing buttons here */}
        <div className="mt-4">
          <Link href="/track-application" className="text-blue-100 hover:text-white underline text-lg">
            ¿Ya aplicaste? Rastrea tu aplicación aquí
          </Link>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit}>
        {/* Form fields here */}
        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar Aplicación"}
        </button>
      </form>

      {/* Success Message Section */}
      {submitted && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="space-y-2">
              <p className="font-medium">¡Aplicación enviada exitosamente!</p>
              <p>
                Tu ID de aplicación es:{" "}
                <strong className="font-mono bg-green-100 px-2 py-1 rounded">{applicationId}</strong>
              </p>
              <p className="text-sm">
                Guarda este ID para rastrear el estado de tu aplicación. También lo recibirás por email.
              </p>
              <Link
                href="/track-application"
                className="inline-flex items-center text-green-700 hover:text-green-800 underline text-sm"
              >
                Rastrear mi aplicación →
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message Section */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          {/* Error icon here */}
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default CareersPage
