// Servicio de WhatsApp para enviar recordatorios e insights
// Inicialmente usa WhatsApp Web (gratis), luego se puede migrar a Twilio

interface WhatsAppMessage {
  to: string
  message: string
  type: "reminder" | "insight" | "motivation"
}

export class WhatsAppService {
  private static instance: WhatsAppService
  private isConnected = false

  private constructor() {}

  static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService()
    }
    return WhatsAppService.instance
  }

  async sendMessage({ to, message, type }: WhatsAppMessage): Promise<boolean> {
    try {
      console.log(`[v0] Sending WhatsApp ${type} to ${to}:`, message)

      // TODO: Implementar whatsapp-web.js o Twilio
      // Por ahora, solo registramos en la base de datos

      // Simular envío exitoso
      return true
    } catch (error) {
      console.error("[v0] Error sending WhatsApp message:", error)
      return false
    }
  }

  async sendReminder(activity: any, userPhone: string): Promise<boolean> {
    const message =
      `🔔 Recordatorio: ${activity.title}\n\n` +
      `📅 ${new Date(activity.start_time).toLocaleString("es-CL")}\n` +
      `📍 ${activity.location || "Sin ubicación"}\n\n` +
      `¡Prepárate para tu actividad!`

    return this.sendMessage({
      to: userPhone,
      message,
      type: "reminder",
    })
  }

  async sendMotivationalInsight(userEmail: string, userPhone: string, context: any): Promise<boolean> {
    // Generar mensaje motivacional usando Cerebro
    const message = await this.generateMotivationalMessage(context)

    return this.sendMessage({
      to: userPhone,
      message,
      type: "motivation",
    })
  }

  private async generateMotivationalMessage(context: any): string {
    // TODO: Integrar con Cerebro para generar mensajes personalizados
    const messages = [
      "💪 ¡Buenos días! Hoy es un gran día para avanzar en tus metas profesionales.",
      "🎯 Recuerda: cada pequeño paso te acerca a tu objetivo. ¡Sigue adelante!",
      "🌟 Tu progreso es inspirador. Mantén el enfoque y los resultados llegarán.",
      "📚 El aprendizaje continuo es la clave del éxito. ¿Qué aprenderás hoy?",
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  }
}
