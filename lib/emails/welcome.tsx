import React from 'react'

interface WelcomeEmailProps {
  email: string
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ email }) => (
  <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", backgroundColor: '#0f172a', padding: '40px 20px', minHeight: '100vh' }}>
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>🚀</span>
        </div>
        <h1 style={{ color: '#0f172a', fontSize: '28px', margin: '0', fontWeight: 'bold' }}>¡Bienvenido a Despega Tu Carrera!</h1>
      </div>

      {/* Main Content */}
      <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        Hola,
      </p>

      <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        ¡Gracias por suscribirte a nuestro newsletter! Nos complace saber que estás interesado en transformar tu carrera profesional.
      </p>

      <div style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', borderLeft: '4px solid #7c3aed', padding: '20px', borderRadius: '8px', margin: '30px 0' }}>
        <p style={{ color: '#0f172a', margin: '0', fontWeight: '600', marginBottom: '10px' }}>📧 ¿Qué recibirás?</p>
        <ul style={{ color: '#475569', margin: '0', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>Tips exclusivos de desarrollo profesional</li>
          <li style={{ marginBottom: '8px' }}>Recursos curados para tu crecimiento</li>
          <li style={{ marginBottom: '8px' }}>Nuevas funciones y actualizaciones</li>
          <li>Oportunidades de networking y colaboración</li>
        </ul>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a href="https://despegatucarrera.com" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', transition: 'all 0.3s ease' }}>
          Explorar Despega Tu Carrera
        </a>
      </div>

      {/* Contact Info */}
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', margin: '20px 0', textAlign: 'center' }}>
        <p style={{ color: '#0f172a', margin: '0 0 10px 0', fontWeight: '600' }}>¿Preguntas o Sugerencias?</p>
        <p style={{ color: '#475569', margin: '0 0 10px 0', fontSize: '14px' }}>
          📧 <a href="mailto:info@despegatucarrera.com" style={{ color: '#7c3aed', textDecoration: 'none' }}>info@despegatucarrera.com</a>
        </p>
        <p style={{ color: '#475569', margin: '0', fontSize: '14px' }}>
          💬 <a href="https://wa.me/56963160187" style={{ color: '#7c3aed', textDecoration: 'none' }}>+56 9 6316 0187 (WhatsApp)</a>
        </p>
      </div>

      {/* Footer */}
      <p style={{ color: '#cbd5e1', fontSize: '12px', textAlign: 'center', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
        © 2026 Despega Tu Carrera. Todos los derechos reservados.
      </p>
    </div>
  </div>
)
