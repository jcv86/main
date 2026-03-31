// Reusable email template components

export function createBaseTemplate(content: string, title: string = '') {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .body { padding: 30px 20px; color: #333; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0; }
        .logo { font-weight: bold; color: #7c3aed; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🧠 Despega Tu Carrera</div>
          ${title ? `<h1>${title}</h1>` : ''}
        </div>
        <div class="body">
          ${content}
        </div>
        <div class="footer">
          <p>© 2026 Despega Tu Carrera. Todos los derechos reservados.</p>
          <p>
            <a href="https://despegatucarrera.com" style="color: #7c3aed; text-decoration: none;">Visitar sitio</a> | 
            <a href="https://wa.me/56963160187" style="color: #7c3aed; text-decoration: none;">WhatsApp</a> | 
            <a href="mailto:info@despegatucarrera.com" style="color: #7c3aed; text-decoration: none;">Contacto</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const emailTemplates = {
  welcome: (name: string) => createBaseTemplate(
    `
      <h2>¡Hola ${name}!</h2>
      <p>Te damos la bienvenida a <strong>Despega Tu Carrera</strong>, la plataforma que te ayudará a alcanzar tus objetivos profesionales.</p>
      <p>Con nuestras evaluaciones personalizadas y coaching con IA, podrás:</p>
      <ul>
        <li>Descubrir tu perfil profesional único</li>
        <li>Recibir recomendaciones personalizadas</li>
        <li>Prepararte para entrevistas</li>
        <li>Planificar tu crecimiento profesional</li>
      </ul>
      <a href="https://despegatucarrera.com/dashboard" class="cta-button">Comenzar Ahora</a>
    `,
    '¡Bienvenido a Despega Tu Carrera!'
  ),

  testComplete: (name: string, profileType: string) => createBaseTemplate(
    `
      <h2>¡${name}, tu evaluación está lista!</h2>
      <p>Felicidades por completar tu evaluación <strong>Despega Cerebral</strong>.</p>
      <p>Tu perfil: <strong>${profileType}</strong></p>
      <p>Ahora puedes acceder a:</p>
      <ul>
        <li>Análisis detallado de tu perfil</li>
        <li>Recomendaciones de carreras ideales</li>
        <li>Consejos para entrevistas</li>
        <li>Guía de desarrollo profesional</li>
      </ul>
      <a href="https://despegatucarrera.com/despega/a1-report" class="cta-button">Ver Mi Reporte</a>
    `,
    'Tu Evaluación Está Lista'
  ),

  passwordReset: (resetLink: string, name: string) => createBaseTemplate(
    `
      <h2>Restablece tu contraseña</h2>
      <p>Hola ${name},</p>
      <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.</p>
      <a href="${resetLink}" class="cta-button">Restablecer Contraseña</a>
      <p><small>Este enlace expira en 24 horas.</small></p>
    `,
    'Restablece tu Contraseña'
  ),

  notification: (title: string, message: string) => createBaseTemplate(
    `
      <h2>${title}</h2>
      <p>${message}</p>
    `,
    title
  ),
}
