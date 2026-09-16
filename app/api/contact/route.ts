import { createHash } from "node:crypto"

import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { z } from "zod"

import { sendEmail } from "@/lib/emails/send-email"
import { createBaseTemplate } from "@/lib/emails/templates"

const SUPPORT_EMAIL = "soporte@despegatucarrera.com"
const CONTACT_EMAIL = "contacto@despegatucarrera.com"
const FROM_EMAIL = "info@despegatucarrera.com"

const hasRateLimitConfig = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

const ratelimit = hasRateLimitConfig
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "dtc:contact",
    })
  : null

const contactSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    subject: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .refine((value) => !/[\r\n]/.test(value), "Invalid subject"),
    message: z.string().trim().min(1).max(5000),
  })
  .strict()

type ContactFormData = z.infer<typeof contactSchema>

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }
    return entities[character]
  })
}

function getClientAddress(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown"
  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

function rateLimitKey(address: string): string {
  return createHash("sha256").update(`dtc-contact:${address}`).digest("hex")
}

function supportEmail(form: ContactFormData) {
  const safeName = escapeHtml(form.name)
  const safeEmail = escapeHtml(form.email)
  const safeSubject = escapeHtml(form.subject)
  const safeMessage = escapeHtml(form.message).replace(/\n/g, "<br />")

  return {
    html: createBaseTemplate(
      `
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Asunto:</strong> ${safeSubject}</p>
        <hr />
        <p><strong>Mensaje:</strong></p>
        <p>${safeMessage}</p>
      `,
      "Nuevo mensaje de contacto",
    ),
    text: [
      "Nuevo mensaje desde el formulario de contacto",
      `Nombre: ${form.name}`,
      `Email: ${form.email}`,
      `Asunto: ${form.subject}`,
      "",
      form.message,
    ].join("\n"),
  }
}

function confirmationEmail(form: ContactFormData) {
  const safeName = escapeHtml(form.name)
  const safeSubject = escapeHtml(form.subject)

  return {
    html: createBaseTemplate(
      `
        <h2>Hola ${safeName},</h2>
        <p>Recibimos tu mensaje sobre <strong>${safeSubject}</strong>.</p>
        <p>El equipo revisará tu consulta y responderá según disponibilidad.</p>
        <p>Si necesitas agregar contexto, puedes responder directamente a este correo.</p>
      `,
      "Hemos recibido tu mensaje",
    ),
    text: [
      `Hola ${form.name},`,
      "",
      `Recibimos tu mensaje sobre: ${form.subject}`,
      "El equipo revisará tu consulta y responderá según disponibilidad.",
      "Si necesitas agregar contexto, puedes responder directamente a este correo.",
    ].join("\n"),
  }
}

function jsonMessage(message: string, status: number) {
  return NextResponse.json({ message }, { status })
}

export async function POST(request: NextRequest) {
  if (!ratelimit) {
    console.error("[contact] Rate limiter is not configured")
    return jsonMessage(
      "El formulario no está disponible temporalmente. Puedes escribirnos por email o WhatsApp.",
      503,
    )
  }

  const address = getClientAddress(request)

  try {
    const { success } = await ratelimit.limit(rateLimitKey(address))
    if (!success) {
      return jsonMessage(
        "Has enviado varias consultas recientemente. Intenta nuevamente más tarde.",
        429,
      )
    }
  } catch {
    console.error("[contact] Rate limiter unavailable")
    return jsonMessage(
      "El formulario no está disponible temporalmente. Puedes escribirnos por email o WhatsApp.",
      503,
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonMessage("No pudimos leer la solicitud. Revisa los datos e intenta nuevamente.", 400)
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return jsonMessage("Revisa nombre, email, asunto y mensaje antes de enviar.", 400)
  }

  const form = parsed.data
  const support = supportEmail(form)

  try {
    await sendEmail({
      to: SUPPORT_EMAIL,
      from: FROM_EMAIL,
      replyTo: form.email,
      subject: `Nuevo mensaje de contacto: ${form.subject}`,
      html: support.html,
      text: support.text,
    })
  } catch {
    console.error("[contact] Support delivery failed")
    return jsonMessage(
      "No pudimos entregar tu mensaje. Puedes escribirnos directamente por email o WhatsApp.",
      503,
    )
  }

  const confirmation = confirmationEmail(form)
  try {
    await sendEmail({
      to: form.email,
      from: FROM_EMAIL,
      replyTo: CONTACT_EMAIL,
      subject: "Hemos recibido tu mensaje - Despega Tu Carrera",
      html: confirmation.html,
      text: confirmation.text,
    })
  } catch {
    // The support copy already arrived. A missing acknowledgement must not make
    // the user retry and create a duplicate support request.
    console.warn("[contact] Confirmation delivery failed")
  }

  console.info("[contact] Message accepted")
  return jsonMessage("Mensaje recibido. Gracias por contactarnos.", 200)
}
