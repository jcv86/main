import React from 'react'

interface TestCompleteEmailProps {
  name: string
  profile: string
  testType: 'cerebral' | 'mbti' | 'big-five' | 'riasec' | 'emotional-intelligence' | 'soft-skills'
}

export const TestCompleteEmail: React.FC<TestCompleteEmailProps> = ({ name, profile, testType }) => (
  <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", backgroundColor: '#0f172a', padding: '40px 20px', minHeight: '100vh' }}>
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '28px' }}>✓</span>
        </div>
        <h1 style={{ color: '#0f172a', fontSize: '28px', margin: '0', fontWeight: 'bold' }}>¡Tu evaluación está lista!</h1>
      </div>

      <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        Hola {name},
      </p>

      <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        ¡Felicidades! Completaste el test de {testType === 'cerebral' ? 'Perfil Cerebral' : 'Evaluación'}. 
      </p>

      <div style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', borderLeft: '4px solid #7c3aed', padding: '20px', borderRadius: '8px', margin: '30px 0' }}>
        <p style={{ color: '#0f172a', margin: '0', fontWeight: '600', marginBottom: '10px' }}>Tu Resultado: {profile}</p>
        <p style={{ color: '#475569', margin: '0', fontSize: '14px' }}>
          Tu perfil ha sido analizado y personalizado exclusivamente para ti. Descubre cómo puedes potenciar tu carrera.
        </p>
      </div>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a href="https://despegatucarrera.com/despega/a1-report" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
          Ver mi Reporte Completo
        </a>
      </div>

      <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
        <p style={{ color: '#0f172a', margin: '0', fontSize: '14px', fontWeight: '600' }}>Próximos pasos:</p>
        <ul style={{ color: '#475569', margin: '10px 0 0 20px', fontSize: '13px', paddingLeft: '0' }}>
          <li>Analiza tu reporte detallado</li>
          <li>Explora recursos recomendados</li>
          <li>Practica con nuestro coach IA</li>
        </ul>
      </div>

      <p style={{ color: '#cbd5e1', fontSize: '12px', textAlign: 'center', marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
        © 2026 Despega Tu Carrera
      </p>
    </div>
  </div>
)
