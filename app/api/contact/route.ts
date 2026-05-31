import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Rate limiting: 5 messages per hour per IP
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
})

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateFormData(data: unknown): data is ContactFormData {
  if (!data || typeof data !== "object") return false

  const form = data as Record<string, unknown>

  return (
    typeof form.name === "string" &&
    form.name.trim().length > 0 &&
    form.name.trim().length <= 100 &&
    typeof form.email === "string" &&
    validateEmail(form.email) &&
    typeof form.subject === "string" &&
    form.subject.trim().length > 0 &&
    form.subject.trim().length <= 200 &&
    typeof form.message === "string" &&
    form.message.trim().length > 0 &&
    form.message.trim().length <= 5000
  )
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Check rate limit
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // Parse and validate request body
    let formData: unknown
    try {
      formData = await request.json()
    } catch {
      return NextResponse.json(
        { message: "Invalid request format" },
        { status: 400 }
      )
    }

    if (!validateFormData(formData)) {
      return NextResponse.json(
        { message: "Invalid form data. Please check all fields." },
        { status: 400 }
      )
    }

    // Send confirmation email to user
    try {
      const userEmailResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/emails/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.email,
            subject: "Hemos recibido tu mensaje - Despega Tu Carrera",
            template: "contact-confirmation",
            data: {
              name: formData.name,
              subject: formData.subject,
            },
          }),
        }
      )

      if (!userEmailResponse.ok) {
        console.error("[v0] Error sending confirmation email")
      }
    } catch (error) {
      console.error("[v0] Error in confirmation email:", error)
      // Don't fail the main request if confirmation email fails
    }

    // Send internal notification to support team
    try {
      const supportEmailResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/emails/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "soporte@despegatucarrera.com",
            subject: `Nuevo mensaje de contacto: ${formData.subject}`,
            template: "contact-notification",
            data: {
              name: formData.name,
              email: formData.email,
              subject: formData.subject,
              message: formData.message,
              ip: ip,
              timestamp: new Date().toISOString(),
            },
          }),
        }
      )

      if (!supportEmailResponse.ok) {
        console.error("[v0] Error sending support notification")
      }
    } catch (error) {
      console.error("[v0] Error in support notification:", error)
      // Don't fail the main request if support email fails
    }

    console.log("[v0] Contact form submitted:", {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { message: "Message sent successfully. We'll get back to you soon!" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Contact API error:", error)
    return NextResponse.json(
      { message: "An error occurred processing your request" },
      { status: 500 }
    )
  }
}
